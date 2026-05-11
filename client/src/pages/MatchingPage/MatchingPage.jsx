import { useEffect, useState } from "react";
import { apiGet, apiPostForm, apiPostJson } from "../../lib/api";
import "./styles.css";

//Page component for handling job matching functionality, including CV upload, job addition, and displaying match results

export default function MatchingPage() {
  const [cvs, setCvs] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");

  const [results, setResults] = useState([]);
  const [statusText, setStatusText] = useState("Selectează o opțiune și apasă Caută…");
  const [loading, setLoading] = useState(false);

  async function loadDropdowns() {
    const [cvsData, jobsData] = await Promise.all([apiGet("/cvs"), apiGet("/jobs")]);
    setCvs(cvsData);
    setJobs(jobsData);
  }

  useEffect(() => {
    loadDropdowns().catch((e) => {
      console.error(e);
      setStatusText("Eroare la încărcarea datelor.");
    });
  }, []);

  async function handleUploadCV(e) {
    e.preventDefault();
    setLoading(true);
    setStatusText("Se procesează CV-ul…");

    try {
      const formData = new FormData(e.target);
      await apiPostForm("/upload-cv", formData);
      await loadDropdowns();
      e.target.reset();
      setStatusText("CV încărcat. Poți face matching.");
    } catch (err) {
      console.error(err);
      setStatusText("Eroare la upload.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddJob(e) {
    e.preventDefault();
    setLoading(true);
    setStatusText("Se salvează jobul…");

    try {
      const jobData = {
        title: e.target.jTitle.value,
        requirements: e.target.jReq.value || "",
        description: e.target.jDesc.value,
        location: "Remote",
        is_remote: true,
        job_type: "contract",
      };

      await apiPostJson("/jobs", jobData);
      await loadDropdowns();
      e.target.reset();
      setStatusText("Job adăugat. Poți face matching.");
    } catch (err) {
      console.error(err);
      setStatusText("Eroare la adăugarea jobului.");
    } finally {
      setLoading(false);
    }
  }

  async function matchForCandidate() {
    setLoading(true);
    setResults([]);
    setStatusText("Se calculează potrivirile…");

    try {
      const data = await apiGet(`/match/candidate/${candidateId}`);
      setResults(Array.isArray(data) ? data : []);
      setStatusText("");
    } catch (e) {
      console.error(e);
      setStatusText("Eroare la matching.");
    } finally {
      setLoading(false);
    }
  }

  async function matchForJob() {
    setLoading(true);
    setResults([]);
    setStatusText("Se calculează potrivirile…");

    try {
      const data = await apiGet(`/match/job/${jobId}`);
      setResults(Array.isArray(data) ? data : []);
      setStatusText("");
    } catch (e) {
      console.error(e);
      setStatusText("Eroare la matching.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="matching-page">
      <h1>Job Matching</h1>

      <div className="grid">
        <div className="card">
          <h2>📤 Adaugă Date</h2>

          <h3>1. Upload CV (PDF)</h3>
          <form id="uploadForm" onSubmit={handleUploadCV}>
            <input type="text" name="name" placeholder="Nume Candidat (Optional)" />
            <input type="file" name="cvFile" accept=".pdf,.txt" required />
            <button type="submit" disabled={loading}>
              {loading ? "Se procesează..." : "Upload & Parsează"}
            </button>
          </form>

          <hr />

          <h3>2. Adaugă Job Manual</h3>
          <form id="jobForm" onSubmit={handleAddJob}>
            <input type="text" name="jTitle" placeholder="Titlu Job" required />
            <input type="text" name="jReq" placeholder="Cerințe (separate prin virgulă)" />
            <textarea name="jDesc" placeholder="Descriere Job" rows={3}></textarea>
            <button type="submit" disabled={loading}>
              {loading ? "Se salvează..." : "Salvează Job"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>🔍 Matching</h2>

          <div style={{ marginBottom: 20 }}>
            <label>Găsește Joburi pentru un Candidat:</label>
            <div className="search-row">
              <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)}>
                <option value="" disabled>
                  {cvs.length ? "Selectează candidat..." : "Niciun CV în bază"}
                </option>
                {cvs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button onClick={matchForCandidate} disabled={loading}>
                Caută
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>Găsește Candidați pentru un Job:</label>
            <div className="search-row">
              <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
                <option value="" disabled>
                  {jobs.length ? "Selectează job..." : "Niciun job în bază"}
                </option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.Employer?.company_name || "Necunoscut"})
                  </option>
                ))}
              </select>
              <button onClick={matchForJob} disabled={loading}>
                Caută
              </button>
            </div>
          </div>

          <div id="resultsArea">
            <h3>Rezultate:</h3>

            {statusText && <div id="resultsList">{statusText}</div>}

            {!statusText && (
              <div id="resultsList">
                {results.length === 0 ? (
                  <p>Nicio potrivire găsită.</p>
                ) : (
                  results.map((item, idx) => {
                    const title = item.title ? `${item.title} la ${item.company}` : item.name;
                    const scorePct = ((item.score ?? 0) * 100).toFixed(1);
                    return (
                      <div className="result-item" key={idx}>
                        <div className="result-row">
                          <strong>
                            {idx + 1}. {title}
                          </strong>
                          <span className="score">{scorePct}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
