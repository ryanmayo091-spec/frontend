import { useState } from "react";

export default function Bank({ user, API_URL }) {
  const [amount, setAmount] = useState("");

  async function deposit() {
    const res = await fetch(`${API_URL}/bank/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount }),
    });
    const data = await res.json();
    alert(data.message);
  }

  async function withdraw() {
    const res = await fetch(`${API_URL}/bank/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount }),
    });
    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🏦 Mafia Bank</h1>
      <p className="mb-6 opacity-80">
        Store your money here to keep it safe. Deposits and withdrawals update instantly.
      </p>
      <div className="bg-gray-800 p-4 rounded shadow space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 rounded text-black"
        />
        <div className="flex gap-3">
          <button onClick={deposit} className="bg-green-600 px-4 py-2 rounded">
            Deposit
          </button>
          <button onClick={withdraw} className="bg-red-600 px-4 py-2 rounded">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
