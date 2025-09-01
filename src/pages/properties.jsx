import { useEffect, useState } from "react";

export default function Properties({ user, API_URL }) {
  const [properties, setProperties] = useState([]);
  const [owned, setOwned] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data));

    fetch(`${API_URL}/user/properties?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setOwned(data));
  }, [API_URL, user.id]);

  async function buyProperty(propertyId) {
    const res = await fetch(`${API_URL}/properties/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function collect(propertyId) {
    const res = await fetch(`${API_URL}/properties/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Collected ${data.reward} ${data.type}`);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🏢 Properties</h1>
      <p className="mb-6 opacity-80">
        Invest in properties to control the mafia economy. Bullet factories
        produce ammo, casinos generate gambling profits, and nightclubs bring in
        passive income.
      </p>

      <div className="space-y-4">
        {properties.map((p) => {
          const ownedProperty = owned.find((o) => o.property_id === p.id);
          return (
            <div
              key={p.id}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-sm opacity-80">{p.description}</p>
                <p className="text-sm opacity-60">
                  Price: ${p.base_price} | Income: ${p.income_rate}
                </p>
              </div>
              {ownedProperty ? (
                <button
                  onClick={() => collect(p.id)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Collect
                </button>
              ) : (
                <button
                  onClick={() => buyProperty(p.id)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Buy
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
