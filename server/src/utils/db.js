import fs from "fs";

const DATABASE_FILENAME = "data/database.json";

export function loadFromDB() {
  if (!fs.existsSync(DATABASE_FILENAME)) {
    return { cvs: [], jobs: [] };
  }
  return JSON.parse(fs.readFileSync(DATABASE_FILENAME, "utf-8"));
}

export function saveDB(db) {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data", { recursive: true });
  }
  fs.writeFileSync(DATABASE_FILENAME, JSON.stringify(db, null, 2));
}

export function addCV(cvData) {
  const db = loadFromDB();

  const cv = {
    id: Date.now().toString(),
    ...cvData,
    addedAt: new Date().toISOString(),
  };

  db.cvs.push(cv);
  saveDB(db);

  return cv.id;
}

export function addJob(jobData) {
  const db = loadFromDB();

  const job = {
    id: Date.now().toString(),
    ...jobData,
    addedAt: new Date().toISOString(),
  };

  db.jobs.push(job);
  saveDB(db);

  return job.id;
}

export function getCVById(cvId) {
  const db = loadFromDB();
  return db.cvs.find((cv) => cv.id === cvId);
}

export function getJobById(jobId) {
  const db = loadFromDB();
  return db.jobs.find((job) => job.id === jobId);
}

export function getAllCVs() {
  const db = loadFromDB();
  return db.cvs;
}

export function getAllJobs() {
  const db = loadFromDB();
  return db.jobs;
}
