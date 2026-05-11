import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import app from './app.js'
import db from './models/index.cjs'

const PORT = process.env.PORT || 8080

const server = http.createServer(app)

await db.sequelize.authenticate();

async function ensureExtension(extensionName) {
  try {
    await db.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "${extensionName}";`);
  } catch (error) {
    // Multiple parallel startups can still race on extension creation.
    if (error?.original?.code !== "23505" && error?.original?.code !== "42710") {
      throw error;
    }
  }
}

await ensureExtension("uuid-ossp");
await ensureExtension("vector");

if (process.env.NODE_ENV !== "production") {
  // Auto-create missing tables in local/dev databases.
  await db.sequelize.sync();
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
console.log(Object.keys(db));
// console.log(db.User.associations);
// console.log(db.Candidate.associations);
// console.log(db.Job.associations);
// console.log(db.Employer.associations);
// console.log(db.Notification.associations);
