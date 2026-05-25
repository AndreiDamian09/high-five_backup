import express from "express"
import controller from "./controllers/index.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";

const apiRouter =express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ storage: multer.memoryStorage() });

apiRouter.use(express.static(path.join(__dirname, "public")));


apiRouter.get("/health",(req,res,next)=> {res.json({message: "api ok you are good to go"})})

apiRouter.post("/upload-cv", requireAuth, requireRole("candidate"), upload.single("cvFile"), controller.user.uploadCV)
apiRouter.post("/jobs", requireAuth, requireRole("employer"), controller.user.jobAdder)
apiRouter.post("/jobs/:id/apply", requireAuth, requireRole("candidate"), controller.user.applyToJob)
apiRouter.patch("/applications/:id/status", requireAuth, requireRole("employer"), controller.user.updateApplicationStatus)
apiRouter.post("/jobs/:id/save", requireAuth, requireRole("candidate"), controller.user.saveJob)
apiRouter.delete("/jobs/:id/save", requireAuth, requireRole("candidate"), controller.user.unsaveJob)
apiRouter.patch("/jobs/:id/status", requireAuth, requireRole("employer"), controller.user.updateRequesterJobStatus)
apiRouter.get("/cvs",controller.user.getCV)
apiRouter.get("/cvs/:id",controller.user.getCandidateById)
apiRouter.get("/jobs", controller.user.getJobs)
apiRouter.get("/jobs/:id", controller.user.getJobById)
apiRouter.get("/me/applications", requireAuth, requireRole("candidate"), controller.user.getMyApplications)
apiRouter.get("/me/profile/contributor", requireAuth, requireRole("candidate"), controller.user.getMyContributorProfile)
apiRouter.patch("/me/profile/contributor", requireAuth, requireRole("candidate"), controller.user.updateMyContributorProfile)
apiRouter.post("/me/profile/contributor/photo", requireAuth, requireRole("candidate"), upload.single("profilePicture"), controller.user.uploadMyContributorPhoto)
apiRouter.get("/me/dashboard/contributor", requireAuth, requireRole("candidate"), controller.user.getContributorDashboard)
apiRouter.get("/me/dashboard/requester", requireAuth, requireRole("employer"), controller.user.getRequesterDashboard)
apiRouter.get("/me/jobs", requireAuth, requireRole("employer"), controller.user.getRequesterJobs)
apiRouter.get("/me/tickets", requireAuth, controller.user.getMyTickets)
apiRouter.get("/me/achievements", requireAuth, requireRole("candidate"), controller.user.getMyAchievements)
apiRouter.get("/teams", requireAuth, controller.user.getTeams)
apiRouter.post("/teams", requireAuth, requireRole("candidate"), controller.user.createTeam)
apiRouter.post("/teams/:id/join", requireAuth, requireRole("candidate"), controller.user.joinTeam)
apiRouter.get("/teams/:id/messages", requireAuth, requireRole("candidate"), controller.user.getTeamMessages)
apiRouter.post("/teams/:id/messages", requireAuth, requireRole("candidate"), controller.user.postTeamMessage)
apiRouter.get("/jobs/:id/messages", requireAuth, controller.user.getProjectMessages)
apiRouter.post("/jobs/:id/messages", requireAuth, controller.user.postProjectMessage)
apiRouter.post("/tickets", requireAuth, controller.user.createTicket)
apiRouter.post("/applications/:id/solution-feedback", requireAuth, requireRole("employer"), controller.user.submitSolutionFeedback)
apiRouter.get("/match/job/:id", controller.user.matchCandidateForJob)
apiRouter.get("/match/candidate/:id", controller.user.matchJobForCandidate)

apiRouter.get("/employers", controller.user.getEmployers)
apiRouter.get("/employers/:id", controller.user.getEmployerById)

// High Five — colaborare bilaterala
apiRouter.post("/applications/:id/high-five", requireAuth, requireRole("employer"), controller.user.sendHighFive)
apiRouter.patch("/applications/:id/high-five", requireAuth, requireRole("candidate"), controller.user.respondToHighFive)
apiRouter.post("/applications/:id/complete", requireAuth, controller.user.completeCollaboration)
apiRouter.post("/applications/:id/cancel", requireAuth, controller.user.cancelCollaboration)

// Milestones
apiRouter.post("/applications/:id/milestones", requireAuth, requireRole("employer"), controller.user.createMilestone)
apiRouter.get("/applications/:id/milestones", requireAuth, controller.user.getMilestones)
apiRouter.patch("/applications/:id/milestones/:milestoneId", requireAuth, controller.user.updateMilestoneStatus)

// Reviews / Rating
apiRouter.post("/applications/:id/review", requireAuth, controller.user.submitReview)
apiRouter.get("/reviews/user/:userId", controller.user.getReviewsForUser)

// Leaderboard
apiRouter.get("/leaderboard", controller.user.getLeaderboard)

// Notifications
apiRouter.get("/me/notifications", requireAuth, controller.user.getMyNotifications)
apiRouter.patch("/me/notifications/:id/read", requireAuth, controller.user.markNotificationRead)
apiRouter.patch("/me/notifications/read-all", requireAuth, controller.user.markAllNotificationsRead)

export default apiRouter;
