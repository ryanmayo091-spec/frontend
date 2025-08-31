import { useEffect, useState } from "react";

export default function Bank({ user, API_URL }) {
  const [amount, setAmount] = useState("");
  const [dirtyAmount, setDirtyAmount] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [investments, setInvestments] = useState([]);

  // Load active investments
  useEffect(() => {
    fetch(`${API_URL}/bank/investments/${user.id}`)
      .then((res) => res.json())
      .then((data) => setInvestments(data))
      .catch(() => {});
  }, [API_URL, user.id]);

  async function deposit() {
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function withdraw() {
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(amount) }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function launder() {
    const res = await fetch(`${API_URL}/bank/launder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount: parseInt(dirtyAmount) }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function invest(type) {
    const res = await fetch(`${API_URL}/bank/invest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, type, amount: parseInt(investAmount) }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function collectInvestment(id) {
    const res = await fetch(`${API_URL}/bank/collect-investment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investmentId: id }),
    });
    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🏦 The Mafia Bank</h1>
      <p className="mb-6 opacity-80">
        The Mafia Bank is where fortunes are hidden, laundered, and grown. 
        Here your dirty cash becomes clean, and risky investments can 
        make you a king—or break you.
      </p>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">💵 Pocket</h2>
          <p>${user.pocket_money ?? 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">🏦 Bank</h2>
          <p>${user.bank_money ?? 0}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">🕵️ Dirty</h2>
          <p>${user.dirty_money ?? 0}</p>
        </div>
      </div>

      {/* Deposit / Withdraw */}
      <div className="bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Deposit & Withdraw</h2>
        <p className="text-sm opacity-70 mb-2">5% mafia fee applies on deposits.</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-2 rounded text-black mb-2"
        />
        <div className="flex gap-3">
          <button onClick={deposit} className="bg-green-600 px-4 py-2 rounded">Deposit</button>
          <button onClick={withdraw} className="bg-red-600 px-4 py-2 rounded">Withdraw</button>
        </div>
      </div>

      {/* Launder Money */}
      <div className="bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Launder Dirty Money</h2>
        <p className="text-sm opacity-70 mb-2">10% fee to clean your cash.</p>
        <input
          type="number"
          value={dirtyAmount}
          onChange={(e) => setDirtyAmount(e.target.value)}
          placeholder="Dirty money amount"
          className="w-full p-2 rounded text-black mb-2"
        />
        <button onClick={launder} className="bg-blue-600 px-4 py-2 rounded">Launder</button>
      </div>

      {/* Investments */}
      <div className="bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Investments</h2>
        <p className="text-sm opacity-70 mb-2">Choose wisely—big risk, big reward.</p>
        <input
          type="number"
          value={investAmount}
          onChange={(e) => setInvestAmount(e.target.value)}
          placeholder="Investment amount"
          className="w-full p-2 rounded text-black mb-2"
        />
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => invest("bonds")} className="bg-yellow-600 px-4 py-2 rounded">Safe Bonds</button>
          <button onClick={() => invest("business")} className="bg-purple-600 px-4 py-2 rounded">Mafia Business</button>
          <button onClick={() => invest("loan-shark")} className="bg-pink-600 px-4 py-2 rounded">Loan Sharking</button>
        </div>
      </div>

      {/* Active Investments */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Active Investments</h2>
        {investments.length === 0 && <p className="opacity-70">No active investments.</p>}
        <ul className="space-y-2">
          {investments.map((inv) => (
            <li key={inv.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-bold capitalize">{inv.type}</p>
                <p className="text-sm opacity-70">${inv.amount} → {Math.round(inv.amount * (1 + inv.return_percent))}</p>
                <p className="text-xs opacity-60">Ends: {new Date(inv.complete_at).toLocaleString()}</p>
              </div>
              {!inv.collected && new Date(inv.complete_at) <= new Date() ? (
                <button onClick={() => collectInvestment(inv.id)} className="bg-green-600 px-3 py-1 rounded">Collect</button>
              ) : (
                <span className="text-sm opacity-60">{inv.collected ? "Collected" : "Pending..."}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
