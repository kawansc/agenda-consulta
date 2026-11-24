import Icon from "./Icon";
import { useApp } from "../context/AppContext";

const ITEMS = [["home", "home", "Início"], ["appts", "cal", "Consultas"], ["profile", "user", "Perfil"]];

export default function Nav() {
  const { user, navOn, go, setBanner } = useApp();
  return (
    <nav className="nav" hidden={!user}>
      {ITEMS.map(([key, icon, label]) => (
        <button key={key} className={navOn === key ? "on" : ""} onClick={() => { if (key === "appts") setBanner(""); go(key); }}>
          <Icon n={icon} />{label}
        </button>
      ))}
    </nav>
  );
}
