import { useEffect, useState } from "react";

export default function Admin({ user, API_URL }) {
  const [users, setUsers] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [targetUser, setTargetUser] = useState("");
  const [amount, setAmount] = useState("");
  const [role, setRole] = useState("player");
  const [tab, setTab] = useState("users");

  // Fetch users + crimes
  useEffect(() => {
    fetch(`${API_URL}/admin/users`)
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);

    fetch(`${API_URL}/admin/crimes`)
      .then(r => r.json())
      .then(setCrimes)
      .catch(console.error);
  }, [API_URL]);

  // === Actions ===
  async function giveMoney() {
    if (!targetUser) return alert("Select a user first!");
    const res = await fetch(`${API_URL}/admin/give-money`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        targetId: targetUser,
        amount: Number(amount),
      }),
    });
    alert((await res.json()).message);
  }

  async function jailUser(minutes) {
    if (!targetUser) return alert("Select a user first!");
    const res = await fetch(`${API_URL}/admin/jail-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser, minutes }),
    });
    alert((await res.json()).message);
  }

  async function releaseUser() {
    if (!targetUser) return alert("Select a user first!");
    const res = await fetch(`${API_URL}/admin/release-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser }),
    });
    alert((await res.json()).message);
  }

  async function updateRole() {
    if (!targetUser) return alert("Select a user first!");
    const res = await fetch(`${API_URL}/admin/set-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser, role }),
    });
    alert((await res.json()).message);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Admin Control Panel</h1>
      <p className="opacity-80">
        Manage players, crimes, and the economy. Only admins and mods have
        access.
      </p>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab("users")}
          className={`px-3 py-1 rounded ${
            tab === "users" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("crimes")}
          className={`px-3 py-1 rounded ${
            tab === "crimes" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Crimes
        </button>
        <button
          onClick={() => setTab("economy")}
          className={`px-3 py-1 rounded ${
            tab === "economy" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Economy
        </button>
      </div>

      {/* USERS TAB */}
      {tab === "users" && (
        <div className="bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold mb-2">Manage Users</h2>

          <select
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            className="w-full p-2 rounded text-black"
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.role}) — 💵 {u.money}
              </option>
            ))}
          </select>

          {/* Money Controls */}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 rounded text-black flex-1"
            />
            <button
              onClick={giveMoney}
              className="bg-green-600 px-3 rounded"
            >
              Give
            </button>
          </div>

          {/* Jail Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => jailUser(10)}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Jail 10m
            </button>
            <button
              onClick={releaseUser}
              className="bg-yellow-600 px-3 py-1 rounded"
            >
              Release
            </button>
          </div>

          {/* Role Controls */}
          <div className="flex gap-3 items-center">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 rounded text-black"
            >
              <option value="player">Player</option>
              <option value="mod">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={updateRole}
              className="bg-blue-600 px-3 rounded"
            >
              Update Role
            </button>
          </div>
        </div>
      )}

      {/* CRIMES TAB */}
      {tab === "crimes" && (
        <div className="bg-gray-800 p-4 rounded shadow space-y-2">
          <h2 className="text-lg font-semibold mb-2">Crimes Overview</h2>
          {crimes.map((crime) => (
            <div
              key={crime.id}
              className="border-b border-gray-700 py-2 text-sm"
            >
              <strong>{crime.name}</strong> — {crime.description} <br />
              💵 {crime.min_reward}-{crime.max_reward} | 🎯{" "}
              {Math.round(crime.success_rate * 100)}% | ⏳{" "}
              {crime.cooldown_seconds}s | 🏆 +{crime.xp_reward} XP
            </div>
          ))}
        </div>
      )}

      {/* ECONOMY TAB */}
      {tab === "economy" && (
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Economy Controls</h2>
          <p className="opacity-80">
            Future expansion: control global taxes, bullet factory production,
            casino odds, etc.
          </p>
        </div>
      )}
    </div>
  );
}
