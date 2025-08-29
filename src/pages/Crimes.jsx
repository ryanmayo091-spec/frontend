import { useEffect, useState } from "react";

export default function Crimes({ user, API_URL }) {
  const [crimes, setCrimes] = useState([]);

  // Fetch crimes
  useEffect(() => {
    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data))
      .catch((err) => console.error("Failed to load crimes", err));
  }, [API_URL]);

  // Commit crime
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();

    if (data.jail_until) {
      alert(data.message || "You were jailed!");
    } else if (data.success) {
      alert(`✅ Success! You earned $${data.reward}`);
    } else {
      alert(data.message || "❌ Failed crime!");
    }
  }

  // Countdown helper
  function getCooldownEnd(crime) {
    if (!user.last_crimes) return 0;
    const last = user.last_crimes[crime.id];
    if (!last) return 0;
    return new Date(last).getTime() + crime.cooldown_seconds * 1000;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crimes</h1>
      <p className="mb-4 opacity-80">
        Choose your path to fortune and notoriety. Each crime has its own risk,
        reward, and cooldown. Fail, and you may end up in prison.
      </p>

      <div className="space-y-4">
        {crimes.map((crime) => {
          const cooldownEnd = getCooldownEnd(crime);
          const remaining = Math.max(
            0,
            Math.ceil((cooldownEnd - Date.now()) / 1000)
          );

          return (
            <div
              key={crime.id}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{crime.name}</h2>
                <p className="text-sm opacity-80">
                  Reward: ${crime.min_reward} - ${crime.max_reward} | Success{" "}
                  {Math.round(crime.success_rate * 100)}%
                </p>
              </div>
              {remaining > 0 ? (
                <span className="text-red-500 text-sm">⏳ {remaining}s</span>
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
