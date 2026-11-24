import { useEffect, useState } from "react";
import api from "../api";
import Back from "../components/Back";
import { useApp } from "../context/AppContext";
import { WD, dow, MONL, eqd, fs, TODAY, iso } from "../utils/dates";
import { brl } from "../utils/format";
import { TIMES } from "../data/constants";

export default function Schedule() {
  const { draft, setDraft, go, byId } = useApp();
  const d = byId(draft.docId);
  const [slots, setSlots] = useState([]);
  const dayIso = iso(draft.day);
  useEffect(() => {
    let on = true;
    setSlots([]);
    api.slots(d.id, dayIso, draft.replaceId).then(s => on && setSlots(s)).catch(() => {});
    return () => { on = false; };
  }, [d.id, dayIso, draft.replaceId]);
  const vm = draft.vm, first = new Date(vm.getFullYear(), vm.getMonth(), 1);
  const dim = new Date(vm.getFullYear(), vm.getMonth() + 1, 0).getDate();
  const days = [...Array(first.getDay()).fill(null), ...Array.from({ length: dim }, (_, i) => new Date(vm.getFullYear(), vm.getMonth(), i + 1))];
  const canPrev = first > new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const mv = n => setDraft({ ...draft, vm: new Date(vm.getFullYear(), vm.getMonth() + n, 1) });
  return (<>
    <Back to="search" title="Agendar consulta" />
    <p className="eyebrow" style={{ marginLeft: 38 }}>Etapa 1 de 3 · Data e horário</p>
    <div className="doc"><div className="avatar">{d.ini}</div><div><b>{d.name}</b><span>{d.spec} · {d.crm}</span></div></div>
    <b style={{ fontSize: 15 }}>Tipo de consulta</b>
    <div className="seg">{["Presencial","Teleconsulta"].map(m => (
      <button key={m} className={"chip" + (draft.mode === m ? " on" : "")} style={{ height: 40, fontSize: 14 }} onClick={() => setDraft({ ...draft, mode: m })}>{m}</button>
    ))}</div>
    <div className="sched">
    <div className="cal">
      <div className="cal-h"><button className="ic" aria-label="Mês anterior" disabled={!canPrev} style={{ opacity: canPrev ? 1 : .3, fontSize: 20 }} onClick={() => mv(-1)}>‹</button><span>{MONL[vm.getMonth()]} {vm.getFullYear()}</span><button className="ic" aria-label="Próximo mês" style={{ fontSize: 20 }} onClick={() => mv(1)}>›</button></div>
      <div className="grid7">
        {["D","S","T","Q","Q","S","S"].map((w, i) => <div className="dw" key={i}>{w}</div>)}
        {days.map((n, i) => n === null ? <span key={i} /> : (
          <button key={i} disabled={n < TODAY} className={"day" + (eqd(draft.day, n) ? " on" : "")} onClick={() => setDraft({ ...draft, day: n, time: null })}>{n.getDate()}</button>
        ))}
      </div>
      <p className="hint">{fs(draft.day)} selecionado · Datas anteriores a hoje ficam indisponíveis</p>
    </div>
    <div className="sched-r">
    <h3 style={{ fontSize: 16, margin: "20px 0 0" }}>{WD[dow(draft.day)]}, {draft.day.getDate()} de {MONL[draft.day.getMonth()].toLowerCase()}</h3>
    <div className="times">{TIMES.map(t => (
      <button key={t} disabled={!slots.includes(t)} className={"time" + (draft.time === t ? " on" : "")} onClick={() => setDraft({ ...draft, time: t })}>{t}</button>
    ))}</div>
    <div className="price"><span>Consulta particular</span><b>{brl(d.price)}</b></div>
    <button className="btn pri" style={{ height: 50 }} disabled={!draft.time} onClick={() => go("review")}>Continuar</button>
    </div></div>
  </>);
}
