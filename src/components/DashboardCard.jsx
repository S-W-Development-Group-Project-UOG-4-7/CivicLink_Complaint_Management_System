import "bootstrap/dist/css/bootstrap.min.css";

const DashboardCard = ({ title, value, color }) => {
  return (
    <div className="card shadow-sm text-center h-100">
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h2 className={`fw-bold text-${color}`}>
          {value}
        </h2>
      </div>
    </div>
  );
};

export default DashboardCard;
