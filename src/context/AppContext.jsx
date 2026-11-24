import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { getToken, setToken } from "../api";
import { INIT_PAY } from "../data/constants";
import { iso, parseISO } from "../utils/dates";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const toAppt = a => ({ id: a.id, docId: a.doctorId, mode: a.mode, day: parseISO(a.date), time: a.time, status: a.status });

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [presencial, setPresencial] = useState(true);
  const [convenio, setConvenio] = useState(false);
  const [sort, setSort] = useState("disp");
  const [draft, setDraft] = useState(null);
  const [appts, setAppts] = useState([]);
  const [history, setHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [banner, setBanner] = useState("");
  const [tab, setTab] = useState("next");
  const [modal, setModal] = useState(null);
  const [user, setUser] = useState(null);
  const [pay, setPay] = useState(INIT_PAY);
  const [loading, setLoading] = useState(true);

  const byId = id => doctors.find(d => d.id === id);
  const upcoming = [...appts].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  // Carrega médicos e consultas do banco (via API).
  const load = useCallback(async () => {
    const [docs, ap] = await Promise.all([api.doctors(), api.appointments()]);
    setDoctors(docs.map(d => ({ ...d, next: parseISO(d.next) })));
    setAppts(ap.upcoming.map(toAppt));
    setHistory(ap.history.map(toAppt));
  }, []);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.me().then(async u => { await load(); setUser(u); }).catch(() => setToken(null)).finally(() => setLoading(false));
  }, [load]);

  const enter = async call => {
    const { token, user } = await call();
    setToken(token); await load(); setUser(user); setScreen("home");
  };
  const login = (email, password) => enter(() => api.login({ email, password }));
  const register = (name, email, password) => enter(() => api.register({ name, email, password }));
  const logout = async () => {
    try { await api.logout(); } catch { /* sessão já expirada */ }
    setToken(null); setUser(null); setAppts([]); setHistory([]); setBanner(""); setDraft(null); setScreen("home");
  };

  const go = s => { setScreen(s); setModal(null); };
  const startBooking = (doc, extra = {}) => {
    const day = extra.day || doc.next;
    setDraft({ docId: doc.id, mode: presencial ? "Presencial" : "Teleconsulta", day, vm: new Date(day.getFullYear(), day.getMonth(), 1), time: null, replaceId: null, ...extra });
    go("schedule");
  };
  const reschedule = a => startBooking(byId(a.docId), { mode: a.mode, day: a.day, time: a.time, replaceId: a.id });

  // Salva no banco: novo agendamento (com pagamento simulado) ou reagendamento.
  const confirm = async payment => {
    const body = { doctorId: draft.docId, mode: draft.mode, date: iso(draft.day), time: draft.time };
    if (draft.replaceId) await api.reschedule(draft.replaceId, body);
    else await api.book({ ...body, payment });
    await load();
    setBanner(draft.replaceId ? "Consulta reagendada!" : "Consulta agendada!");
    setTab("next");
  };
  const cancel = async id => {
    try { await api.cancel(id); await load(); setBanner(""); setModal(null); }
    catch (e) { window.alert(e.message); }
  };

  const navOn = ["home", "search"].includes(screen) ? "home" : screen === "profile" ? "profile" : "appts";
  const setP = o => setPay(p => ({ ...p, ...o }));
  const initials = n => n.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  const value = {
    screen,
    setScreen,
    query,
    setQuery,
    presencial,
    setPresencial,
    convenio,
    setConvenio,
    sort,
    setSort,
    draft,
    setDraft,
    appts,
    history,
    banner,
    setBanner,
    tab,
    setTab,
    modal,
    setModal,
    user,
    pay,
    setPay,
    doctors,
    byId,
    upcoming,
    go,
    startBooking,
    reschedule,
    confirm,
    cancel,
    navOn,
    setP,
    initials,
    login,
    register,
    logout,
    loading,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
