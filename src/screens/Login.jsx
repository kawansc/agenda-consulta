import { useState } from "react";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, register } = useApp();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", pw: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = mode === "register";
  const set = o => { setF(p => ({ ...p, ...o })); setErr(""); };

  const submit = async () => {
    const email = f.email.trim();
    if (isNew && f.name.trim().length < 2) return setErr("Informe seu nome.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Informe um e-mail válido.");
    if (f.pw.length < 6) return setErr("A senha precisa ter ao menos 6 caracteres.");
    setBusy(true);
    try { await (isNew ? register(f.name.trim(), email, f.pw) : login(email, f.pw)); }
    catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div style={{ paddingTop: 48 }}>
      <div className="top" style={{ marginBottom: 4 }}><Icon n="plus" s={28} /><h1 style={{ fontSize: 28 }}>Healthup</h1></div>
      <p className="eyebrow" style={{ marginBottom: 36 }}>Cuidado com a sua saúde</p>
      <h2>{isNew ? "Criar conta" : "Entrar"}</h2>
      <p className="sub">{isNew ? "Cadastre-se para agendar suas consultas." : "Acesse sua conta para agendar e acompanhar suas consultas."}</p>
      {isNew && (<>
        <div className="lab">Nome</div>
        <input className="field" placeholder="Seu nome completo" value={f.name} onChange={e => set({ name: e.target.value })} />
      </>)}
      <div className="lab">E-mail</div>
      <input className="field" type="email" placeholder="voce@email.com" value={f.email} onChange={e => set({ email: e.target.value })} />
      <div className="lab">Senha</div>
      <input className="field" type="password" placeholder="Mínimo de 6 caracteres" value={f.pw}
        onChange={e => set({ pw: e.target.value })} onKeyDown={e => e.key === "Enter" && submit()} />
      {err && <p className="err">{err}</p>}
      <button className="btn pri" style={{ height: 50, marginTop: 22 }} disabled={busy} onClick={submit}>
        {busy ? "Aguarde…" : isNew ? "Criar conta" : "Entrar"}
      </button>
      <button className="btn" style={{ marginTop: 10 }} onClick={() => { setMode(isNew ? "login" : "register"); setErr(""); }}>
        {isNew ? "Já tenho conta" : "Criar conta"}
      </button>
      {!isNew && <p className="note" style={{ marginTop: 16, textAlign: "center" }}>Conta de teste: mariana@healthup.com · senha 123456</p>}
    </div>
  );
}
