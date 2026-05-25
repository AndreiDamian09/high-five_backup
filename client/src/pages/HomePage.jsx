import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./home.css";

const featuredJobs = [
  {
    title: "React Dashboard Builder",
    company: "FinTech Solutions",
    budget: "650-950 RON",
    tags: ["React", "Charts", "API"],
  },
  {
    title: "UX Review For SaaS Flow",
    company: "Digital Agency Pro",
    budget: "450-700 RON",
    tags: ["Figma", "UX", "Audit"],
  },
  {
    title: "Python Data Cleanup Script",
    company: "StartupX",
    budget: "500-800 RON",
    tags: ["Python", "CSV", "Automation"],
  },
];

const categories = [
  "Software",
  "Design",
  "Marketing",
  "Data",
  "Support",
  "Finance",
];

const steps = [
  {
    n: "1",
    title: "Auto-complete profile",
    text: "Upload a CV, then refine skills, budget range, links, and availability.",
  },
  {
    n: "2",
    title: "Post projects",
    text: "Requesters add requirements, responsibilities, budget, and skill tags.",
  },
  {
    n: "3",
    title: "Collaborate and resolve",
    text: "Accepted contributors work in teams, chat, send updates, and open tickets when needed.",
  },
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
const heroRight = {
  hidden: { opacity: 0, x: 50, scale: 0.97 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
  },
};

const sectionContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};
const sectionItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const chipContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const chipItem = {
  hidden: { opacity: 0, scale: 0.75 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
};

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="home-page"
    >
      <section className="home-hero">
        <motion.div
          className="home-hero__left"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={heroItem} className="home-badge">
            AI crowdsourcing platform
          </motion.span>

          <motion.h1 variants={heroItem}>
            Crowd Connect matches contributors with the right projects.
          </motion.h1>

          <motion.p variants={heroItem}>
            Requesters publish projects with budgets, contributors apply or
            negotiate, and the platform supports team collaboration, chat,
            ticketing, remuneration tracking, and achievements.
          </motion.p>

          <motion.div variants={heroItem} className="home-actions">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 14 }}
            >
              <Link to="/taskbrowser" className="home-btn home-btn--primary">
                Browse Projects
              </Link>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 14 }}
            >
              <Link to="/register" className="home-btn">
                Create Account
              </Link>
            </motion.span>
          </motion.div>

          <motion.div
            className="home-stats"
            aria-label="Platform stats"
            variants={sectionContainer}
            initial="hidden"
            animate="show"
          >
            {[
              { val: "30+", label: "Demo projects" },
              { val: "8", label: "Work categories" },
              { val: "AI", label: "Profile matching" },
            ].map((stat) => (
              <motion.div
                key={stat.val}
                variants={sectionItem}
                whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
              >
                <strong>{stat.val}</strong>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="home-hero__right"
          variants={heroRight}
          initial="hidden"
          animate="show"
        >
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop"
            alt="People planning work on laptops"
          />
          <motion.div
            className="home-floating-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: [24, 0, -7, 0, -7, 0],
            }}
            transition={{
              opacity: { duration: 0.45, delay: 0.7, ease: "easeOut" },
              y: {
                duration: 5,
                delay: 0.7,
                times: [0, 0.18, 0.46, 0.6, 0.78, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.2,
              },
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          >
            <span>Top match</span>
            <strong>92%</strong>
            <p>React + PostgreSQL contributor for dashboard task</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="home-section">
        <motion.div
          className="home-section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div>
            <span className="home-kicker">Live-style marketplace</span>
            <h2>Featured projects ready for matching</h2>
          </div>
          <Link to="/taskbrowser" className="home-text-link">
            View all projects
          </Link>
        </motion.div>

        <motion.div
          className="home-job-grid"
          variants={sectionContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {featuredJobs.map((job) => (
            <motion.article
              className="home-job"
              key={job.title}
              variants={sectionItem}
              whileHover={{
                y: -5,
                boxShadow: "0 22px 52px rgba(15, 23, 42, 0.13)",
              }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
            >
              <div>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>
              <strong>{job.budget}</strong>
              <div className="home-job-tags">
                {job.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="home-band">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="home-kicker">How it works</span>
          <h2>From CV to matched project teams</h2>
        </motion.div>

        <motion.div
          className="home-steps"
          variants={sectionContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {steps.map((step) => (
            <motion.article
              key={step.n}
              variants={sectionItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="home-section home-categories">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="home-kicker">Coverage</span>
          <h2>Work categories for the demo dataset</h2>
        </motion.div>

        <motion.div
          className="home-category-list"
          variants={chipContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.span
              key={category}
              variants={chipItem}
              whileHover={{ scale: 1.1, transition: { duration: 0.18 } }}
            >
              {category}
            </motion.span>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}

export default HomePage;
