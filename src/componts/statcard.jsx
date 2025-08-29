export default function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow text-center">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold text-green-400 mt-2">{value}</div>
    </div>
  );
}
