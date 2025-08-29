import { useEffect, useState } from "react";

export default function Crimes({ user, API_URL }) {
  const [crimes, setCrimes] = useState({});
  const [crimeLog, setCrimeLog] = useState([]);

  // Fetch crimes grouped by category
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

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));
    }

    setCrimeLog((prev) => [
      { story: data.story, success: data.success, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  }

  function getCooldownEnd(crime) {
    if (!user.last_crimes) return 0;
    const last = user.last_crimes[crime.id];
    if (!last) return 0;
    return new Date(last).getTime() + crime.cooldown_seconds * 1000;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💀 Crimes</h1>
      <p className="mb-6 opacity-80">
        Petty theft or high-stakes heists — every choice builds your reputation. Fail, and prison awaits.
      </p>

      {Object.keys(crimes).map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">{category} Crimes</h2>
          <div className="space-y-4">
            {crimes[category].map((crime) => {
              const cooldownEnd = getCooldownEnd(crime);
              const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));

              return (
                <div key={crime.id} className="bg-gray-800 p-4 rounded shadow space-y-2">
                  <div>
                    <h3 className="text-xl font-semibold">{crime.name}</h3>
                    <p className="text-sm opacity-80">{crime.description}</p>
                    <p className="text-sm opacity-70 mt-1">
                      💵 ${crime.min_reward} - ${crime.max_reward} | 🎯 {Math.round(crime.success_rate * 100)}% success | ⏳ {crime.cooldown_seconds}s cooldown
                    </p>
                  </div>
                  {remaining > 0 ? (
                    <span className="text-red-400 text-sm">⏳ {remaining}s cooldown</span>
                  ) : (
                    <button
                      onClick={() => commitCrime(crime.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                      Commit Crime
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {crimeLog.length > 0 && (
        <div className="bg-gray-900 p-4 rounded shadow mt-6">
          <h3 className="font-semibold mb-2">📝 Crime Log</h3>
          <ul className="space-y-1 text-sm">
            {crimeLog.map((log, i) => (
              <li key={i} className={log.success ? "text-green-400" : "text-red-400"}>
                [{log.time}] {log.story}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
