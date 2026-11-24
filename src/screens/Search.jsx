import Icon from "../components/Icon";
import Back from "../components/Back";
import { useApp } from "../context/AppContext";
import { WD, dow, fs } from "../utils/dates";
import { norm } from "../utils/format";
import { PLURAL } from "../data/constants";

export default function Search() {
  const { query, setQuery, presencial, setPresencial, startBooking, doctors } = useApp();
  const q = norm(query.trim());
  const list = doctors.filter(d => !q || norm(d.name).includes(q) || norm(d.spec).includes(q));
  const same = list.length && list.every(d => d.spec === list[0].spec);
  return (<>
    <Back to="home" title="Buscar médico" />
    <p className="eyebrow" style={{ marginLeft: 38 }}>Encontre o cuidado de que você precisa</p>
    <label className="search"><Icon n="search" s={20} />
      <input autoFocus placeholder="Especialidade ou nome do médico" value={query} onChange={e => setQuery(e.target.value)} />
    </label>
    <div className="chips">
      <button className={"chip" + (presencial ? " on" : "")} onClick={() => setPresencial(!presencial)}>Presencial</button>
      <button className="chip">Convênio</button><button className="chip">Filtros</button>
    </div>
    <h2 style={{ margin: "18px 0 4px" }}>{same ? PLURAL[list[0].spec] : "Profissionais"}</h2>
    <p className="sub">{list.length} profissiona{list.length === 1 ? "l" : "is"} · São Paulo, SP</p>
    {list.length === 0 && <div className="empty">Nenhum resultado para “{query}”.</div>}
    {list.map((d, i) => (
      <div className="card" key={d.id}>
        <div className="doc"><div className="avatar">{d.ini}</div><div><b>{d.name}</b><span>{d.spec} · {d.km}</span></div></div>
        <div className="meta"><span>Disponível {WD[dow(d.next)].slice(0, 3)}, {fs(d.next)}</span><b>R$ {d.price}</b></div>
        <button className={"btn" + (i === 0 ? " pri" : "")} onClick={() => startBooking(d)}>Ver horários</button>
      </div>
    ))}
  </>);
}
