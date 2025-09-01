import { useEffect, useState } from "react";

export default function Properties({ user, API_URL }) {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/properties`)
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Failed to load properties", err));
  }, [API_URL]);

  async function buyProperty(propertyId) {
    const res = await fetch(`${API_URL}/buy-property`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId }),
    });
    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      <div className="space-y-4">
        {properties.map((p) => (
          <div
            key={p.id}
            className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-sm opacity-80">{p.description}</p>
              <p className="text-sm">Price: ${p.base_price}</p>
              {p.owner_id ? (
                <p className="text-sm text-green-400">Owned</p>
              ) : (
                <p className="text-sm text-red-400">Available</p>
              )}
            </div>
            {!p.owner_id && (
              <button
                onClick={() => buyProperty(p.id)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Buy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
