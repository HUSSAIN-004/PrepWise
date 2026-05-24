import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <>


            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-base bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/50">
                <div className="flex items-center">
                    <span className="text-headline-md font-headline-md font-bold text-primary tracking-tight">PrepWise AI</span>
                </div>
                <div className="hidden md:flex items-center gap-md">
                    <a className="text-on-surface font-semibold border-b-2 border-primary pb-1 text-body-md font-body-md" href="#">Home</a>
                    <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-body-md font-body-md" href="#">Features</a>
                    <a className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-body-md font-body-md" href="#">Pricing</a>
                </div>
                <div className="flex items-center gap-sm">
                    <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 p-xs rounded-full hover:bg-surface-container-high">
                        <span className="material-symbols-outlined"  style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 p-xs rounded-full hover:bg-surface-container-high">
                        <span className="material-symbols-outlined"  style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary overflow-hidden border border-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-sm">person</span>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-[72px] relative overflow-hidden">
                <div className="bg-grid-pattern"></div>
                <div className="glow-mesh"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-[-1] pointer-events-none"></div>

                <section className="min-h-[700px] flex flex-col items-center justify-center px-margin-desktop text-center relative py-xl">
                    <div className="max-w-4xl mx-auto z-10 space-y-md">
                        <div className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-primary/10 border border-primary/30 text-primary text-label-md font-label-md mb-md backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[16px]">bolt</span>
                            <span>The Professional Edge in Placement</span>
                        </div>
                        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-white tracking-tight leading-tight drop-shadow-sm">
                            AI-Powered Placement <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#4facfe] to-primary">Preparation Platform</span>
                        </h1>
                        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto mt-sm">
                            Elevate your technical and behavioral skills with personalized, elite placement prep.
                            Master DSA, analyze resumes, and ace mock interviews with our cutting-edge AI.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-sm mt-lg pt-sm">
                            <Link className="w-full sm:w-auto px-lg py-sm bg-primary text-white rounded-lg font-semibold text-body-md font-body-md hover:bg-[#0058cb] hover:shadow-[0_0_20px_rgba(0,112,255,0.4)] transition-all flex items-center justify-center gap-xs border border-transparent" to="/auth">
                                Get Started
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>
                            <Link className="w-full sm:w-auto px-lg py-sm bg-surface-container-high/50 backdrop-blur-sm border border-outline-variant text-on-surface rounded-lg font-medium text-body-md font-body-md hover:border-primary hover:text-white hover:bg-surface-container-high transition-all flex items-center justify-center gap-xs" to="/auth">
                                Start Practicing
                                <span className="material-symbols-outlined text-[20px]">code</span>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-xl px-margin-desktop max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">

                        <div className="glass-card rounded-2xl p-md flex flex-col h-full lg:col-span-2 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center mb-md group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-[24px]">description</span>
                                </div>
                                <h3 className="text-headline-md font-headline-md text-white mb-xs">AI Resume Analysis</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant flex-grow mb-md">
                                    Upload your resume and get instant, actionable feedback. Our AI scores your profile against industry standards, highlighting gaps and suggesting powerful action verbs.
                                </p>
                                <div className="h-32 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/50 relative overflow-hidden flex items-center justify-center mt-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent w-[200%] animate-[shimmer_3s_infinite]"></div>
                                    <div className="flex items-end gap-3 h-16 px-6 w-full">
                                        <div className="w-1/4 bg-primary/20 h-1/2 rounded-t-md"></div>
                                        <div className="w-1/4 bg-primary/40 h-3/4 rounded-t-md"></div>
                                        <div className="w-1/4 bg-primary/60 h-full rounded-t-md"></div>
                                        <div className="w-1/4 bg-primary h-full rounded-t-md relative shadow-[0_0_15px_rgba(0,112,255,0.5)]">
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-label-sm font-label-sm text-white bg-primary px-2 py-0.5 rounded-full">98%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-md flex flex-col h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center mb-md group-hover:border-secondary/50 group-hover:bg-secondary/10 transition-colors duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-secondary text-[24px]">code_blocks</span>
                                </div>
                                <h3 className="text-headline-md font-headline-md text-white mb-xs">Smart DSA Paths</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant flex-grow">
                                    Personalized Data Structures and Algorithms learning paths based on your target companies and current proficiency.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-md flex flex-col h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center mb-md group-hover:border-tertiary/50 group-hover:bg-tertiary/10 transition-colors duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-tertiary text-[24px]">forum</span>
                                </div>
                                <h3 className="text-headline-md font-headline-md text-white mb-xs">AI Mock Interviews</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant flex-grow">
                                    Experience realistic technical and HR interviews with our conversational AI. Get real-time feedback on communication and technical accuracy.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-md flex flex-col h-full lg:col-span-2 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center mb-md group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300 shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
                                </div>
                                <h3 className="text-headline-md font-headline-md text-white mb-xs">Aptitude Mastery</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant flex-grow mb-md">
                                    Comprehensive quantitative, logical, and verbal reasoning practice tailored to elite company assessment patterns.
                                </p>
                                <div className="flex gap-sm overflow-x-auto pb-2 scrollbar-hide mt-auto">
                                    <div className="min-w-[140px] bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 text-center">
                                        <span className="text-primary font-semibold block mb-2 text-sm">Quants</span>
                                        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary w-[75%] shadow-[0_0_10px_rgba(0,112,255,0.8)]"></div></div>
                                    </div>
                                    <div className="min-w-[140px] bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 text-center">
                                        <span className="text-secondary font-semibold block mb-2 text-sm">Logic</span>
                                        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-secondary w-[60%] shadow-[0_0_10px_rgba(221,183,255,0.8)]"></div></div>
                                    </div>
                                    <div className="min-w-[140px] bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 text-center">
                                        <span className="text-tertiary font-semibold block mb-2 text-sm">Verbal</span>
                                        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-tertiary w-[90%] shadow-[0_0_10px_rgba(0,218,243,0.8)]"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-background border-t border-outline-variant/30 relative z-10">
                <div className="flex items-center">
                    <span className="text-body-lg font-headline-md font-bold text-white tracking-tight">PrepWise AI</span>
                </div>
                <div className="flex flex-wrap justify-center gap-md">
                    <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">Privacy Policy</a>
                    <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">Terms of Service</a>
                    <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">Contact Us</a>
                    <a className="text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm" href="#">Careers</a>
                </div>
                <div className="text-on-surface-variant text-label-sm font-label-sm">
                    © 2024 PrepWise AI. The Professional Edge.
                </div>
            </footer>
        </>
    );
}
