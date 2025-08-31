import { useEffect, useState } from "react";

import Crimes from "./crimes";   // ✅ fixed
import Bank from "./bank";       // ✅ fixed
import Garage from "./garage";   // ✅ fixed
import Prison from "./prison";   // ✅ fixed
import Rankings from "./rankings"; // ✅ fixed

export default function Admin({ user, API_URL }) {
  const [users, setUsers] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [amount, setAmount] = useState(0);

  // Fetch users + crimes
  useEffect(() => {
    fetch(`${API_URL}/admin/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Failed to load users", err));

    fetch(`${API_URL}/admin/crimes`)
      .then((res) => res.json())
      .then(setCrimes)
      .catch((err) => console.error("Failed to load crimes", err));
  }, [API_URL]);

  async function giveMoney() {
    const res = await fetch(`${API_URL}/admin/give-money`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser, amount }),
    });
    const data = await res.json();
    alert(data.message || "Action complete");
  }

  async function jailUser(minutes) {
    const res = await fetch(`${API_URL}/admin/jail-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser, minutes }),
    });
    const data = await res.json();
    alert(data.message || "User jailed");
  }

  async function releaseUser() {
    const res = await fetch(`${API_URL}/admin/release-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUser }),
    });
    const data = await res.json();
    alert(data.message || "User released");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
      <p className="opacity-80 mb-6">
        Manage users, crimes, and the economy. Only admins can see this tab.
      </p>

      {/* User Management */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <select
          value={targetUser || ""}
          onChange={(e) => setTargetUser(e.target.value)}
          className="w-full p-2 rounded text-black mb-4"
        >
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.role})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="w-full p-2 rounded text-black mb-3"
        />

        <div className="flex gap-3">
          <button onClick={giveMoney} className="bg-green-600 px-4 py-2 rounded">
            Give Money
          </button>
          <button onClick={() => jailUser(10)} className="bg-red-600 px-4 py-2 rounded">
            Jail 10m
          </button>
          <button onClick={releaseUser} className="bg-yellow-600 px-4 py-2 rounded">
            Release
          </button>
        </div>
      </div>

      {/* Crimes Management */}
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Crimes Management</h2>
        {crimes.map((crime) => (
          <div key={crime.id} className="mb-3">
            <p>
              <span className="font-semibold">{crime.name}</span> – Reward $
              {crime.min_reward}-{crime.max_reward}, Success{" "}
              {Math.round(crime.success_rate * 100)}%, Cooldown{" "}
              {crime.cooldown_seconds}s
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
