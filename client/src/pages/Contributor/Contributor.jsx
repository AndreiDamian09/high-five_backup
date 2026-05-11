/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../lib/api";
import { motion as Motion } from "framer-motion";
import { animations } from "../variants";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/Card/Card";
import "./styles.css";

const emptyProfile = {
  name: "",
  city: "",
  about_me: "",
  education: "",
  preferred_industries: "",
  preferred_locations: "",
  expected_salary_min: "",
  expected_salary_max: "",
  skillsText: "",
};

function skillsToText(skills = []) {
  return skills
    .map((skill) => {
      const pivot = skill.CandidateSkill || {};
      return [skill.name, pivot.proficiency_level || 3, pivot.years_experience || 0].join("|");
    })
    .join("\n");
}

function openProfileMenu() {
  window.dispatchEvent(new CustomEvent("open-profile-menu"));
}

function Contributor() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    const [dashboardData, profileData, achievementData] = await Promise.all([
      apiGet("/me/dashboard/contributor"),
      apiGet("/me/profile/contributor"),
      apiGet("/me/achievements"),
    ]);

    setDashboard(dashboardData);
    setAchievements(achievementData || []);
    setProfile({
      ...emptyProfile,
      ...profileData,
      preferred_industries: (profileData.preferred_industries || []).join(", "),
      preferred_locations: (profileData.preferred_locations || []).join(", "),
      expected_salary_min: profileData.expected_salary_min || "",
      expected_salary_max: profileData.expected_salary_max || "",
      skillsText: skillsToText(profileData.Skills || []),
    });
  }

  useEffect(() => {
    loadData()
      .catch((e) => setError(`Eroare la incarcare: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const profileScore = useMemo(() => {
    const checks = [
      profile.name,
      profile.city,
      profile.about_me && profile.about_me.length > 40,
      profile.skillsText,
      profile.preferred_industries,
      profile.preferred_locations,
      profile.expected_salary_min || profile.expected_salary_max,
      profile.education,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <div className="contributor-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Motion.div className="contributor-page" variants={animations.shakeError} initial="initial" animate="animate" exit="exit">
        <div className="error-container"><p>{error}</p></div>
      </Motion.div>
    );
  }

  const stats = dashboard?.stats || {};
  const activeTasks = dashboard?.activeTasks || [];
  const profileChecklist = dashboard?.profileChecklist || [];

  return (
    <Motion.div className="contributor-page" variants={animations.pageTransition} initial="initial" animate="animate" exit="exit">
      <section className="contributor-hero">
        <div className="contributor-hero-inner">
          <Motion.div className="contributor-hero-left" variants={animations.fadeInUp} initial="initial" animate="animate" exit="exit">
            <span className="dashboard-badge">Contributor Dashboard</span>
            <h1 className="contributor-title">
              Welcome back, {profile.name || user?.email?.split("@")[0] || "Contributor"}!
            </h1>
            <p className="contributor-subtitle">Here's what's happening with your tasks today</p>
          </Motion.div>

          <div className="contributor-hero-right">
            <Link className="browse-tasks-btn" to="/taskbrowser">Browse New Tasks</Link>
          </div>
        </div>
      </section>

      <Motion.section className="stats-section" variants={animations.containerStagger} initial="initial" animate="animate" exit="exit">
        <div className="stats-grid">
          <Card className="dashboard-card stat-card earnings-card">
            <CardHeader className="dashboard-card-header"><CardTitle>Total Earnings</CardTitle><span className="card-icon">$</span></CardHeader>
            <CardContent className="dashboard-card-content"><div className="card-main-value">${stats.totalEarnings || 0}</div></CardContent>
            <CardFooter className="dashboard-card-footer positive">Based on accepted applications</CardFooter>
          </Card>
          <Card className="dashboard-card stat-card completed-card">
            <CardHeader className="dashboard-card-header"><CardTitle>Completed Tasks</CardTitle><span className="card-icon">✓</span></CardHeader>
            <CardContent className="dashboard-card-content"><div className="card-main-value">{stats.completedTasks || 0}</div></CardContent>
            <CardFooter className="dashboard-card-footer positive">Completed tasks</CardFooter>
          </Card>
          <Card className="dashboard-card stat-card rating-card">
            <CardHeader className="dashboard-card-header"><CardTitle>Profile Match Data</CardTitle><span className="card-icon">%</span></CardHeader>
            <CardContent className="dashboard-card-content"><div className="card-main-value">{profileScore}%</div></CardContent>
            <CardFooter className="dashboard-card-footer">Local form completeness</CardFooter>
          </Card>
          <Card className="dashboard-card stat-card active-card">
            <CardHeader className="dashboard-card-header"><CardTitle>Active Tasks</CardTitle><span className="card-icon">↗</span></CardHeader>
            <CardContent className="dashboard-card-content"><div className="card-main-value">{stats.activeTasks || 0}</div></CardContent>
            <CardFooter className="dashboard-card-footer">Keep up the momentum</CardFooter>
          </Card>
        </div>
      </Motion.section>

      <section className="contributor-workspace">
        <div className="contributor-main-panel">
          <Card className="dashboard-card contributor-panel-card active-task-panel">
            <CardHeader className="dashboard-card-header panel-header">
              <div>
                <CardTitle>Active Tasks</CardTitle>
                <p className="contributor-muted">Tasks you're currently working on</p>
              </div>
            </CardHeader>
            <CardContent className="task-list-content">
              {activeTasks.length === 0 ? (
                <div className="empty-task-state">
                  <strong>No active tasks yet</strong>
                  <p className="contributor-muted">Apply to a matched project to start building your active task list.</p>
                  <Link className="task-primary-action" to="/taskbrowser">Browse Tasks</Link>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div className="task-row" key={task.id}>
                    <div className="task-row-head">
                      <div>
                        <strong>{task.title}</strong>
                        <p className="contributor-muted">$ {task.budget || 0} - {task.status}</p>
                      </div>
                      <span>{task.status}</span>
                    </div>
                    <div className="task-progress-meta">
                      <span>Progress</span>
                      <strong>{task.progress}%</strong>
                    </div>
                    <div className="progress-wrap"><div className="progress-bar" style={{ width: `${task.progress}%` }} /></div>
                    <div className="task-row-actions">
                      <Link to="/collaboration">Continue Working</Link>
                      <Link to="/collaboration" className="secondary">Details</Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="contributor-side-panel">
          <Card className="dashboard-card contributor-panel-card profile-strength-card">
            <CardHeader className="dashboard-card-header panel-header">
              <div>
                <CardTitle>Profile Strength</CardTitle>
                <p className="contributor-muted">Complete your profile to get more tasks</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="strength-value">{stats.profileStrength || 0}%</div>
              <div className="strength-track"><div style={{ width: `${stats.profileStrength || 0}%` }} /></div>
              {profileChecklist.map((item) => (
                <p className={`checklist-item ${item.done ? "done" : ""}`} key={item.label}>
                  <span>{item.done ? "✓" : ""}</span>
                  {item.label}
                </p>
              ))}
              <button className="complete-profile-btn" type="button" onClick={openProfileMenu}>Complete Profile</button>
            </CardContent>
          </Card>

          <Card className="dashboard-card contributor-panel-card achievements-card">
            <CardHeader className="dashboard-card-header"><CardTitle>Achievements</CardTitle></CardHeader>
            <CardContent>
              {achievements.slice(0, 4).map((achievement) => (
                <div className={`achievement-row ${achievement.unlocked ? "unlocked" : ""}`} key={achievement.code}>
                  <span>{achievement.unlocked ? "✓" : ""}</span>
                  <div>
                    <strong>{achievement.title}</strong>
                    <p>{achievement.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>
    </Motion.div>
  );
}

export default Contributor;
