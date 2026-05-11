import "./styles.css";
import { useEffect, useState, useMemo } from "react";
import { apiDelete, apiGet, apiPostJson } from "../../lib/api";
import JobCard from "../../components/JobCard/JobCard";
import {animations} from "../variants";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Categories based on industry types
const CATEGORIES = [
  "All Categories",
  "IT & Software",
  "Design & Creativitate",
  "Vânzări & Marketing",
  "Administrativ & Secretariat",
  "Financiar & Contabilitate",
  "Client Service & Support",
  "Educație",
  "Medicină & Sănătate",
];

const DIFFICULTY_LEVELS = ["All Levels", "Entry", "Mid", "Senior", "Expert"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Highest Budget" },
  { value: "salary_low", label: "Lowest Budget" },
];

function TaskBrowser() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [negotiationTask, setNegotiationTask] = useState(null);
  const [negotiationForm, setNegotiationForm] = useState({
    proposed_budget: "",
    availability_note: "",
    negotiation_message: "",
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    (async () => {
      try {
        const [data, applications] = await Promise.all([
          apiGet("/jobs"),
          isAuthenticated && user?.role === "candidate" ? apiGet("/me/applications") : Promise.resolve([]),
        ]);
        setJobs(data);
        const applied = new Set((applications || []).map((a) => a.job_id));
        setSavedJobIds(Array.from(applied));
      } catch (e) {
        setError(`Error loading tasks: ${e.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, user?.role]);

  async function handleApply(jobId) {
    if (!isAuthenticated || user?.role !== "candidate") {
      setActionMessage("You need to be signed in as a contributor to join tasks.");
      return;
    }
    try {
      await apiPostJson(`/jobs/${jobId}/apply`, { cover_letter: "" });
      setSavedJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      setActionMessage("Request sent to the requester.");
    } catch (e) {
      setActionMessage(`Could not join task: ${e.message}`);
    }
  }

  async function handleToggleSave(jobId) {
    if (!isAuthenticated || user?.role !== "candidate") {
      setActionMessage("You need to be signed in as a contributor to save tasks.");
      return;
    }
    try {
      if (savedJobIds.includes(jobId)) {
        await apiDelete(`/jobs/${jobId}/save`);
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        setActionMessage("Task removed from saved list.");
      } else {
        await apiPostJson(`/jobs/${jobId}/save`, {});
        setSavedJobIds((prev) => [...prev, jobId]);
        setActionMessage("Task saved.");
      }
    } catch (e) {
      setActionMessage(`Could not update saved task: ${e.message}`);
    }
  }

  async function handleNegotiate(event) {
    event.preventDefault();
    if (!isAuthenticated || user?.role !== "candidate") {
      setActionMessage("Sign in as a contributor to negotiate tasks.");
      return;
    }
    if (!negotiationTask) return;

    try {
      await apiPostJson(`/jobs/${negotiationTask.id}/apply`, negotiationForm);
      setSavedJobIds((prev) => (prev.includes(negotiationTask.id) ? prev : [...prev, negotiationTask.id]));
      setActionMessage("Negotiation sent to the requester.");
      setNegotiationTask(null);
      setNegotiationForm({ proposed_budget: "", availability_note: "", negotiation_message: "" });
    } catch (e) {
      setActionMessage(`Could not send negotiation: ${e.message}`);
    }
  }

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query) ||
          job.Employer?.company_name?.toLowerCase().includes(query) ||
          job.Skills?.some((skill) => skill.name?.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      result = result.filter((job) => job.industry === selectedCategory);
    }

    // Difficulty/Experience filter
    if (selectedDifficulty !== "All Levels") {
      result = result.filter((job) => {
        const level = job.experience_level?.toLowerCase();
        const filter = selectedDifficulty.toLowerCase();
        return level?.includes(filter);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "salary_high":
          return (b.salary_max || 0) - (a.salary_max || 0);
        case "salary_low":
          return (a.salary_min || Infinity) - (b.salary_min || Infinity);
        default:
          return 0;
      }
    });

    return result;
  }, [jobs, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalTasks = filteredJobs.length;
    const avgBudget =
      filteredJobs.length > 0
        ? Math.round(
            filteredJobs.reduce(
              (sum, job) => sum + ((job.salary_min || 0) + (job.salary_max || 0)) / 2,
              0
            ) / filteredJobs.length
          )
        : 0;
    return { totalTasks, avgBudget };
  }, [filteredJobs]);

  if (loading) {
    return (
      <div className="task-browser">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Motion.div className="task-browser"
        variants={animations.shakeError}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="error-container">
          <p>{error}</p>
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div
      variants={animations.pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="task-browser"
    >
      {/* Header */}
      <div className="browser-header">
        <Motion.div className="header-container"
          variants={animations.fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <h1 className="browser-title">Browse Available Projects</h1>
          <p className="browser-subtitle">
            Discover crowdsourcing projects matched to your profile, skills, budget range, and availability.
          </p>
        </Motion.div>
      </div>

      {/* Main Content */}
      <Motion.div className="browser-content"
        variants={animations.containerStagger}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <svg
              className="filter-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
            </svg>
            <span>Filters</span>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              className="filter-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="quick-stats">
            <h3 className="stats-title">Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Projects</span>
              <span className="stat-value">{stats.totalTasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg. Budget</span>
              <span className="stat-value">
                {stats.avgBudget > 0 ? `$${stats.avgBudget.toLocaleString()}` : "N/A"}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Task List */}
        <main className="tasks-main">
          {/* Search and Sort Bar */}
          <div className="tasks-toolbar">
            <div className="search-container">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects, skills, requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {actionMessage && <p className="task-action-message">{actionMessage}</p>}
          </div>

          {/* Results Header */}
          <div className="results-header">
            <span className="results-count">
              Showing {filteredJobs.length} project{filteredJobs.length !== 1 ? "s" : ""}
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Task List */}
          <div className="tasks-list">
            {filteredJobs.length === 0 ? (
              <div className="no-results">
                <p>No projects found matching your criteria.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedDifficulty("All Levels");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onNegotiate={setNegotiationTask}
                  onToggleSave={handleToggleSave}
                  isSaved={savedJobIds.includes(job.id)}
                />
              ))
            )}
          </div>
        </main>
      </Motion.div>

      {negotiationTask && (
        <div className="negotiation-backdrop" role="presentation" onMouseDown={() => setNegotiationTask(null)}>
          <form className="negotiation-modal" onSubmit={handleNegotiate} onMouseDown={(e) => e.stopPropagation()}>
            <div className="negotiation-head">
              <div>
                <h2>Negotiate Task</h2>
                <p>{negotiationTask.title}</p>
              </div>
              <button type="button" onClick={() => setNegotiationTask(null)} aria-label="Close negotiation">x</button>
            </div>
            <label>
              Proposed budget
              <input
                value={negotiationForm.proposed_budget}
                onChange={(e) => setNegotiationForm((prev) => ({ ...prev, proposed_budget: e.target.value }))}
                placeholder="Example: 1200 RON or 50 RON/hour"
              />
            </label>
            <label>
              Availability
              <input
                value={negotiationForm.availability_note}
                onChange={(e) => setNegotiationForm((prev) => ({ ...prev, availability_note: e.target.value }))}
                placeholder="Example: I can start Monday, 15 hours/week"
              />
            </label>
            <label>
              Message to requester
              <textarea
                rows="5"
                value={negotiationForm.negotiation_message}
                onChange={(e) => setNegotiationForm((prev) => ({ ...prev, negotiation_message: e.target.value }))}
                placeholder="Explain your approach, timeline, and what you want to negotiate."
              />
            </label>
            <div className="negotiation-actions">
              <button type="button" className="reset-filters-btn secondary" onClick={() => setNegotiationTask(null)}>Cancel</button>
              <button type="submit" className="reset-filters-btn">Send Negotiation</button>
            </div>
          </form>
        </div>
      )}
    </Motion.div>
  );
}

export default TaskBrowser;
