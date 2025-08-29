// src/App.jsx
import { useEffect, useState } from "react";
import {
  Home,
  Sword,
  Car,
  Banknote,
  Shield,
  LogOut,
} from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  const [bankAmount, setBankAmount] = useState("");
  const [transferUser, setTransferUser] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  // Force re-render every 1s (for live cooldowns)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser((u) => (u ? { ...u } : u));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch crimes when logged in
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/crimes`)
        .then((res) => res.json())
        .then((data) => setCrimes(data))
        .catch((err) => console.error("Failed to load crimes", err));
    }
  }, [user]);

  // === AUTH ===
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

  // === CRIMES ===
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    alert(data.message || (data.success ? `Earned $${data.reward}` : "Failed!"));
  }

  // === BANK ===
  async function deposit(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: bankAmount }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setBankAmount("");
    }
    alert(data.message);
  }

  async function withdraw(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: bankAmount }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setBankAmount("");
    }
    alert(data.message);
  }

  async function transfer(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/bank/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId: user.id, toUsername: transferUser, amount: transferAmount }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTransferUser("");
      setTransferAmount("");
    }
    alert(data.message);
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

  // === APP CONTENT ===
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-6">
        {/* HOME */}
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

        {/* CRIMES */}
        {activeTab === "crimes" && (
          <SectionCard title="Commit Crimes" description="Risk it all and earn your fortune in the streets.">
            {crimes.map((crime) => {
              const lastCrime = user.last_crime ? new Date(user.last_crime) : null;
              const nextAvailable = lastCrime ? lastCrime.getTime() + crime.cooldown_seconds * 1000 : 0;
              const now = Date.now();
              const remaining = Math.max(0, Math.ceil((nextAvailable - now) / 1000));
              return (
                <div key={crime.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-center mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{crime.name}</h2>
                    <p className="text-sm opacity-80">
                      Reward: ${crime.min_reward}-{crime.max_reward} | {Math.round(crime.success_rate * 100)}% success
                    </p>
                  </div>
                  {remaining > 0 ? (
                    <span className="text-red-500 text-sm">⏳ {remaining}s</span>
                  ) : (
                    <button onClick={() => commitCrime(crime.id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                      Commit
                    </button>
                  )}
                </div>
              );
            })}
          </SectionCard>
        )}

        {/* BANK */}
        {activeTab === "bank" && (
          <SectionCard title="Bank" description="Secure your money, transfer to others, and build wealth.">
            <form onSubmit={deposit} className="flex gap-2 mb-3">
              <input className="p-2 text-black rounded flex-1" placeholder="Amount" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
              <button className="bg-green-600 px-3 py-1 rounded">Deposit</button>
            </form>
            <form onSubmit={withdraw} className="flex gap-2 mb-3">
              <input className="p-2 text-black rounded flex-1" placeholder="Amount" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
              <button className="bg-red-600 px-3 py-1 rounded">Withdraw</button>
            </form>
            <form onSubmit={transfer} className="flex gap-2">
              <input className="p-2 text-black rounded flex-1" placeholder="To Username" value={transferUser} onChange={(e) => setTransferUser(e.target.value)} />
              <input className="p-2 text-black rounded flex-1" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
              <button className="bg-blue-600 px-3 py-1 rounded">Send</button>
            </form>
          </SectionCard>
        )}

        {/* GARAGE */}
        {activeTab === "garage" && (
          <SectionCard title="Garage" description="Your collection of stolen or purchased cars.">
            <p className="opacity-80">🚗 Car system coming soon.</p>
          </SectionCard>
        )}

        {/* PRISON */}
        {activeTab === "prison" && (
          <SectionCard title="Prison" description="Busted? Serve time or hope someone breaks you out.">
            {user.jail_until && new Date(user.jail_until) > new Date() ? (
              <div className="bg-red-600 p-4 rounded mb-4">
                🚔 You are in jail until {new Date(user.jail_until).toLocaleTimeString()}.
              </div>
            ) : (
              <p className="opacity-80">No jail time right now. Stay safe!</p>
            )}
          </SectionCard>
        )}
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

/* === COMPONENTS === */
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-400">{title}</h1>
        <p className="text-sm opacity-70">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center text-xs ${active ? "text-green-400" : "opacity-70 hover:opacity-100"}`}>
      {icon}
      {label}
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
