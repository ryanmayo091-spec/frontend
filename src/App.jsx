// src/App.jsx
import { useEffect, useState } from "react";
import {
  Home, Sword, Package, Trophy, Banknote, Car, Building2, Users, Landmark, ShoppingBag, LogOut
} from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  // Refresh loop for timers
  useEffect(() => {
    const interval = setInterval(() => {
      setUser((u) => (u ? { ...u } : u));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then((r) => r.json()).then(setCrimes);
      refreshProperties();
    }
  }, [user]);

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

  async function refreshProperties() {
    try {
      const res = await fetch(`${API_URL}/properties`);
      const data = await res.json();
      setProperties(data);
    } catch {
      console.log("Properties not loaded");
    }
  }

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
          <button onClick={register} className="mt-4 text-sm underline block mx-auto hover:text-green-400">Or Register</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 flex flex-col shadow-2xl border-r border-gray-700">
        <h2 className="text-3xl font-extrabold mb-10 text-green-400 text-center">🕵 Mafia Game</h2>
        <nav className="flex flex-col gap-2">
          <TabButton icon={<Home size={18} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <TabButton icon={<Sword size={18} />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
          <TabButton icon={<Banknote size={18} />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
          <TabButton icon={<Building2 size={18} />} label="Properties" active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
          <TabButton icon={<Users size={18} />} label="Gangs" active={activeTab === "gangs"} onClick={() => setActiveTab("gangs")} />
          <TabButton icon={<Landmark size={18} />} label="Casino" active={activeTab === "casino"} onClick={() => setActiveTab("casino")} />
          <TabButton icon={<Car size={18} />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
          <TabButton icon={<ShoppingBag size={18} />} label="Black Market" active={activeTab === "blackmarket"} onClick={() => setActiveTab("blackmarket")} />
          <TabButton icon={<Trophy size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700 space-y-2 text-center">
          <div className="text-lg font-semibold text-green-400">{user.username}</div>
          <div className="text-sm text-gray-300">💰 ${user.money ?? 0} | 🔫 {user.bullets ?? 0}</div>
          <button onClick={logout} className="mt-4 flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 py-2 px-3 rounded-xl font-bold justify-center shadow-md">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "home" && <TabContent title="Home" desc="Welcome to the Mafia underworld. This is your empire’s dashboard — track your money, bullets, and progress here." />}
        {activeTab === "crimes" && <TabContent title="Crimes" desc="Every empire begins with crime. From petty theft to heists, crimes fuel your rise in the underworld." />}
        {activeTab === "bank" && <TabContent title="Bank" desc="The Bank is where dirty money finds safety. Deposit your cash to keep it safe from rivals, withdraw to invest in your empire." />}
        {activeTab === "properties" && <TabContent title="Properties" desc="Properties are the backbone of wealth. Bullet factories, casinos, and nightclubs — they print money and power if you own them." />}
        {activeTab === "gangs" && <TabContent title="Gangs" desc="Family is power. Join a gang, fight rivals, and dominate turf. Together you’re stronger than the law itself." />}
        {activeTab === "casino" && <TabContent title="Casino" desc="The Casino is the mafia’s playground. Gamble, cheat, or own the tables — fortune and ruin live here." />}
        {activeTab === "garage" && <TabContent title="Garage" desc="The Garage stores your vehicles. From beat-up sedans to armored beasts, cars are tools of crime and symbols of power." />}
        {activeTab === "blackmarket" && <TabContent title="Black Market" desc="The Black Market is where the real deals happen. Weapons, drugs, rare items — nothing is legal, but everything has a price." />}
        {activeTab === "rankings" && <TabContent title="Rankings" desc="The leaderboard of crime. The richest, the deadliest, the most feared — see who rules the streets." />}
      </main>
    </div>
  );
}

// Sidebar Button
function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        active ? "bg-green-600 text-white shadow-lg" : "bg-gray-700 hover:bg-gray-600 text-gray-200"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

// Tab content wrapper with description
function TabContent({ title, desc }) {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6 italic text-gray-300">{desc}</div>
      <p className="opacity-60">[Interactive content for {title} will be added here...]</p>
    </div>
  );
}
