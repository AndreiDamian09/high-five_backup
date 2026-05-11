import dotenv from "dotenv";
import db from "../../models/index.cjs";
import { generateEmbedding } from "../services/embedding.js";

dotenv.config();

const { Employer, Job, Skill, JobSkill } = db;

const employerIds = [
  "22222222-0000-0000-0000-000000000001",
  "22222222-0000-0000-0000-000000000002",
  "22222222-0000-0000-0000-000000000003",
  "22222222-0000-0000-0000-000000000004",
  "22222222-0000-0000-0000-000000000005",
  "22222222-0000-0000-0000-000000000006",
];

const mockJobs = [
  {
    id: "66666666-0000-0000-0000-000000000001",
    title: "Build Candidate Profile Wizard",
    description: "Create a multi-step React profile wizard for contributors. It should collect skills, work preferences, links, availability, and salary expectations with clean validation.",
    requirements: "React, controlled forms, responsive CSS, API integration, form validation",
    responsibilities: "Build reusable form sections, connect PATCH profile endpoint, handle loading states, polish mobile layout",
    industry: "IT & Software",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 900,
    salary_max: 1400,
    skills: ["React", "JavaScript", "CSS", "API Integration"],
  },
  {
    id: "66666666-0000-0000-0000-000000000002",
    title: "Design Marketplace Job Cards",
    description: "Design a compact but information-rich job card system for a marketplace dashboard. Cards must support salary, tags, employer details, and remote indicators.",
    requirements: "Figma, UI systems, marketplace UX, component variants",
    responsibilities: "Create card variants, define spacing and typography, deliver developer-ready Figma components",
    industry: "Design & Creativitate",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 600,
    salary_max: 1000,
    skills: ["Figma", "UI Design", "UX Research"],
  },
  {
    id: "66666666-0000-0000-0000-000000000003",
    title: "PostgreSQL Matching Query Optimization",
    description: "Review and optimize PostgreSQL queries used for job matching and dashboards. Focus on indexes, joins, and response time for growing datasets.",
    requirements: "PostgreSQL, query plans, indexes, Sequelize, backend profiling",
    responsibilities: "Audit slow queries, propose indexes, tune Sequelize includes, document before and after results",
    industry: "IT & Software",
    job_type: "contract",
    experience_level: "senior",
    salary_min: 1200,
    salary_max: 2000,
    skills: ["PostgreSQL", "Sequelize", "Node.js", "Performance"],
  },
  {
    id: "66666666-0000-0000-0000-000000000004",
    title: "Write Product Launch Email Sequence",
    description: "Create a five-email launch sequence for a B2B SaaS product. Tone should be clear, useful, and conversion-focused without sounding pushy.",
    requirements: "Email copywriting, B2B SaaS, segmentation, A/B test ideas",
    responsibilities: "Write subject lines, body copy, CTA variants, and notes for automation triggers",
    industry: "Vânzări & Marketing",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 500,
    salary_max: 850,
    skills: ["Copywriting", "Email Marketing", "Marketing Strategy"],
  },
  {
    id: "66666666-0000-0000-0000-000000000005",
    title: "Clean And Analyze Survey Dataset",
    description: "Clean a customer survey CSV and produce a simple analysis report with charts, segments, and recommendations for product improvements.",
    requirements: "Python, Pandas, data cleaning, charts, concise reporting",
    responsibilities: "Normalize data, handle missing values, create charts, write a short insight report",
    industry: "Financiar & Contabilitate",
    job_type: "contract",
    experience_level: "entry",
    salary_min: 400,
    salary_max: 700,
    skills: ["Python", "Pandas", "Data Analysis", "Excel"],
  },
  {
    id: "66666666-0000-0000-0000-000000000006",
    title: "Customer Support Knowledge Base Setup",
    description: "Build a help-center structure for a small SaaS app. Include categories, article outlines, FAQ entries, and tone guidelines.",
    requirements: "Customer support, documentation, SaaS workflows, clear writing",
    responsibilities: "Create information architecture, draft 12 starter articles, define escalation labels",
    industry: "Client Service & Support",
    job_type: "part-time",
    experience_level: "entry",
    salary_min: 350,
    salary_max: 600,
    skills: ["Customer Support", "Documentation", "Technical Writing"],
  },
  {
    id: "66666666-0000-0000-0000-000000000007",
    title: "Implement Stripe Subscription Flow",
    description: "Add a subscription checkout and billing portal flow to a Node and React application using Stripe Checkout.",
    requirements: "Stripe, Node.js, React, webhooks, secure API design",
    responsibilities: "Create checkout endpoint, handle webhook events, update UI states, document environment variables",
    industry: "IT & Software",
    job_type: "contract",
    experience_level: "senior",
    salary_min: 1500,
    salary_max: 2400,
    skills: ["Stripe", "Node.js", "React", "Webhooks"],
  },
  {
    id: "66666666-0000-0000-0000-000000000008",
    title: "Create Social Ads Visual Pack",
    description: "Design a set of static ad creatives for Instagram, LinkedIn, and Facebook for a professional services campaign.",
    requirements: "Graphic design, ad formats, brand consistency, fast iteration",
    responsibilities: "Create 12 ad variations, export platform sizes, prepare editable source files",
    industry: "Design & Creativitate",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 450,
    salary_max: 800,
    skills: ["Photoshop", "Canva", "Brand Design", "Social Media"],
  },
  {
    id: "66666666-0000-0000-0000-000000000009",
    title: "QA Test Plan For Web App",
    description: "Create and execute a QA test plan for a job marketplace app. Cover auth, profile editing, job posting, application flow, and responsive layout.",
    requirements: "Manual QA, test cases, bug reporting, browser testing",
    responsibilities: "Write test cases, execute flows, document bugs with reproduction steps, retest fixes",
    industry: "IT & Software",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 500,
    salary_max: 900,
    skills: ["QA Testing", "Bug Reporting", "Playwright"],
  },
  {
    id: "66666666-0000-0000-0000-000000000010",
    title: "Financial Excel Model Cleanup",
    description: "Clean up an existing Excel model for a small business forecast. Improve formulas, formatting, assumptions, and summary tabs.",
    requirements: "Excel, financial modeling, formulas, scenario planning",
    responsibilities: "Review formulas, add assumptions sheet, improve charts, document model usage",
    industry: "Financiar & Contabilitate",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 550,
    salary_max: 950,
    skills: ["Excel", "Financial Modeling", "Data Analysis"],
  },
  {
    id: "66666666-0000-0000-0000-000000000011",
    title: "Translate App UI To Romanian",
    description: "Translate web app interface strings from English to Romanian while keeping product tone natural and concise.",
    requirements: "Romanian fluency, English fluency, product localization, attention to context",
    responsibilities: "Translate UI strings, suggest shorter labels, flag ambiguous product copy",
    industry: "Educație",
    job_type: "contract",
    experience_level: "entry",
    salary_min: 300,
    salary_max: 550,
    skills: ["Translation", "Localization", "Romanian"],
  },
  {
    id: "66666666-0000-0000-0000-000000000012",
    title: "React Native Bug Fix Sprint",
    description: "Fix a set of UI and state bugs in a React Native mobile app. Issues include keyboard overlap, stale profile data, and inconsistent loading states.",
    requirements: "React Native, mobile debugging, state management, API integration",
    responsibilities: "Fix assigned bugs, test on iOS and Android, submit concise implementation notes",
    industry: "IT & Software",
    job_type: "contract",
    experience_level: "mid",
    salary_min: 1000,
    salary_max: 1600,
    skills: ["React Native", "JavaScript", "Mobile UI", "API Integration"],
  },
];

function jobEmbeddingText(job) {
  return [
    job.title,
    job.description,
    job.requirements,
    job.responsibilities,
    job.industry,
    job.job_type,
    job.experience_level,
    job.skills.join(", "),
  ].join(" | ");
}

async function main() {
  await db.sequelize.authenticate();

  let employers = await Employer.findAll({ where: { id: employerIds } });
  if (employers.length === 0) {
    employers = await Employer.findAll();
  }
  if (employers.length === 0) {
    throw new Error("No employers found. Create/register at least one requester before seeding mock jobs.");
  }

  let created = 0;
  let updated = 0;

  for (const [index, mockJob] of mockJobs.entries()) {
    const employer = employers[index % employers.length];
    let embedding = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        embedding = await generateEmbedding(jobEmbeddingText(mockJob));
      } catch (error) {
        console.warn(`Embedding skipped for ${mockJob.title}: ${error.message}`);
      }
    }

    const [job, wasCreated] = await Job.findOrCreate({
      where: { id: mockJob.id },
      defaults: {
        id: mockJob.id,
        employer_id: employer.id,
        title: mockJob.title,
        description: mockJob.description,
        requirements: mockJob.requirements,
        responsibilities: mockJob.responsibilities,
        industry: mockJob.industry,
        location: "Remote",
        is_remote: true,
        job_type: mockJob.job_type,
        experience_level: mockJob.experience_level,
        salary_min: mockJob.salary_min,
        salary_max: mockJob.salary_max,
        salary_currency: "RON",
        benefits: ["Remote work", "Flexible schedule", "Clear deliverables"],
        status: "active",
        views_count: 40 + index * 17,
        applications_count: 1 + (index % 8),
        expires_at: "2026-06-30",
        embedding,
      },
    });

    if (!wasCreated) {
      await job.update({
        title: mockJob.title,
        description: mockJob.description,
        requirements: mockJob.requirements,
        responsibilities: mockJob.responsibilities,
        industry: mockJob.industry,
        salary_min: mockJob.salary_min,
        salary_max: mockJob.salary_max,
        embedding: embedding || job.embedding,
        status: "active",
      });
      updated++;
    } else {
      created++;
    }

    for (const skillName of mockJob.skills) {
      const [skill] = await Skill.findOrCreate({
        where: { name: skillName },
        defaults: { category: "mock" },
      });
      await JobSkill.findOrCreate({
        where: { job_id: job.id, skill_id: skill.id },
        defaults: { job_id: job.id, skill_id: skill.id, is_required: true, min_proficiency: 3 },
      });
    }
  }

  console.log(`Mock jobs seeded. Created: ${created}. Updated: ${updated}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.sequelize.close();
  });
