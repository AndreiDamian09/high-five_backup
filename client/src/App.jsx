import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// import "./styles/App.css";

import { AuthProvider } from "./context/AuthContext";
import AuthGuard, { GuestGuard } from "./components/AuthGuard/AuthGuard";

import MainPage from "./pages/HomePage";
import Navigation from "./components/Navigation/Navigation";
import Contributor from "./pages/Contributor/Contributor";
import Requester from "./pages/Requester/Requester";
import TaskBrowser from "./pages/TaskBrowser/TaskBrowser";
import MatchingPage from "./pages/MatchingPage/MatchingPage";
import CollaborationHub from "./pages/CollaborationHub/CollaborationHub";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

//Main application component that sets up routing and authentication context for the app

export default function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <div>
        <Navigation />
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          } />
          <Route path="/register" element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          } />
          <Route path="/contributor" element={
            <AuthGuard requireRole="candidate">
              <Contributor />
            </AuthGuard>
          } />
          <Route path="/requester" element={
            <AuthGuard requireRole="employer">
              <Requester />
            </AuthGuard>
          } />
          <Route path="/taskbrowser" element={<TaskBrowser />} />
          <Route path="/matching" element={
            <AuthGuard>
              <MatchingPage />
            </AuthGuard>
          } />
          <Route path="/collaboration" element={
            <AuthGuard>
              <CollaborationHub />
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard requireRole="admin">
              <AdminDashboard />
            </AuthGuard>
          } />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}
