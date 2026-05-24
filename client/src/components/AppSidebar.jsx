import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/dsa-practice", icon: "code", label: "DSA Practice" },
    { to: "/resume-analyzer", icon: "description", label: "Resume Analyzer" },
    { to: "/mock-interview", icon: "forum", label: "Mock Interview" },
    { to: "/aptitude", icon: "psychology", label: "Aptitude" },
];

const activeClass =
    "flex items-center gap-sm bg-primary-container/10 text-primary border-r-4 border-primary px-sm py-xs rounded-l-md transition-all scale-[0.98]";

const inactiveClass =
    "flex items-center gap-sm text-on-surface-variant px-sm py-xs hover:bg-surface-container-high/50 hover:text-on-surface transition-colors rounded-l-md";

export default function AppSidebar() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/auth", { replace: true });
    };

    return (
        <nav className="hidden md:flex flex-col h-dvh w-64 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/20 z-40 fixed left-0 top-0 py-6">
            <div className="px-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined fill text-2xl">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary tracking-tight leading-none">PrepWise AI</h1>
                        <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">Elite Placement Prep</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-sm flex flex-col gap-base">
                {navItems.map((item) => (
                    <NavLink
                        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                        key={item.to}
                        to={item.to}
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-label-md font-label-md">{item.label}</span>
                    </NavLink>
                ))}
                {user?.role === "admin" && (
                    <NavLink
                        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                        to="/admin"
                    >
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        <span className="text-label-md font-label-md">Admin</span>
                    </NavLink>
                )}
            </div>

            <div className="px-md mt-auto flex flex-col gap-sm">
                <button className="w-full py-2 bg-gradient-to-r from-primary-container to-secondary-container text-white text-label-md font-label-md rounded-lg shadow-[0_0_20px_rgba(86,141,255,0.15)] hover:shadow-[0_0_25px_rgba(86,141,255,0.3)] transition-all border border-white/10">
                    Upgrade to Pro
                </button>
                <div className="h-px w-full bg-outline-variant/20 my-2"></div>
                <NavLink className={({ isActive }) => (isActive ? activeClass : inactiveClass)} to="/help-center">
                    <span className="material-symbols-outlined">help</span>
                    <span className="text-label-md font-label-md">Help Center</span>
                </NavLink>
                <button className="flex items-center gap-sm text-on-surface-variant px-sm py-xs hover:bg-surface-container-high/50 hover:text-on-surface transition-colors rounded-md" onClick={handleLogout} type="button">
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-label-md font-label-md">Logout</span>
                </button>
            </div>
        </nav>
    );
}
