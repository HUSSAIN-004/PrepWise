import AppSidebar from "../components/AppSidebar";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function ResumeAnalyzer() {
const { token } = useAuth();
const fileInputRef = useRef(null);
const [analysis, setAnalysis] = useState(null);
const [error, setError] = useState("");
const [isDragging, setIsDragging] = useState(false);
const [isUploading, setIsUploading] = useState(false);

useEffect(() => {
const fetchLatestAnalysis = async () => {
try {
const res = await api.get("/api/resume/latest", {
headers: {
Authorization: `Bearer ${token}`,
},
});

setAnalysis(res.data);
} catch (latestError) {
console.log(latestError);
}
};

if (token) {
fetchLatestAnalysis();
}
}, [token]);

const score = analysis?.atsScore || 0;
const scoreOffset = 283 - (283 * score) / 100;
const scoreLabel = score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 50 ? "Needs Work" : "No Data";
const primarySkills = analysis?.keywords?.slice(0, 3) || [];
const secondarySkills = analysis?.keywords?.slice(3, 9) || [];
const improvementText = analysis?.missingKeywords?.length
? `Consider adding ${analysis.missingKeywords.slice(0, 4).join(", ")} based on the target role profile.`
: analysis?.feedback?.[0] || "Upload a resume to generate keyword and ATS recommendations.";

const analyzeFile = async (file) => {
if (!file || !token) {
return;
}

const formData = new FormData();
formData.append("resume", file);

try {
setError("");
setIsUploading(true);
const res = await api.post("/api/resume/analyze", formData, {
headers: {
Authorization: `Bearer ${token}`,
},
});

setAnalysis(res.data);
} catch (uploadError) {
setError(uploadError.response?.data?.message || "Resume analysis failed");
} finally {
setIsUploading(false);
setIsDragging(false);
}
};

const handleDrop = (event) => {
event.preventDefault();
analyzeFile(event.dataTransfer.files?.[0]);
};


return(<>
<meta charSet="utf-8" />
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<title>PrepWise AI - Resume Analyzer</title>
{ /* Tailwind CSS */ }
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
{ /* Google Fonts: Geist & Material Symbols */ }
<link href="https://fonts.googleapis.com" rel="preconnect" />
<link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
{ /* Tailwind Configuration */ }
<script id="tailwind-config">{`
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
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
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    spacing: {
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
                    fontFamily: {
                        "label-sm": ["Geist", "sans-serif"],
                        "headline-lg": ["Geist", "sans-serif"],
                        "body-sm": ["Geist", "sans-serif"],
                        "display-lg": ["Geist", "sans-serif"],
                        "body-lg": ["Geist", "sans-serif"],
                        "body-md": ["Geist", "sans-serif"],
                        "label-md": ["Geist", "sans-serif"],
                        "headline-md": ["Geist", "sans-serif"],
                        "display-lg-mobile": ["Geist", "sans-serif"]
                    },
                    fontSize: {
                        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "500" }],
                        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
                        "body-sm": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "400" }],
                        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.04em", fontWeight: "700" }],
                        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0", fontWeight: "400" }],
                        "body-md": ["16px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "400" }],
                        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
                        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
                        "display-lg-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }]
                    }
                }
            }
        }
    `}</script>
<style>{`
        /* Custom utilities for strict style guidance compliance */
        body { background-color: #131313; color: #e5e2e1; }
        .glass-panel {
            background-color: #0e0e0e; /* Level 1 Surface */
            border: 1px solid rgba(66, 70, 85, 0.3); /* outline-variant/30 */
            backdrop-filter: blur(12px);
        }
        .glow-effect {
            box-shadow: 0 0 20px rgba(176, 198, 255, 0.1); /* primary tint glow */
        }
        .dashed-border-glow:hover {
            border-color: #b0c6ff;
            box-shadow: inset 0 0 20px rgba(176, 198, 255, 0.05);
        }
        
        /* Data Visualization specific */
        .gauge-ring {
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            transition: stroke-dashoffset 1.5s ease-out;
        }
        .gauge-ring.animate {
            stroke-dashoffset: 42; /* ~85% score */
        }
    `}</style>


<AppSidebar />
{ /* TopNavBar (Mobile) */ }
<nav className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30">
<div className="text-headline-md font-headline-md font-bold text-primary tracking-tight">PrepWise AI</div>
<div className="flex items-center gap-sm">
<button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</nav>
{ /* Main Content Canvas */ }
<main className="flex-1 md:ml-64 p-margin-mobile pt-[80px] md:p-margin-desktop min-h-screen relative overflow-hidden">
{ /* Ambient Background Glow */ }
<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
{ /* Page Header */ }
<header className="mb-lg">
<h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface mb-2">Resume Intelligence</h1>
<p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">Upload your resume for an elite, AI-driven analysis. We match your profile against top tech company ATS patterns to identify gaps and optimize your narrative.</p>
</header>
{ /* Bento Grid Layout */ }
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{ /* Upload Section (Spans full top row in grid, or 8 cols on large screens) */ }
<div
className={`col-span-1 lg:col-span-12 glass-panel rounded-xl p-md flex flex-col items-center justify-center text-center relative group overflow-hidden border-dashed dashed-border-glow transition-all duration-300 min-h-[300px] ${isDragging ? "border-primary" : ""}`}
onDragLeave={() => setIsDragging(false)}
onDragOver={(event) => {
event.preventDefault();
setIsDragging(true);
}}
onDrop={handleDrop}
>
{ /* Interactive subtle background pattern */ }
<div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
<div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant/50 flex items-center justify-center mb-md group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 relative z-10">
<span className="material-symbols-outlined text-[32px] text-primary" data-icon="upload_file">upload_file</span>
</div>
<h3 className="text-headline-md font-headline-md text-on-surface mb-xs relative z-10">Drag & Drop Resume</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant mb-md relative z-10">{isUploading ? "Analyzing with Gemini..." : "Supports PDF, DOCX (Max 5MB)"}</p>
{error && <p className="text-body-sm font-body-sm text-error mb-sm relative z-10">{error}</p>}
<input
accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
className="hidden"
onChange={(event) => analyzeFile(event.target.files?.[0])}
ref={fileInputRef}
type="file"
/>
<div className="flex gap-sm relative z-10">
<button className="bg-primary text-[#002d6f] px-6 py-2.5 rounded-lg text-label-md font-label-md font-bold hover:bg-primary-fixed-dim transition-colors duration-200 glow-effect flex items-center gap-2 disabled:opacity-60" disabled={isUploading} onClick={() => fileInputRef.current?.click()} type="button">
<span className="material-symbols-outlined text-[18px]">folder_open</span>
                        {isUploading ? "Analyzing" : "Browse Files"}
                    </button>
<button className="border border-outline-variant/50 text-on-surface px-6 py-2.5 rounded-lg text-label-md font-label-md hover:border-primary hover:text-primary transition-colors duration-200 flex items-center gap-2" onClick={() => fileInputRef.current?.click()} type="button">
<span className="material-symbols-outlined text-[18px]">link</span>
                        Upload TXT
                    </button>
</div>
</div>
{ /* Analysis Results Placeholders (Appears as loading or pre-populated state) */ }
{ /* ATS Score Gauge */ }
<div className="col-span-1 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col items-center justify-center relative">
<div className="absolute top-md left-md flex items-center gap-2 text-on-surface-variant text-label-sm font-label-sm uppercase tracking-widest">
<span className="material-symbols-outlined text-[16px]">speed</span>
                    ATS Match Rate
                </div>
<div className="relative w-40 h-40 mt-8 flex items-center justify-center">
{ /* Background Circle */ }
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="45" stroke="#2a2a2a" strokeWidth={6} />
{ /* Progress Circle */ }
<circle className="gauge-ring animate" cx="50" cy="50" fill="none" r="45" stroke="#b0c6ff" strokeLinecap="round" strokeWidth={6} style={{ strokeDashoffset: scoreOffset }} />
</svg>
{ /* Center Text */ }
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-display-lg font-display-lg text-primary leading-none">{score}<span className="text-headline-md font-headline-md">%</span></span>
<span className="text-label-sm font-label-sm text-tertiary mt-1">{scoreLabel}</span>
</div>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant text-center mt-md">{analysis?.summary || "Upload a resume to calculate your ATS match rate and generate targeted resume feedback."}</p>
</div>
{ /* Detected Skills Tag Cloud */ }
<div className="col-span-1 lg:col-span-8 glass-panel rounded-xl p-md flex flex-col">
<div className="flex items-center justify-between mb-md">
<div className="flex items-center gap-2 text-on-surface-variant text-label-sm font-label-sm uppercase tracking-widest">
<span className="material-symbols-outlined text-[16px]">radar</span>
                        Extracted Entities & Skills
                    </div>
<button className="text-primary text-label-sm font-label-sm hover:underline">Edit Skills</button>
</div>
<div className="flex flex-wrap gap-xs">
{ /* Primary Tech */ }
{primarySkills.length === 0 && (
<span className="bg-surface-container-high border border-outline-variant/30 text-on-surface px-3 py-1.5 rounded-lg text-label-md font-label-md">No resume analyzed yet</span>
)}
{primarySkills.map((skill) => (
<span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-label-md font-label-md flex items-center gap-1" key={skill}>
                        {skill} <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
</span>
))}
{ /* Secondary Tech */ }
{secondarySkills.map((skill) => (
<span className="bg-surface-container-high border border-outline-variant/30 text-on-surface px-3 py-1.5 rounded-lg text-label-md font-label-md" key={skill}>{skill}</span>
))}
{ /* Soft/Methodology */ }
{analysis?.roleMatch && <span className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-3 py-1.5 rounded-lg text-label-md font-label-md">{analysis.roleMatch}</span>}
</div>
<div className="mt-auto pt-md border-t border-outline-variant/20">
<div className="flex items-start gap-sm">
<span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">lightbulb</span>
<p className="text-body-sm font-body-sm text-on-surface-variant">
<span className="text-on-surface font-medium">Missing Keywords:</span> {improvementText}
                        </p>
</div>
</div>
</div>
</div>
</main>
<script>{`
        // Trigger SVG animation on load
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const ring = document.querySelector('.gauge-ring');
                if(ring) ring.classList.add('animate');
            }, 500);
        });
    `}</script>


</>
)};
