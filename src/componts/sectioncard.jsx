export default function SectionCard({ title, description, children }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-400">{title}</h1>
        <p className="text-sm opacity-70">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
