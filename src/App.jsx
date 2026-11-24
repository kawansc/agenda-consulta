import { useApp } from "./context/AppContext";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Schedule from "./screens/Schedule";
import Review from "./screens/Review";
import Payment from "./screens/Payment";
import Appts from "./screens/Appts";
import Profile from "./screens/Profile";
import Nav from "./components/Nav";
import Modal from "./components/Modal";

export default function App() {
  const { user, screen, draft, modal, loading } = useApp();
  if (loading) return <div className="shell"><main className="scroll"><div className="empty" style={{ paddingTop: 140 }}>Carregando…</div></main></div>;
  return (
    <div className="shell">
      <main className={"scroll s-" + (user ? screen : "login")}>
        <div className="page">
        {!user && <Login />}
        {user && screen === "home" && <Home />}
        {user && screen === "search" && <Search />}
        {user && screen === "schedule" && draft && <Schedule />}
        {user && screen === "review" && draft && <Review />}
        {user && screen === "payment" && draft && <Payment />}
        {user && screen === "appts" && <Appts />}
        {user && screen === "profile" && <Profile />}
        </div>
      </main>
      <Nav />
      {modal && <Modal />}
    </div>
  );
}
