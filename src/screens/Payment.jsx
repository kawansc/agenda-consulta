import Back from "../components/Back";
import { useApp } from "../context/AppContext";
import { fs } from "../utils/dates";
import { brl } from "../utils/format";

export default function Payment() {
  const { draft, pay, confirm, setP, byId, go } = useApp();
  const d = byId(draft.docId), isCard = pay.method === "card";
  const verify = async () => {
    const n = pay.num.replace(/\D/g, "");
    if (isCard) {
      const [mm, yy] = pay.exp.split("/").map(Number);
      let err = "";
      if (n.length !== 16) err = "Número do cartão inválido: são 16 dígitos.";
      else if (!(mm >= 1 && mm <= 12) || !yy || new Date(2000 + yy, mm, 1) <= new Date()) err = "Validade inválida ou cartão vencido.";
      else if (pay.cvv.length !== 3) err = "O CVV tem 3 dígitos.";
      else if (!pay.name.trim()) err = "Informe o nome impresso no cartão.";
      if (err) return setP({ err });
    }
    setP({ err: "", status: "checking" });
    try {
      await Promise.all([
        confirm({ method: pay.method, number: n, exp: pay.exp, cvv: pay.cvv, name: pay.name }),
        new Promise(r => setTimeout(r, 1800)),
      ]);
      setP({ status: "ok" });
      setTimeout(() => go("appts"), 1000);
    } catch (e) {
      setP({ status: "idle", err: e.message });
    }
  };
  if (pay.status !== "idle") return (<div style={{ textAlign: "center", paddingTop: 120 }}>
    {pay.status === "checking"
      ? <><div className="spin" /><h2>Verificando pagamento…</h2><p className="sub">Aguarde um instante.</p></>
      : <><div style={{ fontSize: 48, marginBottom: 8 }}>✓</div><h2>Pagamento aprovado</h2><p className="sub">Finalizando seu agendamento…</p></>}
  </div>);
  return (<>
    <Back to="review" title="Pagamento" />
    <p className="eyebrow" style={{ marginLeft: 38 }}>Etapa 3 de 3 · Pagamento</p>
    <div className="price" style={{ margin: "0 0 18px" }}><span style={{ color: "var(--ink)", fontSize: 15 }}>{d.name} · {fs(draft.day)} · {draft.time}</span><b style={{ fontSize: 22 }}>{brl(d.price)}</b></div>
    <div className="seg" style={{ margin: "0 0 12px" }}>{[["pix", "Pix"], ["card", "Cartão de crédito"]].map(([k, l]) => (
      <button key={k} className={"chip" + (pay.method === k ? " on" : "")} style={{ height: 40, fontSize: 14 }} onClick={() => setP({ method: k, err: "" })}>{l}</button>
    ))}</div>
    {isCard ? (<>
      <div className="lab">Número do cartão</div>
      <input className="field" inputMode="numeric" placeholder="0000 0000 0000 0000" value={pay.num} onChange={e => setP({ num: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(), err: "" })} />
      <div className="two" style={{ marginTop: 0 }}>
        <div><div className="lab">Validade</div><input className="field" inputMode="numeric" placeholder="MM/AA" value={pay.exp} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setP({ exp: v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v, err: "" }); }} /></div>
        <div><div className="lab">CVV</div><input className="field" inputMode="numeric" placeholder="123" value={pay.cvv} onChange={e => setP({ cvv: e.target.value.replace(/\D/g, "").slice(0, 3), err: "" })} /></div>
      </div>
      <div className="lab">Nome no cartão</div>
      <input className="field" placeholder="Como está impresso" value={pay.name} onChange={e => setP({ name: e.target.value, err: "" })} />
    </>) : (<>
      <p className="note" style={{ margin: "4px 0 0" }}>Copie o código abaixo no app do seu banco.</p>
      <div className="pix">00020126580014BR.GOV.BCB.PIX0136healthup-simulacao-{draft.day.getDate()}{draft.time.replace(":", "")}5204000053039865802BR5908HEALTHUP6009SAO PAULO6304ABCD</div>
    </>)}
    {pay.err && <p className="err">{pay.err}</p>}
    <p className="note" style={{ margin: "16px 0" }}>Simulação: nenhum valor é cobrado. Cartões terminados em 0000 são recusados, para você testar o erro.</p>
    <button className="btn pri" style={{ height: 50 }} onClick={verify}>{isCard ? "Pagar " + brl(d.price) : "Já paguei"}</button>
  </>);
}
