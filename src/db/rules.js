import { TIMES } from "../data/constants";

export const MODES = ["Presencial", "Teleconsulta"];

const pad = n => String(n).padStart(2, "0");
export const isoDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
export const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };

// Regra de data: usa o relógio do próprio computador.
export function slotError(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || Number.isNaN(Date.parse(date))) return "Data inválida.";
  if (!TIMES.includes(time)) return "Horário inválido.";
  const today = isoDate();
  if (date < today) return "Não é possível agendar em datas anteriores a hoje.";
  if (date === today && time <= nowHM()) return "Esse horário já passou.";
  return null;
}

// Pagamento SIMULADO: nada é cobrado e o número do cartão nunca é gravado (só os 4 últimos dígitos).
export function simulatePayment(p) {
  if (!p || !["pix", "card"].includes(p.method)) return { approved: false, error: "Escolha uma forma de pagamento." };
  if (p.method === "pix") return { approved: true, method: "pix", last4: null };
  const n = String(p.number || "").replace(/\D/g, "");
  const [mm, yy] = String(p.exp || "").split("/").map(Number);
  if (n.length !== 16) return { approved: false, error: "Número do cartão inválido." };
  if (!(mm >= 1 && mm <= 12) || !yy || new Date(2000 + yy, mm, 1) <= new Date()) return { approved: false, error: "Validade inválida ou cartão vencido." };
  if (!/^\d{3}$/.test(String(p.cvv || ""))) return { approved: false, error: "CVV inválido." };
  if (!String(p.name || "").trim()) return { approved: false, error: "Informe o nome impresso no cartão." };
  if (n.endsWith("0000")) return { approved: false, error: "Pagamento recusado pela operadora. Tente outro cartão." };
  return { approved: true, method: "card", last4: n.slice(-4) };
}
