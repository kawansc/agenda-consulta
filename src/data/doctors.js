// Médicos do sistema. nextOffset = em quantos dias a partir de hoje fica o primeiro horário livre.
export const DOCTORS = [
  { id: 1, conv: true, name: "Dra. Ana Costa", ini: "AC", spec: "Cardiologia", km: "1,2 km", price: 250, crm: "CRM-SP 123456", place: "Clínica Saúde · Unidade Paulista", addr: "Av. Paulista, 1000 · São Paulo", short: "Clínica Saúde / Paulista", nextOffset: 1 },
  { id: 2, conv: false, name: "Dr. Pedro Lima", ini: "PL", spec: "Cardiologia", km: "2,4 km", price: 280, crm: "CRM-SP 234567", place: "Clínica Coração · Unidade Vila Mariana", addr: "R. Domingos de Morais, 500 · São Paulo", short: "Clínica Coração / Vila Mariana", nextOffset: 2 },
  { id: 3, conv: true, name: "Dra. Beatriz Alves", ini: "BA", spec: "Cardiologia", km: "3,1 km", price: 260, crm: "CRM-SP 345678", place: "Instituto Alves · Unidade Pinheiros", addr: "R. dos Pinheiros, 300 · São Paulo", short: "Instituto Alves / Pinheiros", nextOffset: 3 },
  { id: 4, conv: true, name: "Dra. Camila Rocha", ini: "CR", spec: "Dermatologia", km: "1,8 km", price: 230, crm: "CRM-SP 456789", place: "Clínica Vida · Unidade Centro", addr: "R. Barão de Itapetininga, 50 · São Paulo", short: "Clínica Vida / Centro", nextOffset: 3 },
  { id: 5, conv: false, name: "Dr. Rafael Nunes", ini: "RN", spec: "Clínica geral", km: "0,9 km", price: 180, crm: "CRM-SP 567890", place: "Clínica Bem-Estar · Unidade Consolação", addr: "R. da Consolação, 800 · São Paulo", short: "Clínica Bem-Estar / Consolação", nextOffset: 0 },
];
