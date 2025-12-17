import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterOfficer = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />

      {/* Gradient Background Area */}
      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
         background: "linear-gradient(135deg, #b5d4f3ff, #0f2a44)",
        }}
      >
        {/* Form Card */}
        <div
          className="card shadow p-4"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <h4 className="text-center mb-4">
            Register Department Officer
          </h4>

          <form>
            <input
              className="form-control mb-3"
              placeholder="Officer Name"
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
            />

            <select className="form-select mb-3">
              <option>Select Department</option>
              <option>Water Board</option>
              <option>Electricity Board</option>
              <option>Road Development</option>
              <option>Public Transport</option>
            </select>

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
            />

            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: "#0f2a44" }}
            >
              Register Officer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterOfficer;
