import StatCard from "../components/statcard";
import { Sword, Banknote, Lock, Trophy } from "lucide-react";

export default function Dashboard({ user, setActiveTab }) {
  const points = user.points ?? 0;

  // Mafia rank ladder
  const ranks = [
    { name: "Thug", points: 0 },
    { name: "Associate", points: 100 },
    { name: "Made Man", points: 300 },
    { name: "Capo", points: 600 },
    { name: "Underboss", points: 1000 },
    { name: "Consigliere", points: 1500 },
    { name: "Boss", points: 2000 },
  ];

  const currentRank =
    [...ranks].reverse().find((r) => points >= r.points) || ranks[0];
  const nextRank =
    ranks.find((r) => r.points > currentRank.points) || currentRank;

  const progress =
    nextRank && nextRank.points > currentRank.points
      ? ((points - currentRank.points) /
          (nextRank.points - currentRank.points)) *
        100
      : 100;

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-green-400">
        🕵️‍♂️ Mafia Control Center
      </h1>
      <p className="mb-8 opacity-80 text-lg">
        Welcome back, <span className="font-semibold">{user.username}</span>.  
        The streets whisper your name. Manage your empire, grow your fortune, and rise in the underworld.
      </p>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={<Banknote className="text-green-400" />}
          title="Wealth"
          value={`$${user.money ?? 0}`}
          subtitle="Dirty cash hidden away"
        />
        <StatCard
          icon={<Sword className="text-red-400" />}
          title="Crimes"
          value={user.total_crimes ?? 0}
          subtitle={`${user.successful_crimes ?? 0} success • ${user.unsuccessful_crimes ?? 0} fails`}
        />
        <StatCard
          icon={<Lock className="text-yellow-400" />}
          title="Prison"
          value={
            user.jail_until && new Date(user.jail_until) > new Date()
              ? "🚔 In Jail"
              : "Free"
          }
          subtitle={
            user.jail_until && new Date(user.jail_until) > new Date()
              ? `Release: ${new Date(user.jail_until).toLocaleTimeString()}`
              : "Keep your head low..."
          }
        />
        <StatCard
          icon={<Trophy className="text-blue-400" />}
          title="Rank"
          value={currentRank.name}
          subtitle={`${points} pts → Next: ${nextRank.name}`}
        />
      </div>

      {/* Progress */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Progress to Next Rank</h2>
        <div className="w-full bg-gray-700 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded transition-all duration-700"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm opacity-70 mt-1">
          {points} pts • {currentRank.name} → {nextRank.name}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          label="💀 Crimes"
          desc="The streets are calling. Risk it all for cash and power."
          onClick={() => setActiveTab("crimes")}
          color="red"
        />
        <ActionCard
          label="🏦 Bank"
          desc="Wash your money clean. Bigger stash, lower risk."
          onClick={() => setActiveTab("bank")}
          color="green"
        />
        <ActionCard
          label="🚗 Garage"
          desc="Park your rides. Only the best for a mafia boss."
          onClick={() => setActiveTab("garage")}
          color="blue"
        />
        <ActionCard
          label="🚔 Prison"
          desc="See who’s locked up… or plan a bust-out."
          onClick={() => setActiveTab("prison")}
          color="yellow"
        />
        <ActionCard
          label="🏆 Rankings"
          desc="Who rules the city? Check the leaderboard."
          onClick={() => setActiveTab("rankings")}
          color="purple"
        />
      </div>
    </div>
  );
}

function ActionCard({ label, desc, onClick, color }) {
  const colorClass = {
    red: "bg-red-700 hover:bg-red-800",
    green: "bg-green-700 hover:bg-green-800",
    blue: "bg-blue-700 hover:bg-blue-800",
    yellow: "bg-yellow-700 hover:bg-yellow-800",
    purple: "bg-purple-700 hover:bg-purple-800",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`${colorClass} p-4 rounded-lg text-left shadow transition-all duration-300 transform hover:scale-105`}
    >
      <h3 className="text-xl font-bold">{label}</h3>
      <p className="text-sm opacity-80">{desc}</p>
    </button>
  );
}
