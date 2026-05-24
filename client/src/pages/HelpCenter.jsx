import { useState } from "react";
import { Link } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";

const helpTopics = [
  {
    answer: "Use DSA Practice to open real LeetCode questions. When you click Solve, PrepWise records the question in your progress and opens the problem.",
    icon: "code",
    title: "DSA Practice",
  },
  {
    answer: "Upload a PDF, DOCX, or TXT resume. Gemini analyzes the content, stores the result, and updates your dashboard resume score.",
    icon: "description",
    title: "Resume Analyzer",
  },
  {
    answer: "Start a mock interview, answer each prompt, and review the live clarity, confidence, technical depth, and AI feedback metrics.",
    icon: "forum",
    title: "Mock Interview",
  },
  {
    answer: "Start any aptitude module, answer the Open Trivia DB questions, submit the test, and your percentile updates on the dashboard.",
    icon: "psychology",
    title: "Aptitude Arena",
  },
];

const quickActions = [
  { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
  { icon: "description", label: "Analyze Resume", path: "/resume-analyzer" },
  { icon: "forum", label: "Start Interview", path: "/mock-interview" },
  { icon: "psychology", label: "Take Aptitude Test", path: "/aptitude" },
];

export default function HelpCenter() {
  const [openTopic, setOpenTopic] = useState(helpTopics[0].title);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AppSidebar />
      <main className="md:ml-64 min-h-screen px-margin-mobile md:px-margin-desktop py-md">
        <header className="mb-lg">
          <p className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-xs">Support</p>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface">
            Help Center
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mt-xs">
            Find quick answers for the main PrepWise AI workflows and jump back into preparation.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 bg-[#0B0B0B] border border-[#262626] rounded-xl p-md">
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-primary">help</span>
              <h2 className="text-headline-md font-headline-md text-on-surface">Common Questions</h2>
            </div>
            <div className="space-y-sm">
              {helpTopics.map((topic) => {
                const isOpen = openTopic === topic.title;

                return (
                  <button
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-sm text-left hover:border-primary/50 transition-colors"
                    key={topic.title}
                    onClick={() => setOpenTopic(isOpen ? "" : topic.title)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary">{topic.icon}</span>
                        <span className="text-body-md font-body-md text-on-surface">{topic.title}</span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant">
                        {isOpen ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                    {isOpen && (
                      <p className="text-body-sm text-on-surface-variant mt-sm pl-[40px]">
                        {topic.answer}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-md">
              <div className="flex items-center gap-2 mb-md">
                <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
                <h2 className="text-headline-md font-headline-md text-on-surface">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                {quickActions.map((action) => (
                  <Link
                    className="flex items-center gap-sm rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-sm py-xs text-body-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    key={action.path}
                    to={action.path}
                  >
                    <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-md">
              <div className="flex items-center gap-2 mb-sm">
                <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
                <h2 className="text-headline-md font-headline-md text-on-surface">Need More Help?</h2>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Check that the backend is running, your account is logged in, and your API keys are present in `server/.env` before testing AI features.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
