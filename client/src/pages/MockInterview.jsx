import { useEffect, useRef, useState } from "react";
import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function MockInterview() {
    const { token } = useAuth();
    const chatRef = useRef(null);
    const recognitionRef = useRef(null);
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [session, setSession] = useState(null);
    const [statusAction, setStatusAction] = useState("");

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const loadSession = async () => {
            try {
                const res = await api.get("/api/mock-interviews/latest", authHeaders);

                if (res.data) {
                    setSession(res.data);
                } else {
                    const started = await api.post("/api/mock-interviews/start", { role: "Software Engineer" }, authHeaders);
                    setSession(started.data);
                }
            } catch (loadError) {
                setError(loadError.response?.data?.message || "Could not load mock interview");
            }
        };

        if (token) {
            loadSession();
        }
    }, [token]);

    useEffect(() => {
        chatRef.current?.scrollTo({
            behavior: "smooth",
            top: chatRef.current.scrollHeight,
        });
    }, [session?.messages?.length]);

    const startNewInterview = async () => {
        try {
            setError("");
            setIsStarting(true);
            const res = await api.post("/api/mock-interviews/start", { role: "Software Engineer" }, authHeaders);
            setSession(res.data);
            setAnswer("");
        } catch (startError) {
            setError(startError.response?.data?.message || "Could not start interview");
        } finally {
            setIsStarting(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim() || !session?._id || isSending || session.status !== "active") {
            return;
        }

        try {
            setError("");
            setIsSending(true);
            const res = await api.post(
                `/api/mock-interviews/${session._id}/answer`,
                { answer },
                authHeaders
            );

            setSession(res.data);
            setAnswer("");
        } catch (submitError) {
            setError(submitError.response?.data?.message || "Could not submit answer");
        } finally {
            setIsSending(false);
        }
    };

    const updateStatus = async (status) => {
        if (!session?._id || statusAction) {
            return;
        }

        const previousSession = session;

        try {
            setError("");
            setStatusAction(status);
            setSession((current) => current ? { ...current, status } : current);

            if (status !== "active") {
                recognitionRef.current?.stop();
                setIsListening(false);
            }

            if (status === "completed") {
                setAnswer("");
            }

            const res = await api.patch(
                `/api/mock-interviews/${session._id}/status`,
                { status },
                authHeaders
            );

            setSession(res.data);
        } catch (statusError) {
            setSession(previousSession);
            setError(statusError.response?.data?.message || "Could not update interview");
        } finally {
            setStatusAction("");
        }
    };

    const toggleMic = () => {
        if (session?.status !== "active") {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");

            setAnswer(transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => {
            setError("Microphone transcription failed");
            setIsListening(false);
        };
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const metrics = session?.metrics || {};
    const messages = session?.messages || [];
    const feedback = session?.feedback?.length
        ? session.feedback
        : ["Start answering to receive real-time feedback from the interviewer."];
    const areas = session?.areas?.length
        ? session.areas
        : ["Problem Identification", "Alternative Approaches", "Scalability Considerations"];
    const isPaused = session?.status === "paused";
    const isCompleted = session?.status === "completed";
    const isActive = session?.status === "active";
    const isInputDisabled = !isActive || isSending;

    return (<>

        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>PrepWise AI - Mock Interview</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script id="tailwind-config">{`
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "inverse-primary": "#0058cb",
                      "secondary-fixed-dim": "#ddb7ff",
                      "on-error": "#690005",
                      "on-primary-fixed": "#001945",
                      "surface-container": "#201f1f",
                      "surface-container-high": "#2a2a2a",
                      "surface-container-lowest": "#0e0e0e",
                      "surface-tint": "#b0c6ff",
                      "on-primary": "#002d6f",
                      "on-primary-fixed-variant": "#00429c",
                      "on-secondary-fixed": "#2c0051",
                      "tertiary-fixed-dim": "#00daf3",
                      "secondary": "#ddb7ff",
                      "background": "#131313",
                      "surface": "#131313",
                      "surface-bright": "#3a3939",
                      "on-secondary-container": "#d6a9ff",
                      "primary-container": "#568dff",
                      "secondary-container": "#6f00be",
                      "secondary-fixed": "#f0dbff",
                      "on-tertiary-fixed-variant": "#004f58",
                      "on-tertiary-container": "#002f35",
                      "inverse-on-surface": "#313030",
                      "surface-container-highest": "#353534",
                      "on-background": "#e5e2e1",
                      "on-surface": "#e5e2e1",
                      "on-tertiary-fixed": "#001f24",
                      "on-tertiary": "#00363d",
                      "on-surface-variant": "#c2c6d8",
                      "on-error-container": "#ffdad6",
                      "primary-fixed": "#d9e2ff",
                      "outline-variant": "#424655",
                      "primary-fixed-dim": "#b0c6ff",
                      "error": "#ffb4ab",
                      "outline": "#8c90a1",
                      "tertiary": "#00daf3",
                      "surface-variant": "#353534",
                      "inverse-surface": "#e5e2e1",
                      "on-secondary-fixed-variant": "#6900b3",
                      "tertiary-fixed": "#9cf0ff",
                      "surface-container-low": "#1c1b1b",
                      "on-primary-container": "#002661",
                      "primary": "#b0c6ff",
                      "surface-dim": "#131313",
                      "tertiary-container": "#009fb2",
                      "error-container": "#93000a",
                      "on-secondary": "#490080"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "xl": "80px",
                      "base": "4px",
                      "xs": "8px",
                      "sm": "16px",
                      "md": "24px",
                      "margin-desktop": "32px",
                      "margin-mobile": "16px",
                      "lg": "48px",
                      "gutter": "24px"
              },
              "fontFamily": {
                      "label-sm": ["Geist"],
                      "headline-lg": ["Geist"],
                      "body-sm": ["Geist"],
                      "display-lg": ["Geist"],
                      "body-lg": ["Geist"],
                      "body-md": ["Geist"],
                      "label-md": ["Geist"],
                      "headline-md": ["Geist"],
                      "display-lg-mobile": ["Geist"]
              },
              "fontSize": {
                      "label-sm": ["11px", {"lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                      "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                      "body-sm": ["14px", {"lineHeight": "20px", "letterSpacing": "0", "fontWeight": "400"}],
                      "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.04em", "fontWeight": "700"}],
                      "body-lg": ["18px", {"lineHeight": "28px", "letterSpacing": "0", "fontWeight": "400"}],
                      "body-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0", "fontWeight": "400"}],
                      "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                      "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                      "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
              }
            }
          }
        }
    `}</script>
        <style>{`
        body {
            background-color: theme('colors.surface-container-lowest');
            color: theme('colors.on-surface');
        }
        
        .glass-panel {
            background-color: rgba(11, 11, 11, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid theme('colors.outline-variant');
        }
        
        .ai-glow {
            box-shadow: 0 0 20px rgba(176, 198, 255, 0.1);
        }
        
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: theme('colors.outline-variant');
            border-radius: theme('borderRadius.full');
        }
        ::-webkit-scrollbar-thumb:hover {
            background: theme('colors.outline');
        }
    `}</style>


        { /* TopNavBar (Mobile Only) */}
        <nav className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile py-base bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 text-headline-md font-headline-md">
            <div className="text-primary font-bold tracking-tight">PrepWise AI</div>
            <div className="flex gap-sm">
                <span className="material-symbols-outlined hover:text-primary transition-colors duration-200 cursor-pointer" data-icon="notifications">notifications</span>
                <span className="material-symbols-outlined hover:text-primary transition-colors duration-200 cursor-pointer" data-icon="settings">settings</span>
            </div>
        </nav>
        <AppSidebar />
        { /* Main Content Area */}
        <main className="flex-1 md:ml-64 h-full pt-16 md:pt-0 flex flex-col md:flex-row p-sm md:p-md gap-md overflow-hidden bg-background">
            { /* Left Panel: Current Question */}
            <section className="w-full md:w-1/4 glass-panel rounded-lg p-md flex flex-col gap-sm overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary ai-glow" />
                    <span className="text-label-sm font-label-sm text-tertiary tracking-widest uppercase">Current Scenario</span>
                </div>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-md">{session?.scenario || "System Design & Architecture"}</h2>
                <div className="p-sm bg-surface-container rounded-md border border-outline-variant/30 relative">
                    <div className="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-primary" />
                    <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        "{session?.currentQuestion || "Loading your interview question..."}"
                    </p>
                </div>
                <div className="mt-xl">
                    <h3 className="text-label-sm font-label-sm text-on-surface-variant mb-sm uppercase tracking-widest">Key Areas to Cover</h3>
                    <ul className="space-y-2">
                        {areas.map((area) => (
                            <li className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface" key={area}>
                                <span className="material-symbols-outlined text-outline text-sm" data-icon="check_circle">check_circle</span>
                                {area}
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="mt-auto px-md py-2 border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface hover:text-primary hover:border-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" disabled={isStarting} onClick={startNewInterview} type="button">{isStarting ? "Starting..." : "New Interview"}</button>
            </section>
            { /* Center: AI Chat Interface & Input */}
            <section className="w-full md:w-2/4 flex flex-col gap-md h-full">
                { /* Chat Area */}
                <div className="flex-1 glass-panel rounded-lg p-md overflow-y-auto flex flex-col gap-md relative" ref={chatRef}>
                    {messages.map((message, index) => (
                        <div className={message.role === "user" ? "flex gap-sm max-w-[85%] self-end flex-row-reverse" : "flex gap-sm max-w-[85%]"} key={`${message.role}-${index}`}>
                            <div className={message.role === "user" ? "w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/30 shrink-0" : "w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shrink-0 ai-glow"}>
                                <span className={message.role === "user" ? "material-symbols-outlined text-on-surface text-sm" : "material-symbols-outlined text-primary text-sm"} data-icon={message.role === "user" ? "person" : "smart_toy"}>{message.role === "user" ? "person" : "smart_toy"}</span>
                            </div>
                            <div className={message.role === "user" ? "bg-inverse-primary rounded-2xl rounded-tr-sm p-sm text-on-primary" : "bg-surface-container-high rounded-2xl rounded-tl-sm p-sm border border-outline-variant/20"}>
                                <p className={message.role === "user" ? "text-body-md font-body-md" : "text-body-md font-body-md text-on-surface"}>{message.text}</p>
                            </div>
                        </div>
                    ))}
                    {!messages.length && (
                        <div className="flex gap-sm max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shrink-0">
                                <span className="material-symbols-outlined text-primary text-sm" data-icon="smart_toy">smart_toy</span>
                            </div>
                            <div className="bg-surface-container-high rounded-2xl rounded-tl-sm p-sm border border-outline-variant/20">
                                <p className="text-body-md font-body-md text-on-surface">Loading your mock interview...</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="bg-error-container/30 border border-error/30 rounded-md p-sm text-body-sm text-error">{error}</div>
                    )}
                </div>
                { /* Input Area */}
                <div className="glass-panel rounded-lg p-sm flex items-end gap-sm">
                    <button className={isListening ? "p-2 rounded-full bg-error-container text-on-error-container transition-all duration-200 shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" : "p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-all duration-200 shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"} disabled={!isActive} onClick={toggleMic} type="button">
                        <span className="material-symbols-outlined" data-icon="mic">mic</span>
                    </button>
                    <div className="flex-1 bg-[#000000] rounded-md border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all p-2 flex items-center">
                        <textarea className="w-full bg-transparent border-none outline-none text-on-surface resize-none text-body-md font-body-md placeholder-on-surface-variant/50 focus:ring-0 disabled:opacity-60" disabled={isInputDisabled} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                submitAnswer();
                            }
                        }} placeholder={isPaused ? "Resume the interview to continue..." : isCompleted ? "Interview ended. Start a new interview to continue..." : "Type your response..."} rows={2} value={answer} />
                    </div>
                    <button className="p-2 rounded-md bg-inverse-primary text-on-primary hover:opacity-90 transition-all duration-200 shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" disabled={!answer.trim() || isInputDisabled} onClick={submitAnswer} type="button">
                        <span className="material-symbols-outlined" data-icon="send">{isSending ? "hourglass_top" : "send"}</span>
                    </button>
                </div>
            </section>
            { /* Right: Real-time Feedback & Score cards */}
            <section className="w-full md:w-1/4 flex flex-col gap-sm overflow-y-auto pb-xl md:pb-0">
                <div className="glass-panel rounded-lg p-md mb-sm">
                    <h3 className="text-label-sm font-label-sm text-on-surface-variant mb-md uppercase tracking-widest">Real-time Metrics</h3>
                    { /* Metric Card: Confidence */}
                    <div className="mb-md">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-body-sm font-body-sm text-on-surface">Confidence</span>
                            <span className="text-label-sm font-label-sm text-tertiary">{metrics.confidence || 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary rounded-full shadow-[0_0_10px_rgba(0,218,243,0.5)]" style={{ width: `${metrics.confidence || 0}%` }} />
                        </div>
                    </div>
                    { /* Metric Card: Clarity */}
                    <div className="mb-md">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-body-sm font-body-sm text-on-surface">Clarity</span>
                            <span className="text-label-sm font-label-sm text-primary">{metrics.clarity || 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(176,198,255,0.5)]" style={{ width: `${metrics.clarity || 0}%` }} />
                        </div>
                    </div>
                    { /* Metric Card: Technical Depth */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-body-sm font-body-sm text-on-surface">Technical Depth</span>
                            <span className="text-label-sm font-label-sm text-secondary">{metrics.technicalDepth || 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(221,183,255,0.5)]" style={{ width: `${metrics.technicalDepth || 0}%` }} />
                        </div>
                    </div>
                </div>
                { /* Feedback Card */}
                <div className="glass-panel rounded-lg p-md flex-1">
                    <div className="flex items-center gap-2 mb-sm">
                        <span className="material-symbols-outlined text-secondary text-sm" data-icon="auto_awesome">auto_awesome</span>
                        <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">AI Feedback</h3>
                    </div>
                    {feedback.map((item) => (
                        <div className="p-sm bg-surface-container rounded-md border border-outline-variant/30 mb-sm hover:border-outline-variant/60 transition-colors" key={item}>
                            <p className="text-body-sm font-body-sm text-on-surface-variant">{item}</p>
                        </div>
                    ))}
                </div>
                <div className="glass-panel rounded-lg p-sm flex justify-center items-center gap-2 mt-auto">
                    <span className="text-label-sm font-label-sm text-on-surface-variant mr-auto capitalize">{session?.status || "loading"}</span>
                    <button className="px-md py-2 border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface hover:text-primary hover:border-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" disabled={!session || isCompleted || Boolean(statusAction)} onClick={() => updateStatus(isPaused ? "active" : "paused")} type="button">{statusAction === "paused" ? "Pausing..." : statusAction === "active" ? "Resuming..." : isPaused ? "Resume" : "Pause"}</button>
                    <button className="px-md py-2 bg-error-container text-on-error-container rounded-md text-body-sm font-body-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" disabled={!session || isCompleted || Boolean(statusAction)} onClick={() => updateStatus("completed")} type="button">{statusAction === "completed" ? "Ending..." : "End Interview"}</button>
                </div>
            </section>
        </main>


    </>)
};
