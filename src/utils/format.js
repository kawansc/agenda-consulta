export const brl = n => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
export const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
