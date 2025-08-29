// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, LogOut, Building, Car, Store, Landmark, Shield, Users } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Game data
  const [crimes, setCrimes] = useState([]);
  const [amount, setAmount] = useState("");
  const [cars, setCars] = useState([]);
  const [properties, setProperties] = useState([]);
  const [blackMarket, setBlackMarket] = useState([]);
  const [casinoMsg, setCasinoMsg] = useState("");

  // Admin data
  const [adminUsers, setAdminUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [economy, setEconomy] = useState(null);
  const [crimeEdits, setCrimeEdits] = useState({});
  const [factoryRate, setFactoryRate] = useState("");
  const [slotOdds, setSlotOdds] = useState("");
  const [bjOdds, setBjOdds] = useState("");

  // Auto-refresh (cooldowns)
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    const interval = setInterval(() => setUser((u) => (u ? { ...u } : u)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then(res => res.json()).then(setCrimes);
      fetchGarage(); fetchProperties(); fetchBlackMarket();
    }
  }, [user]);

  // --- Auth ---
  async function login(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user));
    } else alert(data.error || "Login failed");
  }
  async function register(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) alert("Registered! Please log in.");
    else alert(data.error || "Register failed");
  }
  function logout() { setUser(null); localStorage.removeItem("user"); }

  // --- Crimes ---
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user));
      alert(`Success! You earned $${data.reward}`);
    } else {
      alert(data.message || "Failed!"); setUser(data.user || user);
    }
  }

  // --- Bank ---
  async function deposit() {
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    else alert(data.error);
  }
  async function withdraw() {
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    else alert(data.error);
  }

  // --- Garage ---
  async function fetchGarage() {
    const res = await fetch(`${API_URL}/garage/${user.id}`); setCars(await res.json());
  }

  // --- Properties ---
  async function fetchProperties() {
    const res = await fetch(`${API_URL}/properties`); setProperties(await res.json());
  }

  // --- Black Market ---
  async function fetchBlackMarket() {
    const res = await fetch(`${API_URL}/blackmarket`); setBlackMarket(await res.json());
  }
  async function buyItem(itemId) {
    const res = await fetch(`${API_URL}/blackmarket/buy`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, itemId }),
    });
    const data = await res.json(); alert(data.message); fetchBlackMarket();
  }

  // --- Casino ---
  async function playSlots() {
    const res = await fetch(`${API_URL}/casino/slots`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json(); setCasinoMsg(data.message);
  }
  async function playBlackjack() {
    const res = await fetch(`${API_URL}/casino/blackjack`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json(); setCasinoMsg(data.message);
  }

  // --- Admin ---
  async function loadUsers() {
    const res = await fetch(`${API_URL}/admin/users/${user.id}`);
    const data = await res.json(); if (!data.error) setAdminUsers(data);
  }
  async function banUser(targetId) {
    await fetch(`${API_URL}/admin/ban-user`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: user.id, targetId }) });
    loadUsers();
  }
  async function deleteUser(targetId) {
    await fetch(`${API_URL}/admin/delete-user`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: user.id, targetId }) });
    loadUsers();
  }
  async function loadStats() {
    const res = await fetch(`${API_URL}/admin/stats/${user.id}`); const data = await res.json(); if (!data.error) setStats(data);
  }
  async function updateCasino() {
    await fetch(`${API_URL}/admin/update-casino`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: user.id, slot_odds: parseFloat(slotOdds), blackjack_odds: parseFloat(bjOdds) }) });
    alert("Casino odds updated");
  }
  async function loadEconomy() {
    const res = await fetch(`${API_URL}/admin/economy/${user.id}`); const data = await res.json(); if (!data.error) setEconomy(data);
  }
  async function updateCrime(crimeId) {
    const edits = crimeEdits[crimeId];
    await fetch(`${API_URL}/admin/update-crime`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: user.id, crimeId, ...edits }) });
    alert("Crime updated"); loadEconomy();
  }
  async function updateFactory() {
    await fetch(`${API_URL}/admin/update-bullet-factory`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: user.id, production_rate: parseInt(factoryRate) }) });
    alert("Factory updated"); loadEconomy();
  }

  // --- UI ---
  if (!user) { /* login/register UI (same as before) */ }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-green-400">Mafia Game</h2>
        <nav className="flex flex-col gap-3">
          <TabButton icon={<Home size={18} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <TabButton icon={<Sword size={18} />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
          <TabButton icon={<Landmark size={18} />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
          <TabButton icon={<Car size={18} />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
          <TabButton icon={<Building size={18} />} label="Properties" active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
          <TabButton icon={<Store size={18} />} label="Black Market" active={activeTab === "blackmarket"} onClick={() => setActiveTab("blackmarket")} />
          <TabButton icon={<Shield size={18} />} label="Casino" active={activeTab === "casino"} onClick={() => setActiveTab("casino")} />
          <TabButton icon={<Users size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
          {(user.role === "admin" || user.role === "mod") && (
            <TabButton icon={<Trophy size={18} />} label="Admin" active={activeTab === "admin"} onClick={() => setActiveTab("admin")} />
          )}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="mb-2 text-sm opacity-80">{user.username}</div>
          <button onClick={logout} className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded justify-center"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "home" && <StoryCard title="Home" text="Welcome to the underworld. Here you’ll see your empire." />}
        {activeTab === "crimes" && (
          <div>
            <StoryCard title="Crimes" text="Commit crimes to earn money and respect." />
            {crimes.map((c) => (
              <div key={c.id} className="bg-gray-800 p-3 rounded mb-2 flex justify-between">
                <div><h2 className="text-lg">{c.name}</h2><p>Reward: ${c.min_reward}-{c.max_reward}, Success {Math.round(c.success_rate*100)}%</p></div>
                <button onClick={()=>commitCrime(c.id)} className="bg-blue-600 px-3 py-1 rounded">Do</button>
              </div>
            ))}
          </div>
        )}
        {activeTab === "bank" && (/* Bank UI with StoryCard */)}
        {activeTab === "garage" && (/* Garage UI with StoryCard */)}
        {activeTab === "properties" && (/* Properties UI with StoryCard */)}
        {activeTab === "blackmarket" && (/* Black Market UI with StoryCard */)}
        {activeTab === "casino" && (/* Casino UI with StoryCard */)}

        {activeTab === "admin" && (user.role === "admin" || user.role === "mod") && (
          <div>
            <StoryCard title="Admin Panel" text="Control the underworld economy." />
            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-xl mb-2">📊 Stats</h2><button onClick={loadStats}>Load</button>
              {stats && <div><p>Total Users: {stats.total_users}</p></div>}
            </section>
            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2>👤 Users</h2><button onClick={loadUsers}>Load Users</button>
              {adminUsers.map(u => (<div key={u.id}>{u.username}<button onClick={()=>banUser(u.id)}>Ban</button></div>))}
            </section>
            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2>🎰 Casino</h2><input value={slotOdds} onChange={e=>setSlotOdds(e.target.value)} /><button onClick={updateCasino}>Save</button>
            </section>
            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2>💼 Economy</h2><button onClick={loadEconomy}>Load</button>
              {economy && economy.crimes.map(c=>(<div key={c.id}>{c.name}<button onClick={()=>updateCrime(c.id)}>Update</button></div>))}
              {economy && <div>Factory: {economy.factory.production_rate}<input value={factoryRate} onChange={e=>setFactoryRate(e.target.value)} /><button onClick={updateFactory}>Update</button></div>}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

// Helpers
function TabButton({ icon, label, active, onClick }) {
  return <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded ${active ? "bg-gray-700 text-green-400" : "hover:bg-gray-700"}`}>{icon} {label}</button>;
}
function StoryCard({ title, text }) {
  return <div className="bg-gray-800 p-4 rounded mb-4 shadow"><h1 className="text-2xl mb-2">{title}</h1><p>{text}</p></div>;
}
