import { useEffect, useMemo, useState } from "react";

export default function Admin({ user, API_URL }) {
  const [tab, setTab] = useState("users"); // users | crimes | economy
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [crimes, setCrimes] = useState([]);

  // Permissions
  const isAdmin = user?.role === "admin";
  const isMod = user?.role === "mod" || isAdmin;

  // Load users (admin/mod)
  async function loadUsers() {
    const res = await fetch(`${API_URL}/admin/users?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  // Load crimes (admin)
  async function loadCrimes() {
    const res = await fetch(`${API_URL}/admin/crimes`);
    const data = await res.json();
    setCrimes(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (isMod) loadUsers();
    if (isAdmin) loadCrimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ===== User actions =====
  async function giveMoney(targetId, amount) {
    const res = await fetch(`${API_URL}/admin/give-money`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId, amount: Number(amount) }),
    });
    const data = await res.json();
    alert(data.message || "Done");
    loadUsers();
  }

  async function jailUser(targetId, minutes) {
    const res = await fetch(`${API_URL}/admin/jail-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId, minutes: Number(minutes) }),
    });
    const data = await res.json();
    alert(data.message || "Done");
    loadUsers();
  }

  async function releaseUser(targetId) {
    const res = await fetch(`${API_URL}/admin/release-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId }),
    });
    const data = await res.json();
    alert(data.message || "Done");
    loadUsers();
  }

  async function setRole(targetId, role) {
    const res = await fetch(`${API_URL}/admin/set-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId, role }),
    });
    const data = await res.json();
    alert(data.message || "Done");
    loadUsers();
  }

  // ===== Crime actions =====
  async function saveCrime(c) {
    const payload = {
      userId: user.id,
      crimeId: c.id,
      min_reward: Number(c.min_reward),
      max_reward: Number(c.max_reward),
      success_rate: Number(c.success_rate),
      cooldown_seconds: Number(c.cooldown_seconds),
    };
    const res = await fetch(`${API_URL}/admin/edit-crime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    alert(data.message || "Crime saved");
    loadCrimes();
  }

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        String(u.id).includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Admin Control Center
        </h1>
        <nav className="flex gap-2">
          {isMod && (
            <button
              onClick={() => setTab("users")}
              className={`px-3 py-2 rounded ${tab === "users" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Users
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => setTab("crimes")}
                className={`px-3 py-2 rounded ${tab === "crimes" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                Crimes
              </button>
              <button
                onClick={() => setTab("economy")}
                className={`px-3 py-2 rounded ${tab === "economy" ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                Economy
              </button>
            </>
          )}
        </nav>
      </header>

      {/* USERS */}
      {tab === "users" && isMod && (
        <section className="bg-gray-800 p-4 rounded shadow">
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 p-2 rounded text-black"
              placeholder="Search by id, username, or role"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={loadUsers} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700">
              Search
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left opacity-80">
                <tr>
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Pocket</th>
                  <th className="py-2 pr-4">Bank</th>
                  <th className="py-2 pr-4">Dirty</th>
                  <th className="py-2 pr-4">XP</th>
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Jail Until</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t border-gray-700">
                    <td className="py-2 pr-4">{u.id}</td>
                    <td className="py-2 pr-4">{u.username}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4">${u.pocket_money ?? 0}</td>
                    <td className="py-2 pr-4">${u.bank_money ?? 0}</td>
                    <td className="py-2 pr-4">${u.dirty_money ?? 0}</td>
                    <td className="py-2 pr-4">{u.xp ?? 0}</td>
                    <td className="py-2 pr-4">{u.rank ?? "-"}</td>
                    <td className="py-2 pr-4">
                      {u.jail_until ? new Date(u.jail_until).toLocaleString() : "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <QuickAction label="+$1k" onClick={() => giveMoney(u.id, 1000)} />
                        <QuickAction label="+$10k" onClick={() => giveMoney(u.id, 10000)} />
                        <QuickAction label="Jail 10m" onClick={() => jailUser(u.id, 10)} />
                        <QuickAction label="Release" onClick={() => releaseUser(u.id)} />
                        {isAdmin && (
                          <>
                            <QuickAction label="Set Player" onClick={() => setRole(u.id, "player")} />
                            <QuickAction label="Set Mod" onClick={() => setRole(u.id, "mod")} />
                            <QuickAction label="Set Admin" onClick={() => setRole(u.id, "admin")} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="10" className="opacity-70 py-4 text-center">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CRIMES */}
      {tab === "crimes" && isAdmin && (
        <section className="bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Crimes</h2>
            <button onClick={loadCrimes} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700">Refresh</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {crimes.map((c) => (
              <CrimeEditor key={c.id} c={c} onSave={saveCrime} />
            ))}
            {crimes.length === 0 && (
              <div className="opacity-70">No crimes found.</div>
            )}
          </div>
        </section>
      )}

      {/* ECONOMY (placeholder) */}
      {tab === "economy" && isAdmin && (
        <section className="bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Economy</h2>
          <p className="opacity-80">
            Global settings like taxes/interest can be configured here. (We’ll wire this to a config table next.)
          </p>
          <TaxSetter user={user} API_URL={API_URL} />
        </section>
      )}
    </div>
  );
}

function QuickAction({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs"
    >
      {label}
    </button>
  );
}

function CrimeEditor({ c, onSave }) {
  const [form, setForm] = useState({
    id: c.id,
    name: c.name,
    category: c.category,
    min_reward: c.min_reward,
    max_reward: c.max_reward,
    success_rate: c.success_rate,
    cooldown_seconds: c.cooldown_seconds,
  });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="bg-gray-900 rounded p-4">
      <div className="font-semibold mb-2">{form.name} <span className="opacity-60">({form.category})</span></div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col">
          <span className="opacity-70">Min</span>
          <input type="number" className="p-2 rounded text-black" value={form.min_reward} onChange={(e) => update("min_reward", e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="opacity-70">Max</span>
          <input type="number" className="p-2 rounded text-black" value={form.max_reward} onChange={(e) => update("max_reward", e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="opacity-70">Success (0–1)</span>
          <input type="number" step="0.01" className="p-2 rounded text-black" value={form.success_rate} onChange={(e) => update("success_rate", e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="opacity-70">Cooldown (s)</span>
          <input type="number" className="p-2 rounded text-black" value={form.cooldown_seconds} onChange={(e) => update("cooldown_seconds", e.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => onSave(form)}
          className="px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function TaxSetter({ user, API_URL }) {
  const [tax, setTax] = useState(5);
  async function setGlobalTax() {
    const res = await fetch(`${API_URL}/admin/set-tax`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, taxRate: Number(tax) }),
    });
    const data = await res.json();
    alert(data.message || "Saved");
  }
  return (
    <div className="flex items-end gap-3">
      <label className="flex flex-col">
        <span className="opacity-70 text-sm">Global Tax (%)</span>
        <input type="number" className="p-2 rounded text-black" value={tax} onChange={(e) => setTax(e.target.value)} />
      </label>
      <button onClick={setGlobalTax} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700">
        Save Tax
      </button>
    </div>
  );
}
