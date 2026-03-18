import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Analyst – Physical Logistics</h4>
                <h5>BMW Group, Oxford, UK</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Owned end-to-end KPI reporting for logistics and inventory teams
              using Power BI dashboards backed by SQL and AWS pipelines. Enabled
              self-service data access for 50+ users, reduced manual reporting by
              50%, and contributed to £1.5M cost recovery through analytics.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MSc Engineering Business Management</h4>
                <h5>University of Exeter</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Advanced studies in engineering management, data-driven
              decision-making, and business analytics. Developed strong
              foundations in statistical analysis, project management, and
              operational research methodologies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Marketing Coordinator</h4>
                <h5>Techfest IIT Bombay</h5>
              </div>
              <h3>2019</h3>
            </div>
            <p>
              Coordinated marketing for Asia's largest science festival with
              175,000+ attendees. Analyzed campaign performance metrics, executed
              email marketing campaigns, and negotiated partnerships securing up
              to 30% cost reductions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
