import { useApp } from "../context/AppContext";

export default function Profile() {
  const { setBanner, user, go, initials, logout } = useApp();
  return (<>
    <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Perfil</h1>
    <p className="eyebrow">Sua conta</p>
    <div className="card"><div className="doc" style={{ marginBottom: 0 }}><div className="avatar">{initials(user.name)}</div><div><b>{user.name}</b><span>{user.email}</span></div></div></div>
    <button className="btn" onClick={logout}>Sair da conta</button>
  </>);
}
