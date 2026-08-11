import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dropdown from "#src/component/Dropdown/Dropdown";
import useCurrentUser from "#src/hooks/useCurrentUser";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import NewQuizModal from "./component/NewQuizModal";
import QUERY_KEYS from "#src/config/constant/QUERY_KEYS";
import URLS from "#src/config/constant/URLS";

type TabKey = "all" | "published" | "draft";

type QuizStatus = "published" | "draft";

interface QuizCardData {
  id: string;
  title: string;
  status: QuizStatus;
  questions: number;
  roomsPlayed: number;
  updatedAt: string;
  accent: string;
}

const tabs: Array<{ key: TabKey; label: string; count: number }> = [
  { key: "all", label: "All", count: 3 },
  { key: "published", label: "Published", count: 2 },
  { key: "draft", label: "Draft", count: 1 },
];

const quizCards: QuizCardData[] = [
  {
    id: "ancient-civilizations",
    title: "Ancient Civilizations",
    status: "published",
    questions: 4,
    roomsPlayed: 18,
    updatedAt: "2026-07-12",
    accent: "from-primary-500/30 via-primary-500/15 to-transparent",
  },
  {
    id: "pop-culture-2025",
    title: "Pop Culture 2025",
    status: "published",
    questions: 3,
    roomsPlayed: 11,
    updatedAt: "2026-07-28",
    accent: "from-primary-500/25 via-primary-500/10 to-transparent",
  },
  {
    id: "science-trivia",
    title: "Science Trivia",
    status: "draft",
    questions: 2,
    roomsPlayed: 4,
    updatedAt: "2026-08-01",
    accent: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
];

const stats = [
  {
    title: "Total Quizzes",
    value: "3",
    detail: "Created across all topics",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="22"
        viewBox="0 0 24 24"
        width="22"
      >
        <path
          d="M4 19V5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M8 19V12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M12 19V8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M16 19V14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M20 19V10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: "Published",
    value: "2",
    detail: "Live and ready to host",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="22"
        viewBox="0 0 24 24"
        width="22"
      >
        <path
          d="M5 12.5 10 17 19 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "Total Questions",
    value: "9",
    detail: "Across all quiz sets",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="22"
        viewBox="0 0 24 24"
        width="22"
      >
        <path
          d="M8 9h8M8 15h8M10 3h4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M6 3h12v18H6z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { data } = useCurrentUser();
  const [isNewQuizOpen, setIsNewQuizOpen] = useState(false);

  const currentUser = data?.user;
  const displayName = useMemo(() => {
    if (!currentUser) return "Host";
    return `${currentUser.first_name} ${currentUser.last_name}`.trim();
  }, [currentUser]);

  const logoutMutation = useMutation({
    mutationFn: () =>
      handleGlobalPostRequest<
        { success: boolean; message: string },
        Record<string, never>
      >({
        url: URLS.LOGOUT,
        data: {},
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
    },
  });

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
                icon: (
                  <span className="font-display text-lg uppercase text-primary-500">
                    A
                  </span>
                ),
              },
              {
                label: "Settings",
                description: "Tune your workspace",
                icon: (
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <path
                      d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M19.4 15a7.8 7.8 0 0 0 .1-.95c0-.32-.03-.64-.1-.95l2-1.56-1.9-3.3-2.42.76a7.8 7.8 0 0 0-1.64-.95L13 5h-2l-.44 2.05c-.58.2-1.13.5-1.64.95l-2.42-.76-1.9 3.3 2 1.56c-.06.31-.1.63-.1.95 0 .32.04.64.1.95l-2 1.56 1.9 3.3 2.42-.76c.51.45 1.06.75 1.64.95L11 19h2l.44-2.05c.58-.2 1.13-.5 1.64-.95l2.42.76 1.9-3.3-2-1.56Z"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                    />
                  </svg>
                ),
              },
              {
                label: "Sign out",
                description: "End your session",
                icon: (
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <path
                      d="M10 17 15 12 10 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M15 12H4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 4h5a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                ),
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
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  className="text-muted transition group-hover:text-ink"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
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
                {item.label === "My Quizzes"
                  ? "▥"
                  : item.label === "Host a Room"
                    ? "▶"
                    : "◷"}
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
            <span className="text-lg">＋</span>
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
          {tabs.map((tab) => (
            <button
              className={`inline-flex h-9 items-center gap-2.5 rounded-lg border px-4 font-display text-xs uppercase tracking-[0.14em] transition ${
                tab.key === "all"
                  ? "border-line bg-white/5 text-ink"
                  : "border-line/70 bg-surface text-muted hover:border-primary-700 hover:text-ink"
              }`}
              key={tab.key}
              type="button"
            >
              <span>{tab.label}</span>
              <span
                className={tab.key === "all" ? "text-ink/70" : "text-muted"}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          {quizCards.map((quiz) => (
            <article
              className="group rounded-xl border border-line bg-surface p-4 shadow-card transition hover:-translate-y-1 hover:border-primary-700/60"
              key={quiz.id}
            >
              <div
                className={`rounded-lg border border-white/5 bg-gradient-to-br p-4 ${quiz.accent}`}
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
                    className="rounded-full border border-line bg-black/30 px-2 py-1.5 text-muted transition hover:border-primary-700 hover:text-primary-500"
                    type="button"
                  >
                    ⋯
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-2">
                    <span className="text-sm">#</span>
                    {quiz.questions} questions
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="text-sm">◷</span>
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
                    className="rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                  >
                    Host
                  </button>
                  <button
                    className="rounded-lg border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted transition hover:border-primary-700 hover:text-ink"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
                <button
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition hover:border-danger hover:text-danger"
                  type="button"
                >
                  🗑
                </button>
              </div>
            </article>
          ))}

          <button
            className="group flex min-h-[260px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-black/20 text-muted transition hover:border-primary-700 hover:bg-white/[0.03] hover:text-primary-500"
            onClick={() => setIsNewQuizOpen(true)}
            type="button"
          >
            <span className="text-4xl transition group-hover:scale-110">
              ＋
            </span>
            <span className="mt-3 font-display text-xl uppercase tracking-[0.14em]">
              New Quiz
            </span>
          </button>
        </section>
      </main>
      {isNewQuizOpen && (
        <NewQuizModal
          handleClose={() => setIsNewQuizOpen(false)}
          onCreate={async () => {
            setIsNewQuizOpen(false);
          }}
          isOpen={isNewQuizOpen}
        />
      )}
    </div>
  );
};

export default DashboardPage;
