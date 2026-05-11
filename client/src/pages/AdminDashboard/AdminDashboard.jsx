/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { adminGet, adminPatchJson } from "../../lib/api";
import "./styles.css";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("");

  async function loadData() {
    const [dashboardData, ticketData] = await Promise.all([
      adminGet("/dashboard"),
      adminGet("/tickets"),
    ]);
    setDashboard(dashboardData);
    setTickets(ticketData);
  }

  useEffect(() => {
    loadData().catch((e) => setStatus(`Nu am putut incarca admin dashboard: ${e.message}`));
  }, []);

  async function updateTicket(ticketId, ticketStatus) {
    await adminPatchJson(`/tickets/${ticketId}/status`, { status: ticketStatus });
    setStatus("Ticket actualizat.");
    await loadData();
  }

  const stats = dashboard?.stats || {};

  return (
    <main className="admin-page">
      <header className="admin-hero">
        <div>
          <span className="admin-badge">Admin</span>
          <h1>Dashboard administrare platforma</h1>
          <p>Monitorizare pentru proiecte, useri, echipe, aplicari si tichete.</p>
        </div>
      </header>

      {status && <p className="admin-status">{status}</p>}

      <section className="admin-stats">
        <article><span>Useri</span><strong>{stats.users || 0}</strong></article>
        <article><span>Contributori</span><strong>{stats.contributors || 0}</strong></article>
        <article><span>Requesteri</span><strong>{stats.requesters || 0}</strong></article>
        <article><span>Proiecte active</span><strong>{stats.activeProjects || 0}</strong></article>
        <article><span>Aplicari</span><strong>{stats.applications || 0}</strong></article>
        <article><span>Echipe</span><strong>{stats.teams || 0}</strong></article>
        <article><span>Tichete deschise</span><strong>{stats.openTickets || 0}</strong></article>
      </section>

      <section className="admin-panel">
        <h2>Ticketing</h2>
        {tickets.length === 0 ? <p>Nu exista tichete.</p> : null}
        <div className="admin-ticket-list">
          {tickets.map((ticket) => (
            <article className="admin-ticket" key={ticket.id}>
              <div>
                <strong>{ticket.subject}</strong>
                <p>{ticket.description}</p>
                <span>{ticket.Job?.title || "Fara proiect"} - {ticket.OpenedBy?.email || "user"} - {ticket.status}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => updateTicket(ticket.id, "in_review")}>In review</button>
                <button type="button" onClick={() => updateTicket(ticket.id, "resolved")}>Resolved</button>
                <button type="button" onClick={() => updateTicket(ticket.id, "closed")}>Close</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
