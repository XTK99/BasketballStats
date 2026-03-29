import "./DashboardHeaderCard.css";

function DashboardHeaderCard({ heading, title, children }) {
  return (
    <section className="panel-card">
      <div className="dashboard-header-row">
        <div className="dashboard-title-block">
          <p className="dashboard-kicker">{heading}</p>
          <h2 className="dashboard-entity-title">{title}</h2>
        </div>
        {children ? (
          <div className="dashboard-inline-search">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

export default DashboardHeaderCard;
