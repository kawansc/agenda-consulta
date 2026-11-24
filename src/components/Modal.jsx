import { useApp } from "../context/AppContext";
import { fs } from "../utils/dates";
import FiltersSheet from "./FiltersSheet";
import NotifsSheet from "./NotifsSheet";

export default function Modal() {
  const { appts, modal, setModal, reschedule, cancel, byId } = useApp();
  if (modal.type === "filters") return <FiltersSheet />;
  if (modal.type === "notifs") return <NotifsSheet />;
  const a = appts.find(x => x.id === modal.id);
  if (!a) return null;
  const d = byId(a.docId);
  return (
    <div className="modal" onClick={() => setModal(null)}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        {modal.type === "cancel" ? (<>
          <h2>Cancelar consulta?</h2>
          <p className="sub">{d.name} · {fs(a.day)} às {a.time}. O cancelamento é gratuito até 24h antes.</p>
          <div className="two"><button className="btn" onClick={() => setModal(null)}>Voltar</button><button className="btn pri" onClick={() => cancel(a.id)}>Cancelar consulta</button></div>
        </>) : (<>
          <h2>{d.name}</h2>
          <p className="sub" style={{ marginBottom: 6 }}>{d.spec} · {d.crm}</p>
          <div className="lab">Data e horário</div><div className="val">{fs(a.day)} {a.day.getFullYear()} · {a.time}</div>
          <div className="lab">Local</div><div className="val">{d.place}</div><small style={{ color: "var(--muted)", fontSize: 13 }}>{d.addr}</small>
          <div className="two" style={{ marginTop: 20 }}><button className="btn" onClick={() => reschedule(a)}>Reagendar</button><button className="btn" onClick={() => setModal({ type: "cancel", id: a.id })}>Cancelar</button></div>
        </>)}
      </div>
    </div>
  );
}
