import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";


export default function Auth() {


    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const [isLogin, setIsLogin] = useState(true);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignupChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/api/auth/login",
                loginData
            );

            login(res.data.token, res.data.user);

            alert("Login Successful");

            navigate(redirectTo, { replace: true });
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/api/auth/register",
                signupData
            );

            login(res.data.token, res.data.user);

            alert("Signup Successful");

            navigate(redirectTo, { replace: true });
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Signup Failed"
            );
        }
    };
    return (
           <><meta charSet="utf-8" />
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<title>PrepWise AI - Login</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
                      "label-sm": [
                              "Geist"
                      ],
                      "headline-lg": [
                              "Geist"
                      ],
                      "body-sm": [
                              "Geist"
                      ],
                      "display-lg": [
                              "Geist"
                      ],
                      "body-lg": [
                              "Geist"
                      ],
                      "body-md": [
                              "Geist"
                      ],
                      "label-md": [
                              "Geist"
                      ],
                      "headline-md": [
                              "Geist"
                      ],
                      "display-lg-mobile": [
                              "Geist"
                      ]
              },
              "fontSize": {
                      "label-sm": [
                              "11px",
                              {
                                      "lineHeight": "14px",
                                      "letterSpacing": "0.05em",
                                      "fontWeight": "500"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "40px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "600"
                              }
                      ],
                      "body-sm": [
                              "14px",
                              {
                                      "lineHeight": "20px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-lg": [
                              "48px",
                              {
                                      "lineHeight": "56px",
                                      "letterSpacing": "-0.04em",
                                      "fontWeight": "700"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "28px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-md": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.05em",
                                      "fontWeight": "500"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "600"
                              }
                      ],
                      "display-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "40px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "700"
                              }
                      ]
              }
      },
          },
        }
    `}</script>
<style>{`
        body {
            background-color: #131313;
            background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,0.2) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,0.1) 0, transparent 50%);
            background-attachment: fixed;
        }
        
        .glass-panel {
            background: rgba(11, 11, 11, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(66, 70, 85, 0.3);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .input-glow:focus {
            border-color: #b0c6ff;
            box-shadow: 0 0 15px rgba(176, 198, 255, 0.1);
            outline: none;
        }

        /* View Transitions */
        .auth-view {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .hidden-view {
            opacity: 0;
            pointer-events: none;
            position: absolute;
            transform: translateY(10px);
        }
        .active-view {
            opacity: 1;
            pointer-events: auto;
            position: relative;
            transform: translateY(0);
        }
    `}</style>

           <div className="min-h-screen flex items-center justify-center bg-background px-4">

            { /* Ambient Glows */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none" />
            <main className="w-full max-w-md relative z-10">
                { /* Logo Header */}
                <div className="text-center mb-lg"><h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary tracking-tight">PrepWise AI</h1><p className="text-body-md font-body-md text-on-surface-variant mt-xs">Elite Placement Prep</p></div>
                { /* Auth Container */}
                <div className="glass-panel rounded-xl p-md md:p-lg relative overflow-hidden">
                    { /* Login View */}
                    {isLogin ? (
                   <div className="w-full">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Welcome back</h2>
                        <form onSubmit={handleLoginSubmit} className="space-y-sm">
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-base" htmlFor="login-email">Email address</label>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-sm py-xs text-body-md font-body-md text-on-surface placeholder:text-outline input-glow transition-all" id="login-email" placeholder="name@company.com" required type="email" name="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange} />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-base">
                                    <label className="block text-label-md font-label-md text-on-surface-variant" htmlFor="login-password">Password</label>
                                    <a className="text-label-sm font-label-sm text-primary hover:text-primary-fixed transition-colors" href="#">Forgot password?</a>
                                </div>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-sm py-xs text-body-md font-body-md text-on-surface placeholder:text-outline input-glow transition-all" id="login-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required type="password" name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange} />
                            </div>
                            <button className="w-full bg-primary text-on-primary rounded-lg py-xs px-sm text-label-md font-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-xs mt-md" type="submit">
                                Sign In
                                <span className="material-symbols-outlined" data-weight="fill">arrow_forward</span>
                            </button>
                        </form>
                        <div className="mt-md flex items-center gap-sm">
                            <div className="h-px bg-outline-variant/30 flex-1" />
                            <span className="text-label-sm font-label-sm text-outline">OR CONTINUE WITH</span>
                            <div className="h-px bg-outline-variant/30 flex-1" />
                        </div>
                        <div className="mt-md grid grid-cols-2 gap-sm">
                            <button className="flex items-center justify-center gap-xs bg-transparent border border-outline-variant rounded-lg py-xs px-sm hover:border-primary/50 hover:bg-surface-container transition-all">
                                <img alt="Google" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjkrcI-u63ffcsRaZzIlv5t65nu_oHWg_ACUMyilvaNdubu37GOiVHrsbRnwvjmkpXxqQVwiP5OAaiQze-0HmMIkyDkU086LR_qeAGGLJKe3AYFwANP_g2qVXhgAKWD5x0s0ZG485uyu8s_ky7a0rag6kohq1ZuiC9p12PpIqRsawqJmGp9iUN2lMWL33or4MqvbG140k0BWWDCxcw9vn96t4CRbeb-YDAQQvGN3h6lh-IOMZf8BctrPZuI1d_pSHuWVW3DN-XA0Nm" />
                                <span className="text-label-md font-label-md text-on-surface">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-xs bg-transparent border border-outline-variant rounded-lg py-xs px-sm hover:border-primary/50 hover:bg-surface-container transition-all">
                                <img alt="GitHub" className="w-4 h-4 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeA_FM4KsZoX5tRmif0Ila_5gIvF3VD3tZj0D3YF1LRdjnlmD0ChiMJZdb7BO4daQKBBJo7tDV7ceJO-CGMO1on2VOrkTTKqPhdVdMBvhb31R9yT84uUaGpr_MiCDCkASbHN1vrECQtEc49Rz2JjDd170KaoAe7y19cGG2QHR3BOezhMU5oF5jN2Uf52LNuXs3EazUgnmaHiiCwGamfRqPH1N4WU43HZIeWKMNux6tIg4Y8XftWFBukaF7G8FOosUu1bleOGKeDOeI" />
                                <span className="text-label-md font-label-md text-on-surface">GitHub</span>
                            </button>
                        </div>
                        <p className="mt-lg text-center text-body-sm font-body-sm text-on-surface-variant">
                            Don't have an account?
                            <button className="text-primary hover:text-primary-fixed transition-colors font-medium" type="button" onClick={() => setIsLogin(false)}>Sign up</button>
                        </p>
                    </div>
                    ) : (
                    <div className="w-full" id="signup-view">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Create an account</h2>
                        <form onSubmit={handleSignupSubmit} className="space-y-sm" >
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-base" htmlFor="signup-name">Full name</label>
                                <input name="name"
                                    value={signupData.name}
                                    onChange={handleSignupChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-sm py-xs text-body-md font-body-md text-on-surface placeholder:text-outline input-glow transition-all" id="signup-name" placeholder="John Doe" required type="text" />
                            </div>
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-base" htmlFor="signup-email">Email address</label>
                                <input name="email"
                                    value={signupData.email}
                                    onChange={handleSignupChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-sm py-xs text-body-md font-body-md text-on-surface placeholder:text-outline input-glow transition-all" id="signup-email" placeholder="name@company.com" required type="email" />
                            </div>
                            <div>
                                <label className="block text-label-md font-label-md text-on-surface-variant mb-base" htmlFor="signup-password">Password</label>
                                <input name="password"
                                    value={signupData.password}
                                    onChange={handleSignupChange} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-sm py-xs text-body-md font-body-md text-on-surface placeholder:text-outline input-glow transition-all" id="signup-password" placeholder="Create a strong password" required type="password" />
                            </div>
                            <button className="w-full bg-primary text-on-primary rounded-lg py-xs px-sm text-label-md font-label-md hover:bg-primary-fixed transition-colors flex items-center justify-center gap-xs mt-md" type="submit">
                                Get Started
                                <span className="material-symbols-outlined" data-weight="fill">rocket_launch</span>
                            </button>
                        </form>
                        <p className="mt-md text-center text-label-sm font-label-sm text-outline max-w-xs mx-auto">
                            By clicking continue, you agree to our <a className="text-on-surface hover:text-primary transition-colors" href="#">Terms of Service</a> and <a className="text-on-surface hover:text-primary transition-colors" href="#">Privacy Policy</a>.
                        </p>
                        <p className="mt-lg text-center text-body-sm font-body-sm text-on-surface-variant">
                            Already have an account?
                            <button className="text-primary hover:text-primary-fixed transition-colors font-medium" type="button" onClick={() => setIsLogin(true)}>Sign in</button>
                        </p>
                    </div>
                    )}
                </div>
            </main>
 

    </div>
    
</>
)
};
