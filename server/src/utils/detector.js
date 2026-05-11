import { INDUSTRIES } from "../config/industrii.js";

export function detectIndustry(skills, description = "") {
  const combinedText = [...skills, description].join(" ").toLowerCase();

  let bestMatch = {
    industry: "Altele",
    score: 0,
    icon: "🔧",
    color: "\x1b[37m",
  };

  for (const [industryName, data] of Object.entries(INDUSTRIES)) {
    let matchCount = 0;

    for (const keyword of data.keywords) {
      if (combinedText.includes(keyword)) {
        matchCount++;
      }
    }

    if (matchCount > bestMatch.score) {
      bestMatch = {
        industry: industryName,
        score: matchCount,
        icon: data.icon,
        color: data.color,
      };
    }
  }

  return bestMatch;
}

export function getExperienceLevel(experience) {
  const expStr = String(experience).toLowerCase();

  const yearsMatch = expStr.match(/(\d+)/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;

  if (years === 0 && (expStr.includes("junior") || expStr.includes("entry"))) {
    return { level: "Entry Level", years: 0, icon: "🌱" };
  }
  if (years <= 2) {
    return { level: "Junior", years, icon: "🌱" };
  }
  if (years <= 5) {
    return { level: "Mid-Level", years, icon: "🌿" };
  }
  if (years <= 10) {
    return { level: "Senior", years, icon: "🌳" };
  }
  return { level: "Expert", years, icon: "🏆" };
}
