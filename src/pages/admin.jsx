import { useEffect, useState } from "react";

export default function Admin({ API_URL }) {
  const [users, setUsers] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/admin/get-users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data));
  }, [API_URL]);

  async function saveUser() {
    const res = await fetch(`${API_URL}/admin/update-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedUser),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function jailUser(seconds) {
    const res = await fetch(`${API_URL}/admin/jail-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser.id, seconds }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function updateCrime(c) {
    const res = await fetch(`${API_URL}/admin/update-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <select
        onChange={(e) => {
          const user = users.find((u) => u.id === parseInt(e.target.value));
          setSelectedUser(user);
        }}
        className="text-black p-2 mb-4"
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>

      {selectedUser && (
        <div className="bg-gray-800 p-4 rounded mb-6">
          <input
            className="text-black p-1 mb-2 w-full"
            placeholder="Money"
            value={selectedUser.money}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, money: e.target.value })
            }
          />
          <input
            className="text-black p-1 mb-2 w-full"
            placeholder="Bank"
            value={selectedUser.bank_balance}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, bank_balance: e.target.value })
            }
          />
          <button
            onClick={saveUser}
            className="bg-green-600 px-3 py-1 rounded mr-2"
          >
            Save User
          </button>
          <button
            onClick={() => jailUser(60)}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Jail 1m
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Crimes</h2>
      {crimes.map((c) => (
        <div key={c.id} className="bg-gray-800 p-4 rounded mb-4">
          <h3 className="font-semibold">{c.name}</h3>
          <input
            className="text-black p-1 mb-1 w-full"
            placeholder="Min Reward"
            defaultValue={c.min_reward}
            onBlur={(e) =>
              updateCrime({ ...c, min_reward: e.target.value })
            }
          />
          <input
            className="text-black p-1 mb-1 w-full"
            placeholder="Max Reward"
            defaultValue={c.max_reward}
            onBlur={(e) =>
              updateCrime({ ...c, max_reward: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
}
