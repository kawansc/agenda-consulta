import { useApp } from "../context/AppContext";
import { WS, dow, fs } from "../utils/dates";

export default function Appts() {
  const { setQuery, banner, tab, setTab, setModal, upcoming, go, reschedule, cancel, byId, history } = useApp();
  return (<>
    <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Minhas consultas</h1>
    <p className="eyebrow" style={{ marginBottom: 20 }}>Seus próximos cuidados</p>
    {banner && <div className="banner"><b>✓ {banner}</b><span>Sua consulta está confirmada. Enviaremos um lembrete antes do horário.</span></div>}
    <div className="seg" style={{ margin: "0 0 20px" }}>
      <button className={"chip" + (tab === "next" ? " on" : "")} style={{ height: 40, fontSize: 14 }} onClick={() => setTab("next")}>Próximas</button>
      <button className={"chip" + (tab === "past" ? " on" : "")} style={{ height: 40, fontSize: 14 }} onClick={() => setTab("past")}>Anteriores</button>
    </div>
    {tab === "past" ? (history.length === 0 ? <div className="empty">Nenhuma consulta anterior.</div> : <div className="cards">{history.map(a => {
      const d = byId(a.docId);
      return (
        <div className="card" key={a.id}>
          <div className="when"><span>{fs(a.day).toUpperCase()} · {WS[dow(a.day)]} · {a.time}</span><em>{a.status === "cancelled" ? "Cancelada" : "Realizada"}</em></div>
          <div className="doc" style={{ marginBottom: 0 }}><div className="avatar">{d.ini}</div><div><b>{d.name}</b><span>{d.spec} · {a.mode}</span></div></div>
        </div>
      );
    })}</div>) : (<>
      <h2 style={{ fontSize: 22, marginBottom: 14 }}>Agendamentos</h2>
      {upcoming.length === 0 && <div className="empty">Você não tem consultas futuras.</div>}
      <div className="cards">{upcoming.map(a => {
        const d = byId(a.docId);
        return (
          <div className="card" key={a.id}>
            <div className="when"><span>{fs(a.day).toUpperCase()} · {WS[dow(a.day)]} · {a.time}</span><em>Confirmada</em></div>
            {a.compact ? <div style={{ fontWeight: 700, fontSize: 16 }}>{d.name}</div> : <div className="doc"><div className="avatar">{d.ini}</div><div><b>{d.name}</b><span>{d.spec} · {d.crm}</span></div></div>}
            <p className="loc" style={{ paddingBottom: a.compact ? 8 : 12, borderBottom: a.compact ? 0 : "1px solid var(--line)" }}>{d.spec} · {a.mode === "Presencial" ? d.short.replace("Clínica", "Clínica") : "Teleconsulta"}</p>
            {a.compact
              ? <button className="btn sm" onClick={() => setModal({ type: "details", id: a.id })}>Ver detalhes</button>
              : <div className="two"><button className="btn sm" onClick={() => reschedule(a)}>Reagendar</button><button className="btn sm" onClick={() => setModal({ type: "cancel", id: a.id })}>Cancelar</button></div>}
          </div>
        );
      })}</div>
    </>)}
    <button className="btn pri" style={{ height: 50, marginTop: 4 }} onClick={() => { setQuery(""); go("search"); }}>Agendar nova consulta</button>
  </>);
}
