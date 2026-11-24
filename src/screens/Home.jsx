import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { WD, dow, fs } from "../utils/dates";
import { SPECS } from "../data/constants";

export default function Home() {
  const { query, setQuery, setModal, user, upcoming, go, byId } = useApp();
  const next = upcoming[0];
  const doc = next && byId(next.docId);
  return (<>
    <div className="row" style={{ marginBottom: 4 }}>
      <div className="top" style={{ marginBottom: 0 }}><Icon n="plus" s={24} /><h1 style={{ fontSize: 24 }}>Healthup</h1></div>
      <button className="ic" aria-label="Notificações" onClick={() => setModal({ type: "notifs" })}><Icon n="bell" /></button>
    </div>
    <p className="eyebrow">Cuidado com a sua saúde</p>
    <h2 style={{ fontSize: 28 }}>Olá, {user.name.split(" ")[0]}</h2>
    <p className="sub">Sua próxima consulta começa aqui.</p>
    <label className="search"><Icon n="search" s={20} />
      <input placeholder="Especialidade ou nome do médico" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && go("search")} />
    </label>
    <div className="row" style={{ margin: "26px 0 12px" }}><h3 style={{ margin: 0 }}>Especialidades</h3><button className="link" onClick={() => { setQuery(""); go("search"); }}>Ver todas</button></div>
    <div className="specs">{SPECS.map(s => (
      <button key={s} className="spec" onClick={() => { setQuery(s); go("search"); }}><Icon n="plus" s={18} />{s}</button>
    ))}</div>
    <h3>Próxima consulta</h3>
    {next ? (
      <div className="card">
        <div className="doc"><div className="avatar">{doc.ini}</div><div><b>{doc.name}</b><span>{doc.spec} · {next.mode}</span></div></div>
        <div style={{ fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}><Icon n="cal" s={18} />{fs(next.day)} · {WD[dow(next.day)]} · {next.time}</div>
        <p className="loc">{doc.place}</p>
        <button className="btn" onClick={() => setModal({ type: "details", id: next.id })}>Ver detalhes</button>
      </div>
    ) : <div className="card empty">Nenhuma consulta marcada.</div>}
    <div className="card" style={{ background: "var(--soft)" }}>
      <b style={{ fontSize: 16 }}>Reserve um tempo para você</b>
      <p className="sub" style={{ margin: "6px 0 14px" }}>Escolha um profissional e agende no melhor horário.</p>
      <button className="btn pri" onClick={() => { setQuery(""); go("search"); }}>Agendar consulta</button>
    </div>
  </>);
}
