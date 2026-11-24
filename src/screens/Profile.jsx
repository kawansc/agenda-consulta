import { useState } from "react";
import { applyTheme, getTheme } from "../utils/theme";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { setBanner, user, go, initials, logout } = useApp();
  const [theme, setTheme] = useState(getTheme());
  const pick = t => { setTheme(t); applyTheme(t); };
  return (<>
    <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Perfil</h1>
    <p className="eyebrow">Sua conta</p>
    <div className="card"><div className="doc" style={{ marginBottom: 0 }}><div className="avatar">{initials(user.name)}</div><div><b>{user.name}</b><span>{user.email}</span></div></div></div>
    <div className="lab" style={{ margin: "6px 0 8px" }}>Aparência</div>
    <div className="opts" style={{ marginBottom: 14 }}>{[["auto", "Automático"], ["light", "Claro"], ["dark", "Escuro"]].map(([k, l]) => (
      <button key={k} className={"chip" + (theme === k ? " on" : "")} onClick={() => pick(k)}>{l}</button>
    ))}</div>
    <button className="btn" onClick={logout}>Sair da conta</button>
  </>);
}
