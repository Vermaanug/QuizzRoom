import Dropdown from "#src/component/Dropdown/Dropdown";
import {
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Copy,
  LogOut,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Settings,
  Trash2,
  User
} from "lucide-react";
import { useMemo } from "react";
import NewQuizModal from "./component/NewQuizModal";
import useDashboard from "./hook/useDashboard";


const stats = [
  {
    title: "Total Quizzes",
    value: "3",
    detail: "Created across all topics",
    icon: <BarChart3 size={22} strokeWidth={1.8} />,
  },
  {
    title: "Published",
    value: "2",
    detail: "Live and ready to host",
    icon: <Check size={22} strokeWidth={2} />,
  },
  {
    title: "Total Questions",
    value: "9",
    detail: "Across all quiz sets",
    icon: <ClipboardList size={22} strokeWidth={1.8} />,
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const DashboardPage = () => {
  const {
    states: { isNewQuizOpen, setIsNewQuizOpen, activeTab, setIsActiveTab, TABS },
    services: { getCurrentUserService, getAllQuizzesService },
    mutations: { logoutMutation },
    functions: { handleCreateQuiz, handleDeleteQuiz },
    route: {navigateTo}
  } = useDashboard();

  const currentUser = getCurrentUserService.data?.user;
  const displayName = useMemo(() => {
    if (!currentUser) return "Host";
    return `${currentUser.first_name} ${currentUser.last_name}`.trim();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-primary-500/8 blur-3xl" />
        <div className="absolute right-[-10rem] top-[10rem] h-80 w-80 rounded-full bg-primary-500/6 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[22rem] bg-[radial-gradient(circle_at_center,rgba(198,255,0,0.06),transparent_60%)]" />
      </div>

      <header className="relative z-50 border-b border-line/80 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-xl uppercase tracking-[-0.02em] text-primary-500 sm:text-2xl">
              QuizRoom
            </span>
            <span className="text-lg text-primary-500 sm:text-xl">⚡</span>
          </div>

          <Dropdown
            align="end"
            items={[
              {
                label: "Profile",
                description: "Account settings coming soon",
                icon: <User size={18} strokeWidth={1.8} />,
              },
              {
                label: "Settings",
                description: "Tune your workspace",
                icon: <Settings size={18} strokeWidth={1.8} />,
              },
              {
                label: "Sign out",
                description: "End your session",
                icon: <LogOut size={18} strokeWidth={1.8} />,
                tone: "danger",
                onSelect: () => logoutMutation.mutate(),
              },
            ]}
            panelClassName="w-72"
            trigger={
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 font-display text-sm text-black">
                  {currentUser?.first_name?.[0] ?? "A"}
                </span>
                <span className="hidden max-w-[120px] truncate font-display text-sm uppercase tracking-[0.04em] text-ink sm:block">
                  {displayName.split(" ")[0]}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="text-muted transition group-hover:text-ink"
                />
              </>
            }
          />
        </div>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 sm:pt-7">
        <nav className="flex gap-5 border-b border-line/80 text-xs uppercase tracking-[0.16em] text-muted">
          {[
            { label: "My Quizzes", active: true },
            { label: "Host a Room", active: false },
            { label: "Past Rooms", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`relative flex items-center gap-2 border-b-2 px-1 pb-4 font-display transition ${
                item.active
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent hover:text-ink"
              }`}
              type="button"
            >
              <span className="text-base">
                {item.label === "My Quizzes" ? (
                  <ClipboardList size={16} />
                ) : item.label === "Host a Room" ? (
                  <Play size={16} />
                ) : (
                  <Clock3 size={16} />
                )}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <section className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">
              Welcome back, {currentUser?.first_name ?? "Anurag"}
            </p>
            <h1 className="mt-1.5 font-display text-3xl uppercase tracking-[-0.03em] text-ink sm:text-5xl">
              My Quizzes
            </h1>
          </div>

          <button
            className="inline-flex h-11 items-center justify-center gap-2.5 self-start bg-primary-500 px-4 font-display text-sm uppercase tracking-[0.12em] text-black shadow-button transition hover:bg-primary-100"
            onClick={() => setIsNewQuizOpen(true)}
            type="button"
          >
            <span className="text-lg">
              <Plus size={18} strokeWidth={2} />
            </span>
            New Quiz
          </button>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <article
              className={`rounded-xl border p-4 shadow-card transition ${
                index === 1
                  ? "border-primary-700 bg-primary-500/8"
                  : "border-line bg-surface"
              }`}
              key={stat.title}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${index === 1 ? "bg-primary-500 text-black" : "bg-white/5 text-muted"}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className={`font-display text-3xl uppercase tracking-[-0.03em] ${index === 1 ? "text-primary-500" : "text-ink"}`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted">{stat.title}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-7 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              className={`inline-flex h-9 items-center gap-2.5 rounded-lg border px-4 font-display text-xs uppercase tracking-[0.14em] transition ${
                tab.key === activeTab?.key
                  ? "border-line bg-white/5 text-ink"
                  : "border-line/70 bg-surface text-muted hover:border-primary-700 hover:text-ink"
              }`}
              key={tab.key}
              type="button"
              onClick={() => {
                setIsActiveTab(tab)
              }}
            >
              <span>{tab.label}</span>
              <span
                className={tab.key === activeTab?.key ? "text-ink/70" : "text-muted"}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          {getAllQuizzesService.data?.quizzes?.map((quiz) => (
            <div
              className="group rounded-xl border border-line bg-surface p-4 shadow-card transition hover:-translate-y-1 hover:border-primary-700/60"
              key={quiz.id}
            >
              <div
                className={`rounded-lg border border-white/5 bg-gradient-to-br p-4 from-primary-500/30 via-primary-500/15 to-transparent" `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full border border-primary-700/80 bg-black/35 px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.14em] text-primary-500">
                      {quiz.status}
                    </div>
                    <h2 className="mt-4 font-display text-2xl uppercase tracking-[-0.03em] text-ink">
                      {quiz.title}
                    </h2>
                  </div>
                  <button
                    className="rounded-full border border-line bg-black/30 p-2 text-muted transition hover:border-primary-700 hover:text-primary-500"
                    type="button"
                    aria-label="Quiz options"
                  >
                    <MoreHorizontal size={18} strokeWidth={1.8} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={14} strokeWidth={1.8} />
                    {formatDate(quiz.updatedAt)}
                  </span>
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${
                      quiz.status === "published"
                        ? "bg-primary-500"
                        : "bg-amber-500"
                    }`}
                    style={{
                      width: quiz.status === "published" ? "100%" : "58%",
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                    onClick={() => {
                      setIsNewQuizOpen(true)
                      navigateTo({
                        to: {
                          "quizId": quiz?.id
                        }
                      })
                    }}
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                  >
                    <Play size={13} />
                    Host
                  </button>

                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                  >
                    <Copy size={13} />
                    Copy
                  </button>
                </div>
                <button
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition hover:border-danger hover:text-danger"
                  type="button"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ))}

          <button
            className="group flex min-h-[260px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-black/20 text-muted transition hover:border-primary-700 hover:bg-white/[0.03] hover:text-primary-500"
            onClick={() => setIsNewQuizOpen(true)}
            type="button"
          >
            <Plus
              size={36}
              strokeWidth={1.5}
              className="transition group-hover:scale-110"
            />
            <span className="mt-3 font-display text-xl uppercase tracking-[0.14em]">
              New Quiz
            </span>
          </button>
        </section>
      </main>
      {isNewQuizOpen && (
        <NewQuizModal
          handleClose={() => setIsNewQuizOpen(false)}
          onCreate={handleCreateQuiz}
          isOpen={isNewQuizOpen}
        />
      )}
    </div>
  );
};

export default DashboardPage;
