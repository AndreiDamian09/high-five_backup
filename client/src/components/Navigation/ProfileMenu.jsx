import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { apiGet, apiPatchJson, apiPostForm } from "../../lib/api";

const emptyProfile = {
  name: "",
  phone: "",
  city: "",
  country: "Romania",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  profile_picture_url: "",
  about_me: "",
  experience_years: 0,
  education: "",
  preferred_industries: "",
  preferred_locations: "",
  expected_salary_min: "",
  expected_salary_max: "",
  available_from: "",
  is_open_to_work: true,
  skillsText: "",
};

function skillsToText(skills = []) {
  return skills
    .map((skill) => {
      const pivot = skill.CandidateSkill || {};
      return [skill.name, pivot.proficiency_level || 3, pivot.years_experience || 0].join("|");
    })
    .join("\n");
}

function textToSkills(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, proficiency, years] = line.split("|").map((part) => part?.trim());
      return {
        name,
        proficiency_level: Number(proficiency || 3),
        years_experience: Number(years || 0),
      };
    })
    .filter((skill) => skill.name);
}

function normalizeProfile(profileData) {
  return {
    ...emptyProfile,
    ...profileData,
    preferred_industries: (profileData.preferred_industries || []).join(", "),
    preferred_locations: (profileData.preferred_locations || []).join(", "),
    expected_salary_min: profileData.expected_salary_min || "",
    expected_salary_max: profileData.expected_salary_max || "",
    available_from: profileData.available_from || "",
    skillsText: skillsToText(profileData.Skills || []),
  };
}

export default function ProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await apiGet("/me/profile/contributor");
      setProfile(normalizeProfile(data));
    } catch (e) {
      setMessage(`Could not load profile: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    function openProfileMenu() {
      setIsOpen(true);
    }

    window.addEventListener("open-profile-menu", openProfileMenu);
    return () => window.removeEventListener("open-profile-menu", openProfileMenu);
  }, []);

  const initials = useMemo(() => {
    const source = profile.name || user?.email || "User";
    return source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";
  }, [profile.name, user?.email]);

  function updateProfile(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  }

  async function handleUploadPhoto(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!formData.get("profilePicture")?.name) {
      setMessage("Choose an image first.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const data = await apiPostForm("/me/profile/contributor/photo", formData);
      setProfile((prev) => ({ ...prev, profile_picture_url: data.profile_picture_url }));
      form.reset();
      setMessage("Profile photo updated.");
    } catch (e) {
      setMessage(`Could not upload photo: ${e.message}`);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleUploadCv(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!formData.get("cvFile")?.name) {
      setMessage("Choose a PDF or TXT CV first.");
      return;
    }

    setUploadingCv(true);
    setMessage("Reading CV and updating profile...");
    try {
      await apiPostForm("/upload-cv", formData);
      await loadProfile();
      form.reset();
      setMessage("CV processed. Profile and embedding updated.");
    } catch (e) {
      setMessage(`Could not process CV: ${e.message}`);
    } finally {
      setUploadingCv(false);
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
      country: profile.country,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      profile_picture_url: profile.profile_picture_url,
      about_me: profile.about_me,
      experience_years: Number(profile.experience_years || 0),
      education: profile.education,
      preferred_industries: profile.preferred_industries,
      preferred_locations: profile.preferred_locations,
      expected_salary_min: profile.expected_salary_min ? Number(profile.expected_salary_min) : null,
      expected_salary_max: profile.expected_salary_max ? Number(profile.expected_salary_max) : null,
      available_from: profile.available_from || null,
      is_open_to_work: profile.is_open_to_work,
      skills: textToSkills(profile.skillsText),
    };

    try {
      const data = await apiPatchJson("/me/profile/contributor", payload);
      setProfile(normalizeProfile(data.profile || profile));
      setMessage("Profile saved and embedding regenerated.");
    } catch (e) {
      setMessage(`Could not save profile: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  const profileModal = isOpen ? (
    <div className="profile-modal-backdrop" role="presentation" onMouseDown={() => setIsOpen(false)}>
      <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="profile-modal-head">
          <div className="profile-modal-title-row">
            <div className="profile-modal-avatar">
              {profile.profile_picture_url ? <img src={profile.profile_picture_url} alt="Profile" /> : <span>{initials}</span>}
            </div>
            <div>
              <h2 id="profile-modal-title">Profile</h2>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="profile-close-btn" type="button" onClick={() => setIsOpen(false)} aria-label="Close profile">x</button>
        </div>

        {loading ? <p className="profile-message-inline">Loading profile...</p> : null}

        <form className="profile-upload-row" onSubmit={handleUploadPhoto}>
          <label>
            Profile Photo
            <input type="file" name="profilePicture" accept="image/*" />
          </label>
          <button type="submit" disabled={uploadingPhoto}>{uploadingPhoto ? "Uploading..." : "Upload Photo"}</button>
        </form>

        <form className="profile-upload-row" onSubmit={handleUploadCv}>
          <label>
            Autofill From CV
            <input type="file" name="cvFile" accept=".pdf,.txt" />
          </label>
          <button type="submit" disabled={uploadingCv}>{uploadingCv ? "Processing..." : "Upload CV"}</button>
        </form>

        <form className="nav-profile-form" onSubmit={handleSaveProfile}>
          <div className="nav-profile-grid">
            <label>Full Name<input value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} /></label>
            <label>Phone<input value={profile.phone || ""} onChange={(e) => updateProfile("phone", e.target.value)} /></label>
            <label>City<input value={profile.city || ""} onChange={(e) => updateProfile("city", e.target.value)} /></label>
            <label>Country<input value={profile.country || ""} onChange={(e) => updateProfile("country", e.target.value)} /></label>
            <label>Years Of Experience<input type="number" min="0" value={profile.experience_years || 0} onChange={(e) => updateProfile("experience_years", e.target.value)} /></label>
            <label>Available From<input type="date" value={profile.available_from || ""} onChange={(e) => updateProfile("available_from", e.target.value)} /></label>
            <label>Minimum Salary<input type="number" min="0" value={profile.expected_salary_min || ""} onChange={(e) => updateProfile("expected_salary_min", e.target.value)} /></label>
            <label>Maximum Salary<input type="number" min="0" value={profile.expected_salary_max || ""} onChange={(e) => updateProfile("expected_salary_max", e.target.value)} /></label>
          </div>

          <label className="profile-open-toggle">
            <input type="checkbox" checked={profile.is_open_to_work} onChange={(e) => updateProfile("is_open_to_work", e.target.checked)} />
            Open to work
          </label>

          <label>About You<textarea rows="4" value={profile.about_me || ""} onChange={(e) => updateProfile("about_me", e.target.value)} /></label>
          <label>Matching Skills<textarea rows="5" value={profile.skillsText} onChange={(e) => updateProfile("skillsText", e.target.value)} placeholder={"React|4|2\nNode.js|3|1"} /></label>
          <label>Education<textarea rows="3" value={profile.education || ""} onChange={(e) => updateProfile("education", e.target.value)} /></label>

          <div className="nav-profile-grid">
            <label>Preferred Industries<input value={profile.preferred_industries || ""} onChange={(e) => updateProfile("preferred_industries", e.target.value)} /></label>
            <label>Preferred Locations<input value={profile.preferred_locations || ""} onChange={(e) => updateProfile("preferred_locations", e.target.value)} /></label>
            <label>LinkedIn<input value={profile.linkedin_url || ""} onChange={(e) => updateProfile("linkedin_url", e.target.value)} /></label>
            <label>GitHub<input value={profile.github_url || ""} onChange={(e) => updateProfile("github_url", e.target.value)} /></label>
            <label>Portfolio<input value={profile.portfolio_url || ""} onChange={(e) => updateProfile("portfolio_url", e.target.value)} /></label>
          </div>

          {message && <p className="profile-message-inline">{message}</p>}
          <div className="profile-modal-actions">
            <button className="profile-secondary-btn" type="button" onClick={() => setIsOpen(false)}>Close</button>
            <button className="profile-primary-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button className="profile-avatar-btn" type="button" onClick={() => setIsOpen(true)} title="Open profile">
        {profile.profile_picture_url ? (
          <img src={profile.profile_picture_url} alt="Profile" />
        ) : (
          <span>{initials}</span>
        )}
      </button>

      {profileModal ? createPortal(profileModal, document.body) : null}
    </>
  );
}
