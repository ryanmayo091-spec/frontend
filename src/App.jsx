// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, Banknote, Car, Building2, Users, LogOut } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [amount, setAmount] = useState("");
  const [customPrices, setCustomPrices] = useState({});
  const [salePrices, setSalePrices] = useState({});
  const [gangName, setGangName] = useState("");
  const [joinGangId, setJoinGangId] = useState("");
  const [warTargetGang, setWarTargetGang] = useState("");
  const [bulletsForWar, setBulletsForWar] = useState("");

  // Refresh every second for timers
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

  // Fetch crimes & properties
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then((r) => r.json()).then(setCrimes);
      refreshProperties();
    }
  }, [user]);

  // Auth
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

  // Crimes
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert(data.message || (data.success ? `You earned $${data.reward}` : "Failed!"));
  }

  // Properties
  async function refreshProperties() {
    const res = await fetch(`${API_URL}/properties`);
    const data = await res.json();
    setProperties(data);
  }

  async function buyBullets(propertyId, amount) {
    const res = await fetch(`${API_URL}/factory/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Bought ${data.bulletsBought} bullets for $${data.cost}`);
      refreshProperties();
    } else {
      alert(data.error || "Failed to buy bullets");
    }
  }

  async function setPropertyPrice(propertyId) {
    const res = await fetch(`${API_URL}/properties/set-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId, customPrice: parseInt(customPrices[propertyId]) }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Property price updated!");
      refreshProperties();
    } else {
      alert(data.error || "Failed to update price");
    }
  }

  // Attacks
  async function attackPlayer(defenderId, bulletsUsed) {
    const res = await fetch(`${API_URL}/attack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attackerId: user.id, defenderId, bulletsUsed }),
    });
    const data = await res.json();
    alert(data.message);
  }

  // Gangs
  async function createGang() {
    const res = await fetch(`${API_URL}/gang/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bossId: user.id, name: gangName }),
    });
    const data = await res.json();
    alert(data.success ? "Gang created!" : data.error);
  }

  async function joinGang() {
    const res = await fetch(`${API_URL}/gang/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, gangId: parseInt(joinGangId) }),
    });
    const data = await res.json();
    alert(data.success ? "Joined gang!" : data.error);
  }

  async function startWar() {
    const res = await fetch(`${API_URL}/gang/war`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gangA: user.gang_id,
        gangB: parseInt(warTargetGang),
        bulletsUsed: parseInt(bulletsForWar),
        initiatorId: user.id,
      }),
    });
    const data = await res.json();
    alert(data.message);
  }

  // --- UI ---
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
          <TabButton icon={<Building2 size={18} />} label="Properties" active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
          <TabButton icon={<Users size={18} />} label="Gangs" active={activeTab === "gangs"} onClick={() => setActiveTab("gangs")} />
          <TabButton icon={<Trophy size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700 space-y-2 text-center">
          <div className="text-lg font-semibold text-green-400">{user.username}</div>
          <div className="text-sm text-gray-300">💰 ${user.money ?? 0} | 🏦 ${user.bank_balance ?? 0} | 🔫 {user.bullets ?? 0}</div>
          <button onClick={logout} className="mt-4 flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 py-2 px-3 rounded-xl font-bold justify-center shadow-md">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "home" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <StatCard title="Money" value={`$${user.money}`} />
            <StatCard title="Bullets" value={user.bullets ?? 0} />
            <button onClick={() => attackPlayer(2, 50)} className="bg-red-600 px-4 py-2 rounded mt-4">Attack Player #2 with 50 bullets</button>
          </div>
        )}

        {activeTab === "crimes" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Crimes</h1>
            {crimes.map((c) => (
              <div key={c.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl">{c.name}</h2>
                  <p>Reward: ${c.min_reward}-{c.max_reward} | Success {Math.round(c.success_rate * 100)}%</p>
                </div>
                <button onClick={() => commitCrime(c.id)} className="bg-blue-600 px-4 py-2 rounded">Commit</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "properties" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Properties</h1>
            {properties.map((p) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded shadow mb-2">
                <h2 className="font-bold">{p.name}</h2>
                {p.name === "Bullet Factory" && (
                  <div>
                    {p.owner_id === user.id ? (
                      <div>
                        <p>Stock: {p.bullets ?? 0} bullets</p>
                        <input type="number" placeholder="Set bullet price"
                          value={customPrices[p.id] || ""}
                          onChange={(e) => setCustomPrices({ ...customPrices, [p.id]: e.target.value })}
                          className="p-1 text-black rounded"
                        />
                        <button onClick={() => setPropertyPrice(p.id)} className="bg-blue-600 px-3 py-1 rounded ml-2">Update Price</button>
                      </div>
                    ) : (
                      <div>
                        <p>Stock available: {p.bullets ?? 0} bullets</p>
                        <input type="number" placeholder="Bullets to buy"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="p-1 text-black rounded"
                        />
                        <button onClick={() => buyBullets(p.id, amount)} className="bg-green-600 px-3 py-1 rounded ml-2">Buy</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "gangs" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Gangs</h1>
            <input type="text" placeholder="Gang name" value={gangName} onChange={(e) => setGangName(e.target.value)} className="p-2 rounded text-black mr-2" />
            <button onClick={createGang} className="bg-green-600 px-3 py-1 rounded">Create Gang</button>
            <div className="mt-4">
              <input type="number" placeholder="Gang ID" value={joinGangId} onChange={(e) => setJoinGangId(e.target.value)} className="p-2 rounded text-black mr-2" />
              <button onClick={joinGang} className="bg-blue-600 px-3 py-1 rounded">Join Gang</button>
            </div>
            <div className="mt-4">
              <input type="number" placeholder="Target Gang ID" value={warTargetGang} onChange={(e) => setWarTargetGang(e.target.value)} className="p-2 rounded text-black mr-2" />
              <input type="number" placeholder="Bullets to use" value={bulletsForWar} onChange={(e) => setBulletsForWar(e.target.value)} className="p-2 rounded text-black mr-2" />
              <button onClick={startWar} className="bg-red-600 px-3 py-1 rounded">Start War</button>
            </div>
          </div>
        )}

        {activeTab === "rankings" && <div><h1>Rankings Coming Soon</h1></div>}
      </main>
    </div>
  );
}

// --- Components ---
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

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow text-center mb-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold text-green-400 mt-2">{value}</div>
    </div>
  );
}
