const categories = [
  { icon: "⌘", name: "Technology", quizzes: 24, color: "bg-indigo-50 text-primary-600" },
  { icon: "⚛", name: "Science", quizzes: 18, color: "bg-violet-50 text-secondary-600" },
  { icon: "◎", name: "Geography", quizzes: 15, color: "bg-sky-50 text-sky-600" },
  { icon: "◆", name: "History", quizzes: 12, color: "bg-amber-50 text-amber-600" },
];

const leaderboard = [
  { rank: 1, name: "Maya Chen", points: "9,840", initials: "MC", color: "bg-amber-100 text-amber-700" },
  { rank: 2, name: "Noah Wilson", points: "9,120", initials: "NW", color: "bg-slate-200 text-slate-700" },
  { rank: 3, name: "Ava Sharma", points: "8,760", initials: "AS", color: "bg-orange-100 text-orange-700" },
];

const HomePage = () => {
  const { data } = useCurrentUser();
  const user = data?.user;
  const initials = `${user?.firstName?.[0] || "Q"}${user?.lastName?.[0] || "R"}`.toUpperCase();

  return (
  <div className="min-h-screen bg-canvas">
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 font-display text-lg font-extrabold text-white shadow-button">Q</div>
          <span className="font-display text-xl font-extrabold tracking-tight">Quizz<span className="text-primary-600">Room</span></span>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
          <a className="text-primary-600" href="#discover">Discover</a>
          <a className="transition hover:text-ink" href="#categories">Categories</a>
          <a className="transition hover:text-ink" href="#leaderboard">Leaderboard</a>
        </nav>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-lg text-muted transition hover:border-primary-100 hover:text-primary-600">♢</button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700" title={user?.username}>{initials}</div>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 px-6 py-10 text-white shadow-card sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12">
        <div className="relative z-10 max-w-xl">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">Daily challenge</span>
          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Ready to test your knowledge?</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">Take today’s mixed-topic challenge, build your streak, and climb the leaderboard.</p>
          <button className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-50">Start daily quiz →</button>
        </div>
        <div className="relative mt-9 grid grid-cols-2 gap-3 lg:mt-0 lg:w-72">
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur"><p className="text-3xl font-extrabold">10</p><p className="mt-1 text-xs text-indigo-100">Questions</p></div>
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur"><p className="text-3xl font-extrabold">5m</p><p className="mt-1 text-xs text-indigo-100">Time limit</p></div>
          <div className="col-span-2 rounded-2xl bg-white/15 p-4 text-center text-sm font-semibold backdrop-blur">🔥 Keep your 7-day streak alive</div>
        </div>
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[45px] border-white/5" />
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["12", "Quizzes played"], ["84%", "Average score"], ["#28", "Global rank"], ["7 days", "Current streak"]].map(([value, label]) => (
          <div className="rounded-2xl border bg-white p-5 shadow-sm" key={label}>
            <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{label}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <section id="categories">
            <div className="mb-5 flex items-end justify-between">
              <div><p className="text-xs font-bold uppercase tracking-widest text-primary-600">Explore</p><h2 className="mt-1 font-display text-2xl font-extrabold">Browse categories</h2></div>
              <button className="text-sm font-bold text-primary-600">View all</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <button className="group flex items-center gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md" key={category.name}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${category.color}`}>{category.icon}</span>
                  <span><span className="block font-bold text-ink">{category.name}</span><span className="mt-1 block text-xs text-muted">{category.quizzes} quizzes</span></span>
                  <span className="ml-auto text-muted transition group-hover:translate-x-1 group-hover:text-primary-600">→</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-10" id="discover">
            <h2 className="font-display text-2xl font-extrabold">Continue learning</h2>
            <div className="mt-5 rounded-2xl border bg-white p-5 shadow-sm sm:flex sm:items-center sm:gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-3xl">🌍</div>
              <div className="mt-4 flex-1 sm:mt-0"><p className="text-xs font-bold uppercase tracking-wider text-sky-600">Geography</p><h3 className="mt-1 font-bold">Countries and capitals</h3><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/5 rounded-full bg-primary-600" /></div><p className="mt-2 text-xs text-muted">6 of 10 questions completed</p></div>
              <button className="mt-4 rounded-xl border border-primary-100 px-5 py-2.5 text-sm font-bold text-primary-600 transition hover:bg-primary-50 sm:mt-0">Continue</button>
            </div>
          </section>
        </div>

        <aside className="rounded-3xl border bg-white p-6 shadow-sm" id="leaderboard">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-primary-600">Top players</p><h2 className="mt-1 font-display text-xl font-extrabold">Leaderboard</h2></div><span className="text-2xl">🏆</span></div>
          <div className="mt-6 space-y-3">
            {leaderboard.map((player) => (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3" key={player.rank}>
                <span className="w-4 text-center text-xs font-extrabold text-muted">{player.rank}</span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${player.color}`}>{player.initials}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{player.name}</p><p className="text-xs text-muted">{player.points} points</p></div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full rounded-xl bg-primary-50 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-100">View full leaderboard</button>
        </aside>
      </div>
    </main>
  </div>
  );
};

export default HomePage;
import useCurrentUser from "#src/hooks/useCurrentUser";
