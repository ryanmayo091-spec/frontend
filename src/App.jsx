// src/App.jsx
import { useEffect, useState } from "react";
import {
  Home, Sword, Package, Trophy, Banknote, Car, Building2, Users, Landmark, ShoppingBag, LogOut, Shield
} from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [cars, setCars] = useState([]);
  const [items, setItems] = useState([]);
  const [gangWars, setGangWars] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [amount, setAmount] = useState("");
  const [customPrices, setCustomPrices] = useState({});
  const [casinoResult, setCasinoResult] = useState("");

  // Refresh loop
  useEffect(() => {
    const interval = setInterval(() => setUser((u) => (u ? { ...u } : u)), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then((r) => r.json()).then(setCrimes);
      refreshProperties();
      refreshCars();
      refreshItems();
      refreshWars();
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
    if (data.success) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    else alert(data.error || "Login failed");
  }

  async function register(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.success ? "Registered! Please log in." : data.error || "Register failed");
  }

  function logout() { setUser(null); localStorage.removeItem("user"); }

  // --- Crimes ---
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.user) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    alert(data.message || (data.success ? `You earned $${data.reward}` : "Failed!"));
  }

  // --- Bank ---
  async function deposit(amount) {
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    alert(data.message || data.error);
  }

  async function withdraw(amount) {
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) { setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user)); }
    alert(data.message || data.error);
  }

  // --- Properties ---
  async function refreshProperties() {
    try { const res = await fetch(`${API_URL}/properties`); setProperties(await res.json()); }
    catch { console.log("Properties not loaded"); }
  }

  async function setPropertyPrice(propertyId) {
    const res = await fetch(`${API_URL}/properties/set-price`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId, customPrice: parseInt(customPrices[propertyId]) }),
    });
    const data = await res.json();
    alert(data.success ? "Property price updated!" : data.error);
    refreshProperties();
  }

  // --- Garage ---
  async function refreshCars() { 
    try { const res = await fetch(`${API_URL}/garage/${user.id}`); setCars(await res.json()); }
    catch { setCars([]); }
  }

  async function buyCar(model) {
    const res = await fetch(`${API_URL}/garage/buy`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, model }),
    });
    alert((await res.json()).message);
    refreshCars();
  }

  async function sellCar(carId) {
    const res = await fetch(`${API_URL}/garage/sell`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, carId }),
    });
    alert((await res.json()).message);
    refreshCars();
  }

  // --- Casino ---
  async function playSlots() {
    const res = await fetch(`${API_URL}/casino/slots`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setCasinoResult((await res.json()).message);
  }

  async function playBlackjack() {
    const res = await fetch(`${API_URL}/casino/blackjack`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setCasinoResult((await res.json()).message);
  }

  // --- Black Market ---
  async function refreshItems() { 
    try { const res = await fetch(`${API_URL}/blackmarket`); setItems(await res.json()); }
    catch { setItems([]); }
  }

  async function buyItem(itemId) {
    const res = await fetch(`${API_URL}/blackmarket/buy`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, itemId }),
    });
    alert((await res.json()).message);
    refreshItems();
  }

  // --- Gangs ---
  async function refreshWars() { 
    try { const res = await fetch(`${API_URL}/gang/wars`); setGangWars(await res.json()); }
    catch { setGangWars([]); }
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
          <TabButton icon={<Banknote size={18} />} label="Bank" active={activeTab === "bank"} onClick={() => setActiveTab("bank")} />
          <TabButton icon={<Building2 size={18} />} label="Properties" active={activeTab === "properties"} onClick={() => setActiveTab("properties")} />
          <TabButton icon={<Users size={18} />} label="Gangs" active={activeTab === "gangs"} onClick={() => setActiveTab("gangs")} />
          <TabButton icon={<Landmark size={18} />} label="Casino" active={activeTab === "casino"} onClick={() => setActiveTab("casino")} />
          <TabButton icon={<Car size={18} />} label="Garage" active={activeTab === "garage"} onClick={() => setActiveTab("garage")} />
          <TabButton icon={<ShoppingBag size={18} />} label="Black Market" active={activeTab === "blackmarket"} onClick={() => setActiveTab("blackmarket")} />
          <TabButton icon={<Trophy size={18} />} label="Rankings" active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} />
          {user.role === "admin" || user.role === "mod" ? (
            <TabButton icon={<Shield size={18} />} label="Admin Panel" active={activeTab === "admin"} onClick={() => setActiveTab("admin")} />
          ) : null}
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
      <main className="flex-1 p-8 space-y-6">
        {activeTab === "home" && <TabContent title="Home" desc="Welcome to the Mafia underworld. Track your empire here." />}
        {activeTab === "crimes" && crimes.map((c) => (
          <div key={c.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-2">
            <div><h2 className="text-xl">{c.name}</h2><p>Reward: ${c.min_reward}-{c.max_reward}</p></div>
            <button onClick={() => commitCrime(c.id)} className="bg-blue-600 px-4 py-2 rounded">Commit</button>
          </div>
        ))}
        {activeTab === "bank" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4 max-w-md">
            <p>💰 Cash: ${user.money} | 🏦 Bank: ${user.bank_balance}</p>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="p-2 text-black rounded w-full" />
            <div className="flex gap-2">
              <button onClick={() => deposit(amount)} className="bg-green-600 px-4 py-2 rounded w-1/2">Deposit</button>
              <button onClick={() => withdraw(amount)} className="bg-blue-600 px-4 py-2 rounded w-1/2">Withdraw</button>
            </div>
          </div>
        )}
        {activeTab === "properties" && properties.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded shadow mb-2">
            <h2 className="font-bold">{p.name}</h2>
            {p.owner_id === user.id ? (
              <div>
                <p>Stock: {p.bullets ?? 0} bullets</p>
                <input type="number" placeholder="Set price" value={customPrices[p.id] || ""} onChange={(e) => setCustomPrices({ ...customPrices, [p.id]: e.target.value })} className="p-1 text-black rounded" />
                <button onClick={() => setPropertyPrice(p.id)} className="bg-blue-600 px-3 py-1 rounded ml-2">Update</button>
              </div>
            ) : <p>Owned by another player</p>}
          </div>
        ))}
        {activeTab === "garage" && (
          <div>
            <h1 className="text-xl mb-2">Your Cars</h1>
            {cars.map((car) => (
              <div key={car.id} className="bg-gray-800 p-2 mb-2 rounded flex justify-between">
                <span>{car.model}</span>
                <button onClick={() => sellCar(car.id)} className="bg-red-600 px-2 py-1 rounded">Sell</button>
              </div>
            ))}
            <button onClick={() => buyCar("Sedan")} className="bg-green-600 px-4 py-2 rounded">Buy Sedan ($1000)</button>
          </div>
        )}
        {activeTab === "casino" && (
          <div className="space-y-4">
            <button onClick={playSlots} className="bg-purple-600 px-4 py-2 rounded">Play Slots</button>
            <button onClick={playBlackjack} className="bg-yellow-600 px-4 py-2 rounded">Play Blackjack</button>
            <p>{casinoResult}</p>
          </div>
        )}
        {activeTab === "blackmarket" && items.map((i) => (
          <div key={i.id} className="bg-gray-800 p-4 rounded mb-2 flex justify-between">
            <span>{i.name} - ${i.price}</span>
            <button onClick={() => buyItem(i.id)} className="bg-green-600 px-2 py-1 rounded">Buy</button>
          </div>
        ))}
        {activeTab === "gangs" && (
          <div>
            <h1 className="text-xl mb-2">Gang Wars History</h1>
            {gangWars.map((w) => (
              <div key={w.id} className="bg-gray-800 p-2 mb-2 rounded">
                <p>{w.gang_a} vs {w.gang_b} → Winner: {w.winner}</p>
                <small>{new Date(w.war_time).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
        {activeTab === "admin" && (user.role === "admin" || user.role === "mod") && (
          <div>
            <h1 className="text-2xl mb-4">Admin Panel</h1>
            <p className="opacity-70">Here admins and mods can manage players, properties, and economy. (Backend APIs needed)</p>
          </div>
        )}
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

// Tab content wrapper
function TabContent({ title, desc }) {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-6 italic text-gray-300">{desc}</div>
    </div>
  );
}
