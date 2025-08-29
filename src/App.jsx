// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, LogOut, Building, Car, Store, Landmark, Shield, Users } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  // Admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [economy, setEconomy] = useState(null);
  const [crimeEdits, setCrimeEdits] = useState({});
  const [factoryRate, setFactoryRate] = useState("");
  const [slotOdds, setSlotOdds] = useState("");
  const [bjOdds, setBjOdds] = useState("");

  // Re-render every second (for cooldowns)
  useEffect(() => {
    const interval = setInterval(() => setUser((u) => (u ? { ...u } : u)), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Load crimes
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then(res => res.json()).then(setCrimes);
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
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
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

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  // --- Crimes ---
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert(`Success! You earned $${data.reward}`);
    } else {
      alert(data.message || "Failed!");
      setUser(data.user || user);
    }
  }

  // --- Admin functions ---
  async function loadUsers() {
    const res = await fetch(`${API_URL}/admin/users/${user.id}`);
    const data = await res.json();
    if (!data.error) setAdminUsers(data);
  }
  async function banUser(targetId) {
    await fetch(`${API_URL}/admin/ban-user`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id, targetId }) });
    loadUsers();
  }
  async function deleteUser(targetId) {
    await fetch(`${API_URL}/admin/delete-user`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id, targetId }) });
    loadUsers();
  }
  async function loadStats() {
    const res = await fetch(`${API_URL}/admin/stats/${user.id}`);
    const data = await res.json();
    if (!data.error) setStats(data);
  }
  async function updateCasino() {
    await fetch(`${API_URL}/admin/update-casino`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id, slot_odds: parseFloat(slotOdds), blackjack_odds: parseFloat(bjOdds) }),
    });
    alert("Casino odds updated");
  }
  async function loadEconomy() {
    const res = await fetch(`${API_URL}/admin/economy/${user.id}`);
    const data = await res.json();
    if (!data.error) setEconomy(data);
  }
  async function updateCrime(crimeId) {
    const edits = crimeEdits[crimeId];
    await fetch(`${API_URL}/admin/update-crime`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id, crimeId, ...edits }),
    });
    alert("Crime updated");
    loadEconomy();
  }
  async function updateFactory() {
    await fetch(`${API_URL}/admin/update-bullet-factory`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user.id, production_rate: parseInt(factoryRate) }),
    });
    alert("Factory updated");
    loadEconomy();
  }

  // --- UI ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-lg w-80">
          <h1 className="text-2xl font-bold mb-4 text-center">Mafia Game</h1>
          <form onSubmit={login} className="flex flex-col gap-2">
            <input className="p-2 rounded text-black" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="p-2 rounded text-black" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-green-600 hover:bg-green-700 p-2 rounded">Login</button>
          </form>
          <button onClick={register} className="mt-3 text-sm underline block mx-auto hover:text-green-400">Or Register</button>
        </div>
      </div>
    );
  }

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
          <button onClick={logout} className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 p-2 rounded justify-center">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "home" && (
          <div>
            <h1 className="text-3xl mb-4">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <StatCard title="Money" value={`$${user.money}`} />
              <StatCard title="Bank" value={`$${user.bank_balance}`} />
              <StatCard title="Bullets" value={user.bullets} />
              <StatCard title="Crimes" value={user.total_crimes} />
            </div>
          </div>
        )}

        {activeTab === "crimes" && (
          <div>
            <h1 className="text-2xl mb-4">Crimes</h1>
            {crimes.map((c) => (
              <div key={c.id} className="bg-gray-800 p-3 rounded mb-2 flex justify-between items-center">
                <div>
                  <h2 className="text-lg">{c.name}</h2>
                  <p className="text-sm opacity-70">Reward: ${c.min_reward}-{c.max_reward}, Success {Math.round(c.success_rate*100)}%</p>
                </div>
                <button onClick={() => commitCrime(c.id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Do</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "admin" && (user.role === "admin" || user.role === "mod") && (
          <div>
            <h1 className="text-3xl mb-6">⚖️ Admin Panel</h1>

            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-xl mb-2">📊 Game Stats</h2>
              <button onClick={loadStats} className="bg-blue-600 px-3 py-1 rounded mb-2">Refresh</button>
              {stats && (
                <div>
                  <p>Total Users: {stats.total_users}</p>
                  <p>Richest: {stats.richest?.username} (${stats.richest?.money})</p>
                  <p>Most Bullets: {stats.most_bullets?.username} ({stats.most_bullets?.bullets})</p>
                </div>
              )}
            </section>

            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-xl mb-2">👤 Player Management</h2>
              <button onClick={loadUsers} className="bg-green-600 px-3 py-1 rounded mb-2">Load Users</button>
              {adminUsers.map((u) => (
                <div key={u.id} className="bg-gray-700 p-2 rounded mb-2">
                  <p>{u.username} (ID:{u.id}) 💰{u.money} 🔫{u.bullets} Role:{u.role}</p>
                  <button onClick={() => banUser(u.id)} className="bg-red-600 px-2 py-1 rounded mr-2">Ban</button>
                  <button onClick={() => deleteUser(u.id)} className="bg-red-800 px-2 py-1 rounded">Delete</button>
                </div>
              ))}
            </section>

            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-xl mb-2">🎰 Casino Control</h2>
              <input placeholder="Slot odds" value={slotOdds} onChange={(e)=>setSlotOdds(e.target.value)} className="p-1 text-black rounded mr-2" />
              <input placeholder="Blackjack odds" value={bjOdds} onChange={(e)=>setBjOdds(e.target.value)} className="p-1 text-black rounded mr-2" />
              <button onClick={updateCasino} className="bg-yellow-600 px-3 py-1 rounded">Update</button>
            </section>

            <section className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-xl mb-2">💼 Economy Control</h2>
              <button onClick={loadEconomy} className="bg-blue-600 px-3 py-1 rounded mb-2">Load Economy</button>
              {economy && (
                <>
                  {economy.crimes.map((c) => (
                    <div key={c.id} className="bg-gray-700 p-2 mb-2 rounded">
                      <p>{c.name} → ${c.min_reward}-{c.max_reward}, Success {Math.round(c.success_rate*100)}%, CD {c.cooldown_seconds}s</p>
                      <input type="number" placeholder="Min" onChange={(e)=>setCrimeEdits({...crimeEdits,[c.id]:{...crimeEdits[c.id],min_reward:e.target.value}})} />
                      <input type="number" placeholder="Max" onChange={(e)=>setCrimeEdits({...crimeEdits,[c.id]:{...crimeEdits[c.id],max_reward:e.target.value}})} />
                      <input type="number" placeholder="Success" onChange={(e)=>setCrimeEdits({...crimeEdits,[c.id]:{...crimeEdits[c.id],success_rate:e.target.value}})} />
                      <input type="number" placeholder="CD" onChange={(e)=>setCrimeEdits({...crimeEdits,[c.id]:{...crimeEdits[c.id],cooldown_seconds:e.target.value}})} />
                      <button onClick={()=>updateCrime(c.id)} className="bg-green-600 px-2 py-1 rounded">Update</button>
                    </div>
                  ))}
                  <h3 className="text-lg mt-4 mb-2">Bullet Factory</h3>
                  <p>Current: {economy.factory.production_rate} bullets/hr</p>
                  <input type="number" placeholder="New rate" value={factoryRate} onChange={(e)=>setFactoryRate(e.target.value)} />
                  <button onClick={updateFactory} className="bg-yellow-600 px-3 py-1 rounded">Update</button>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

// UI helpers
function TabButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded ${active ? "bg-gray-700 text-green-400" : "hover:bg-gray-700"}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded text-center">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold text-green-400">{value}</div>
    </div>
  );
}
