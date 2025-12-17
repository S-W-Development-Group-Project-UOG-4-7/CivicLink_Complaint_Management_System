import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import DashboardCard from "../components/DashboardCard";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="w-100">
        

        {/* Gradient Background */}
        <div
          className="p-4"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #b5d4f3ff, #0f2a44)",
          }}
        >
          <h3 className="text-white mb-4">Dashboard Overview</h3>

          {/* Statistics Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <DashboardCard
                title="Total Complaints"
                value="120"
                color="success"
              />
            </div>

            <div className="col-md-3">
              <DashboardCard
                title="Pending Complaints"
                value="45"
                color="warning"
              />
            </div>

            <div className="col-md-3">
              <DashboardCard
                title="Resolved Complaints"
                value="75"
                color="success"
              />
            </div>

            <div className="col-md-3">
              <DashboardCard
                title="Officers"
                value="18"
                color="info"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-flex gap-3 flex-wrap">
                <a href="/register-officer" className="btn btn-primary">
                  Register Officer
                </a>
                <a href="/complaints" className="btn btn-outline-secondary">
                  View Complaints
                </a>
                <a href="/departments" className="btn btn-outline-dark">
                  Manage Departments
                </a>
              </div>
            </div>
          </div>

          {/* Recent Complaints Table */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="mb-3">Recent Complaints</h5>

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Issue</th>
                    <th>Status</th>
                    <th>District</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Potholes on Main Road</td>
                    <td>
                      <span className="badge bg-warning">Pending</span>
                    </td>
                    <td>Colombo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Broken Street Light</td>
                    <td>
                      <span className="badge bg-info">In Progress</span>
                    </td>
                    <td>Gampaha</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Garbage Collection Issue</td>
                    <td>
                      <span className="badge bg-success">Resolved</span>
                    </td>
                    <td>Kandy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
