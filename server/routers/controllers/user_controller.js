import { parseFile } from "../../src/services/parser.js";
import { generateEmbedding } from "../../src/services/embedding.js";
import { findCandidatesForJob, findJobsForCandidate } from "../../src/services/matching.js";
import db from "../../models/index.cjs";
const {
  Candidate,
  Employer,
  Job,
  Skill,
  JobSkill,
  Application,
  User,
  Team,
  TeamMember,
  ChatMessage,
  SupportTicket,
  Achievement,
} = db;
const { Op } = db.Sequelize;

async function getCandidateForUser(userId) {
  return Candidate.findOne({ where: { user_id: userId } });
}

async function getEmployerForUser(userId) {
  return Employer.findOne({ where: { user_id: userId } });
}

function splitList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCandidateEmbeddingText(candidateData, skills = []) {
  const skillText = skills
    .map((skill) => `${skill.name} proficiency ${skill.proficiency_level || 3}/5 ${skill.years_experience || 0} years`)
    .join(" | ");

  return [
    candidateData.name,
    candidateData.about_me,
    `Experience years: ${candidateData.experience_years || 0}`,
    candidateData.education,
    `Preferred industries: ${splitList(candidateData.preferred_industries).join(", ")}`,
    `Preferred locations: ${splitList(candidateData.preferred_locations).join(", ")}`,
    `Expected salary: ${candidateData.expected_salary_min || ""}-${candidateData.expected_salary_max || ""}`,
    `Availability: ${candidateData.available_from || ""}`,
    candidateData.cv_raw_text,
    `Skills: ${skillText}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function firstMatch(text, regex) {
  const match = text.match(regex);
  return match?.[1]?.trim() || match?.[0]?.trim() || null;
}

function normalizePhone(value) {
  if (!value) return null;
  const compact = String(value)
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");

  const digitsOnly = compact.replace(/\D/g, "");
  const looksLikeYearRange = /(?:19|20)\d{2}.*(?:19|20)\d{2}/.test(digitsOnly);
  if (compact.length < 7 || compact.length > 15 || looksLikeYearRange) return null;
  return compact.slice(0, 20);
}

function compactSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function cleanUrl(value) {
  if (!value) return null;
  return value.replace(/[),.;\]]+$/g, "").trim();
}

function extractLargestEmbeddedImageDataUrl(fileBuffer, mimeType) {
  if (mimeType !== "application/pdf") return null;

  const candidates = [];
  const signatures = [
    { type: "image/jpeg", start: Buffer.from([0xff, 0xd8]), end: Buffer.from([0xff, 0xd9]) },
    {
      type: "image/png",
      start: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      end: Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]),
    },
  ];

  for (const signature of signatures) {
    let cursor = 0;
    while (cursor < fileBuffer.length) {
      const start = fileBuffer.indexOf(signature.start, cursor);
      if (start === -1) break;
      const end = fileBuffer.indexOf(signature.end, start + signature.start.length);
      if (end === -1) break;

      const imageEnd = end + signature.end.length;
      const image = fileBuffer.subarray(start, imageEnd);
      if (image.length > 8_000) {
        candidates.push({ type: signature.type, image });
      }
      cursor = imageEnd;
    }
  }

  if (candidates.length === 0) return null;
  const best = candidates.sort((a, b) => b.image.length - a.image.length)[0];
  return `data:${best.type};base64,${best.image.toString("base64")}`;
}

function normalizeCvText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .replace(/([a-z])([A-Z][a-z])/g, "$1\n$2")
    .replace(/(Telefon|Phone|Mobile|Email|LinkedIn|Github|GitHub|Educatie|Education|Experienta|Experience|Skills|Skill-uri|Competente|Competențe|Proiecte|Projects)/gi, "\n$1")
    .replace(/[ \t]+/g, " ");
}

function sectionText(lines, startRegex, stopRegexes = []) {
  const startIndex = lines.findIndex((line) => startRegex.test(line));
  if (startIndex === -1) return "";

  const collected = [];
  for (const line of lines.slice(startIndex + 1)) {
    if (stopRegexes.some((regex) => regex.test(line))) break;
    collected.push(line);
  }
  return collected.join("\n").trim();
}

function extractPhone(lines, text) {
  const labeledLine = lines.find((line) => /(telefon|phone|mobile|tel\.?)/i.test(line));
  const labeledPhone = labeledLine ? firstMatch(labeledLine, /(?:\+?\d[\d\s().-]{6,}\d)/) : null;
  if (normalizePhone(labeledPhone)) return normalizePhone(labeledPhone);

  const candidates = [...text.matchAll(/(?:\+?\d[\d ().-]{6,}\d)/g)]
    .map((match) => normalizePhone(match[0]))
    .filter(Boolean);

  return candidates.find((candidate) => !/^(19|20)\d{6,}$/.test(candidate.replace(/\D/g, ""))) || null;
}

function extractName(lines) {
  const blocked = /(cv|curriculum|resume|email|telefon|phone|linkedin|github|portofoliu|portfolio|educatie|education|skills|skill-uri|competente|competențe|abilitati|abilități|aptitudini|limbi|language|experience|experienta|despre|profil|summary|projects|proiecte)/i;
  return lines.find((line) => {
    const cleaned = compactSpaces(line);
    const words = cleaned.split(" ");
    return cleaned.length >= 5 &&
      cleaned.length <= 60 &&
      words.length >= 2 &&
      words.length <= 4 &&
      words.every((word) => /^[A-ZĂÂÎȘȚ][a-zăâîșțA-ZĂÂÎȘȚ'.-]+$/.test(word)) &&
      !blocked.test(cleaned) &&
      !cleaned.includes("@") &&
      !/https?:\/\//i.test(cleaned) &&
      !/\d/.test(cleaned);
  }) || null;
}

function extractAbout(lines) {
  const summary = sectionText(lines, /(summary|profile|profil|despre)/i, [
    /(skills|skill-uri|competente|educatie|education|experience|experienta|projects|proiecte)/i,
  ]);
  if (summary) return summary.slice(0, 900);

  const blocked = /(telefon|phone|email|linkedin|github|educatie|education|skills|skill-uri|competente|facultate|universitate|university|20\d{2}|19\d{2})/i;
  return lines
    .filter((line) => line.length > 30 && !blocked.test(line))
    .slice(0, 4)
    .join("\n")
    .slice(0, 900) || null;
}

function extractEducation(lines) {
  const educationSection = sectionText(lines, /(educatie|education|studii)/i, [
    /(skills|skill-uri|competente|experience|experienta|projects|proiecte|certificari|certifications)/i,
  ]);

  const sourceLines = educationSection ? educationSection.split("\n") : lines;
  return sourceLines
    .filter((line) => /(universitate|university|facultate|licenta|master|bachelor|degree|college|academy|ase|cibernetica|cibernetic)/i.test(line))
    .map(compactSpaces)
    .filter(Boolean)
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 4)
    .join("\n") || null;
}

function extractCandidateDataFromCv(text, knownSkills = []) {
  const cleanText = normalizeCvText(text);
  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const nameLine = extractName(lines);

  const phone = extractPhone(lines, cleanText);
  const linkedin_url = cleanUrl(firstMatch(cleanText, /(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/i));
  const github_url = cleanUrl(firstMatch(cleanText, /(https?:\/\/(?:www\.)?github\.com\/[^\s]+)/i));
  const portfolio_url = cleanUrl(firstMatch(cleanText, /(https?:\/\/(?!.*(?:linkedin|github))[^\s]+)/i));

  const yearsFromText = [
    ...cleanText.matchAll(/(\d{1,2})\+?\s*(?:years|yrs|ani)\s+(?:of\s+)?(?:experience|experienta|experiență)/gi),
  ].map((match) => Number(match[1]));
  const experience_years = yearsFromText.length ? Math.max(...yearsFromText) : 0;
  const about_me = extractAbout(lines);
  const education = extractEducation(lines);

  const educationLines = lines.filter((line) =>
    /(university|universitate|facultate|licenta|licență|master|bachelor|degree|college|academy)/i.test(line)
  );

  const detectedSkills = knownSkills
    .filter((skill) => {
      const escaped = skill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(cleanText);
    })
    .map((skill) => ({
      name: skill.name,
      category: skill.category || "other",
      proficiency_level: experience_years >= 5 ? 4 : 3,
      years_experience: experience_years,
    }));

  const fallbackSkills = [
    "React", "JavaScript", "TypeScript", "Node.js", "Express", "PostgreSQL", "SQL",
    "Python", "Java", "Spring", "Docker", "AWS", "HTML", "CSS", "Figma",
  ];

  for (const name of fallbackSkills) {
    if (!detectedSkills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(cleanText)) {
        detectedSkills.push({ name, category: "other", proficiency_level: 3, years_experience: experience_years });
      }
    }
  }

  return {
    data: {
      name: nameLine,
      phone,
      linkedin_url,
      github_url,
      portfolio_url,
      about_me,
      experience_years,
      education,
    },
    skills: detectedSkills,
  };
}

const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Niciun fișier încărcat." });
    }

    console.log(`📥 Procesare fișier: ${req.file.originalname}`);

    const parsedText = await parseFile(req.file.buffer, req.file.mimetype);
    const cvPhoto = extractLargestEmbeddedImageDataUrl(req.file.buffer, req.file.mimetype);

    // Generează embedding din textul parsat
    const embedding = await generateEmbedding(parsedText);

    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot încărca CV-uri." });
    }

    const candidateData = {
      name: req.body.name || "Candidat (Upload)",
      city: req.body.city || null,
      country: req.body.country || "România",
      phone: normalizePhone(req.body.phone),
      about_me: req.body.about_me || null,
      experience_years: req.body.experience_years || 0,
      cv_raw_text: parsedText,
      embedding,
    };

    let candidate = await getCandidateForUser(req.user.id);
    if (candidate) {
      await candidate.update({ ...candidateData, cv_raw_text: parsedText, embedding });
    } else {
      candidate = await Candidate.create({ ...candidateData, user_id: req.user.id });
    }

    res.json({
      success: true,
      id: candidate.id,
      message: "CV parsat și salvat cu succes!",
    });
  } catch (error) {
    console.error("Eroare upload:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadCVAuto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Niciun fisier incarcat." });
    }

    const parsedText = await parseFile(req.file.buffer, req.file.mimetype);
    const cvPhoto = extractLargestEmbeddedImageDataUrl(req.file.buffer, req.file.mimetype);

    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot incarca CV-uri." });
    }

    const knownSkills = await Skill.findAll({ attributes: ["name", "category"] });
    const extracted = extractCandidateDataFromCv(parsedText, knownSkills);
    const candidate = await getCandidateForUser(req.user.id);

    const candidateData = {
      name: req.body.name || extracted.data.name || candidate?.name || "Candidat (Upload)",
      city: req.body.city || candidate?.city || null,
      country: req.body.country || candidate?.country || "Romania",
      phone: normalizePhone(req.body.phone || extracted.data.phone || candidate?.phone),
      linkedin_url: extracted.data.linkedin_url || candidate?.linkedin_url || null,
      github_url: extracted.data.github_url || candidate?.github_url || null,
      portfolio_url: extracted.data.portfolio_url || candidate?.portfolio_url || null,
      about_me: req.body.about_me || extracted.data.about_me || candidate?.about_me || null,
      experience_years: req.body.experience_years || extracted.data.experience_years || candidate?.experience_years || 0,
      education: extracted.data.education || candidate?.education || null,
      profile_picture_url: cvPhoto || candidate?.profile_picture_url || null,
      cv_raw_text: parsedText,
    };

    const embedding = await generateEmbedding(buildCandidateEmbeddingText(candidateData, extracted.skills));
    candidateData.embedding = embedding;

    let savedCandidate = candidate;
    if (savedCandidate) {
      await savedCandidate.update(candidateData);
    } else {
      savedCandidate = await Candidate.create({ ...candidateData, user_id: req.user.id });
    }

    if (extracted.skills.length > 0) {
      await db.CandidateSkill.destroy({ where: { candidate_id: savedCandidate.id } });
      for (const sk of extracted.skills) {
        const [skill] = await Skill.findOrCreate({
          where: { name: sk.name },
          defaults: { category: sk.category || "other" },
        });
        await db.CandidateSkill.create({
          candidate_id: savedCandidate.id,
          skill_id: skill.id,
          proficiency_level: sk.proficiency_level,
          years_experience: sk.years_experience,
        });
      }
    }

    const profile = await Candidate.findByPk(savedCandidate.id, {
      include: [{ model: Skill, through: { attributes: ["proficiency_level", "years_experience"] } }],
    });

    res.json({
      success: true,
      id: savedCandidate.id,
      profile,
      extracted,
      photoExtracted: !!cvPhoto,
      message: cvPhoto
        ? "CV parsat, poza extrasa, profil completat si embedding regenerat."
        : "CV parsat, profil completat si embedding regenerat.",
    });
  } catch (error) {
    console.error("Eroare upload:", error);
    res.status(500).json({ error: error.message });
  }
};

const jobAdder = async (req, res, next) => {
  try {
    const {
      title, description, requirements, responsibilities,
      industry, location, is_remote, job_type, experience_level,
      salary_min, salary_max, salary_currency, benefits, skills, expires_at,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "title și description sunt obligatorii." });
    }

    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Doar requesterii pot adăuga job-uri." });
    }

    const employer = await getEmployerForUser(req.user.id);
    if (!employer) {
      return res.status(404).json({ error: "Employer-ul nu a fost găsit." });
    }

    // Generează embedding din descrierea jobului
    const embeddingText = [
      title,
      description,
      requirements,
      responsibilities,
      industry,
      location,
      job_type,
      experience_level,
      Array.isArray(benefits) ? benefits.join(", ") : benefits,
      Array.isArray(skills) ? skills.map((skill) => skill.name).join(", ") : "",
    ].filter(Boolean).join(" | ");
    const embedding = await generateEmbedding(embeddingText);

    const job = await Job.create({
      employer_id: employer.id, title, description, requirements, responsibilities,
      industry, location, is_remote, job_type, experience_level,
      salary_min, salary_max, salary_currency, benefits, expires_at,
      embedding,
    });

    // Asociază skills dacă sunt trimise (array de { name, is_required, min_proficiency })
    if (skills && Array.isArray(skills)) {
      for (const sk of skills) {
        const [skill] = await Skill.findOrCreate({
          where: { name: sk.name },
          defaults: { category: sk.category || "other" },
        });
        await JobSkill.create({
          job_id: job.id,
          skill_id: skill.id,
          is_required: sk.is_required ?? true,
          min_proficiency: sk.min_proficiency ?? 3,
        });
      }
    }

    console.log(`✅ Job adăugat: ${title}`);
    res.json({ success: true, id: job.id, message: "Job adăugat!" });
  } catch (e) {
    console.error("Eroare adăugare job:", e);
    res.status(500).json({ error: e.message });
  }
};

const getMyContributorProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot accesa profilul." });
    }

    const candidate = await Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Skill, through: { attributes: ["proficiency_level", "years_experience"] } }],
    });

    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });
    res.json(candidate);
  } catch (e) {
    console.error("Eroare profil contributor:", e);
    res.status(500).json({ error: e.message });
  }
};

const updateMyContributorProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot modifica profilul." });
    }

    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const allowedFields = [
      "name", "phone", "city", "country", "linkedin_url", "github_url", "portfolio_url",
      "about_me", "experience_years", "education", "preferred_industries", "preferred_locations",
      "expected_salary_min", "expected_salary_max", "available_from", "is_open_to_work", "profile_picture_url",
    ];

    const candidateData = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        candidateData[field] = req.body[field];
      }
    }

    candidateData.experience_years = Number(candidateData.experience_years ?? candidate.experience_years ?? 0);
    if (candidateData.expected_salary_min !== undefined && candidateData.expected_salary_min !== "" && candidateData.expected_salary_min !== null) {
      candidateData.expected_salary_min = Number(candidateData.expected_salary_min);
    }
    if (candidateData.expected_salary_max !== undefined && candidateData.expected_salary_max !== "" && candidateData.expected_salary_max !== null) {
      candidateData.expected_salary_max = Number(candidateData.expected_salary_max);
    }
    if (candidateData.preferred_industries !== undefined) {
      candidateData.preferred_industries = splitList(candidateData.preferred_industries);
    }
    if (candidateData.preferred_locations !== undefined) {
      candidateData.preferred_locations = splitList(candidateData.preferred_locations);
    }

    const incomingSkills = Array.isArray(req.body.skills) ? req.body.skills : [];
    const normalizedSkills = incomingSkills
      .map((skill) => ({
        name: String(skill.name || "").trim(),
        category: skill.category || "other",
        proficiency_level: Number(skill.proficiency_level || 3),
        years_experience: Number(skill.years_experience || 0),
      }))
      .filter((skill) => skill.name);

    const embeddingText = buildCandidateEmbeddingText(
      { ...candidate.get({ plain: true }), ...candidateData },
      normalizedSkills
    );
    candidateData.embedding = await generateEmbedding(embeddingText);

    await candidate.update(candidateData);

    if (normalizedSkills.length > 0 || Object.prototype.hasOwnProperty.call(req.body, "skills")) {
      await db.CandidateSkill.destroy({ where: { candidate_id: candidate.id } });
      for (const sk of normalizedSkills) {
        const [skill] = await Skill.findOrCreate({
          where: { name: sk.name },
          defaults: { category: sk.category },
        });
        await db.CandidateSkill.create({
          candidate_id: candidate.id,
          skill_id: skill.id,
          proficiency_level: Math.min(5, Math.max(1, sk.proficiency_level)),
          years_experience: Math.max(0, sk.years_experience),
        });
      }
    }

    const updated = await Candidate.findByPk(candidate.id, {
      include: [{ model: Skill, through: { attributes: ["proficiency_level", "years_experience"] } }],
    });

    res.json({ success: true, profile: updated, message: "Profil salvat si embedding regenerat." });
  } catch (e) {
    console.error("Eroare update profil contributor:", e);
    res.status(500).json({ error: e.message });
  }
};

const uploadMyContributorPhoto = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Only contributors can update profile photos." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Upload a valid image file." });
    }

    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Contributor profile not found." });

    const profile_picture_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    await candidate.update({ profile_picture_url });

    res.json({ success: true, profile_picture_url });
  } catch (e) {
    console.error("Eroare upload poza profil:", e);
    res.status(500).json({ error: e.message });
  }
};

const applyToJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot aplica." });
    }
    const { id: jobId } = req.params;
    const { cover_letter, proposed_budget, availability_note, negotiation_message } = req.body;

    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job-ul nu a fost găsit." });

    const [application, created] = await Application.findOrCreate({
      where: { job_id: jobId, candidate_id: candidate.id },
      defaults: {
        job_id: jobId,
        candidate_id: candidate.id,
        cover_letter: [
          cover_letter || negotiation_message || "",
          proposed_budget ? `Proposed budget: ${proposed_budget}` : "",
          availability_note ? `Availability: ${availability_note}` : "",
        ].filter(Boolean).join("\n\n") || null,
        cv_snapshot: candidate.cv_raw_text || null,
      },
    });

    if (!created) {
      return res.status(409).json({ error: "Ai aplicat deja la acest job." });
    }

    await job.increment("applications_count");
    return res.status(201).json({ success: true, applicationId: application.id });
  } catch (e) {
    console.error("Eroare aplicare job:", e);
    return res.status(500).json({ error: e.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Only requesters can update applications." });
    }

    const employer = await getEmployerForUser(req.user.id);
    if (!employer) return res.status(404).json({ error: "Requester profile not found." });

    const { status, employer_notes } = req.body;
    if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid application status." });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, attributes: ["id", "employer_id"] }],
    });
    if (!application || application.Job?.employer_id !== employer.id) {
      return res.status(404).json({ error: "Application not found for this requester." });
    }

    await application.update({
      status,
      employer_notes: employer_notes ?? application.employer_notes,
      reviewed_at: ["reviewed", "accepted", "rejected"].includes(status) ? new Date() : application.reviewed_at,
    });

    res.json({ success: true, application });
  } catch (e) {
    console.error("Eroare update aplicatie:", e);
    res.status(500).json({ error: e.message });
  }
};

const saveJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot salva job-uri." });
    }
    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job-ul nu a fost găsit." });

    const [saved, created] = await db.SavedJob.findOrCreate({
      where: { candidate_id: candidate.id, job_id: job.id },
      defaults: { candidate_id: candidate.id, job_id: job.id },
    });
    return res.status(created ? 201 : 200).json({ success: true, id: saved.id, saved: true });
  } catch (e) {
    console.error("Eroare salvare job:", e);
    return res.status(500).json({ error: e.message });
  }
};

const unsaveJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot salva job-uri." });
    }
    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    await db.SavedJob.destroy({
      where: { candidate_id: candidate.id, job_id: req.params.id },
    });
    return res.json({ success: true, saved: false });
  } catch (e) {
    console.error("Eroare unsave job:", e);
    return res.status(500).json({ error: e.message });
  }
};

const getContributorDashboard = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot accesa dashboard-ul." });
    }
    const candidate = await Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Skill, through: { attributes: [] } }],
    });
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const apps = await Application.findAll({
      where: { candidate_id: candidate.id },
      include: [{ model: Job, attributes: ["id", "title", "status", "salary_min", "salary_max", "created_at"] }],
      order: [["created_at", "DESC"]],
    });

    const accepted = apps.filter((a) => a.status === "accepted");
    const activeApps = apps.filter((a) => ["pending", "reviewed"].includes(a.status));
    const totalEarnings = accepted.reduce((sum, a) => {
      const max = a.Job?.salary_max || 0;
      const min = a.Job?.salary_min || 0;
      return sum + Math.round((max + min) / 2);
    }, 0);

    const profileStrength = Math.min(
      100,
      (candidate.profile_picture_url ? 20 : 0) +
      ((candidate.Skills?.length || 0) > 0 ? 30 : 0) +
      (candidate.about_me ? 20 : 0) +
      (candidate.cv_raw_text ? 30 : 0)
    );

    res.json({
      stats: {
        totalEarnings,
        completedTasks: accepted.length,
        activeTasks: activeApps.length,
        averageRating: 4.8,
        reviewCount: accepted.length,
        profileStrength,
      },
      activeTasks: activeApps.slice(0, 5).map((a) => ({
        id: a.id,
        title: a.Job?.title || "Untitled",
        status: a.status,
        budget: a.Job?.salary_max || a.Job?.salary_min || 0,
        progress: a.status === "reviewed" ? 65 : 40,
      })),
      profileChecklist: [
        { label: "Profile photo added", done: !!candidate.profile_picture_url },
        { label: "Skills listed", done: (candidate.Skills?.length || 0) > 0 },
        { label: "Portfolio/about completed", done: !!candidate.about_me },
        { label: "CV uploaded", done: !!candidate.cv_raw_text },
      ],
    });
  } catch (e) {
    console.error("Eroare dashboard contributor:", e);
    res.status(500).json({ error: e.message });
  }
};

const getRequesterDashboard = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Doar requesterii pot accesa dashboard-ul." });
    }
    const employer = await getEmployerForUser(req.user.id);
    if (!employer) return res.status(404).json({ error: "Profil de requester inexistent." });

    const jobs = await Job.findAll({
      where: { employer_id: employer.id },
      include: [
        {
          model: Application,
          include: [{ model: Candidate, attributes: ["id", "name"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const allApplications = jobs.flatMap((j) => j.Applications || []);
    const activeTasks = jobs.filter((j) => j.status === "active").length;
    const completedTasks = jobs.filter((j) => j.status === "closed").length;
    const totalSpent = jobs.reduce((sum, j) => {
      if (j.status !== "closed") return sum;
      const min = j.salary_min || 0;
      const max = j.salary_max || 0;
      return sum + Math.round((min + max) / 2);
    }, 0);
    const uniqueContributors = new Set(allApplications.map((a) => a.candidate_id)).size;

    const tasks = jobs.slice(0, 8).map((j) => ({
      id: j.id,
      title: j.title,
      status: j.status,
      budget: j.salary_max || j.salary_min || 0,
      applicants: j.Applications?.length || 0,
      progress: j.status === "closed" ? 100 : j.status === "paused" ? 35 : 65,
      topContributor: j.Applications?.[0]?.Candidate?.name || null,
    }));

    const recentActivity = allApplications
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        message: `${a.Candidate?.name || "Contributor"} applied for a task`,
        status: a.status,
        at: a.created_at,
      }));

    res.json({
      stats: { activeTasks, completedTasks, totalSpent, activeContributors: uniqueContributors },
      tasks,
      recentActivity,
    });
  } catch (e) {
    console.error("Eroare dashboard requester:", e);
    res.status(500).json({ error: e.message });
  }
};

const getRequesterJobs = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Doar requesterii pot accesa job-urile proprii." });
    }
    const employer = await getEmployerForUser(req.user.id);
    if (!employer) return res.status(404).json({ error: "Profil de requester inexistent." });

    const jobs = await Job.findAll({
      where: { employer_id: employer.id },
      include: [{
        model: Application,
        attributes: ["id", "status", "candidate_id", "cover_letter", "employer_notes", "created_at"],
        include: [{
          model: Candidate,
          attributes: ["id", "name", "city", "experience_years", "profile_picture_url", "about_me"],
          include: [{ model: Skill, through: { attributes: ["proficiency_level", "years_experience"] } }],
        }],
      }],
      order: [["created_at", "DESC"]],
    });
    res.json(jobs);
  } catch (e) {
    console.error("Eroare listare job-uri requester:", e);
    res.status(500).json({ error: e.message });
  }
};

const updateRequesterJobStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employer") {
      return res.status(403).json({ error: "Doar requesterii pot modifica statusul." });
    }
    const employer = await getEmployerForUser(req.user.id);
    if (!employer) return res.status(404).json({ error: "Profil de requester inexistent." });

    const { status } = req.body;
    if (!["active", "paused", "closed", "draft"].includes(status)) {
      return res.status(400).json({ error: "Status invalid." });
    }
    const job = await Job.findOne({ where: { id: req.params.id, employer_id: employer.id } });
    if (!job) return res.status(404).json({ error: "Job-ul nu a fost găsit." });
    await job.update({ status });
    res.json({ success: true, job });
  } catch (e) {
    console.error("Eroare update status job:", e);
    res.status(500).json({ error: e.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "candidate") {
      return res.status(403).json({ error: "Doar contributorii pot accesa aplicațiile." });
    }
    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });
    const applications = await Application.findAll({
      where: { candidate_id: candidate.id },
      include: [
        {
          model: Job,
          include: [{ model: Employer, attributes: ["company_name"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(applications);
  } catch (e) {
    console.error("Eroare listare aplicații:", e);
    res.status(500).json({ error: e.message });
  }
};

async function canUseProjectChat(user, jobId) {
  const job = await Job.findByPk(jobId);
  if (!job) return { allowed: false, status: 404, error: "Proiectul nu a fost gasit." };

  if (user.role === "employer") {
    const employer = await getEmployerForUser(user.id);
    if (employer && job.employer_id === employer.id) return { allowed: true, job };
  }

  if (user.role === "candidate") {
    const candidate = await getCandidateForUser(user.id);
    const application = candidate
      ? await Application.findOne({ where: { job_id: jobId, candidate_id: candidate.id } })
      : null;
    if (application) return { allowed: true, job, application };
  }

  return { allowed: false, status: 403, error: "Nu ai acces la chatul acestui proiect." };
}

const getProjectMessages = async (req, res) => {
  try {
    const access = await canUseProjectChat(req.user, req.params.id);
    if (!access.allowed) return res.status(access.status).json({ error: access.error });

    const messages = await ChatMessage.findAll({
      where: { job_id: req.params.id, channel: "project" },
      include: [{ model: User, as: "Sender", attributes: ["id", "email", "role"] }],
      order: [["created_at", "ASC"]],
      limit: 100,
    });
    res.json(messages);
  } catch (e) {
    console.error("Eroare listare mesaje proiect:", e);
    res.status(500).json({ error: e.message });
  }
};

const postProjectMessage = async (req, res) => {
  try {
    const body = String(req.body.body || "").trim();
    if (body.length < 1) return res.status(400).json({ error: "Mesajul nu poate fi gol." });

    const access = await canUseProjectChat(req.user, req.params.id);
    if (!access.allowed) return res.status(access.status).json({ error: access.error });

    const message = await ChatMessage.create({
      sender_user_id: req.user.id,
      job_id: req.params.id,
      channel: "project",
      body,
    });
    res.status(201).json({ success: true, message });
  } catch (e) {
    console.error("Eroare creare mesaj proiect:", e);
    res.status(500).json({ error: e.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: Candidate, as: "Owner", attributes: ["id", "name"] },
        { model: Candidate, as: "Members", attributes: ["id", "name"], through: { attributes: ["role"] } },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(teams);
  } catch (e) {
    console.error("Eroare listare echipe:", e);
    res.status(500).json({ error: e.message });
  }
};

const createTeam = async (req, res) => {
  try {
    if (req.user.role !== "candidate") return res.status(403).json({ error: "Doar contributorii pot crea echipe." });
    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const name = String(req.body.name || "").trim();
    if (name.length < 3) return res.status(400).json({ error: "Numele echipei trebuie sa aiba minim 3 caractere." });

    const team = await Team.create({
      owner_candidate_id: candidate.id,
      name,
      description: req.body.description || null,
      visibility: req.body.visibility === "private" ? "private" : "public",
    });
    await TeamMember.create({ team_id: team.id, candidate_id: candidate.id, role: "owner" });
    res.status(201).json({ success: true, team });
  } catch (e) {
    console.error("Eroare creare echipa:", e);
    res.status(500).json({ error: e.message });
  }
};

const joinTeam = async (req, res) => {
  try {
    if (req.user.role !== "candidate") return res.status(403).json({ error: "Doar contributorii pot intra in echipe." });
    const candidate = await getCandidateForUser(req.user.id);
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ error: "Echipa nu a fost gasita." });
    if (team.visibility === "private" && team.owner_candidate_id !== candidate.id) {
      return res.status(403).json({ error: "Echipa privata accepta membri doar prin invitatie." });
    }

    const [member] = await TeamMember.findOrCreate({
      where: { team_id: team.id, candidate_id: candidate.id },
      defaults: { team_id: team.id, candidate_id: candidate.id, role: "member" },
    });
    res.json({ success: true, member });
  } catch (e) {
    console.error("Eroare join echipa:", e);
    res.status(500).json({ error: e.message });
  }
};

async function canUseTeam(user, teamId) {
  if (user.role !== "candidate") return { allowed: false, status: 403, error: "Doar contributorii pot folosi chatul de echipa." };
  const candidate = await getCandidateForUser(user.id);
  if (!candidate) return { allowed: false, status: 404, error: "Profil de contributor inexistent." };
  const member = await TeamMember.findOne({ where: { team_id: teamId, candidate_id: candidate.id } });
  if (!member) return { allowed: false, status: 403, error: "Trebuie sa fii membru in echipa." };
  return { allowed: true, candidate, member };
}

const getTeamMessages = async (req, res) => {
  try {
    const access = await canUseTeam(req.user, req.params.id);
    if (!access.allowed) return res.status(access.status).json({ error: access.error });

    const messages = await ChatMessage.findAll({
      where: { team_id: req.params.id, channel: "team" },
      include: [{ model: User, as: "Sender", attributes: ["id", "email", "role"] }],
      order: [["created_at", "ASC"]],
      limit: 100,
    });
    res.json(messages);
  } catch (e) {
    console.error("Eroare listare mesaje echipa:", e);
    res.status(500).json({ error: e.message });
  }
};

const postTeamMessage = async (req, res) => {
  try {
    const body = String(req.body.body || "").trim();
    if (body.length < 1) return res.status(400).json({ error: "Mesajul nu poate fi gol." });

    const access = await canUseTeam(req.user, req.params.id);
    if (!access.allowed) return res.status(access.status).json({ error: access.error });

    const message = await ChatMessage.create({
      sender_user_id: req.user.id,
      team_id: req.params.id,
      channel: "team",
      body,
    });
    res.status(201).json({ success: true, message });
  } catch (e) {
    console.error("Eroare creare mesaj echipa:", e);
    res.status(500).json({ error: e.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const subject = String(req.body.subject || "").trim();
    const description = String(req.body.description || "").trim();
    if (subject.length < 3 || description.length < 5) {
      return res.status(400).json({ error: "Completeaza subiectul si descrierea tichetului." });
    }

    const ticket = await SupportTicket.create({
      opened_by_user_id: req.user.id,
      job_id: req.body.job_id || null,
      application_id: req.body.application_id || null,
      subject,
      description,
      category: req.body.category || "other",
      priority: req.body.priority || "normal",
    });
    res.status(201).json({ success: true, ticket });
  } catch (e) {
    console.error("Eroare creare ticket:", e);
    res.status(500).json({ error: e.message });
  }
};

const getMyTickets = async (req, res) => {
  try {
    let where = { opened_by_user_id: req.user.id };

    if (req.user.role === "employer") {
      const employer = await getEmployerForUser(req.user.id);
      if (employer) {
        const jobs = await Job.findAll({ where: { employer_id: employer.id }, attributes: ["id"] });
        where = { [Op.or]: [{ opened_by_user_id: req.user.id }, { job_id: jobs.map((job) => job.id) }] };
      }
    }

    const tickets = await SupportTicket.findAll({
      where,
      include: [
        { model: Job, attributes: ["id", "title"] },
        { model: User, as: "OpenedBy", attributes: ["id", "email", "role"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(tickets);
  } catch (e) {
    console.error("Eroare listare tickete:", e);
    res.status(500).json({ error: e.message });
  }
};

const submitSolutionFeedback = async (req, res) => {
  try {
    if (req.user.role !== "employer") return res.status(403).json({ error: "Doar requesterii pot valida solutii." });
    const employer = await getEmployerForUser(req.user.id);
    if (!employer) return res.status(404).json({ error: "Profil de requester inexistent." });

    const application = await Application.findByPk(req.params.id, { include: [{ model: Job }] });
    if (!application || application.Job?.employer_id !== employer.id) {
      return res.status(404).json({ error: "Aplicatia nu apartine acestui requester." });
    }

    const decision = ["accepted", "changes_requested", "rejected"].includes(req.body.decision)
      ? req.body.decision
      : "changes_requested";
    const feedback = String(req.body.feedback || "").trim();
    const note = [`Solution decision: ${decision}`, feedback ? `Feedback: ${feedback}` : ""].filter(Boolean).join("\n");

    await application.update({
      employer_notes: [application.employer_notes, note].filter(Boolean).join("\n\n"),
      reviewed_at: new Date(),
    });

    let ticket = null;
    if (req.body.open_ticket || decision === "rejected") {
      ticket = await SupportTicket.create({
        opened_by_user_id: req.user.id,
        job_id: application.job_id,
        application_id: application.id,
        subject: `Solution review: ${application.Job?.title || "project"}`,
        description: feedback || "Solutia nu corespunde cerintelor.",
        category: "solution_quality",
        priority: decision === "rejected" ? "high" : "normal",
      });
    }

    res.json({ success: true, application, ticket });
  } catch (e) {
    console.error("Eroare feedback solutie:", e);
    res.status(500).json({ error: e.message });
  }
};

const getMyAchievements = async (req, res) => {
  try {
    if (req.user.role !== "candidate") return res.status(403).json({ error: "Doar contributorii au achievements." });
    const candidate = await Candidate.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Skill, through: { attributes: [] } }],
    });
    if (!candidate) return res.status(404).json({ error: "Profil de contributor inexistent." });

    const applications = await Application.findAll({ where: { candidate_id: candidate.id } });
    const teamCount = await TeamMember.count({ where: { candidate_id: candidate.id } });
    const unlocks = [
      {
        code: "profile_ready",
        title: "Profil complet",
        description: "Ai CV, descriere si skill-uri pentru matching.",
        unlocked: !!candidate.cv_raw_text && !!candidate.about_me && (candidate.Skills?.length || 0) > 0,
      },
      {
        code: "first_apply",
        title: "Prima aplicare",
        description: "Ai aplicat la primul proiect.",
        unlocked: applications.length > 0,
      },
      {
        code: "accepted_contributor",
        title: "Contributor acceptat",
        description: "Ai fost acceptat in echipa unui proiect.",
        unlocked: applications.some((app) => app.status === "accepted"),
      },
      {
        code: "team_player",
        title: "Membru de clan",
        description: "Ai intrat sau ai creat o echipa.",
        unlocked: teamCount > 0,
      },
    ];

    for (const item of unlocks.filter((item) => item.unlocked)) {
      await Achievement.findOrCreate({
        where: { candidate_id: candidate.id, code: item.code },
        defaults: { candidate_id: candidate.id, code: item.code, title: item.title, description: item.description },
      });
    }

    const saved = await Achievement.findAll({ where: { candidate_id: candidate.id } });
    const savedCodes = new Set(saved.map((item) => item.code));
    res.json(unlocks.map((item) => ({ ...item, unlocked: savedCodes.has(item.code) || item.unlocked })));
  } catch (e) {
    console.error("Eroare achievements:", e);
    res.status(500).json({ error: e.message });
  }
};

const getCV = async (req, res, next) => {
  try {
    const candidates = await Candidate.findAll({
      attributes: ["id", "name", "city", "experience_years", "is_open_to_work"],
      include: [
        { model: Skill, through: { attributes: ["proficiency_level"] } },
      ],
    });
    res.json(candidates);
  } catch (e) {
    console.error("Eroare listare candidați:", e);
    res.status(500).json({ error: e.message });
  }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      attributes: ["id", "title", "industry", "location", "is_remote", "job_type",
        "experience_level", "salary_min", "salary_max", "salary_currency", "description", "applications_count", "status", "created_at"],
      include: [
        {
          model: Employer,
          attributes: ["id", "company_name", "logo_url"],
        },
        {
          model: Skill,
          through: { attributes: ["is_required", "min_proficiency"] },
        },
      ],
      where: { status: "active" },
      order: [["created_at", "DESC"]],
    });
    res.json(jobs);
  } catch (e) {
    console.error("Eroare listare joburi:", e);
    res.status(500).json({ error: e.message });
  }
};

const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id, {
      include: [
        { model: Skill, through: { attributes: ["proficiency_level", "years_experience"] } },
        { model: db.WorkExperience },
        { model: db.Education },
      ],
    });
    if (!candidate) return res.status(404).json({ error: "Candidatul nu a fost găsit." });
    res.json(candidate);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Employer, attributes: ["id", "company_name", "logo_url", "website_url"] },
        { model: Skill, through: { attributes: ["is_required", "min_proficiency"] } },
      ],
    });
    if (!job) return res.status(404).json({ error: "Job-ul nu a fost găsit." });

    // Incrementează views
    await job.increment("views_count");

    res.json(job);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const matchCandidateForJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const minScore = parseFloat(req.query.minScore) || 0.6;

    const matches = await findCandidatesForJob(jobId, limit, minScore);
    res.json(matches);
  } catch (e) {
    console.error("Eroare matching job:", e);
    res.status(500).json({ error: e.message });
  }
};

const matchJobForCandidate = async (req, res, next) => {
  try {
    const candidateId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const minScore = parseFloat(req.query.minScore) || 0.6;

    const matches = await findJobsForCandidate(candidateId, limit, minScore);
    res.json(matches);
  } catch (e) {
    console.error("Eroare matching candidat:", e);
    res.status(500).json({ error: e.message });
  }
};

const getEmployers = async (req, res, next) => {
  try {
    const employers = await Employer.findAll({
      attributes: ["id", "company_name", "logo_url", "website_url"],
    });
    res.json(employers);
  } catch (e) {
    console.error("Eroare listare employers:", e);
    res.status(500).json({ error: e.message });
  }
};

const getEmployerById = async (req, res, next) => {
  try {
    const employer = await Employer.findByPk(req.params.id, {
      attributes: ["id", "company_name", "logo_url", "website_url"],
    });
    if (!employer) return res.status(404).json({ error: "Employer-ul nu a fost găsit." });
    res.json(employer);
  } catch (e) {
    console.error("Eroare obtinere employer:", e);
    res.status(500).json({ error: e.message });
  }
};

export default {
  uploadCV: uploadCVAuto,
  getCV,
  getCandidateById,
  jobAdder,
  applyToJob,
  updateApplicationStatus,
  saveJob,
  unsaveJob,
  getMyContributorProfile,
  updateMyContributorProfile,
  uploadMyContributorPhoto,
  getMyApplications,
  getProjectMessages,
  postProjectMessage,
  getTeams,
  createTeam,
  joinTeam,
  getTeamMessages,
  postTeamMessage,
  createTicket,
  getMyTickets,
  submitSolutionFeedback,
  getMyAchievements,
  getJobById,
  matchCandidateForJob,
  matchJobForCandidate,
  getContributorDashboard,
  getRequesterDashboard,
  getRequesterJobs,
  updateRequesterJobStatus,
  getJobs,
  getEmployers,
  getEmployerById,
}
