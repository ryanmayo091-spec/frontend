import { useState, useEffect } from "react";

const API_URL = "https://mafia-game-kxct.onrender.com"; // replace with your backend URL

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

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
    } else alert(data.error);
  }

  async function register(e) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Registered! Please log in.");
    } else alert(data.error);
  }

  async function loadCrimes() {
    const res = await fetch(`${API_URL}/crimes`);
    const data = await res.json();
    setCrimes(data);
  }

  useEffect(() => {
    if (user) loadCrimes();
  }, [user]);

  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`✅ Success! You earned $${data.reward}`);
    } else {
      alert("❌ Failed crime");
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl mb-4">Mafia Game</h1>
        <form className="flex flex-col gap-2" onSubmit={login}>
          <input
            className="p-2 rounded text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="p-2 rounded text-black"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-600 p-2 rounded">Login</button>
        </form>
        <button className="mt-2 text-sm" onClick={register}>
          Or Register
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl">Welcome, {user.username}</h1>
        <button onClick={logout} className="bg-red-600 p-2 rounded">
          Logout
        </button>
      </div>
      <p>💰 Money: ${user.money}</p>

      <h2 className="mt-6 mb-2 text-lg">Crimes</h2>
      <ul>
        {crimes.map((c) => (
          <li key={c.id} className="mb-2">
            {c.name} - Reward: ${c.min_reward} to ${c.max_reward}
            <button
              className="ml-2 bg-blue-600 p-1 rounded"
              onClick={() => commitCrime(c.id)}
            >
              Commit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

