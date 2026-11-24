import Icon from "../components/Icon";
import Back from "../components/Back";
import { useApp } from "../context/AppContext";
import { WD, dow, fs } from "../utils/dates";
import { brl } from "../utils/format";
import { INIT_PAY } from "../data/constants";

export default function Review() {
  const { draft, user, setPay, go, byId, confirm } = useApp();
  const d = byId(draft.docId);
  const tele = draft.mode === "Teleconsulta";
  const next = async () => {
    if (!draft.replaceId) { setPay(INIT_PAY); return go("payment"); }
    try { await confirm(); go("appts"); } catch (e) { window.alert(e.message); }
  };
  return (<>
    <Back to="schedule" title="Revisar agendamento" />
    <p className="eyebrow" style={{ marginLeft: 38 }}>Etapa 2 de 3 · Confirmação</p>
    <h2>Tudo certo para agendar?</h2>
    <p className="sub">Confira as informações da sua consulta.</p>
    <div className="card" style={{ padding: 18 }}>
      <div className="doc"><div className="avatar">{d.ini}</div><div><b>{d.name}</b><span>{d.spec} · {d.crm}</span></div></div>
      <div className="hr" />
      <div className="lab">Data e horário</div><div className="val">{fs(draft.day)} {draft.day.getFullYear()} · {draft.time}</div><small style={{ color: "var(--muted)", fontSize: 13 }}>{WD[dow(draft.day)]} · Duração de 30 min</small>
      <div className="lab">Local</div><div className="val">{tele ? "Videochamada no app" : d.place}</div><small style={{ color: "var(--muted)", fontSize: 13 }}>{tele ? "O link fica disponível em Minhas consultas" : d.addr}</small>
      <div className="lab">Atendimento</div><div className="val">{draft.mode} · Particular</div><small style={{ color: "var(--muted)", fontSize: 13 }}>{"Pagamento online · Pix ou cartão"}</small>
      <button className="alter" onClick={() => go("schedule")}>Alterar data ou horário <Icon n="next" s={14} /></button>
    </div>
    <div className="card"><div className="lab" style={{ margin: 0 }}>Paciente</div><div className="val" style={{ marginTop: 4 }}>{user.name}</div><small style={{ color: "var(--muted)", fontSize: 13 }}>Agendamento para mim</small></div>
    <div className="price" style={{ margin: "18px 0 14px" }}><span style={{ color: "var(--ink)", fontSize: 15 }}>Valor da consulta</span><b style={{ fontSize: 22 }}>{brl(d.price)}</b></div>
    <p className="note">Você pode cancelar ou reagendar até 24h antes da consulta, sem custo.</p>
    <button className="btn pri" style={{ height: 50 }} onClick={next}>{draft.replaceId ? "Confirmar reagendamento" : "Ir para o pagamento"}</button>
  </>);
}
