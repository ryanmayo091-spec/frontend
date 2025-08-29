export default function StatCard({ title, value, color }) {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400"
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <p className="text-sm opacity-70">{title}</p>
      <p className={`text-2xl font-bold ${colors[color] || "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
