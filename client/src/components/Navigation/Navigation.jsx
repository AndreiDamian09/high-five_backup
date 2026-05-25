import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import ProfileMenu from "./ProfileMenu";
import "./styles.css";

export default function Navigation() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.nav
      className="main-nav"
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <NavLink to="/" className="main-nav__brand">
        <img src="/Group.png" alt="HighFive Logo" height="39" />
      </NavLink>

      <NavLink to="/" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
        Home
      </NavLink>
      <NavLink to="/taskbrowser" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
        Browse Tasks
      </NavLink>

      {isAuthenticated && user?.role === "candidate" && (
        <>
          <NavLink to="/contributor" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Contributor
          </NavLink>
          <NavLink to="/matching" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Matching
          </NavLink>
          <NavLink to="/collaboration" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Collaboration
          </NavLink>
        </>
      )}
      {isAuthenticated && user?.role === "employer" && (
        <>
          <NavLink to="/requester" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Requester
          </NavLink>
          <NavLink to="/matching" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Matching
          </NavLink>
          <NavLink to="/collaboration" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Collaboration
          </NavLink>
        </>
      )}
      {isAuthenticated && user?.role === "admin" && (
        <NavLink to="/admin" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
          Admin
        </NavLink>
      )}

      <div className="main-nav__spacer" />

      {loading ? (
        <span className="main-nav__user">...</span>
      ) : isAuthenticated ? (
        <>
          {user?.role === "candidate" ? (
            <ProfileMenu user={user} />
          ) : (
            <span className="main-nav__user">{user?.email}</span>
          )}
          <button onClick={handleLogout} className="main-nav__logout-btn">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => `main-nav__link ${isActive ? "is-active" : ""}`}>
            Login
          </NavLink>
          <NavLink to="/register" className="main-nav__cta">
            Register
          </NavLink>
        </>
      )}

      <DarkModeToggle />
    </motion.nav>
  );
}
