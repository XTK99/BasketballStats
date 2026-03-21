import "./DashboardHeaderCard.css";

function DashboardHeaderCard({ heading, title, children }) {
  return (
    <section className="panel-card">
      <div className="dashboard-header-row">
        <div>
          <h2 className="panel-title">{heading}</h2>
          <p className="app-subtitle">{title}</p>
        </div>

        {children ? (
          <div className="dashboard-inline-search">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

export default DashboardHeaderCard;
