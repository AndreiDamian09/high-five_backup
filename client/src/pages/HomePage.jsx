import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { animations } from "./variants";
import "./home.css";

const featuredJobs = [
  { title: "React Dashboard Builder", company: "FinTech Solutions", budget: "650-950 RON", tags: ["React", "Charts", "API"] },
  { title: "UX Review For SaaS Flow", company: "Digital Agency Pro", budget: "450-700 RON", tags: ["Figma", "UX", "Audit"] },
  { title: "Python Data Cleanup Script", company: "StartupX", budget: "500-800 RON", tags: ["Python", "CSV", "Automation"] },
];

const categories = ["Software", "Design", "Marketing", "Data", "Support", "Finance"];

function HomePage() {
  return (
    <Motion.div variants={animations.pageTransition} initial="initial" animate="animate" exit="exit" className="home-page">
      <section className="home-hero">
        <div className="home-hero__left">
          <span className="home-badge">AI crowdsourcing platform</span>
          <h1>Crowd Connect matches contributors with the right projects.</h1>
          <p>
            Requesters publish projects with budgets, contributors apply or negotiate, and the platform supports
            team collaboration, chat, ticketing, remuneration tracking, and achievements.
          </p>
          <div className="home-actions">
            <Link to="/taskbrowser" className="home-btn home-btn--primary">Browse Projects</Link>
            <Link to="/register" className="home-btn">Create Account</Link>
          </div>
          <div className="home-stats" aria-label="Platform stats">
            <div><strong>30+</strong><span>Demo projects</span></div>
            <div><strong>8</strong><span>Work categories</span></div>
            <div><strong>AI</strong><span>Profile matching</span></div>
          </div>
        </div>

        <div className="home-hero__right">
          <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop" alt="People planning work on laptops" />
          <div className="home-floating-panel">
            <span>Top match</span>
            <strong>92%</strong>
            <p>React + PostgreSQL contributor for dashboard task</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <div>
            <span className="home-kicker">Live-style marketplace</span>
            <h2>Featured projects ready for matching</h2>
          </div>
          <Link to="/taskbrowser" className="home-text-link">View all projects</Link>
        </div>

        <div className="home-job-grid">
          {featuredJobs.map((job) => (
            <article className="home-job" key={job.title}>
              <div>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>
              <strong>{job.budget}</strong>
              <div className="home-job-tags">
                {job.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-band">
        <div>
          <span className="home-kicker">How it works</span>
          <h2>From CV to matched project teams</h2>
        </div>
        <div className="home-steps">
          <article><span>1</span><h3>Auto-complete profile</h3><p>Upload a CV, then refine skills, budget range, links, and availability.</p></article>
          <article><span>2</span><h3>Post projects</h3><p>Requesters add requirements, responsibilities, budget, and skill tags.</p></article>
          <article><span>3</span><h3>Collaborate and resolve</h3><p>Accepted contributors work in teams, chat, send updates, and open tickets when needed.</p></article>
        </div>
      </section>

      <section className="home-section home-categories">
        <div>
          <span className="home-kicker">Coverage</span>
          <h2>Work categories for the demo dataset</h2>
        </div>
        <div className="home-category-list">
          {categories.map((category) => <span key={category}>{category}</span>)}
        </div>
      </section>
    </Motion.div>
  );
}

export default HomePage;
