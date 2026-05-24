import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const quickLinks = [
  { label: "Dashboard", path: "/dashboard", keywords: "overview home progress" },
  { label: "DSA Practice", path: "/dsa-practice", keywords: "problems questions dynamic programming arrays hashing" },
  { label: "Resume Analyzer", path: "/resume-analyzer", keywords: "resume ats match verbs profile" },
  { label: "Mock Interview", path: "/mock-interview", keywords: "system design interview faang session" },
  { label: "Aptitude", path: "/aptitude", keywords: "percentile aptitude quantitative logic verbal" },
];

const difficultyClass = {
  Easy: "text-[#00e676] bg-[#00e676]/10 border-[#00e676]/20",
  Medium: "text-[#ffb300] bg-[#ffb300]/10 border-[#ffb300]/20",
  Hard: "text-error bg-error/10 border-error/20",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activityRange, setActivityRange] = useState("7d");
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setStatus("loading");

      try {
        const { data } = await api.get("/api/users/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(data);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token]);

  const displayName = user?.name || dashboard?.user?.name || "there";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dsaPercent = dashboard?.stats?.dsaTotal ? Math.round((dashboard.stats.dsaSolved / dashboard.stats.dsaTotal) * 100) : 0;
  const activityValues = dashboard?.activity?.[activityRange] || [];
  const activityLabels = activityRange === "7d" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["W1", "W2", "W3", "W4", "W5", "W6", "Now"];

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return quickLinks.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(normalizedQuery));
  }, [query]);

  const goTo = (path) => {
    navigate(path);
  };

  if (status === "loading") {
    return (
      <div className="h-dvh w-full overflow-hidden bg-background text-on-surface">
        <AppSidebar />
        <div className="flex h-full min-w-0 flex-col items-center justify-center md:pl-64">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-md py-sm text-body-sm text-on-surface-variant">
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !dashboard) {
    return (
      <div className="h-dvh w-full overflow-hidden bg-background text-on-surface">
        <AppSidebar />
        <div className="flex h-full min-w-0 flex-col items-center justify-center gap-sm md:pl-64">
          <div className="rounded-xl border border-error/20 bg-surface-container-lowest px-md py-sm text-body-sm text-on-surface-variant">
            Dashboard data could not be loaded from the backend.
          </div>
          <button
            className="rounded-lg bg-primary px-sm py-xs text-label-md font-label-md text-on-primary hover:bg-primary-fixed transition-colors"
            onClick={() => window.location.reload()}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-background text-on-surface">
      <AppSidebar />

      <div className="flex h-full min-w-0 flex-col md:pl-64">
        <header className="z-50 flex h-14 shrink-0 justify-between items-center gap-md px-margin-mobile md:px-margin-desktop py-base bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30">
          <div className="flex-1 max-w-md relative">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline shadow-inner"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) {
                    goTo(searchResults[0].path);
                  }
                }}
                placeholder="Search problems, topics..."
                type="text"
                value={query}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-2xl overflow-hidden">
                {searchResults.map((result) => (
                  <button
                    className="w-full flex items-center justify-between px-sm py-xs text-left text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                    key={result.path}
                    onClick={() => goTo(result.path)}
                    type="button"
                  >
                    <span>{result.label}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-sm relative">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors relative"
              onClick={() => setOpenPanel(openPanel === "notifications" ? null : "notifications")}
              type="button"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
              onClick={() => setOpenPanel(openPanel === "settings" ? null : "settings")}
              type="button"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <button
              className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors bg-primary/10 text-primary text-label-md font-label-md"
              onClick={() => setOpenPanel(openPanel === "profile" ? null : "profile")}
              type="button"
            >
              {initials}
            </button>

            {openPanel && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-sm shadow-2xl">
                {openPanel === "notifications" && (
                  <div className="space-y-xs">
                    <h3 className="text-body-md font-body-md text-on-surface">Notifications</h3>
                    {dashboard.notifications.length > 0 ? (
                      dashboard.notifications.map((notification) => (
                        <p className="text-body-sm text-on-surface-variant" key={notification.message}>{notification.message}</p>
                      ))
                    ) : (
                      <p className="text-body-sm text-on-surface-variant">No notifications yet.</p>
                    )}
                  </div>
                )}
                {openPanel === "settings" && (
                  <div className="space-y-xs">
                    <h3 className="text-body-md font-body-md text-on-surface">Quick Settings</h3>
                    <button className="w-full text-left text-body-sm text-on-surface-variant hover:text-primary" onClick={() => goTo("/resume-analyzer")} type="button">Resume preferences</button>
                    <button className="w-full text-left text-body-sm text-on-surface-variant hover:text-primary" onClick={() => goTo("/aptitude")} type="button">Assessment settings</button>
                  </div>
                )}
                {openPanel === "profile" && (
                  <div className="space-y-xs">
                    <h3 className="text-body-md font-body-md text-on-surface">{displayName}</h3>
                    <p className="text-body-sm text-on-surface-variant">{user?.email || dashboard.user?.email}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden px-margin-mobile md:px-margin-desktop py-xs">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-sm">
            <section className="flex shrink-0 flex-col md:flex-row justify-between items-start md:items-end gap-sm">
              <div>
                <h2 className="text-[28px] leading-8 md:text-[34px] md:leading-10 font-bold text-on-surface tracking-tight">Welcome back, {firstName}.</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mt-1 max-w-2xl">Your preparation trajectory is looking sharp. Let's tackle today's objectives.</p>
              </div>

              <button
                className="flex items-center gap-sm bg-surface-container-lowest/50 border border-outline-variant/20 p-xs rounded-xl backdrop-blur-sm hover:border-tertiary/50 transition-colors"
                onClick={() => goTo("/aptitude")}
                type="button"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                    <path className="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${dashboard.readiness.score}, 100`} strokeWidth="3"></path>
                  </svg>
                  <span className="absolute text-headline-md font-headline-md text-tertiary font-bold">{dashboard.readiness.score}<span className="text-label-sm">%</span></span>
                </div>
                <div className="text-left">
                  <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Placement Readiness</p>
                  <p className="text-body-sm font-body-sm text-on-surface text-tertiary-fixed-dim">{dashboard.readiness.cohort}</p>
                </div>
              </button>
            </section>

            <section className="grid shrink-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm">
              <button className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-xs relative overflow-hidden group hover:border-outline-variant/50 transition-colors text-left" onClick={() => goTo("/dsa-practice")} type="button">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-primary bg-primary/10 px-2 py-1 rounded-full">{dashboard.stats.dsaTotal ? "On Track" : "No Data"}</span>
                </div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase">DSA Questions</p>
                <h3 className="text-headline-lg font-headline-lg text-on-surface mt-1">{dashboard.stats.dsaSolved}<span className="text-headline-md text-outline-variant">/{dashboard.stats.dsaTotal}</span></h3>
                <div className="mt-2 w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${dsaPercent}%` }}></div>
                </div>
              </button>

              <button className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-xs relative overflow-hidden group hover:border-outline-variant/50 transition-colors text-left" onClick={() => goTo("/aptitude")} type="button">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-secondary bg-secondary/10 px-2 py-1 rounded-full">{dashboard.stats.aptitudePercentile ? "Elite Tier" : "No Data"}</span>
                </div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase">Aptitude Score</p>
                <h3 className="text-headline-lg font-headline-lg text-on-surface mt-1">{dashboard.stats.aptitudePercentile}th<span className="text-body-md text-outline-variant ml-1 font-normal">Percentile</span></h3>
                <p className="text-label-sm font-label-sm text-secondary-fixed-dim mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> {dashboard.stats.aptitudePercentile ? "Updated from backend" : "No score yet"}
                </p>
              </button>

              <button className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-xs relative overflow-hidden group hover:border-outline-variant/50 transition-colors text-left" onClick={() => goTo("/resume-analyzer")} type="button">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="text-label-sm font-label-sm text-[#00e676] bg-[#00e676]/10 px-2 py-1 rounded-full border border-[#00e676]/20">{dashboard.stats.resumeMatch ? "Excellent" : "No Data"}</span>
                </div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase">Resume ATS Match</p>
                <h3 className="text-headline-lg font-headline-lg text-on-surface mt-1">{dashboard.stats.resumeMatch}%</h3>
                <span className="mt-2 text-label-sm font-label-sm text-tertiary flex items-center gap-1">
                  View Suggestions <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </button>

              <button className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-xs relative overflow-hidden group hover:border-outline-variant/50 transition-colors text-left" onClick={() => goTo("/dashboard")} type="button">
                <div className="absolute -right-4 -top-4 text-error/5 rotate-12 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px] fill">local_fire_department</span>
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="p-2 bg-error/10 rounded-lg text-error">
                    <span className="material-symbols-outlined fill">local_fire_department</span>
                  </div>
                </div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase relative z-10">Daily Streak</p>
                <h3 className="text-headline-lg font-headline-lg text-on-surface mt-1 relative z-10">{dashboard.stats.dailyStreak} Days</h3>
                <div className="mt-2 flex gap-1 relative z-10">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div className={`w-1/5 h-1.5 rounded-full ${index < dashboard.stats.dailyStreak ? "bg-error" : "bg-surface-container"}`} key={index}></div>
                  ))}
                </div>
              </button>
            </section>

            <section className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(330px,1.15fr)] gap-sm">
              <div className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-sm min-h-0 flex flex-col">
                <div className="flex justify-between items-center mb-sm">
                  <h3 className="text-headline-md font-headline-md text-on-surface">Activity &amp; Progress</h3>
                  <select
                    className="bg-surface border border-outline-variant/30 text-body-sm font-body-sm rounded-md px-2 py-1 text-on-surface focus:ring-primary focus:border-primary"
                    onChange={(event) => setActivityRange(event.target.value)}
                    value={activityRange}
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>

                <div className="flex-1 relative border-l border-b border-outline-variant/10 pl-2 pb-2 flex items-end">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 pl-2">
                    <div className="w-full h-px bg-outline-variant/5"></div>
                    <div className="w-full h-px bg-outline-variant/5"></div>
                    <div className="w-full h-px bg-outline-variant/5"></div>
                    <div className="w-full h-px bg-outline-variant/5"></div>
                  </div>

                  <div className="w-full h-full flex items-end justify-between px-4 relative z-10">
                    {activityValues.length > 0 ? activityValues.map((value, index) => (
                      <div
                        className={`w-8 rounded-t-sm transition-all ${index === activityValues.length - 1 ? "bg-gradient-to-t from-tertiary/30 to-tertiary shadow-[0_0_15px_rgba(0,218,243,0.3)]" : "bg-gradient-to-t from-primary/20 to-primary/80 hover:brightness-125"}`}
                        key={`${activityRange}-${index}`}
                        style={{ height: `${value}%` }}
                        title={`${value}% progress`}
                      ></div>
                    )) : (
                      <div className="w-full text-center text-label-sm text-on-surface-variant">No activity yet.</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between px-4 pl-6 mt-2 text-label-sm font-label-sm text-outline-variant">
                  {activityLabels.map((label, index) => (
                    <span className={index === activityLabels.length - 1 ? "text-tertiary" : ""} key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0e0e0e] to-surface-container-low border border-outline-variant/20 rounded-xl p-sm min-h-0 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-sm">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <h3 className="text-headline-md font-headline-md text-on-surface">AI Recommendations</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {dashboard.recommendations.length > 0 ? dashboard.recommendations.map((recommendation) => (
                    <button
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-container/50 transition-colors border border-transparent hover:border-outline-variant/20 group cursor-pointer text-left"
                      key={`${recommendation.title}-${recommendation.path}`}
                      onClick={() => goTo(recommendation.path)}
                      type="button"
                    >
                      <div className="p-2 bg-primary/10 rounded-md text-primary mt-1">
                        <span className="material-symbols-outlined text-[20px]">{recommendation.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-body-md font-body-md text-on-surface group-hover:text-primary transition-colors">{recommendation.title}</h4>
                        <p className="text-body-sm font-body-sm text-on-surface-variant mt-1 line-clamp-1">{recommendation.description}</p>
                      </div>
                      <span className="px-3 py-1 text-label-sm font-label-sm bg-surface-container border border-outline-variant/30 rounded group-hover:border-primary transition-colors mt-2">{recommendation.label}</span>
                    </button>
                  )) : (
                    <p className="text-body-sm text-on-surface-variant">No recommendations yet.</p>
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-xs">
                <div className="bg-gradient-to-b from-primary-container/10 to-[#0e0e0e] border border-primary/20 rounded-xl p-sm relative overflow-hidden shadow-[0_0_30px_rgba(86,141,255,0.05)]">
                  <div className="absolute top-0 right-0 p-3">
                    <span className="material-symbols-outlined text-primary/40 text-[36px]">video_camera_front</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-label-sm font-label-sm rounded mb-2 border border-primary/30 uppercase tracking-widest">Upcoming</span>
                  <h3 className="text-body-lg font-headline-md text-on-surface leading-6">{dashboard.upcoming?.title || "No upcoming session"}</h3>
                  {dashboard.upcoming?.time && (
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span> {dashboard.upcoming.time}
                    </p>
                  )}
                  {dashboard.upcoming?.interviewer && (
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-1 flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[16px]">person</span> Interviewer: {dashboard.upcoming.interviewer}
                    </p>
                  )}
                  <button className="w-full py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" disabled={!dashboard.upcoming?.path} onClick={() => goTo(dashboard.upcoming.path)} type="button">
                    Join Session <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>

                <div className="bg-[#0e0e0e] border border-outline-variant/20 rounded-xl p-sm flex-1 min-h-0">
                  <div className="flex justify-between items-center mb-xs">
                    <h3 className="text-body-lg font-headline-md text-on-surface">Recent Practice</h3>
                    <button className="text-label-sm font-label-sm text-outline-variant hover:text-on-surface transition-colors" onClick={() => goTo("/dsa-practice")} type="button">View All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-sm gap-y-xs">
                    {dashboard.recentPractice.length > 0 ? dashboard.recentPractice.map((practice) => (
                      <button className="flex justify-between items-start group cursor-pointer text-left" key={practice.title} onClick={() => goTo("/dsa-practice")} type="button">
                        <div>
                          <h4 className="text-body-sm font-body-md text-on-surface group-hover:text-primary transition-colors">{practice.title}</h4>
                          <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">{practice.topic}</p>
                        </div>
                        <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded border ${difficultyClass[practice.difficulty]}`}>{practice.difficulty}</span>
                      </button>
                    )) : (
                      <p className="col-span-2 text-body-sm text-on-surface-variant">No recent practice yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
