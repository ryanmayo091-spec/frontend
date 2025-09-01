import { useEffect, useState } from "react";

export default function Properties({ user, API_URL }) {
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/properties`)
      .then(r => r.json())
      .then(setProperties)
      .catch(console.error);
  }, [API_URL]);

  async function buyProperty(id) {
    const res = await fetch(`${API_URL}/properties/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId: id }),
    });
    alert((await res.json()).message);
  }

  async function collectProduction(id) {
    const res = await fetch(`${API_URL}/properties/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId: id }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Collected ${data.produced} units. Total stored: ${data.stored}`);
    }
  }

  async function setPropertyPrice(id) {
    const res = await fetch(`${API_URL}/properties/set-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, propertyId: id, price }),
    });
    alert((await res.json()).message);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🏢 Properties</h1>
      <p className="mb-6 opacity-80">
        Own and control the underground economy. Properties generate income or resources over time.
      </p>

      <div className="space-y-6">
        {properties.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="opacity-80 mb-2">{p.description}</p>
            <p className="text-sm">Base Price: ${p.base_price}</p>
            <p className="text-sm">Production: {p.production_rate} {p.production_type}/min</p>

            {p.owner ? (
              <div className="mt-3">
                <p className="text-sm">Owned by: {p.owner}</p>
                {p.owner === user.username ? (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => collectProduction(p.id)}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Collect Production
                    </button>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Set Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="p-2 rounded text-black flex-1"
                      />
                      <button
                        onClick={() => setPropertyPrice(p.id)}
                        className="bg-blue-600 px-3 rounded"
                      >
                        Update Price
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-400 text-sm">You do not own this property.</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => buyProperty(p.id)}
                className="mt-3 bg-yellow-600 px-4 py-2 rounded"
              >
                Buy for ${p.base_price}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
