// Banco de dados local: guardado no próprio navegador (localStorage), em formato de tabelas.
// Nada sai do computador. Para ver os dados: F12 > Application > Local Storage > healthup_db_v1.
import { DOCTORS } from "../data/doctors";
import { TIMES } from "../data/constants";
import { MODES, addDays, isoDate, nowHM, slotError, simulatePayment } from "./rules";
import { hashPassword, checkPassword, newToken } from "./password";

const DB_KEY = "healthup_db_v1";
const TOKEN_KEY = "healthup_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = t => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

const save = db => localStorage.setItem(DB_KEY, JSON.stringify(db));
const fail = msg => { throw new Error(msg); };
const pub = u => ({ id: u.id, name: u.name, email: u.email });

// Abre o banco; na primeira vez cria as tabelas, a conta de teste e uma consulta de exemplo.
async function open() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) { try { return JSON.parse(raw); } catch { /* arquivo corrompido: recria abaixo */ } }
  const { salt, hash } = await hashPassword("123456");
  const db = {
    seq: { user: 2, appointment: 2 },
    users: [{ id: 1, name: "Mariana Souza", email: "mariana@healthup.com", salt, hash }],
    sessions: {},
    appointments: [{ id: 1, userId: 1, doctorId: 4, mode: "Presencial", date: addDays(3), time: "11:00", status: "confirmed", price: 230, paymentMethod: "pix", cardLast4: null }],
  };
  save(db);
  return db;
}

const authUser = db => db.users.find(u => u.id === db.sessions[getToken()]) || fail("Sessão expirada. Entre novamente.");
const isTaken = (db, doctorId, date, time, ignoreId = 0) =>
  db.appointments.some(a => a.doctorId === doctorId && a.date === date && a.time === time && a.status === "confirmed" && a.id !== ignoreId);
const startSession = (db, user) => { const token = newToken(); db.sessions[token] = user.id; save(db); return { token, user: pub(user) }; };

export default {
  async register({ name = "", email = "", password = "" }) {
    const mail = email.trim().toLowerCase();
    if (name.trim().length < 2) fail("Informe seu nome.");
    if (!/^\S+@\S+\.\S+$/.test(mail)) fail("Informe um e-mail válido.");
    if (password.length < 6) fail("A senha precisa ter ao menos 6 caracteres.");
    const { salt, hash } = await hashPassword(password);
    const db = await open();
    if (db.users.some(u => u.email === mail)) fail("Este e-mail já está cadastrado.");
    const user = { id: db.seq.user++, name: name.trim(), email: mail, salt, hash };
    db.users.push(user);
    return startSession(db, user);
  },

  async login({ email = "", password = "" }) {
    const db = await open();
    const user = db.users.find(u => u.email === email.trim().toLowerCase());
    if (!user || !(await checkPassword(password, user.salt, user.hash))) fail("E-mail ou senha incorretos.");
    return startSession(db, user);
  },

  async logout() { const db = await open(); delete db.sessions[getToken()]; save(db); },
  async me() { return pub(authUser(await open())); },
  async doctors() { return DOCTORS.map(({ nextOffset, ...d }) => ({ ...d, next: addDays(nextOffset) })); },

  // Horários livres do dia: remove os já ocupados e os que já passaram.
  async slots(doctorId, date, exclude) {
    const db = await open();
    return TIMES.filter(t => !slotError(date, t) && !isTaken(db, Number(doctorId), date, t, Number(exclude) || 0));
  },

  async appointments() {
    const db = await open();
    const me = authUser(db), today = isoDate(), now = nowHM(), upcoming = [], history = [];
    const rows = db.appointments.filter(a => a.userId === me.id)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    for (const a of rows) {
      const row = { id: a.id, doctorId: a.doctorId, mode: a.mode, date: a.date, time: a.time, status: a.status, price: a.price };
      const future = a.status === "confirmed" && (a.date > today || (a.date === today && a.time >= now));
      (future ? upcoming : history).push(row);
    }
    return { upcoming, history: history.reverse() };
  },

  async book({ doctorId, mode, date, time, payment }) {
    const db = await open();
    const me = authUser(db);
    const doc = DOCTORS.find(d => d.id === Number(doctorId)) || fail("Médico não encontrado.");
    if (!MODES.includes(mode)) fail("Tipo de consulta inválido.");
    const err = slotError(date, time);
    if (err) fail(err);
    if (isTaken(db, doc.id, date, time)) fail("Esse horário acabou de ser ocupado. Escolha outro.");
    const pay = simulatePayment(payment);
    if (!pay.approved) fail(pay.error);
    const a = { id: db.seq.appointment++, userId: me.id, doctorId: doc.id, mode, date, time, status: "confirmed", price: doc.price, paymentMethod: pay.method, cardLast4: pay.last4 };
    db.appointments.push(a);
    save(db);
    return { id: a.id, date, time };
  },

  async reschedule(id, { date, time, mode }) {
    const db = await open();
    const me = authUser(db);
    const a = db.appointments.find(x => x.id === Number(id) && x.userId === me.id && x.status === "confirmed") || fail("Consulta não encontrada.");
    const err = slotError(date, time);
    if (err) fail(err);
    if (isTaken(db, a.doctorId, date, time, a.id)) fail("Esse horário já está ocupado.");
    Object.assign(a, { date, time, mode: MODES.includes(mode) ? mode : a.mode });
    save(db);
    return { ok: true };
  },

  async cancel(id) {
    const db = await open();
    const me = authUser(db);
    const a = db.appointments.find(x => x.id === Number(id) && x.userId === me.id && x.status === "confirmed") || fail("Consulta não encontrada.");
    a.status = "cancelled";
    save(db);
    return { ok: true };
  },
};
