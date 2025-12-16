import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OfficerLogin = () => {
  const [formData, setFormData] = useState({
    department: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Login submitted (backend pending)");
  };
  const [showPassword, setShowPassword] = useState(false);


  return (
    <>
      {/* Background Section */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a9d0f5, #4190c8)",
        }}
      >
        <div className="col-md-4 col-sm-10">
          <div
            className="card shadow-lg border-0 login-card"
            style={{
              borderRadius: "18px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div className="card-body p-4">
              {/* Logo */}
              <div className="text-center mb-3">
                <img
                  src="/assets/images/civiclink-logo.png"
                  alt="CivicLink Logo"
                  style={{ width: "120px" }}
                />
              </div>

              <h4 className="text-center fw-bold mb-4">
                Department Officer Login
              </h4>

              <form onSubmit={handleSubmit}>
                {/* Department */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Department
                  </label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="roads">Road Development Authority</option>
                    <option value="water">Water Supply Department</option>
                    <option value="electricity">Electricity Board</option>
                    <option value="garbage">Municipal Waste Management</option>
                    <option value="transport">Public Transport Authority</option>
                  </select>
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

{/* Password */}
<div className="mb-3">
  <label className="form-label fw-semibold">
    Password
  </label>

  <div className="input-group">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      name="password"
      placeholder="Enter password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>
</div>


                {/* Login Button */}
                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold text-white login-btn"
                >
                  Login
                </button>
              </form>

              {/* Footer Text */}
              <p className="text-center text-muted mt-4 small">
                Authorized personnel only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for hover effects */}
      <style>
        {`
          .login-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          }

          .login-btn {
            background-color: #0f2a44;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .login-btn:hover {
            background-color: #143a5e;
            transform: translateY(-2px);
          }

          .form-control:focus,
          .form-select:focus {
            border-color: #0f2a44;
            box-shadow: 0 0 0 0.15rem rgba(15, 42, 68, 0.25);
          }
        `}
      </style>
    </>
  );
};

export default OfficerLogin;
