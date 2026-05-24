import AppSidebar from "../components/AppSidebar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function DSAPractice() {
    const { token } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [solvedQuestions, setSolvedQuestions] = useState([]);
    const rowsPerPage = 4;

    useEffect(() => {
        const fetchQuestions =
            async () => {
                try {
                    const res =
                        await api.get(
                            "/api/questions"
                        );

                    setQuestions(Array.isArray(res.data) ? res.data : []);
                } catch (error) {
                    console.log(error);
                }
            };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.get("/api/questions/progress", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSolvedQuestions(res.data.solvedQuestions || []);
                setCurrentStreak(res.data.currentStreak || 0);
            } catch (error) {
                console.log(error);
            }
        };

        if (token) {
            fetchProgress();
        }
    }, [token]);

    const normalizeQuestion = (question) => {
        const title = question.title || question.questionTitle || "Untitled Problem";
        const slug = question.titleSlug || question.questionTitleSlug || title.toLowerCase().replaceAll(" ", "-");
        const tags = question.topicTags || question.topics || [];
        const topicNames = tags.map((tag) => tag.name || tag.slug || tag).filter(Boolean);

        return {
            difficulty: question.difficulty || "Medium",
            id: question.questionFrontendId || question.frontendQuestionId || slug,
            slug,
            title,
            topics: topicNames,
        };
    };

    const normalizedQuestions = questions.map(normalizeQuestion);
    const filteredQuestions = normalizedQuestions.filter((question) => {
        const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = !difficulty || question.difficulty.toLowerCase() === difficulty;
        const matchesTopic = !topic || question.topics.some((item) => item.toLowerCase().includes(topic));

        return matchesSearch && matchesDifficulty && matchesTopic;
    });
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / rowsPerPage));
    const currentQuestions = filteredQuestions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    const visiblePages = Array.from(
        { length: Math.min(3, totalPages) },
        (_, index) => startPage + index
    );

    const difficultyClass = (value) => {
        if (value === "Easy") {
            return "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20";
        }

        if (value === "Hard") {
            return "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-error/10 text-error border border-error/20";
        }

        return "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-tertiary/10 text-tertiary border border-tertiary/20";
    };

    const solvedSlugs = solvedQuestions.map((question) => question.slug);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleSolve = async (question) => {
        try {
            const res = await api.post(
                "/api/questions/solve",
                {
                    difficulty: question.difficulty,
                    slug: question.slug,
                    title: question.title,
                    topics: question.topics,
                    totalQuestions: questions.length,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSolvedQuestions(res.data.solvedQuestions || []);
            setCurrentStreak(res.data.currentStreak || 0);
            if (!question.isAdminContent) {
                window.open(`https://leetcode.com/problems/${question.slug}/`, "_blank", "noopener,noreferrer");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-on-background">

            <>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <title>PrepWise AI - DSA Practice</title>
                <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
                <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
                <style>{`
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #131313;
        }
        ::-webkit-scrollbar-thumb {
            background: #353534;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #424655;
        }
    `}</style>
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
                        "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "body-sm": ["14px", { "lineHeight": "20px", "letterSpacing": "0", "fontWeight": "400" }],
                        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.04em", "fontWeight": "700" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "0", "fontWeight": "400" }],
                        "body-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "400" }],
                        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "display-lg-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
                    }
                }
            }
        }
    `}</script>


                <AppSidebar />
                { /* Main Content Area */}
                <main className="flex-1 flex flex-col md:ml-64 h-screen relative">
                    { /* TopNavBar (Mobile Only) */}
                    <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile py-base bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30">
                        <h1 className="text-headline-md font-headline-md font-bold text-primary tracking-tight">PrepWise AI</h1>
                        <div className="flex items-center gap-sm text-primary">
                            <button className="hover:text-primary transition-colors duration-200"><span className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
                            <button className="hover:text-primary transition-colors duration-200"><span className="material-symbols-outlined" data-icon="settings">settings</span></button>
                        </div>
                    </header>
                    { /* Canvas */}
                    <div className="flex-1 overflow-y-auto px-margin-mobile md:px-margin-desktop py-xl md:py-md">
                        { /* Page Header */}
                        <div className="mb-lg mt-md md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-md">
                            <div>
                                <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface mb-xs">DSA Practice</h2>
                                <p className="text-body-lg font-body-lg text-on-surface-variant">Master data structures and algorithms with AI-curated problem sets.</p>
                            </div>
                            { /* Quick Stats Bento */}
                            <div className="flex gap-sm">
                                <div className="bg-[#0B0B0B] border border-[#262626] rounded-lg p-sm min-w-[120px]">
                                    <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Solved</span>
                                    <span className="text-headline-md font-headline-md text-tertiary">{solvedQuestions.length}/{questions.length}</span>
                                </div>
                                <div className="bg-[#0B0B0B] border border-[#262626] rounded-lg p-sm min-w-[120px]">
                                    <span className="text-label-sm font-label-sm text-on-surface-variant block mb-1">Current Streak</span>
                                    <span className="text-headline-md font-headline-md text-primary flex items-center gap-1">{currentStreak} <span className="material-symbols-outlined text-sm" data-icon="local_fire_department" data-weight="fill">local_fire_department</span></span>
                                </div>
                            </div>
                        </div>
                        { /* Search & Filter Bar (Glassmorphic) */}
                        <div className="bg-[#0B0B0B]/70 backdrop-blur-md border border-[#262626] rounded-xl p-sm mb-md flex flex-col lg:flex-row gap-sm items-center shadow-lg">
                            <div className="relative w-full lg:flex-1">
                                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
                                <input className="w-full bg-black border border-outline-variant rounded-lg py-xs pl-[40px] pr-sm text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/50" onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} placeholder="Search problems..." type="text" value={searchTerm} />
                            </div>
                            <div className="flex flex-wrap w-full lg:w-auto gap-sm">
                                { /* Difficulty Filter */}
                                <div className="relative flex-1 min-w-[140px]">
                                    <select className="w-full appearance-none bg-black border border-outline-variant rounded-lg py-xs px-sm text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" onChange={(event) => { setDifficulty(event.target.value); setCurrentPage(1); }} value={difficulty}>
                                        <option value="">Difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">arrow_drop_down</span>
                                </div>
                                { /* Topic Filter */}
                                <div className="relative flex-1 min-w-[140px]">
                                    <select className="w-full appearance-none bg-black border border-outline-variant rounded-lg py-xs px-sm text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" onChange={(event) => { setTopic(event.target.value); setCurrentPage(1); }} value={topic}>
                                        <option value="">Topics</option>
                                        <option value="array">Arrays</option>
                                        <option value="dp">Dynamic Programming</option>
                                        <option value="tree">Trees</option>
                                        <option value="graph">Graphs</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">arrow_drop_down</span>
                                </div>
                                <button className="bg-surface-container-high border border-outline-variant rounded-lg px-sm py-xs text-body-sm font-body-sm hover:border-primary hover:text-primary transition-colors flex items-center gap-1" onClick={() => { setSearchTerm(""); setDifficulty(""); setTopic(""); setCurrentPage(1); }} type="button">
                                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                    More Filters
                                </button>
                            </div>
                        </div>
                        { /* Problem List Table */}
                        <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-outline-variant/30 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider bg-surface-container-lowest/50">
                                            <th className="py-sm px-md w-16 text-center">Status</th>
                                            <th className="py-sm px-md">Problem Title</th>
                                            <th className="py-sm px-md">Difficulty</th>
                                            <th className="py-sm px-md hidden sm:table-cell">Topics</th>
                                            <th className="py-sm px-md text-right w-32">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-body-sm font-body-sm divide-y divide-[#262626]/50">
                                        {currentQuestions.map((question) => {
                                            const isSolved = solvedSlugs.includes(question.slug);

                                            return (
                                                <tr className="hover:bg-surface-container-low/30 transition-colors group" key={question.slug}>
                                                    <td className="py-md px-md text-center">
                                                        <span className={`material-symbols-outlined ${isSolved ? "text-primary" : "text-outline"} text-[20px]`} data-icon={isSolved ? "check_circle" : "radio_button_unchecked"} data-weight={isSolved ? "fill" : undefined}>{isSolved ? "check_circle" : "radio_button_unchecked"}</span>
                                                    </td>
                                                    <td className="py-md px-md font-medium group-hover:text-primary transition-colors cursor-pointer">{question.title}</td>
                                                    <td className="py-md px-md">
                                                        <span className={difficultyClass(question.difficulty)}>{question.difficulty}</span>
                                                    </td>
                                                    <td className="py-md px-md hidden sm:table-cell text-on-surface-variant text-[12px]">{question.topics.slice(0, 3).join(", ") || "General"}</td>
                                                    <td className="py-md px-md text-right">
                                                        <button className={isSolved ? "text-primary border border-[#262626] bg-transparent hover:bg-primary hover:text-[#001945] rounded px-xs py-1 text-label-sm font-label-sm transition-all duration-300" : "bg-primary text-[#001945] hover:bg-primary-fixed rounded px-xs py-1 text-label-sm font-label-sm font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(176,198,255,0.2)]"} onClick={() => handleSolve(question)} type="button">Solve</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            { /* Pagination */}
                            <div className="border-t border-[#262626] px-md py-sm flex items-center justify-between bg-surface-container-lowest/30">
                                <span className="text-label-sm text-on-surface-variant">Showing {filteredQuestions.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredQuestions.length)} of {filteredQuestions.length} entries</span>
                                <div className="flex gap-1">
                                    <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:border-on-surface disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                                    {visiblePages.map((page) => (
                                        <button className={currentPage === page ? "px-2 py-1 rounded border border-primary bg-primary/10 text-primary text-label-sm" : "px-2 py-1 rounded border border-outline-variant hover:border-on-surface text-on-surface-variant text-label-sm"} key={page} onClick={() => setCurrentPage(page)} type="button">{page}</button>
                                    ))}
                                    <button className="p-1 rounded border border-outline-variant text-outline hover:text-on-surface hover:border-on-surface" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} type="button"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>


            </>

        </div>
    );
}
