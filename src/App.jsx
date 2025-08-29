// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, LogOut, Building, Car, Store, Landmark, Shield, Users } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Game states
  const [crimes, setCrimes] = useState([]);
  const [amount, setAmount] = useState("");
  const [cars, setCars] = useState([]);
  const [properties, setProperties] = useState([]);
  const [blackMarket, setBlackMarket] = useState([]);
  const [casinoMsg, setCasinoMsg] = useState("");

  // Admin states (already implemented in last version)
  const [adminUsers, setAdminUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [economy, setEconomy] = useState(null);
  const [crimeEdits, setCrimeEdits] = useState({});
  const [factoryRate, setFactoryRate] = useState("");
  const [slotOdds, setSlotOdds] = useState("");
  const [bjOdds, setBjOdds] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`).then(res => res.json()).then(setCrimes);
      fetchGarage();
      fetchProperties();
      fetchBlackMarket();
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

  // --- Bank ---
  async function deposit() {
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user));
      alert(data.message);
    } else alert(data.error);
  }
  async function withdraw() {
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user));
      alert(data.message);
    } else alert(data.error);
  }

  // --- Garage ---
  async function fetchGarage() {
    const res = await fetch(`${API_URL}/garage/${user.id}`);
    const data = await res.json();
    setCars(data);
  }
  async function buyCar(model) {
    const res = await fetch(`${API_URL}/garage/buy`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, model }),
    });
    const data = await res.json(); alert(data.message); fetchGarage();
  }
  async function sellCar(carId) {
    const res = await fetch(`${API_URL}/garage/sell`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, carId }),
    });
    const data = await res.json(); alert(data.message); fetchGarage();
  }

  // --- Properties ---
  async function fetchProperties() {
    const res = await fetch(`${API_URL}/properties`);
    const data = await res.json(); setProperties(data);
  }

  // --- Black Market ---
  async function fetchBlackMarket() {
    const res = await fetch(`${API_URL}/blackmarket`);
    const data = await res.json(); setBlackMarket(data);
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
        {activeTab === "home" && <h1 className="text-3xl mb-4">Dashboard</h1>}

        {activeTab === "bank" && (
          <div>
            <h1 className="text-2xl mb-4">Bank</h1>
            <p>Cash: ${user.money} | Bank: ${user.bank_balance}</p>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="p-2 rounded text-black mr-2" />
            <button onClick={deposit} className="bg-green-600 px-3 py-1 rounded mr-2">Deposit</button>
            <button onClick={withdraw} className="bg-blue-600 px-3 py-1 rounded">Withdraw</button>
          </div>
        )}

        {activeTab === "garage" && (
          <div>
            <h1 className="text-2xl mb-4">Garage</h1>
            <button onClick={()=>buyCar("Sedan")} className="bg-green-600 px-3 py-1 rounded mr-2">Buy Sedan $1000</button>
            <button onClick={()=>buyCar("Sports")} className="bg-green-600 px-3 py-1 rounded mr-2">Buy Sports $5000</button>
            <button onClick={()=>buyCar("Armored")} className="bg-green-600 px-3 py-1 rounded">Buy Armored $20000</button>
            <h2 className="mt-4">Your Cars:</h2>
            {cars.map(car => (
              <div key={car.id} className="bg-gray-800 p-2 my-2 rounded flex justify-between">
                <span>{car.model}</span>
                <button onClick={()=>sellCar(car.id)} className="bg-red-600 px-2 py-1 rounded">Sell</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "properties" && (
          <div>
            <h1 className="text-2xl mb-4">Properties</h1>
            {properties.map(p => (
              <div key={p.id} className="bg-gray-800 p-2 mb-2 rounded">
                <p>{p.name} - Owner: {p.owner_id || "None"} | Price: ${p.custom_price || p.base_price}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "blackmarket" && (
          <div>
            <h1 className="text-2xl mb-4">Black Market</h1>
            {blackMarket.map(item => (
              <div key={item.id} className="bg-gray-800 p-2 mb-2 rounded flex justify-between">
                <span>{item.name} - ${item.price}</span>
                <button onClick={()=>buyItem(item.id)} className="bg-blue-600 px-2 py-1 rounded">Buy</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "casino" && (
          <div>
            <h1 className="text-2xl mb-4">Casino</h1>
            <button onClick={playSlots} className="bg-purple-600 px-3 py-1 rounded mr-2">Play Slots ($100)</button>
            <button onClick={playBlackjack} className="bg-purple-800 px-3 py-1 rounded">Play Blackjack ($200)</button>
            {casinoMsg && <p className="mt-3">{casinoMsg}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

// Helpers
function TabButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded ${active ? "bg-gray-700 text-green-400" : "hover:bg-gray-700"}`}>
      {icon} {label}
    </button>
  );
}
