import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { generateEmbedding } from "../services/embedding.js";
import db from "../../models/index.cjs";

const { Candidate, Job, Skill } = db;

async function generateEmbeddingsForCandidates() {

  const candidates = await Candidate.findAll({
    include: [{ model: Skill, through: { attributes: [] } }],
  });

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const candidate of candidates) {
    if (candidate.embedding && candidate.embedding.length > 0) {
      skipped++;
      continue;
    }

    const skills = candidate.Skills?.map((s) => s.name).join(", ") || "";
    const text =
      candidate.cv_raw_text ||
      `${candidate.name} | ${skills} | ${candidate.about_me || ""} | ${candidate.experience_years || 0} ani experiență`;

    if (!text || text.trim().length < 10) {
      errors++;
      continue;
    }

    try {
      const embedding = await generateEmbedding(text);
      await candidate.update({ embedding });
      generated++;
    } catch (e) {
      errors++;
    }
  }

  return { generated, skipped, errors };
}

async function generateEmbeddingsForJobs() {

  const jobs = await Job.findAll({
    include: [{ model: Skill, through: { attributes: [] } }],
  });

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const job of jobs) {
    if (job.embedding && job.embedding.length > 0) {
      skipped++;
      continue;
    }

    const skills = job.Skills?.map((s) => s.name).join(", ") || "";
    const text = `${job.title} | ${job.description} | ${job.requirements || ""} | ${skills}`;

    if (!text || text.trim().length < 10) {
      errors++;
      continue;
    }

    try {
      const embedding = await generateEmbedding(text);
      await job.update({ embedding });
      generated++;
    } catch (e) {
      errors++;
    }
  }

  return { generated, skipped, errors };
}

async function main() {

  try {
    await db.sequelize.authenticate();

    const candidateStats = await generateEmbeddingsForCandidates();
    const jobStats = await generateEmbeddingsForJobs();

   
  } catch (e) {
  } finally {
    await db.sequelize.close();
  }
}

main();
