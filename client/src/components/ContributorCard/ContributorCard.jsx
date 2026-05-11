import "./styles.css";

//Card component for displaying contributor information in the list of matches

export default function ContributorCard({ contributor, score }) {
  return (
    <div className="contributor-card">
      <div className="contributor-card__header">
        <h3 className="contributor-card__name">
          {contributor.name}
        </h3>

        {score !== undefined && (
          <span className="contributor-card__score">
            {(score * 100).toFixed(1)}%
          </span>
        )}
      </div>

      {contributor.city && (
        <p className="contributor-card__location">
          📍 {contributor.city}
        </p>
      )}
{/* 
      {contributor.about_me && (
        <p className="contributor-card__about">
          {contributor.about_me.length > 140
            ? contributor.about_me.slice(0, 140) + "…"
            : contributor.about_me}
        </p>
      )} */}

      {contributor.experience_years !== undefined && (
        <div className="contributor-card__footer">
          <span className="contributor-card__badge">
            {contributor.experience_years} ani experiență
          </span>
        </div>
      )}
      
    {contributor.is_open_to_work !== undefined && (
        <div className="contributor-card__footer">
          <span className="contributor-card__badge">
            {contributor.is_open_to_work} deschis la oportunități
          </span>
        </div>
      )}
    </div>
  );
}
