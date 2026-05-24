import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import DSAPractice from "./pages/DSAPractice";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import Aptitude from "./pages/Aptitude";
import HelpCenter from "./pages/HelpCenter";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import AdminRoute from "./components/AdminRoute";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
export default function App() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dsa-practice" element={<DSAPractice />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/help-center" element={<HelpCenter />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </PageTransition>
  );
}
