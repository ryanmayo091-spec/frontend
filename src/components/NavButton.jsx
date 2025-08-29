export default function NavButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center text-xs ${active ? "text-green-400" : "opacity-70 hover:opacity-100"}`}>
      {icon}
      {label}
    </button>
  );
}
