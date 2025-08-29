import { useEffect, useState } from "react";

export default function Crimes({ user, API_URL }) {
  const [crimes, setCrimes] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [lastCrimes, setLastCrimes] = useState(user.last_crimes || {});

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
      alert(`✅ Success! You earned $${data.reward} and ${data.xpGain} XP`);
    } else {
      alert(data.message || `❌ Crime failed but gained ${data.xpGain} XP`);
    }

    if (data.user) {
      setLastCrimes(data.user.last_crimes || {});
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  function getCooldown(crimeId, cooldown) {
    if (!lastCrimes || !lastCrimes[crimeId]) return 0;
    const end = new Date(lastCrimes[crimeId]).getTime() + cooldown * 1000;
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
  }

  const grouped = crimes.reduce((acc, crime) => {
    const category = crime.category || "Miscellaneous";
    if (!acc[category]) acc[category] = [];
    acc[category].push(crime);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">💀 Crimes</h1>
      <p className="mb-6 opacity-80">
        Gain XP and rank up as you commit crimes. Higher ranks unlock tougher, more rewarding crimes.
      </p>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <p>👤 Rank: <span className="text-green-400 font-bold">{user.rank}</span></p>
        <p>⭐ XP: <span className="text-blue-400 font-bold">{user.xp}</span></p>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, crimeList]) => (
          <div key={category} className="bg-gray-800 rounded shadow">
            <button
              onClick={() => setOpenCategory(openCategory === category ? null : category)}
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left text-green-400 hover:bg-gray-700 rounded"
            >
              {category}
              <span>{openCategory === category ? "▲" : "▼"}</span>
            </button>

            {openCategory === category && (
              <div className="p-4 space-y-4">
                {crimeList.map((crime) => {
                  const remaining = getCooldown(crime.id, crime.cooldown_seconds);
                  return (
                    <div
                      key={crime.id}
                      className="bg-gray-900 p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">{crime.name}</h3>
                        <p className="text-sm opacity-80">{crime.description}</p>
                        <p className="text-xs opacity-60">
                          💵 ${crime.min_reward} - ${crime.max_reward} | 🎯{" "}
                          {Math.round(crime.success_rate * 100)}% | ⏳ {crime.cooldown_seconds}s
                        </p>
                      </div>
                      {remaining > 0 ? (
                        <span className="text-red-400 text-sm">⏳ {remaining}s</span>
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
