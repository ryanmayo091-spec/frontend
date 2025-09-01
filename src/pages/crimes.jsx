import { useEffect, useState } from "react";

export default function Crimes({ user, API_URL }) {
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data))
      .catch((err) => console.error("Failed to load crimes", err));
  }, [API_URL]);

  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();

    if (data.success) {
      alert(data.message);
    } else {
      alert(data.message || "❌ Failed!");
    }
  }

  function getCooldown(crime) {
    if (!user.last_crimes) return 0;
    const last = user.last_crimes[crime.id];
    if (!last) return 0;
    return new Date(last).getTime() + crime.cooldown_seconds * 1000;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crimes</h1>
      <div className="space-y-4">
        {crimes.map((crime) => {
          const end = getCooldown(crime);
          const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
          return (
            <div
              key={crime.id}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{crime.name}</h2>
                <p className="text-sm opacity-80">{crime.description}</p>
                <p className="text-sm">
                  💵 ${crime.min_reward} - ${crime.max_reward} | 🎯{" "}
                  {Math.round(crime.success_rate * 100)}% | ⏱ {crime.cooldown_seconds}s
                </p>
              </div>
              {remaining > 0 ? (
                <span className="text-red-500 text-sm">Cooldown: {remaining}s</span>
              ) : (
                <button
                  onClick={() => commitCrime(crime.id)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Commit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
