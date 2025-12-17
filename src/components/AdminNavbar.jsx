import "bootstrap/dist/css/bootstrap.min.css";

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand fw-bold">
        CivicLink Admin Dashboard
      </span>

      <div className="d-flex align-items-center gap-3">
        <span className="fw-semibold">Admin</span>
        <button className="btn btn-outline-danger btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
