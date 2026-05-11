import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatchJson, apiPostJson } from "../../lib/api";
import "./styles.css";

const INDUSTRIES = [
  "IT & Software",
  "Design & Creativitate",
  "Vânzări & Marketing",
  "Administrativ & Secretariat",
  "Financiar & Contabilitate",
  "Client Service & Support",
  "Educație",
  "Medicină & Sănătate",
];

const emptyJob = {
  title: "",
  industry: "IT & Software",
  location: "Remote",
  is_remote: true,
  job_type: "contract",
  experience_level: "mid",
  salary_min: "",
  salary_max: "",
  salary_currency: "RON",
  description: "",
  requirements: "",
  responsibilities: "",
  benefits: "",
  skills: "",
  expires_at: "",
};

function Requester() {
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState(emptyJob);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [solutionFeedback, setSolutionFeedback] = useState({});

  async function loadData() {
    const [d, myJobs] = await Promise.all([apiGet("/me/dashboard/requester"), apiGet("/me/jobs")]);
    setDashboard(d);
    setJobs(myJobs);
  }

  useEffect(() => {
    loadData()
      .catch((e) => setError(`Eroare la incarcare: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const canSubmit = useMemo(() => {
    return jobForm.title.trim().length >= 3 && jobForm.description.trim().length >= 20 && jobForm.skills.trim().length > 0;
  }, [jobForm]);

  function updateField(field, value) {
    setJobForm((prev) => ({ ...prev, [field]: value }));
    setStatusMessage("");
  }

  async function handlePostTask(event) {
    event.preventDefault();
    if (!canSubmit) {
      setStatusMessage("Completeaza titlul, descrierea si skill-urile ca sa putem face matching bun.");
      return;
    }

    const skills = jobForm.skills
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name, is_required: true, min_proficiency: 3 }));

    const benefits = jobForm.benefits
      .split(",")
      .map((benefit) => benefit.trim())
      .filter(Boolean);

    const payload = {
      ...jobForm,
      salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : null,
      salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : null,
      benefits,
      skills,
    };

    setSaving(true);
    try {
      await apiPostJson("/jobs", payload);
      setJobForm(emptyJob);
      setStatusMessage("Job publicat. Embedding-ul a fost generat pentru matching.");
      setIsJobModalOpen(false);
      await loadData();
    } catch (e) {
      setStatusMessage(`Nu am putut publica jobul: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(jobId, status) {
    setStatusMessage("");
    try {
      await apiPatchJson(`/jobs/${jobId}/status`, { status });
      setStatusMessage("Status actualizat.");
      await loadData();
    } catch (e) {
      setStatusMessage(`Nu am putut actualiza statusul: ${e.message}`);
    }
  }

  async function handleApplicationStatus(applicationId, status) {
    setStatusMessage("");
    try {
      await apiPatchJson(`/applications/${applicationId}/status`, { status });
      setStatusMessage(status === "accepted" ? "Contributor added to the task team." : "Contributor status updated.");
      await loadData();
    } catch (e) {
      setStatusMessage(`Could not update contributor: ${e.message}`);
    }
  }

  async function handleSolutionFeedback(applicationId, decision, openTicket = false) {
    setStatusMessage("");
    try {
      await apiPostJson(`/applications/${applicationId}/solution-feedback`, {
        decision,
        feedback: solutionFeedback[applicationId] || "",
        open_ticket: openTicket,
      });
      setStatusMessage(openTicket ? "Feedback saved and a ticket was opened." : "Solution feedback saved.");
      setSolutionFeedback((prev) => ({ ...prev, [applicationId]: "" }));
      await loadData();
    } catch (e) {
      setStatusMessage(`Could not save solution feedback: ${e.message}`);
    }
  }

  if (loading) return <div className="requester-page"><p>Loading requester dashboard...</p></div>;
  if (error) return <div className="requester-page"><p className="rq-error">{error}</p></div>;

  const stats = dashboard?.stats || {};
  const allApplications = jobs.flatMap((job) => job.Applications || []);
  const acceptedCount = allApplications.filter((app) => app.status === "accepted").length;
  const pendingCount = allApplications.filter((app) => ["pending", "reviewed"].includes(app.status)).length;
  const totalBudget = jobs.reduce((sum, job) => sum + (job.salary_max || job.salary_min || 0), 0);

  return (
    <div className="requester-page">
      <header className="rq-hero">
        <div>
          <span className="rq-badge">Requester Dashboard</span>
          <h1>Requester Dashboard</h1>
          <p>Create projects, set budgets, accept contributors, validate solutions, and open tickets when work is not conforming.</p>
        </div>
        <button className="rq-primary" type="button" onClick={() => setIsJobModalOpen(true)}>
          Post Project
        </button>
      </header>

      {statusMessage && !isJobModalOpen && <p className="rq-inline-status rq-page-status">{statusMessage}</p>}

      <section className="rq-stats">
        <article><div><h4>Active Tasks</h4><strong>{stats.activeTasks || 0}</strong><span>Currently open</span></div><b>○</b></article>
        <article><div><h4>Completed Tasks</h4><strong>{stats.completedTasks || 0}</strong><span>{acceptedCount} accepted contributors</span></div><b>✓</b></article>
        <article><div><h4>Total Budget</h4><strong>{totalBudget || 0} RON</strong><span>Across posted tasks</span></div><b>$</b></article>
        <article><div><h4>Pending Review</h4><strong>{pendingCount}</strong><span>Contributor requests</span></div><b>↗</b></article>
      </section>

      <section className="rq-grid">
        <div className="rq-card rq-task-panel">
          <div className="rq-panel-head">
            <div>
              <h3>Your Projects</h3>
              <p>Monitor contributors, negotiations, and team composition</p>
            </div>
            <button type="button" onClick={() => setIsJobModalOpen(true)}>New Project</button>
          </div>
            {jobs.length === 0 ? (
              <p>No projects yet.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="rq-task rq-task-full">
                  <div className="rq-task-top">
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.salary_max || job.salary_min || "Negotiable"} RON - {job.job_type || "task"} - {job.Applications?.length || 0} contributors</p>
                    </div>
                    <span className={`rq-status-pill ${job.status}`}>{job.status}</span>
                  </div>

                  <div className="rq-progress-row">
                    <span>Progress</span>
                    <strong>{job.status === "closed" ? 100 : job.status === "paused" ? 35 : 65}%</strong>
                  </div>
                  <div className="rq-progress-track">
                    <div style={{ width: `${job.status === "closed" ? 100 : job.status === "paused" ? 35 : 65}%` }} />
                  </div>

                  <div className="rq-team">
                    <h4>Project Team</h4>
                    {(job.Applications || []).filter((app) => app.status === "accepted").length === 0 ? (
                      <p>No accepted contributors yet.</p>
                    ) : (
                      <div className="rq-team-list">
                        {(job.Applications || []).filter((app) => app.status === "accepted").map((app) => (
                          <span key={app.id}>{app.Candidate?.name || "Contributor"}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rq-applicants">
                    <h4>Contributor Requests</h4>
                    {(job.Applications || []).length === 0 ? (
                      <p>No contributors requested this task yet.</p>
                    ) : (
                      (job.Applications || []).map((app) => (
                        <article className="rq-applicant" key={app.id}>
                          <div className="rq-applicant-head">
                            <div className="rq-applicant-avatar">
                              {app.Candidate?.profile_picture_url ? (
                                <img src={app.Candidate.profile_picture_url} alt={app.Candidate?.name || "Contributor"} />
                              ) : (
                                <span>{(app.Candidate?.name || "C").slice(0, 2).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <strong>{app.Candidate?.name || "Contributor"}</strong>
                              <p>{app.Candidate?.experience_years || 0} years - {app.Candidate?.city || "Remote"} - {app.status}</p>
                            </div>
                          </div>
                          {app.Candidate?.Skills?.length > 0 && (
                            <div className="rq-skill-list">
                              {app.Candidate.Skills.slice(0, 6).map((skill) => <span key={skill.id}>{skill.name}</span>)}
                            </div>
                          )}
                          {app.cover_letter && <pre className="rq-cover-letter">{app.cover_letter}</pre>}
                          <div className="rq-actions">
                            <button onClick={() => handleApplicationStatus(app.id, "accepted")}>Accept To Team</button>
                            <button onClick={() => handleApplicationStatus(app.id, "reviewed")}>Mark Reviewed</button>
                            <button onClick={() => handleApplicationStatus(app.id, "rejected")}>Reject</button>
                          </div>
                          {app.status === "accepted" && (
                            <div className="rq-solution-review">
                              <label>
                                Solution feedback
                                <textarea
                                  rows="3"
                                  value={solutionFeedback[app.id] || ""}
                                  onChange={(e) => setSolutionFeedback((prev) => ({ ...prev, [app.id]: e.target.value }))}
                                  placeholder="Mention what was accepted, what needs changes, or why the solution is not conforming."
                                />
                              </label>
                              <div className="rq-actions">
                                <button onClick={() => handleSolutionFeedback(app.id, "accepted")}>Accept Solution</button>
                                <button onClick={() => handleSolutionFeedback(app.id, "changes_requested")}>Request Changes</button>
                                <button onClick={() => handleSolutionFeedback(app.id, "rejected", true)}>Open Ticket</button>
                              </div>
                            </div>
                          )}
                        </article>
                      ))
                    )}
                  </div>

                  <div className="rq-task-footer">
                    <button onClick={() => handleStatus(job.id, "active")}>Set Active</button>
                    <button onClick={() => handleStatus(job.id, "paused")}>Pause</button>
                    <button onClick={() => handleStatus(job.id, "closed")}>Close Task</button>
                  </div>
                </div>
              ))
            )}
        </div>

        <aside className="rq-right-column">
          <div className="rq-card rq-activity-card">
            <div className="rq-panel-head compact">
              <div>
                <h3>Recent Activity</h3>
                <p>Latest updates on your tasks</p>
              </div>
            </div>
            {(dashboard?.recentActivity || []).length === 0 ? <p>No recent contributor activity.</p> : null}
            {(dashboard?.recentActivity || []).map((activity) => (
              <div className="rq-activity" key={activity.id}>
                <span>{activity.status === "accepted" ? "✓" : "↗"}</span>
                <div>
                  <strong>{activity.message}</strong>
                  <p>{activity.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rq-card rq-budget-card">
            <h3>Budget Overview</h3>
            <p>Current task budget breakdown</p>
            <div><span>Open Budget</span><strong>{totalBudget} RON</strong></div>
            <div><span>Accepted Team</span><strong>{acceptedCount}</strong></div>
            <div><span>Pending Review</span><strong>{pendingCount}</strong></div>
          </div>
        </aside>
      </section>

      {isJobModalOpen && (
        <div className="rq-modal-backdrop" role="presentation" onMouseDown={() => setIsJobModalOpen(false)}>
          <div className="rq-modal" role="dialog" aria-modal="true" aria-labelledby="post-job-title" onMouseDown={(e) => e.stopPropagation()}>
            <form className="rq-card rq-job-form" onSubmit={handlePostTask}>
              <div className="rq-card-head">
                <div>
                  <h3 id="post-job-title">Posteaza job</h3>
                  <span>Se genereaza embedding la salvare</span>
                </div>
                <button className="rq-close-btn" type="button" onClick={() => setIsJobModalOpen(false)} aria-label="Inchide formularul">
                  x
                </button>
              </div>

              <div className="rq-form-grid">
                <label>
                  Titlu job
                  <input value={jobForm.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Frontend React Developer" />
                </label>
                <label>
                  Industrie
                  <select value={jobForm.industry} onChange={(e) => updateField("industry", e.target.value)}>
                    {INDUSTRIES.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                  </select>
                </label>
                <label>
                  Locatie
                  <input value={jobForm.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Bucuresti / Remote" />
                </label>
                <label>
                  Tip job
                  <select value={jobForm.job_type} onChange={(e) => updateField("job_type", e.target.value)}>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </label>
                <label>
                  Nivel
                  <select value={jobForm.experience_level} onChange={(e) => updateField("experience_level", e.target.value)}>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="expert">Expert</option>
                  </select>
                </label>
                <label>
                  Expira la
                  <input type="date" value={jobForm.expires_at} onChange={(e) => updateField("expires_at", e.target.value)} />
                </label>
                <label>
                  Salariu minim
                  <input type="number" min="0" value={jobForm.salary_min} onChange={(e) => updateField("salary_min", e.target.value)} />
                </label>
                <label>
                  Salariu maxim
                  <input type="number" min="0" value={jobForm.salary_max} onChange={(e) => updateField("salary_max", e.target.value)} />
                </label>
              </div>

              <label className="rq-check">
                <input type="checkbox" checked={jobForm.is_remote} onChange={(e) => updateField("is_remote", e.target.checked)} />
                Remote disponibil
              </label>

              <label>
                Skill-uri pentru matching
                <input value={jobForm.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
              </label>
              <label>
                Descriere
                <textarea rows="5" value={jobForm.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Context, obiective, produs, echipa..." />
              </label>
              <label>
                Cerinte
                <textarea rows="4" value={jobForm.requirements} onChange={(e) => updateField("requirements", e.target.value)} placeholder="Experienta, tehnologii, nivel asteptat..." />
              </label>
              <label>
                Responsabilitati
                <textarea rows="4" value={jobForm.responsibilities} onChange={(e) => updateField("responsibilities", e.target.value)} placeholder="Ce va face candidatul concret..." />
              </label>
              <label>
                Beneficii
                <input value={jobForm.benefits} onChange={(e) => updateField("benefits", e.target.value)} placeholder="Program flexibil, bonusuri, training" />
              </label>

              {statusMessage && <p className="rq-inline-status">{statusMessage}</p>}
              <div className="rq-modal-actions">
                <button className="rq-secondary" type="button" onClick={() => setIsJobModalOpen(false)}>
                  Renunta
                </button>
                <button className="rq-primary" disabled={saving || !canSubmit} type="submit">
                  {saving ? "Se publica..." : "Publica job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requester;
