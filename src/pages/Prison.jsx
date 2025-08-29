export default function Prison({ user }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">🚔 Prison</h1>
      <p className="mb-6 opacity-80">
        When crimes go wrong, you end up here. Jail is where mobsters pay their
        dues, but friends (or bribes) can get you out quicker. You can also bust
        other inmates for rewards.
      </p>

      <div className="bg-gray-800 p-4 rounded shadow space-y-2">
        <p>Coming soon: Prisoner list, bust attempts, and bail payments.</p>
      </div>
    </div>
  );
}
