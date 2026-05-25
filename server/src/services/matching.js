import { cosinusSimilarity } from "./embedding.js";
import db from "../../models/index.cjs";

const { Candidate, Job, Skill, Employer } = db;

export async function findCandidatesForJob(jobId, limit = 5, minScore = 0.6) {
  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new Error(`Job-ul cu id ul ${jobId} nu exista`);
  }

  if (!job.embedding) {
    throw new Error(`Job-ul ${jobId} nu are embedding`);
  }

  const candidates = await Candidate.findAll({
    where: { is_open_to_work: true },
    include: [{ model: Skill, through: { attributes: [] } }],
  });

  const matches = candidates
    .filter((c) => c.embedding)
    .map((candidate) => {
      const skills = candidate.Skills?.map((s) => s.name) || [];

      return {
        id: candidate.id,
        name: candidate.name,
        skills: skills,
        experience_years: candidate.experience_years,
        city: candidate.city,
        score: cosinusSimilarity(candidate.embedding, job.embedding),
      };
    });

  return matches
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function findJobsForCandidate(candidateId, limit = 5, minScore = 0.6) {
  const candidate = await Candidate.findByPk(candidateId, {
    include: [{ model: Skill, through: { attributes: [] } }],
  });

  if (!candidate) {
    throw new Error(`Candidatul cu id ul ${candidateId} nu a fost gasit`);
  }

  if (!candidate.embedding) {
    throw new Error(`Candidatul ${candidateId} nu are embedding`);
  }

  const jobs = await Job.findAll({
    where: { status: "active" },
    include: [
      { model: Skill, through: { attributes: [] } },
      { model: Employer, attributes: ["company_name"] },
    ],
  });

  const matches = jobs
    .filter((j) => j.embedding)
    .map((job) => {
      const skills = job.Skills?.map((s) => s.name) || [];

      return {
        id: job.id,
        title: job.title,
        company: job.Employer?.company_name,
        location: job.location,
        skills: skills,
        industry: job.industry,
        score: cosinusSimilarity(candidate.embedding, job.embedding),
      };
    });

  return matches
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
