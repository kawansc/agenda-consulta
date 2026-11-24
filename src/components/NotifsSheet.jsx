import { useApp } from "../context/AppContext";
import { fs } from "../utils/dates";

export default function NotifsSheet() {
  const { upcoming, byId, setModal } = useApp();
  return (
    <div className="modal" onClick={() => setModal(null)}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <h2>Notificações</h2>
        {upcoming.length === 0 && <p className="sub">Você não tem lembretes no momento.</p>}
        {upcoming.map(a => (
          <div className="note-item" key={a.id}>
            <b>Lembrete de consulta</b>
            <span>{byId(a.docId).name} · {fs(a.day)} às {a.time} · {a.mode}</span>
          </div>
        ))}
        <button className="btn" style={{ marginTop: 8 }} onClick={() => setModal(null)}>Fechar</button>
      </div>
    </div>
  );
}