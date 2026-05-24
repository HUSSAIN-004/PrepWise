import { useEffect, useMemo, useState } from "react";
import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const moduleCopy = {
    logical: {
        description: "Deductive logic, syllogisms, and spatial reasoning.",
        icon: "extension",
        title: "Logical Reasoning",
    },
    quantitative: {
        description: "Master numerical patterns, data interpretation, and complex arithmetic puzzles critical for technical roles.",
        icon: "calculate",
        title: "Quantitative Aptitude",
    },
    verbal: {
        description: "Reading comprehension, grammar, and vocabulary precision.",
        icon: "spellcheck",
        title: "Verbal Ability",
    },
};

export default function Aptitude() {
    const { token } = useAuth();
    const [activeAttempt, setActiveAttempt] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [stats, setStats] = useState({
        accuracy: 0,
        attempts: 0,
        percentile: 0,
        progress: {},
    });
    const [timeLeft, setTimeLeft] = useState(0);

    const authHeaders = useMemo(() => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoading(true);
                const res = await api.get("/api/aptitude/stats", authHeaders);
                setStats(res.data.stats);
            } catch (loadError) {
                setError(loadError.response?.data?.message || "Could not load aptitude stats");
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            loadStats();
        }
    }, [token, authHeaders]);

    useEffect(() => {
        if (!activeAttempt || result || timeLeft <= 0) {
            return undefined;
        }

        const timer = setInterval(() => {
            setTimeLeft((value) => Math.max(0, value - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [activeAttempt, result, timeLeft]);

    const startModule = async (category) => {
        try {
            setError("");
            setResult(null);
            setAnswers({});
            const res = await api.post("/api/aptitude/start", { category }, authHeaders);
            setActiveAttempt(res.data);
            setTimeLeft((res.data.meta?.durationMinutes || 20) * 60);
        } catch (startError) {
            setError(startError.response?.data?.message || "Could not start aptitude module");
        }
    };

    const submitAttempt = async () => {
        if (!activeAttempt?.attemptId || isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            const orderedAnswers = activeAttempt.questions.map((question) => answers[question.index] ?? -1);
            const res = await api.post(
                `/api/aptitude/${activeAttempt.attemptId}/submit`,
                { answers: orderedAnswers },
                authHeaders
            );

            setResult(res.data);
            setStats(res.data.stats);
        } catch (submitError) {
            setError(submitError.response?.data?.message || "Could not submit aptitude module");
        } finally {
            setIsSubmitting(false);
        }
    };

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    const answeredCount = Object.values(answers).filter((value) => value !== undefined).length;
    const activeTitle = activeAttempt?.meta?.title || "TCS NQT Pattern";

    return (<>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>PrepWise AI - Aptitude Practice</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script id="tailwind-config">{`
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary": "#ddb7ff",
                        "error-container": "#93000a",
                        "primary": "#b0c6ff",
                        "on-primary-fixed": "#001945",
                        "surface-container": "#201f1f",
                        "outline": "#8c90a1",
                        "tertiary-container": "#009fb2",
                        "on-background": "#e5e2e1",
                        "on-secondary": "#490080",
                        "on-error-container": "#ffdad6",
                        "surface-dim": "#131313",
                        "on-tertiary": "#00363d",
                        "background": "#131313",
                        "outline-variant": "#424655",
                        "error": "#ffb4ab",
                        "tertiary": "#00daf3",
                        "surface-container-high": "#2a2a2a",
                        "on-surface": "#e5e2e1",
                        "on-surface-variant": "#c2c6d8",
                        "surface": "#131313"
                    },
                    "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                    "spacing": { "md": "24px", "base": "4px", "margin-mobile": "16px", "gutter": "24px", "margin-desktop": "32px", "lg": "48px", "xs": "8px", "xl": "80px", "sm": "16px" },
                    "fontFamily": { "label-md": ["Geist"], "display-lg": ["Geist"], "display-lg-mobile": ["Geist"], "headline-md": ["Geist"], "headline-lg": ["Geist"], "body-sm": ["Geist"], "body-md": ["Geist"], "label-sm": ["Geist"], "body-lg": ["Geist"] },
                    "fontSize": {
                        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.04em", "fontWeight": "700" }],
                        "display-lg-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body-sm": ["14px", { "lineHeight": "20px", "letterSpacing": "0", "fontWeight": "400" }],
                        "body-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "400" }],
                        "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "0", "fontWeight": "400" }]
                    }
                }
            }
        }
    `}</script>
        <style>{`
        body { background-color: #000000; color: #e5e2e1; font-family: 'Geist', sans-serif; }
        .glass-panel { background: rgba(11, 11, 11, 0.7); backdrop-filter: blur(12px); border: 1px solid #262626; }
        .glass-panel:hover { border-color: #404040; }
        .ai-glow { box-shadow: 0 0 20px rgba(176, 198, 255, 0.1); }
        .ai-gradient-text { background: linear-gradient(90deg, #b0c6ff, #ddb7ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    `}</style>

        <nav className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile py-base bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30">
            <div className="text-headline-md font-headline-md font-bold text-primary tracking-tight">PrepWise AI</div>
            <div className="flex items-center gap-sm">
                <button className="text-on-surface-variant hover:text-primary transition-colors duration-200" type="button">
                    <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                </button>
                <button className="text-on-surface-variant hover:text-primary transition-colors duration-200" type="button">
                    <span className="material-symbols-outlined" data-icon="settings">settings</span>
                </button>
            </div>
        </nav>
        <AppSidebar />
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-margin-mobile md:p-margin-desktop min-h-screen relative z-10">
            <header className="mb-lg flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
                <div>
                    <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface">Aptitude Arena</h2>
                    <p className="text-body-lg font-body-lg text-on-surface-variant mt-2 max-w-2xl">Sharpen your cognitive reflexes. Adaptive tests designed to simulate elite corporate assessments.</p>
                </div>
                <div className="glass-panel rounded-lg p-sm flex items-center gap-md min-w-[280px]">
                    <div>
                        <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Overall Percentile</p>
                        <p className="text-headline-lg font-headline-lg ai-gradient-text mt-1">{isLoading ? "--" : `${stats.percentile}%`}</p>
                    </div>
                    <div className="h-10 w-px bg-outline-variant/30" />
                    <div>
                        <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Accuracy</p>
                        <p className="text-headline-md font-headline-md text-on-surface mt-1">{stats.accuracy}%</p>
                    </div>
                </div>
            </header>

            {error && <div className="mb-sm rounded-lg border border-error/30 bg-error-container/20 p-sm text-body-sm text-error">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
                <div className="col-span-1 md:col-span-8 glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-[120px]" data-icon="calculate">calculate</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary" data-icon="functions">functions</span>
                            <h3 className="text-headline-md font-headline-md text-on-surface">Quantitative Aptitude</h3>
                        </div>
                        <p className="text-body-md font-body-md text-on-surface-variant max-w-md mb-6">{moduleCopy.quantitative.description}</p>
                        <div className="flex gap-4 mb-8">
                            <div className="bg-surface-container px-3 py-1 rounded border border-outline-variant/20 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-tertiary" data-icon="bar_chart">bar_chart</span>
                                <span className="text-label-sm font-label-sm text-on-surface">Advanced</span>
                            </div>
                            <div className="bg-surface-container px-3 py-1 rounded border border-outline-variant/20 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-tertiary" data-icon="timer">timer</span>
                                <span className="text-label-sm font-label-sm text-on-surface">45 Mins</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((item) => <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-label-sm text-on-surface" key={item}>{item}</div>)}
                        </div>
                        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-md hover:bg-primary-fixed transition-all duration-200 active:scale-[0.98] flex items-center gap-2" onClick={() => startModule("quantitative")} type="button">
                            Start Module
                            <span className="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {["logical", "verbal"].map((category) => (
                    <div className="col-span-1 md:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between group" key={category}>
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={category === "logical" ? "material-symbols-outlined text-secondary" : "material-symbols-outlined text-tertiary"} data-icon={moduleCopy[category].icon}>{moduleCopy[category].icon}</span>
                                <h3 className="text-headline-md font-headline-md text-on-surface">{moduleCopy[category].title}</h3>
                            </div>
                            <p className="text-body-sm font-body-sm text-on-surface-variant">{moduleCopy[category].description}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                                <span>Completion</span>
                                <span className="text-primary">{stats.progress?.[category] || 0}%</span>
                            </div>
                            <div className="w-full bg-surface-container-high rounded-full h-1.5">
                                <div className={category === "logical" ? "bg-secondary h-1.5 rounded-full" : "bg-tertiary h-1.5 rounded-full"} style={{ width: `${stats.progress?.[category] || 0}%` }} />
                            </div>
                            <button className="w-full border border-outline-variant/50 text-on-surface font-label-md text-label-md px-4 py-2 rounded-md hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 mt-4" onClick={() => startModule(category)} type="button">
                                {stats.progress?.[category] ? "Retake Test" : "Start Test"}
                            </button>
                        </div>
                    </div>
                ))}

                <div className="col-span-1 md:col-span-12 glass-panel rounded-xl p-md border-primary/30 ai-glow relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#b0c6ff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 flex flex-col lg:flex-row gap-md justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-md mb-md">
                                <div className="w-16 h-16 rounded-full border-4 border-surface-container flex items-center justify-center relative">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-error" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${timeLeft ? 80 : 0}, 100`} strokeWidth={4} />
                                    </svg>
                                    <span className="material-symbols-outlined text-error" data-icon="timer">timer</span>
                                </div>
                                <div>
                                    <p className="text-label-sm font-label-sm text-error uppercase tracking-wider font-bold">{activeAttempt ? "Active Mock Assessment" : "No Active Assessment"}</p>
                                    <h4 className="text-headline-md font-headline-md text-on-surface">{activeAttempt ? activeTitle : "Choose a module to begin"}</h4>
                                </div>
                            </div>

                            {activeAttempt ? (
                                <div className="space-y-sm">
                                    {activeAttempt.questions.map((question) => (
                                        <div className="bg-surface-container rounded-lg border border-outline-variant/30 p-sm" key={question.index}>
                                            <p className="text-body-md text-on-surface mb-sm">{question.index + 1}. {question.question}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-xs">
                                                {question.options.map((option, optionIndex) => {
                                                    const submitted = Boolean(result);
                                                    const answerInfo = result?.answers?.[question.index];
                                                    const isSelected = answers[question.index] === optionIndex;
                                                    const isCorrect = submitted && answerInfo?.correct && isSelected;
                                                    const isWrong = submitted && !answerInfo?.correct && isSelected;

                                                    return (
                                                        <button
                                                            className={`rounded-md border px-sm py-xs text-left text-body-sm transition-colors ${isCorrect ? "border-tertiary bg-tertiary/10 text-tertiary" : isWrong ? "border-error bg-error/10 text-error" : isSelected ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/30 bg-black text-on-surface-variant hover:border-primary hover:text-primary"}`}
                                                            disabled={submitted}
                                                            key={option}
                                                            onClick={() => setAnswers((current) => ({ ...current, [question.index]: optionIndex }))}
                                                            type="button"
                                                        >
                                                            {option}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {result?.explanations?.[question.index] && (
                                                <p className="mt-xs text-label-sm text-on-surface-variant">{result.explanations[question.index]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-body-md text-on-surface-variant">Your test questions will appear here after you start a module.</p>
                            )}
                        </div>

                        <div className="lg:w-64 flex flex-col items-end gap-sm">
                            <div className="text-display-lg font-display-lg text-on-surface tabular-nums tracking-tight">{minutes}:{seconds}</div>
                            <p className="text-body-sm font-body-sm text-on-surface-variant">Time Remaining</p>
                            <p className="text-label-sm text-on-surface-variant">{answeredCount}/{activeAttempt?.questions?.length || 0} answered</p>
                            {result && <p className="text-headline-md text-tertiary">Score: {result.score}%</p>}
                            <button className="w-full bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-md hover:bg-primary-fixed transition-all duration-200 disabled:opacity-50" disabled={!activeAttempt || isSubmitting || Boolean(result)} onClick={submitAttempt} type="button">
                                {isSubmitting ? "Submitting..." : "Submit Test"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>)
};
