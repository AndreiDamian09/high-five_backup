import express from "express"
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
import db from "../models/index.cjs";

const adminRouter =express.Router()

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/dashboard", async (req, res) => {
  try {
    const [users, contributors, requesters, projects, applications, tickets, teams] = await Promise.all([
      db.User.count(),
      db.Candidate.count(),
      db.Employer.count(),
      db.Job.count(),
      db.Application.count(),
      db.SupportTicket.count(),
      db.Team.count(),
    ]);

    const openTickets = await db.SupportTicket.count({ where: { status: ["open", "in_review"] } });
    const activeProjects = await db.Job.count({ where: { status: "active" } });
    res.json({
      stats: { users, contributors, requesters, projects, activeProjects, applications, tickets, openTickets, teams },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/tickets", async (req, res) => {
  try {
    const tickets = await db.SupportTicket.findAll({
      include: [
        { model: db.User, as: "OpenedBy", attributes: ["id", "email", "role"] },
        { model: db.Job, attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(tickets);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.patch("/tickets/:id/status", async (req, res) => {
  try {
    const ticket = await db.SupportTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found." });

    const status = ["open", "in_review", "resolved", "closed"].includes(req.body.status) ? req.body.status : ticket.status;
    await ticket.update({ status, resolution_note: req.body.resolution_note ?? ticket.resolution_note });
    res.json({ success: true, ticket });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default adminRouter
