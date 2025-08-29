import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";

export default function Crimes({ user, setUser, API_URL }) {
  const [crimes, setCrimes] = useState([]);
  const [crimeLog, setCrimeLog] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/crimes/${user.id}`)
      .then((res) => res.json())
      .then((data) => setCrimes(data))
      .catch((err) => console.error("Failed to load crimes", err));
  }, [user, API_URL]);

  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    setCrimeLog((prev) => [
      { story: data.story, success: data.success },
      ...prev.slice(0, 9),
    ]);
  }

  return (
    <SectionCard title="Commit Crimes" description="Each crime has its own cooldown. Choose wisely.">
      <div className="space-y-4">
        {crimes.map((crime) => {
          const cooldown = user.cooldowns?.[crime.id];
          const now = Date.now();
          const remaining = cooldown ? Math.max(0, Math.ceil((new Date(cooldown) - now) / 1000)) : 0;

          return (
            <div key={crime.id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-bold">{crime.name}</h2>
              <p className="text-sm opacity-70">{crime.description}</p>
              <p className="text-sm opacity-70">
                Reward: ${crime.min_reward}-{crime.max_reward} | Success: {Math.round(crime.success_rate * 100)}%
              </p>

              {remaining > 0 ? (
                <span className="text-red-400">⏳ {remaining}s</span>
              ) : (
                <button onClick={() => commitCrime(crime.id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mt-2">
                  Do Crime
                </button>
              )}
            </div>
          );
        })}

        {crimeLog.length > 0 && (
          <div className="bg-gray-900 p-4 rounded shadow mt-6">
            <h3 className="font-semibold mb-2">📝 Crime Log</h3>
            <ul className="space-y-1 text-sm">
              {crimeLog.map((log, i) => (
                <li key={i} className={log.success ? "text-green-400" : "text-red-400"}>
                  {log.story}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
