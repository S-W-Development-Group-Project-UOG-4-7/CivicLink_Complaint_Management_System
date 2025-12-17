import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSidebar = () => {
  return (
    <div
      className="text-white d-flex flex-column vh-100"
      style={{
        width: "250px",
        backgroundColor: "#0f2a44", // dark blue
      }}
    >
      {/* Logo Section */}
      <div className="text-center py-4 border-bottom">
        <img
          src="/assets/images/civiclink-logo.png"
          alt="CivicLink Logo"
          style={{ width: "120px" }}
          className="mb-2"
        />
        <h6 className="fw-bold mb-0">Admin Panel</h6>
      </div>

      {/* Menu */}
      <ul className="nav flex-column gap-1 px-2 mt-4">
        <li className="nav-item">
          <Link className="nav-link text-white sidebar-link" to="/admin">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white sidebar-link" to="/register-officer">
            Register Officer
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white sidebar-link" to="/complaints">
            Complaints
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white sidebar-link" to="/departments">
            Departments
          </Link>
        </li>
      </ul>

      {/* Logout at bottom */}
      <div className="mt-auto px-3 pb-3">
        <Link
          className="btn btn-outline-light w-100"
          to="/login"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
