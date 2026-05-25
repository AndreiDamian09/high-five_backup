import "./style.css";
import { motion } from "framer-motion";

function JobCard({ job, onApply, onNegotiate, onToggleSave, isSaved }) {
  // Determine difficulty based on experience level
  const getDifficulty = (level) => {
    if (!level) return { label: "Entry", class: "easy" };
    const lower = level.toLowerCase();
    if (lower.includes("entry") || lower.includes("junior")) return { label: "Easy", class: "easy" };
    if (lower.includes("mid") || lower.includes("intermediate")) return { label: "Medium", class: "medium" };
    if (lower.includes("senior") || lower.includes("expert")) return { label: "Hard", class: "hard" };
    return { label: "Entry", class: "easy" };
  };

  const difficulty = getDifficulty(job.experience_level);
  const skills = job.Skills || [];

  // Format salary as budget
  const formatBudget = () => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} RON`;
    }
    if (job.salary_max) return `${job.salary_max.toLocaleString()} RON`;
    if (job.salary_min) return `${job.salary_min.toLocaleString()}+ RON`;
    return "Negotiable";
  };

  // Estimate time based on job type
  const getTimeEstimate = () => {
    const type = job.job_type?.toLowerCase();
    if (type?.includes("part")) return "Part-time";
    if (type?.includes("contract")) return "Contract";
    if (type?.includes("freelance")) return "Flexible";
    return "Full-time";
  };

  return (
    <motion.div
      className="job-card"
      whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(15, 23, 42, 0.14)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="job-card-header">
        <div className="job-card-title-section">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-description">
            {job.description?.slice(0, 150)}
            {job.description?.length > 150 ? "..." : ""}
          </p>
        </div>
        <span className={`difficulty-badge ${difficulty.class}`}>
          {difficulty.label}
        </span>
      </div>

      {/* Skills Tags */}
      {skills.length > 0 && (
        <div className="job-card-tags">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill.id} className="skill-tag">
              {skill.name}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="skill-tag more-tag">+{skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Meta Information */}
      <div className="job-card-meta">
        <div className="meta-item">
          <span className="meta-icon">$</span>
          <span>{formatBudget()}</span>
        </div>
        <div className="meta-item">
          <svg className="meta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{getTimeEstimate()}</span>
        </div>
        <div className="meta-item">
          <svg className="meta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 18L9 11l4 4L21 7" />
          </svg>
          <span>{job.applications_count || 0} contributors interested</span>
        </div>
        {job.matchScore && (
          <div className="meta-item match-score">
            <svg className="meta-icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{(job.matchScore * 100).toFixed(0)}% match</span>
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="job-card-company">
        Initiated by <strong>{job.Employer?.company_name || "Unknown Requester"}</strong>
        {job.location && (
          <span className="company-location">
            <span className="location-dot">•</span>
            {job.is_remote ? "Remote" : job.location}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="job-card-actions">
        <button className="apply-btn" onClick={() => onApply?.(job.id)}>
          Apply
        </button>
        <button className="negotiate-btn" onClick={() => onNegotiate?.(job)}>
          Negotiate
        </button>
        <button className="details-btn" onClick={() => onToggleSave?.(job.id)}>
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </motion.div>
  );
}

export default JobCard;
