import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, Car, Banknote, Lock, LogOut } from "lucide-react";

// Pages (all lowercase file names)
import Crimes from "./pages/crimes";
import Bank from "./pages/bank";
import Garage from "./pages/garage";
import Prison from "./pages/prison";
import Rankings from "./pages/rankings";

// Components (all lowercase file names)
import SectionCard from "./components/sectioncard";
import StatCard from "./components/statcard";
import NavButton from "./components/navbutton";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Auto-refresh user (for cooldowns etc.)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser((u) => (u ? { ...u } : u));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Login
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

  // Register
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

  // Logout
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
            <input
              className="p-2 rounded text-black"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="p-2 rounded text-black"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold">
              Login
            </button>
          </form>
          <button
            onClick={register}
            className="mt-4 text-sm underline block mx-auto hover:text-green-400"
          >
            Or Register
          </button>
        </div>
      </div>
    );
  }

  // === MAIN APP ===
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-green-400">Mafia Game</h2>
        <nav className="flex flex-col gap-3">
          <TabButton icon={<Home size={18} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <TabButton icon={<Sword size={18} />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
          <TabButton icon={<Banknote size={18} />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
          <TabButton icon={<Car size={18} />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
          <TabButton icon={<Lock size={18} />} label="Prison" active={activeTab === "prison"} onClick={() => setActiveTab("prison")} />
          <TabButton icon={<Trophy size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="mb-2 text-sm opacity-80">{user.username}</div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded justify-center"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "home" && (
  <SectionCard title="Dashboard" description="Your underworld empire overview.">
    {/* Player Profile Card */}
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4 mb-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/809/809052.png"
        alt="avatar"
        className="w-16 h-16 rounded-full border-2 border-green-500"
      />
      <div>
        <h2 className="text-xl font-bold">{user.username}</h2>
        <p className="opacity-80">Rank: {user.rank || "Rookie"} ⭐ {user.xp || 0} XP</p>
        <p className="text-green-400 font-semibold">💵 ${user.money ?? 0}</p>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="💵 Money" value={`$${user.money ?? 0}`} color="green" />
      <StatCard title="🎯 Success" value={user.successful_crimes ?? 0} color="blue" />
      <StatCard title="❌ Fails" value={user.unsuccessful_crimes ?? 0} color="red" />
      <StatCard title="🕵️ Crimes" value={user.total_crimes ?? 0} color="yellow" />
    </div>

    {/* XP + Rank Progress */}
    <div className="bg-gray-800 mt-6 p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-2">Rank Progress</h3>
      <p className="mb-2">👤 {user.rank || "Rookie"} — ⭐ {user.xp || 0} XP</p>
      <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-4"
          style={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
        ></div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      <button
        onClick={() => setActiveTab("crimes")}
        className="bg-blue-600 hover:bg-blue-700 py-3 rounded shadow text-lg font-semibold"
      >
        🚨 Commit Crime
      </button>
      <button
        onClick={() => setActiveTab("bank")}
        className="bg-green-600 hover:bg-green-700 py-3 rounded shadow text-lg font-semibold"
      >
        🏦 Bank
      </button>
      <button
        onClick={() => setActiveTab("garage")}
        className="bg-purple-600 hover:bg-purple-700 py-3 rounded shadow text-lg font-semibold"
      >
        🚗 Garage
      </button>
    </div>

    {/* Recent Activity */}
    <div className="bg-gray-800 mt-6 p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-3">📜 Recent Activity</h3>
      <ul className="space-y-2 text-sm">
        <li className="opacity-80">✅ Robbed a corner store — earned $200</li>
        <li className="opacity-80">❌ Failed to pickpocket a stranger</li>
        <li className="opacity-80">✅ Mugged someone — earned $50</li>
      </ul>
    </div>
  </SectionCard>
)}


function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
        active ? "bg-gray-700 text-green-400" : "hover:bg-gray-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}

