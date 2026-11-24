import { useApp } from "../context/AppContext";

const OPTIONS = [["disp", "Primeiro horário livre"], ["price", "Menor preço"], ["km", "Mais perto de mim"]];

export default function FiltersSheet() {
  const { sort, setSort, convenio, setConvenio, setModal } = useApp();
  return (
    <div className="modal" onClick={() => setModal(null)}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <h2>Filtros</h2>
        <div className="lab">Ordenar por</div>
        <div className="opts">{OPTIONS.map(([k, l]) => (
          <button key={k} className={"chip" + (sort === k ? " on" : "")} onClick={() => setSort(k)}>{l}</button>
        ))}</div>
        <div className="lab">Atendimento</div>
        <div className="opts">
          <button className={"chip" + (convenio ? " on" : "")} onClick={() => setConvenio(!convenio)}>Aceita convênio</button>
        </div>
        <div className="two" style={{ marginTop: 22 }}>
          <button className="btn" onClick={() => { setSort("disp"); setConvenio(false); }}>Limpar</button>
          <button className="btn pri" onClick={() => setModal(null)}>Ver resultados</button>
        </div>
      </div>
    </div>
  );
}