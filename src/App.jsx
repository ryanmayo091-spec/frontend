import { useEffect, useState } from "react";
import { Home, Sword, Car, Banknote, Shield, LogOut } from "lucide-react";
import SectionCard from "./components/SectionCard";
import StatCard from "./components/StatCard";
import NavButton from "./components/NavButton";
import Crimes from "./pages/Crimes";
import Bank from "./pages/Bank";
import Garage from "./pages/Garage";
import Prison from "./pages/Prison";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // re-render every second (for cooldowns)
  useEffect(() => {
    const interval = setInterval(() => setUser((u) => (u ? { ...u } : u)), 1000);
    return () => clearInterval(interval);
  }, []);

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  async function login(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else alert(data.error || "Login failed");
  }

  async function register(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) alert("Registered! Please log in.");
    else alert(data.error || "Register failed");
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  // === LOGIN SCREEN ===
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80">
          <h1 className="text-2xl font-bold mb-6 text-center">Mafia Game</h1>
          <form onSubmit={login} className="flex flex-col gap-3">
            <input className="p-2 rounded text-black" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="p-2 rounded text-black" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold">Login</button>
          </form>
          <button onClick={register} className="mt-4 text-sm underline block mx-auto hover:text-green-400">
            Or Register
          </button>
        </div>
      </div>
    );
  }

  // === MAIN APP ===
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-6">
        {activeTab === "home" && (
          <SectionCard title="Dashboard" description="Your life in the underworld.">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <StatCard title="Money" value={`$${user.money ?? 0}`} />
              <StatCard title="Total Crimes" value={user.total_crimes ?? 0} />
              <StatCard title="Successful" value={user.successful_crimes ?? 0} />
              <StatCard title="Unsuccessful" value={user.unsuccessful_crimes ?? 0} />
            </div>
          </SectionCard>
        )}

        {activeTab === "crimes" && <Crimes user={user} setUser={setUser} API_URL={API_URL} />}
        {activeTab === "bank" && <Bank user={user} setUser={setUser} API_URL={API_URL} />}
        {activeTab === "garage" && <Garage user={user} />}
        {activeTab === "prison" && <Prison user={user} />}
      </main>

      {/* Bottom Navbar */}
      <nav className="bg-gray-800 border-t border-gray-700 flex justify-around p-2">
        <NavButton icon={<Home />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavButton icon={<Sword />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
        <NavButton icon={<Banknote />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
        <NavButton icon={<Car />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
        <NavButton icon={<Shield />} label="Prison" active={activeTab === "prison"} onClick={() => setActiveTab("prison")} />
        <NavButton icon={<LogOut />} label="Logout" onClick={logout} />
      </nav>
    </div>
  );
}
