// src/App.jsx
import { useEffect, useState } from "react";
import { Home, Sword, Package, Trophy, LogOut } from "lucide-react";

const API_URL = "https://mafia-game-kxct.onrender.com";

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

useEffect(() => {
  const saved = localStorage.getItem("user");
  if (saved) setUser(JSON.parse(saved));
}, []);

  // Fetch crimes when logged in
useEffect(() => {
  if (user) {
    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data));
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

async function commitCrime(crimeId) {
  const res = await fetch(`${API_URL}/commit-crime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, crimeId }),
  });
  const data = await res.json();

  if (data.jail_until) {
    // User failed a crime and is jailed
    setUser({ ...user, jail_until: data.jail_until });
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, jail_until: data.jail_until })
    );
    alert(data.message || "You are in jail!");
  } else if (data.success) {
    // Crime success
    setUser({ ...user, money: data.newBalance });
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, money: data.newBalance })
    );
    alert(`Success! You earned $${data.reward}`);
  } else {
    // Crime failed but not jailed
    alert(data.message || "Crime failed!");
  }
}


  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

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
            <button className="bg-green-600 hover:bg-green-700 p-2 rounded font-semibold">Login</button>
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

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-green-400">Mafia Game</h2>
        <nav className="flex flex-col gap-3">
          <TabButton icon={<Home size={18} />} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <TabButton icon={<Sword size={18} />} label="Crimes" active={activeTab === "crimes"} onClick={() => setActiveTab("crimes")} />
          <TabButton icon={<Package size={18} />} label="Inventory" active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
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
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <StatCard title="Money" value={`$${user.money ?? 0}`} />
              <StatCard title="Total Crimes" value={user.total_crimes ?? 0} />
              <StatCard title="Successful" value={user.successful_crimes ?? 0} />
              <StatCard title="Unsuccessful" value={user.unsuccessful_crimes ?? 0} />
            </div>
          </div>
        )}

     {activeTab === "crimes" && (
  <div>
    <h1 className="text-3xl font-bold mb-6">Crimes</h1>

    {user.jail_until && new Date(user.jail_until) > new Date() ? (
      <div className="bg-red-600 p-4 rounded mb-4">
        🚔 You are in jail until{" "}
        {new Date(user.jail_until).toLocaleTimeString()}.
      </div>
    ) : (
      <div className="grid gap-4">
        {crimes.map((crime) => (
          <div
            key={crime.id}
            className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{crime.name}</h2>
              <p className="text-sm opacity-80">
                Reward: ${crime.min_reward} - ${crime.max_reward} | Success
                Rate: {Math.round(crime.success_rate * 100)}%
              </p>
            </div>
            <button
              onClick={() => commitCrime(crime.id)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Commit
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {activeTab === "inventory" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Inventory</h1>
            <p className="opacity-80">Your items will appear here soon.</p>
          </div>
        )}

        {activeTab === "rankings" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Rankings</h1>
            <p className="opacity-80">Leaderboard coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}

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

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow text-center">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold text-green-400 mt-2">{value}</div>
    </div>
  );
}




