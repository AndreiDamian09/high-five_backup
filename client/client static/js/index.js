// const API = "http://localhost:8081/api";
const API ="https://influence-achieving-warrant-validity.trycloudflare.com/api"

async function loadDropdowns() {
  try {
    const [cvsResponse, jobsResponse] = await Promise.all([
      fetch(`${API}/cvs`),
      fetch(`${API}/jobs`),
    ]);

    const cvs = await cvsResponse.json();
    const jobs = await jobsResponse.json();

    const cvSel = document.getElementById("candidateSelect");
    if (cvs.length === 0) {
      cvSel.innerHTML = "<option disabled selected>Niciun CV in baza</option>";
    } else {
      cvSel.innerHTML = cvs
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");
    }

    const jobSel = document.getElementById("jobSelect");
    if (jobs.length === 0) {
      jobSel.innerHTML =
        "<option disabled selected>Niciun Job in baza</option>";
    } else {
      jobSel.innerHTML = jobs
        .map(
          (j) => `<option value="${j.id}">${j.title} (${j.Employer?.company_name || "Necunoscut"})</option>`
        )
        .join("");
    }

    console.log(" Date incarcate automat!");
  } catch (error) {
    console.error(" Eroare la incarcarea datelor:", error);
    const cvSel = document.getElementById("candidateSelect");
    const jobSel = document.getElementById("jobSelect");
    if (cvSel) cvSel.innerHTML = "<option>Eroare server</option>";
    if (jobSel) jobSel.innerHTML = "<option>Eroare server</option>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDropdowns();

  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector("button");
      const originalText = btn.innerText;

      try {
        btn.innerText = "Se proceseaza...";
        btn.classList.add("loading");

        const formData = new FormData(e.target);
        const res = await fetch(`${API}/upload-cv`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        alert(data.message || data.error);

        await loadDropdowns();
        e.target.reset();
      } catch (err) {
        alert("Eroare upload: " + err.message);
      } finally {
        btn.innerText = originalText;
        btn.classList.remove("loading");
      }
    };
  }

  const jobForm = document.getElementById("jobForm");
  if (jobForm) {
    jobForm.onsubmit = async (e) => {
      e.preventDefault();
      const jobData = {
        title: document.getElementById("jTitle").value,
        company: document.getElementById("jCompany").value,
        requirements: document
          .getElementById("jReq")
          .value.split(",")
          .map((s) => s.trim()),
        description: document.getElementById("jDesc").value,
      };

      try {
        const res = await fetch(`${API}/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });
        alert("Job adaugat cu succes!");

        await loadDropdowns();
        e.target.reset();
      } catch (err) {
        alert("Eroare: " + err.message);
      }
    };
  }
});

async function matchForCandidate() {
  const select = document.getElementById("candidateSelect");

  const id = select.value;
  if (!id) return alert("Selecteaza un candidat!");

  document.getElementById("resultsList").innerHTML =
    "Se calculeaza potrivirile...";

  try {
    const res = await fetch(`${API}/match/candidate/${id}`);
    const data = await res.json();
    renderResults(data, "job");
  } catch (e) {
    console.error(e);
    const resultsList = document.getElementById("resultsList");
    if (resultsList) resultsList.innerHTML = "Eroare la matching.";
  }
}

async function matchForJob() {
  const select = document.getElementById("jobSelect");
  if (!select) return;

  const id = select.value;
  if (!id) return alert("Selecteaza un job!");

  document.getElementById("resultsList").innerHTML =
    "Se calculeaza potrivirile...";

  try {
    const res = await fetch(`${API}/match/job/${id}`);
    const data = await res.json();
    renderResults(data, "cv");
  } catch (e) {
    console.error(e);
    const resultsList = document.getElementById("resultsList");
    if (resultsList) resultsList.innerHTML = "Eroare la matching.";
  }
}

function renderResults(data, type) {
  const list = document.getElementById("resultsList");
  if (!list) return;

  if (data.error)
    return (list.innerHTML = `<p style="color:red">${data.error}</p>`);
  if (data.length === 0)
    return (list.innerHTML = `<p>Nicio potrivire gasita (Scor prea mic).</p>`);

  list.innerHTML = data
    .map((item, index) => {
      const title =
        type === "job" ? `${item.title} la ${item.company}` : item.name;
      const icon = item.industry?.icon || "📄";
      const score = (item.score * 100).toFixed(1);

      const stars = "⭐".repeat(Math.round(item.score * 5));

      return `
                <div class="result-item">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${index + 1}. ${title}</strong>
                        <span class="score">${score}%</span>
                    </div>
                    <div style="font-size: 0.9em; color: #666; margin-top:5px;">
                        ${stars} <span class="industry-tag">${icon} ${
        item.industry?.industry || "General"
      }</span>
                    </div>
                </div>`;
    })
    .join("");
}

window.matchForCandidate = matchForCandidate;
window.matchForJob = matchForJob;
