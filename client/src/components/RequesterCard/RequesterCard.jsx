import "./styles.css";

//Card component for displaying requester information in the list of matches

export default function RequesterCard({ requester, score }) {
  return (
    <div className="contributor-card">
      <div className="contributor-card__header">
        <h3 className="contributor-card__name">
          {requester.company_name}
        </h3>

        {score !== undefined && (
          <span className="contributor-card__score">
            {(score * 100).toFixed(1)}%
          </span>
        )}
      </div>



      {requester.website_url !== undefined && (
        <div className="contributor-card__footer">
          <span className="contributor-card__badge">
            {requester.website_url} 
          </span>
        </div>
      )}
      
    
    </div>
  );
}
