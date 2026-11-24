export const WD = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
export const WS = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];
export const dow = d => d.getDay();
export const MON = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
export const MONL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const sod = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const eqd = (a, b) => a.getTime() === b.getTime();
export const fs = d => d.getDate() + " " + MON[d.getMonth()];
export const TODAY = sod(new Date());

const pad = n => String(n).padStart(2, "0");
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
