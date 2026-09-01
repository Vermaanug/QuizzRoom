import Dropdown from "#src/component/Dropdown/Dropdown";
import {
  ChevronDown,
  ClipboardList,
  Clock3,
  ListChecks,
  Lock,
  LogOut,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Settings,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useMemo } from "react";
import NewQuizModal from "./component/NewQuizModal";
import useDashboard from "./hook/useDashboard";
import HostRoomModal from "./component/HostRoomModal";
import BrandMark from "#src/component/Brand/BrandMark";
import GenerateAIPage from "./component/GenerateAI";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const DashboardPage = () => {
  const {
    states: {
      isNewQuizOpen,
      setIsNewQuizOpen,
      activeTab,
      setIsActiveTab,
      TABS,
      isHostModalOpen,
      setIsHostModalOpen,
      selectedQuiz,
      setSelectedQuiz,
      activeMainTab,
      setIsActiveMainTab,
      MAIN_TABS,
    },
    services: { getCurrentUserService, getAllQuizzesService },
    mutations: {
      logoutMutation,
      createRoomMutation,
      generateQuizMutation,
      quizPublishMutation,
    },
    functions: {
      handleCreateQuiz,
      handleDeleteQuiz,
      handleQuizPublish,
      handleCreateRoom,
      handleGenerateQuiz,
    },
    route: { navigateTo },
  } = useDashboard();

  const currentUser = getCurrentUserService.data?.user;
  const displayName = useMemo(() => {
    if (!currentUser) return "Host";
    return `${currentUser.first_name} ${currentUser.last_name}`.trim();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="relative z-50 border-b border-line/80 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <BrandMark />

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
          {MAIN_TABS.map((item) => (
            <button
              key={item.label}
              className={`relative flex items-center gap-2 border-b-2 px-1 pb-4 font-display transition ${
                item.key === activeMainTab?.key
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent hover:text-ink"
              }`}
              type="button"
              onClick={() => {
                setIsActiveMainTab(item);
              }}
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

        {activeMainTab?.key == "quizzes" && (
          <>
            {" "}
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
            <section className="mt-7 flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  className={`inline-flex h-9 items-center gap-2.5  border px-4 font-display text-xs uppercase tracking-[0.14em] transition ${
                    tab.key === activeTab?.key
                      ? "border-line bg-white/5 text-ink"
                      : "border-line/70 bg-surface text-muted hover:border-primary-700 hover:text-ink"
                  }`}
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setIsActiveTab(tab);
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </section>
            <section className="mt-6 grid gap-4 xl:grid-cols-3">
              {getAllQuizzesService.data?.quizzes?.map((quiz) => {
                const isPublished = quiz.status === "published";
                // Backend's list endpoint doesn't return this yet — see note below.
                const questionCount = quiz?.questionCount;
                const canPublish = questionCount > 0;

                return (
                  <div
                    className="border bg-surface p-4 transition hover:border-primary-700"
                    key={quiz.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`inline-flex items-center border px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.14em] ${
                          isPublished
                            ? "border-primary-500 text-primary-500"
                            : "border-line text-muted"
                        }`}
                      >
                        {quiz.status}
                      </div>
                      <button
                        className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-muted transition hover:border-primary-700 hover:text-ink"
                        type="button"
                        aria-label="Quiz options"
                      >
                        <MoreHorizontal size={16} strokeWidth={1.8} />
                      </button>
                    </div>

                    <h2 className="mt-4 truncate font-display text-2xl uppercase tracking-[-0.02em] text-ink">
                      {quiz.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} strokeWidth={1.8} />
                        {formatDate(quiz.updatedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ListChecks size={13} strokeWidth={1.8} />
                        {questionCount} question{questionCount === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-4 h-[3px] bg-line">
                      <div
                        className={
                          isPublished
                            ? "h-full bg-primary-500"
                            : "h-full bg-primary-700"
                        }
                        style={{
                          width: isPublished
                            ? "100%"
                            : canPublish
                              ? "70%"
                              : "20%",
                        }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                      <div className="flex flex-wrap gap-2">
                        {!isPublished && (
                          <button
                            className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-ink transition hover:border-primary-700"
                            type="button"
                            onClick={() => {
                              navigateTo({ url: `/quiz/${quiz.id}` });
                            }}
                          >
                            <Pencil size={13} strokeWidth={1.8} />
                            Edit
                          </button>
                        )}

                        {isPublished ? (
                          <button
                            className="inline-flex items-center gap-1.5 border border-primary-500 px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-primary-500 transition hover:bg-primary-500 hover:text-black"
                            type="button"
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setIsHostModalOpen(true);
                            }}
                          >
                            <Play size={13} strokeWidth={1.8} />
                            Host
                          </button>
                        ) : (
                          <button
                            className={
                              canPublish
                                ? "inline-flex items-center gap-1.5 border border-primary-500 bg-primary-500 px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-black transition hover:bg-primary-100"
                                : "inline-flex cursor-not-allowed items-center gap-1.5 border border-line px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em] text-muted opacity-60"
                            }
                            type="button"
                            disabled={!canPublish}
                            title={
                              canPublish
                                ? undefined
                                : "Add at least one question to publish"
                            }
                            onClick={() =>
                              handleQuizPublish({ quizID: quiz?.id })
                            }
                          >
                            {canPublish ? (
                              <Upload size={13} strokeWidth={1.8} />
                            ) : (
                              <Lock size={13} strokeWidth={1.8} />
                            )}
                            Publish
                          </button>
                        )}
                      </div>

                      <button
                        className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-muted transition hover:border-danger hover:text-danger"
                        type="button"
                        aria-label={`Delete ${quiz.title}`}
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                );
              })}

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
            </section>{" "}
          </>
        )}

        {activeMainTab?.key === "ai" && (
          <GenerateAIPage
            onGenerate={handleGenerateQuiz}
            isLoading={generateQuizMutation?.isPending}
          />
        )}
      </main>
      {isNewQuizOpen && (
        <NewQuizModal
          handleClose={() => setIsNewQuizOpen(false)}
          onCreate={handleCreateQuiz}
          isOpen={isNewQuizOpen}
        />
      )}
      {isHostModalOpen && selectedQuiz && (
        <HostRoomModal
          isOpen={isHostModalOpen}
          handleClose={() => {
            setIsHostModalOpen(false);
          }}
          quiz={selectedQuiz}
          onGenerateRoom={handleCreateRoom}
          isLoading={createRoomMutation?.isPending}
        />
      )}
    </div>
  );
};

export default DashboardPage;
