import { useEffect, useState } from "react";

export default function Crimes({ user, API_URL }) {
  const [crimes, setCrimes] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [lastCrimes, setLastCrimes] = useState(user.last_crimes || {});

  // Load crimes from backend
  useEffect(() => {
    fetch(`${API_URL}/crimes`)
      .then((res) => res.json())
      .then((data) => setCrimes(data))
      .catch((err) => console.error("Failed to load crimes", err));
  }, [API_URL]);

  // Commit a crime
  async function commitCrime(crimeId) {
    const res = await fetch(`${API_URL}/commit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, crimeId }),
    });
    const data = await res.json();

    alert(data.message);

    if (data.user) {
      setLastCrimes(data.user.last_crimes || {});
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  // Get cooldown timer
  function getCooldown(crimeId, cooldown) {
    if (!lastCrimes || !lastCrimes[crimeId]) return 0;
    const end = new Date(lastCrimes[crimeId]).getTime() + cooldown * 1000;
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
  }

  // Group crimes by category
  const grouped = crimes.reduce((acc, crime) => {
    const category = crime.category || "Miscellaneous";
    if (!acc[category]) acc[category] = [];
    acc[category].push(crime);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Crimes</h1>
      <p className="mb-6 opacity-80">
        Each crime has its own risks, rewards, and cooldowns. Succeed to gain
        money and XP, fail and you may end up in prison.
      </p>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, crimeList]) => (
          <div key={category} className="bg-gray-800 rounded shadow">
            {/* Category Toggle */}
            <button
              onClick={() =>
                setOpenCategory(openCategory === category ? null : category)
              }
              className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left text-green-400 hover:bg-gray-700 rounded"
            >
              {category}
              <span>{openCategory === category ? "▲" : "▼"}</span>
            </button>

            {/* Crimes inside category */}
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
                        <p className="text-xs opacity-60 flex gap-3 items-center mt-1">
                          <span className="flex items-center gap-1">
                            <img
                              src="https://i.ibb.co/k53Qd5k/money-bag.png"
                              alt="Money"
                              className="w-4 h-4"
                            />
                            ${crime.min_reward} - ${crime.max_reward}
                          </span>
                          <span className="flex items-center gap-1">
                            <img
                              src="https://i.ibb.co/0Y0Y3cs/mafia-hat.png"
                              alt="Success"
                              className="w-4 h-4"
                            />
                            {Math.round(crime.success_rate * 100)}%
                          </span>
                          <span className="flex items-center gap-1">
                            <img
                              src="https://i.ibb.co/SBSj3tM/prison-bars.png"
                              alt="Cooldown"
                              className="w-4 h-4"
                            />
                            {crime.cooldown_seconds}s
                          </span>
                        </p>
                      </div>

                      {/* Button or cooldown */}
                      {remaining > 0 ? (
                        <span className="text-red-400 text-sm">
                          Cooling down: {remaining}s
                        </span>
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
