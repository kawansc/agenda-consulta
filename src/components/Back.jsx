import Icon from "./Icon";
import { useApp } from "../context/AppContext";

export default function Back({ to, title }) {
  const { go } = useApp();
  return (
    <div className="top"><button className="ic" aria-label="Voltar" onClick={() => go(to)}><Icon n="back" s={24} /></button><h1>{title}</h1></div>
  );
}
