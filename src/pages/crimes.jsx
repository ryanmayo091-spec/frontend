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

    if (data.success) {
      alert(`✅ Success! You earned $${data.reward}`);
    } else if (data.jail_until) {
      alert(`🚔 You got caught! In jail until ${new Date(data.jail_until).toLocaleTimeString()}`);
    } else {
      alert(data.message || "❌ Failed crime!");
    }
  }

  // Helper: cooldown
  function getCooldownEnd(crime) {
    if (!user.last_crimes) return 0;
    const last = user.last_crimes[crime.id];
    if (!last) return 0;
    return new Date(last).getTime() + crime.cooldown_seconds * 1000;
  }

  // Group crimes by category
  const grouped = crimes.reduce((acc, crime) => {
    acc[crime.category] = acc[crime.category] || [];
    acc[crime.category].push(crime);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💀 Crimes</h1>
      <p className="mb-6 opacity-80">
        Crimes are your path to fortune and fear. Each one has its own story, reward,
        and risk. Fail, and you may end up behind bars.
      </p>

      {Object.entries(grouped).map(([category, crimes]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-400">{category} Crimes</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {crimes.map((crime) => {
              const cooldownEnd = getCooldownEnd(crime);
              const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));

              return (
                <div
                  key={crime.id}
                  className="bg-gray-800 rounded-xl shadow overflow-hidden flex flex-col"
                >
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://source.unsplash.com/600x400/?mafia,crime,${crime.category}')`,
                    }}
                  ></div>
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{crime.name}</h3>
                      <p className="text-sm opacity-70 mb-2">{crime.description}</p>
                      <p className="text-sm opacity-80">
                        💵 ${crime.min_reward} - ${crime.max_reward} | 🎯 {Math.round(crime.success_rate * 100)}% | ⏳ {crime.cooldown_seconds}s
                      </p>
                    </div>
                    {remaining > 0 ? (
                      <button
                        disabled
                        className="bg-gray-700 text-gray-400 mt-3 p-2 rounded"
                      >
                        Cooling down: {remaining}s
                      </button>
                    ) : (
                      <button
                        onClick={() => commitCrime(crime.id)}
                        className="bg-blue-600 hover:bg-blue-700 mt-3 p-2 rounded font-semibold"
                      >
                        Commit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
