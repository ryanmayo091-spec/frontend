import StatCard from "../components/statcard";
import { Sword, Banknote, Lock, Trophy } from "lucide-react";

export default function Dashboard({ user, setActiveTab }) {
  const points = user.points ?? 0;

  // Define rank ladder
  const ranks = [
    { name: "Thug", points: 0 },
    { name: "Associate", points: 100 },
    { name: "Made Man", points: 300 },
    { name: "Capo", points: 600 },
    { name: "Underboss", points: 1000 },
    { name: "Consigliere", points: 1500 },
    { name: "Boss", points: 2000 },
  ];

  // Get current + next rank
  const currentRank =
    [...ranks].reverse().find((r) => points >= r.points) || ranks[0];
  const nextRank =
    ranks.find((r) => r.points > currentRank.points) || currentRank;

  // Progress %
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

      {/* Main stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={<Banknote className="text-green-400" />}
          title="Wealth"
          value={`$${user.money ?? 0}`}
          subtitle="Dirty cash hidden away"
        />
        <StatCard
          icon={<Sword className="text-red-400" />}
          title="Crimes Attempted"
          value={user.total_crimes ?? 0}
          subtitle={`${user.successful_crimes ?? 0} successful, ${user.unsuccessful_crimes ?? 0} failed`}
        />
        <StatCard
          icon={<Lock className="text-yellow-400" />}
          title="Prison Status"
          value={
            user.jail_until && new Date(user.jail_until) > new Date()
              ? "🚔 In Jail"
              : "Free"
          }
          subtitle={
            user.jail_until && new Date(user.jail_until) > new Date()
              ? `Released at ${new Date(
                  user.jail_until
                ).toLocaleTimeString()}`
              : "Keep your head low... for now"
          }
        />
        <StatCard
          icon={<Trophy className="text-blue-400" />}
          title="Rank"
          value={currentRank.name}
          subtitle={`${points} pts • Next: ${nextRank.name}`}
        />
      </div>

      {/* Rank Progress Bar */}
      <div className="bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Progress to Next Rank</h2>
        <div className="w-full bg-gray-700 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm opacity-70 mt-1">
          {points} pts • {currentRank.name} → {nextRank.name}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => setActiveTab("crimes")}
          className="bg-red-600 hover:bg-red-700 p-4 rounded-lg text-left shadow"
        >
          <h3 className="text-xl font-bold">💀 Crimes</h3>
          <p className="text-sm opacity-80">
            Hit the streets and take risks for cash and reputation.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-left shadow"
        >
          <h3 className="text-xl font-bold">🏦 Bank</h3>
          <p className="text-sm opacity-80">
            Launder your dirty money and keep it safe.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("garage")}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-left shadow"
        >
          <h3 className="text-xl font-bold">🚗 Garage</h3>
          <p className="text-sm opacity-80">
            Manage your cars and flex your mafia lifestyle.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("prison")}
          className="bg-yellow-600 hover:bg-yellow-700 p-4 rounded-lg text-left shadow"
        >
          <h3 className="text-xl font-bold">🚔 Prison</h3>
          <p className="text-sm opacity-80">
            See who’s locked up… maybe help with a bust.
          </p>
        </button>

        <button
          onClick={() => setActiveTab("rankings")}
          className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-left shadow"
        >
          <h3 className="text-xl font-bold">🏆 Rankings</h3>
          <p className="text-sm opacity-80">
            Check the leaderboard and see who rules the city.
          </p>
        </button>
      </div>
    </div>
  );
}
