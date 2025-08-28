// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, Banknote, Car, Building2, LogOut } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [cars, setCars] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [amount, setAmount] = useState("");

  // Force re-render every 1s (for live countdowns)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser((u) => (u ? { ...u } : u));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch data
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then((res) => res.json()).then(setCrimes);
      fetch(`${API_URL}/cars`).then((res) => res.json()).then(setCars);
      fetch(`${API_URL}/properties`).then((res) => res.json()).then(setProperties);
    }
  }, [user]);

  // --- Auth ---
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

  // --- Crimes ---
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert(`You earned $${data.reward}`);
    } else {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert(data.message);
    }
  }

  // --- Bank ---
  async function bankAction(type) {
    const res = await fetch(`${API_URL}/bank/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    setAmount("");
  }

  // --- Garage ---
  async function buyCar(carId) {
    const res = await fetch(`${API_URL}/garage/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, carId }),
    });
    const data = await res.json();
    alert("Car purchased!");
  }

  // --- Properties ---
  async function buyProperty(propertyId) {
    const res = await fetch(`${API_URL}/properties/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId }),
    });
    const data = await res.json();
    alert("Property purchased!");
  }

  // --- Login/Register screen ---
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

  // --- Logged in UI ---
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 flex flex-col shadow-2xl border-r border-gray-700">
        <h2 className="text-3xl font-extrabold mb-10 text-green-400 text-center">🕵 Mafia Game</h2>
        <nav className="flex flex-col gap-2">
          <TabButton icon={<Home size={18} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <TabButton icon={<Sword size={18} />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
          <TabButton icon={<Banknote size={18} />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
          <TabButton icon={<Car size={18} />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
          <TabButton icon={<Building2 size={18} />} label="Properties" active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
          <TabButton icon={<Package size={18} />} label="Inventory" active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
          <TabButton icon={<Trophy size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700 space-y-2 text-center">
          <div className="text-lg font-semibold text-green-400">{user.username}</div>
          <div className="text-sm text-gray-300">💰 ${user.money ?? 0} | 🏦 ${user.bank_balance ?? 0}</div>
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
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <StatCard title="Money" value={`$${user.money ?? 0}`} />
              <StatCard title="Bank" value={`$${user.bank_balance ?? 0}`} />
              <StatCard title="Total Crimes" value={user.total_crimes ?? 0} />
              <StatCard title="Successful" value={user.successful_crimes ?? 0} />
            </div>
          </div>
        )}

        {activeTab === "crimes" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Crimes</h1>
            {crimes.map((crime) => (
              <div key={crime.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-semibold">{crime.name}</h2>
                  <p className="text-sm opacity-80">Reward: ${crime.min_reward}-{crime.max_reward} | Success {Math.round(crime.success_rate * 100)}%</p>
                </div>
                <button onClick={() => commitCrime(crime.id)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Commit</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "bank" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Bank</h1>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="p-2 rounded text-black mb-2" />
            <div className="space-x-2">
              <button onClick={() => bankAction("deposit")} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Deposit</button>
              <button onClick={() => bankAction("withdraw")} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">Withdraw</button>
            </div>
          </div>
        )}

        {activeTab === "garage" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Garage</h1>
            {cars.map((car) => (
              <div key={car.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-2">
                <div>{car.name} - ${car.price}</div>
                <button onClick={() => buyCar(car.id)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Buy</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "properties" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Properties</h1>
            {properties.map((p) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-2">
                <div>{p.name} - ${p.price} (Income/hr: ${p.income_per_hour})</div>
                <button onClick={() => buyProperty(p.id)} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Buy</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "inventory" && (
          <div><h1 className="text-3xl font-bold mb-6">Inventory</h1><p className="opacity-80">Your items will appear here soon.</p></div>
        )}

        {activeTab === "rankings" && (
          <div><h1 className="text-3xl font-bold mb-6">Rankings</h1><p className="opacity-80">Leaderboard coming soon.</p></div>
        )}
      </main>
    </div>
  );
}

// --- UI Components ---
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
    <div className="bg-gray-800 rounded-xl p-4 shadow text-center">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold text-green-400 mt-2">{value}</div>
    </div>
  );
}
