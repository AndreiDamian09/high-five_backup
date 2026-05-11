/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPostJson } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./styles.css";

function messageAuthor(message) {
  const sender = message.Sender;
  if (!sender) return "User";
  return sender.role === "employer" ? `Requester (${sender.email})` : `Contributor (${sender.email})`;
}

export default function CollaborationHub() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [projectMessages, setProjectMessages] = useState([]);
  const [teamMessages, setTeamMessages] = useState([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [teamMessage, setTeamMessage] = useState("");
  const [teamForm, setTeamForm] = useState({ name: "", description: "" });
  const [ticketForm, setTicketForm] = useState({ subject: "", description: "", category: "other", priority: "normal" });
  const [status, setStatus] = useState("");

  const isContributor = user?.role === "candidate";

  async function loadData() {
    const loaders = [
      isContributor ? apiGet("/me/applications") : apiGet("/me/jobs"),
      apiGet("/me/tickets"),
    ];
    if (isContributor) loaders.push(apiGet("/teams"), apiGet("/me/achievements"));

    const [projectData, ticketData, teamData = [], achievementData = []] = await Promise.all(loaders);
    const normalizedProjects = isContributor
      ? (projectData || []).map((app) => ({ id: app.Job?.id, title: app.Job?.title || "Project", status: app.status })).filter((item) => item.id)
      : projectData || [];

    setProjects(normalizedProjects);
    setTickets(ticketData || []);
    setTeams(teamData || []);
    setAchievements(achievementData || []);
    if (!projectId && normalizedProjects[0]?.id) setProjectId(normalizedProjects[0].id);
  }

  useEffect(() => {
    loadData().catch((e) => setStatus(`Nu am putut incarca hub-ul: ${e.message}`));
  }, [user?.role]);

  useEffect(() => {
    if (!projectId) return;
    apiGet(`/jobs/${projectId}/messages`)
      .then(setProjectMessages)
      .catch((e) => setStatus(`Chat proiect indisponibil: ${e.message}`));
  }, [projectId]);

  useEffect(() => {
    if (!teamId) return;
    apiGet(`/teams/${teamId}/messages`)
      .then(setTeamMessages)
      .catch((e) => setStatus(`Chat echipa indisponibil: ${e.message}`));
  }, [teamId]);

  const selectedProjectTitle = useMemo(() => projects.find((project) => project.id === projectId)?.title || "Selecteaza proiect", [projects, projectId]);

  async function sendProjectMessage(event) {
    event.preventDefault();
    await apiPostJson(`/jobs/${projectId}/messages`, { body: projectMessage });
    setProjectMessage("");
    setProjectMessages(await apiGet(`/jobs/${projectId}/messages`));
  }

  async function sendTeamMessage(event) {
    event.preventDefault();
    await apiPostJson(`/teams/${teamId}/messages`, { body: teamMessage });
    setTeamMessage("");
    setTeamMessages(await apiGet(`/teams/${teamId}/messages`));
  }

  async function createTeam(event) {
    event.preventDefault();
    await apiPostJson("/teams", teamForm);
    setTeamForm({ name: "", description: "" });
    setStatus("Echipa creata.");
    await loadData();
  }

  async function joinTeam(id) {
    await apiPostJson(`/teams/${id}/join`, {});
    setStatus("Ai intrat in echipa.");
    setTeamId(id);
    await loadData();
  }

  async function createTicket(event) {
    event.preventDefault();
    await apiPostJson("/tickets", { ...ticketForm, job_id: projectId || null });
    setTicketForm({ subject: "", description: "", category: "other", priority: "normal" });
    setStatus("Ticket deschis pentru administratori.");
    await loadData();
  }

  return (
    <main className="collab-page">
      <header className="collab-hero">
        <div>
          <span className="collab-badge">Collaboration Hub</span>
          <h1>Chat, echipe, tichete si achievements</h1>
          <p>Spatiul comun pentru requester si contributori dupa aplicare sau acceptare in proiect.</p>
        </div>
      </header>

      {status && <p className="collab-status">{status}</p>}

      <section className="collab-grid">
        <article className="collab-panel collab-chat-panel">
          <div className="collab-panel-head">
            <div>
              <h2>Chat proiect</h2>
              <p>{selectedProjectTitle}</p>
            </div>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Alege proiect</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
          </div>
          <div className="collab-messages">
            {projectMessages.length === 0 ? <p className="collab-muted">Nu exista mesaje inca.</p> : null}
            {projectMessages.map((message) => (
              <div className="collab-message" key={message.id}>
                <strong>{messageAuthor(message)}</strong>
                <p>{message.body}</p>
              </div>
            ))}
          </div>
          <form className="collab-send" onSubmit={sendProjectMessage}>
            <input value={projectMessage} onChange={(e) => setProjectMessage(e.target.value)} placeholder="Scrie un mesaj pentru proiect" disabled={!projectId} />
            <button type="submit" disabled={!projectId || !projectMessage.trim()}>Trimite</button>
          </form>
        </article>

        <aside className="collab-panel">
          <h2>Ticketing</h2>
          <form className="collab-form" onSubmit={createTicket}>
            <input value={ticketForm.subject} onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))} placeholder="Subiect ticket" />
            <textarea value={ticketForm.description} onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))} rows="4" placeholder="Descrie problema" />
            <div className="collab-inline">
              <select value={ticketForm.category} onChange={(e) => setTicketForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option value="solution_quality">Solutie neconforma</option>
                <option value="payment">Remuneratie</option>
                <option value="collaboration">Colaborare</option>
                <option value="other">Altceva</option>
              </select>
              <select value={ticketForm.priority} onChange={(e) => setTicketForm((prev) => ({ ...prev, priority: e.target.value }))}>
                <option value="normal">Normal</option>
                <option value="high">Urgent</option>
                <option value="low">Scazut</option>
              </select>
            </div>
            <button type="submit">Deschide ticket</button>
          </form>
          <div className="collab-list">
            {tickets.slice(0, 5).map((ticket) => (
              <div className="collab-ticket" key={ticket.id}>
                <strong>{ticket.subject}</strong>
                <span>{ticket.status} - {ticket.priority}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {isContributor && (
        <section className="collab-grid">
          <article className="collab-panel">
            <div className="collab-panel-head">
              <div>
                <h2>Echipe / clanuri</h2>
                <p>Creeaza o echipa sau intra intr-una publica.</p>
              </div>
            </div>
            <form className="collab-form" onSubmit={createTeam}>
              <input value={teamForm.name} onChange={(e) => setTeamForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nume echipa" />
              <textarea value={teamForm.description} onChange={(e) => setTeamForm((prev) => ({ ...prev, description: e.target.value }))} rows="3" placeholder="Specializare, reguli, obiective" />
              <button type="submit">Creeaza echipa</button>
            </form>
            <div className="collab-team-list">
              {teams.map((team) => (
                <div className="collab-team" key={team.id}>
                  <div>
                    <strong>{team.name}</strong>
                    <p>{team.description || "Echipa publica"}</p>
                    <span>{team.Members?.length || 0} membri</span>
                  </div>
                  <button type="button" onClick={() => joinTeam(team.id)}>Intra</button>
                  <button type="button" onClick={() => setTeamId(team.id)}>Chat</button>
                </div>
              ))}
            </div>
          </article>

          <article className="collab-panel collab-chat-panel">
            <div className="collab-panel-head">
              <h2>Chat echipa</h2>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
                <option value="">Alege echipa</option>
                {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
            <div className="collab-messages">
              {teamMessages.length === 0 ? <p className="collab-muted">Alege o echipa si incepe discutia.</p> : null}
              {teamMessages.map((message) => (
                <div className="collab-message" key={message.id}>
                  <strong>{messageAuthor(message)}</strong>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>
            <form className="collab-send" onSubmit={sendTeamMessage}>
              <input value={teamMessage} onChange={(e) => setTeamMessage(e.target.value)} placeholder="Mesaj pentru echipa" disabled={!teamId} />
              <button type="submit" disabled={!teamId || !teamMessage.trim()}>Trimite</button>
            </form>
          </article>
        </section>
      )}

      {isContributor && (
        <section className="collab-panel collab-achievements">
          <h2>Achievements</h2>
          <div className="collab-achievement-grid">
            {achievements.map((achievement) => (
              <div className={`collab-achievement ${achievement.unlocked ? "unlocked" : ""}`} key={achievement.code}>
                <strong>{achievement.title}</strong>
                <p>{achievement.description}</p>
                <span>{achievement.unlocked ? "Unlocked" : "Locked"}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
