import { useEffect, useState } from "react";

export default function Admin({ user, API_URL }) {
  const [tab, setTab] = useState("players");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [properties, setProperties] = useState([]);
  const [crimes, setCrimes] = useState([]);

  // Load data
  useEffect(() => {
    fetch(`${API_URL}/admin/get-users`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));

    fetch(`${API_URL}/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data));

    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data));
  }, [API_URL]);

  // === ACTIONS ===
  async function updateUser() {
    if (!selectedPlayer) return;
    await fetch(`${API_URL}/admin/update-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPlayer),
    });
    alert("✅ Player updated");
  }

  async function jailUser(seconds) {
    if (!selectedPlayer) return;
    await fetch(`${API_URL}/admin/jail-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedPlayer.id, jailSeconds: seconds }),
    });
    alert("✅ Jail status updated");
  }

  async function setPropertyOwner(propertyId, ownerId) {
    await fetch(`${API_URL}/admin/set-property-owner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, ownerId }),
    });
    alert("✅ Property updated");
  }

  async function updateCrime(crime) {
    await fetch(`${API_URL}/admin/update-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crime),
    });
    alert("✅ Crime updated");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🛡️ Admin Panel</h1>
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "players" ? "bg-green-600" : "bg-gray-700"
          }`}
          onClick={() => setTab("players")}
        >
          Players
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "properties" ? "bg-green-600" : "bg-gray-700"
          }`}
          onClick={() => setTab("properties")}
        >
          Properties
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "economy" ? "bg-green-600" : "bg-gray-700"
          }`}
          onClick={() => setTab("economy")}
        >
          Economy
        </button>
      </div>

      {/* === PLAYERS TAB === */}
      {tab === "players" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Players</h2>
          <select
            className="w-full p-2 text-black rounded mb-4"
            onChange={(e) => {
              const player = players.find(
                (p) => p.id === parseInt(e.target.value)
              );
              setSelectedPlayer(player);
            }}
          >
            <option value="">Select Player</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.username}
              </option>
            ))}
          </select>

          {selectedPlayer && (
            <div className="space-y-3 bg-gray-800 p-4 rounded">
              <input
                className="w-full p-2 text-black rounded"
                value={selectedPlayer.money}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, money: e.target.value })
                }
                placeholder="Money"
              />
              <input
                className="w-full p-2 text-black rounded"
                value={selectedPlayer.bank_balance}
                onChange={(e) =>
                  setSelectedPlayer({
                    ...selectedPlayer,
                    bank_balance: e.target.value,
                  })
                }
                placeholder="Bank Balance"
              />
              <input
                className="w-full p-2 text-black rounded"
                value={selectedPlayer.xp}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, xp: e.target.value })
                }
                placeholder="XP"
              />
              <input
                className="w-full p-2 text-black rounded"
                value={selectedPlayer.rank}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, rank: e.target.value })
                }
                placeholder="Rank"
              />
              <select
                className="w-full p-2 text-black rounded"
                value={selectedPlayer.role}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, role: e.target.value })
                }
              >
                <option value="player">Player</option>
                <option value="mod">Mod</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex gap-3">
                <button
                  className="bg-green-600 px-4 py-2 rounded"
                  onClick={updateUser}
                >
                  Save
                </button>
                <button
                  className="bg-red-600 px-4 py-2 rounded"
                  onClick={() => jailUser(300)}
                >
                  Jail 5min
                </button>
                <button
                  className="bg-blue-600 px-4 py-2 rounded"
                  onClick={() => jailUser(0)}
                >
                  Unjail
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === PROPERTIES TAB === */}
      {tab === "properties" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Properties</h2>
          <div className="space-y-4">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-gray-800 p-4 rounded">
                <h3 className="font-bold">{prop.name}</h3>
                <p className="opacity-80">{prop.description}</p>
                <select
                  className="w-full p-2 text-black rounded mt-2"
                  onChange={(e) =>
                    setPropertyOwner(prop.id, parseInt(e.target.value))
                  }
                >
                  <option value="">Set Owner</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.username}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === ECONOMY TAB === */}
      {tab === "economy" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Economy</h2>
          <div className="space-y-4">
            {crimes.map((crime) => (
              <div key={crime.id} className="bg-gray-800 p-4 rounded space-y-2">
                <h3 className="font-bold">{crime.name}</h3>
                <input
                  className="w-full p-2 text-black rounded"
                  value={crime.min_reward}
                  onChange={(e) =>
                    setCrimes(
                      crimes.map((c) =>
                        c.id === crime.id
                          ? { ...c, min_reward: e.target.value }
                          : c
                      )
                    )
                  }
                  placeholder="Min Reward"
                />
                <input
                  className="w-full p-2 text-black rounded"
                  value={crime.max_reward}
                  onChange={(e) =>
                    setCrimes(
                      crimes.map((c) =>
                        c.id === crime.id
                          ? { ...c, max_reward: e.target.value }
                          : c
                      )
                    )
                  }
                  placeholder="Max Reward"
                />
                <input
                  className="w-full p-2 text-black rounded"
                  value={crime.success_rate}
                  onChange={(e) =>
                    setCrimes(
                      crimes.map((c) =>
                        c.id === crime.id
                          ? { ...c, success_rate: e.target.value }
                          : c
                      )
                    )
                  }
                  placeholder="Success Rate"
                />
                <button
                  className="bg-green-600 px-4 py-2 rounded"
                  onClick={() => updateCrime(crime)}
                >
                  Save Crime
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
