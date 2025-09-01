import { useState } from "react";

export default function Casino({ user, API_URL }) {
  const [bet, setBet] = useState("");
  const [result, setResult] = useState("");

  async function playSlots() {
    const res = await fetch(`${API_URL}/casino/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, bet: parseInt(bet) }),
    });
    const data = await res.json();
    setResult(data.win > 0 ? `🎰 You won $${data.win}` : "❌ You lost!");
  }

  async function playBlackjack() {
    const res = await fetch(`${API_URL}/casino/blackjack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, bet: parseInt(bet) }),
    });
    const data = await res.json();
    setResult(`${data.result}! Amount: $${data.amount}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎲 Casino</h1>
      <p className="mb-6 opacity-80">
        Try your luck at the slots or blackjack. The house always wins in the
        long run—but maybe you’ll get lucky tonight.
      </p>

      <div className="bg-gray-800 p-4 rounded shadow space-y-4">
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          placeholder="Enter bet amount"
          className="w-full p-2 rounded text-black"
        />
        <div className="flex gap-3">
          <button
            onClick={playSlots}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Play Slots
          </button>
          <button
            onClick={playBlackjack}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Play Blackjack
          </button>
        </div>
        {result && <p className="mt-4 text-lg">{result}</p>}
      </div>
    </div>
  );
}
