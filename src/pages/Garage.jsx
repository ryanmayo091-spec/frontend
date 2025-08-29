export default function Garage({ user }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🚗 Mafia Garage</h1>
      <p className="mb-6 opacity-80">
        Welcome to your garage. Every mob boss needs fast getaways, armored
        cars, and flashy rides to show off power. Cars can be bought, stolen,
        or traded with other players.
      </p>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Your Cars</h2>
        <p className="opacity-70 mt-2">Coming soon: list of owned vehicles.</p>
      </div>
    </div>
  );
}
