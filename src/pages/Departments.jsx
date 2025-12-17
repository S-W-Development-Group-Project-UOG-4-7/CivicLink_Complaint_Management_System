// src/pages/Departments.jsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const Departments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Water Board" },
    { id: 2, name: "Electricity Board" },
    { id: 3, name: "Road Development" },
    { id: 4, name: "Public Transport" },
  ]);

  const [newDepartment, setNewDepartment] = useState("");

  const addDepartment = () => {
    if (newDepartment.trim() === "") return;

    setDepartments([
      ...departments,
      { id: Date.now(), name: newDepartment },
    ]);

    setNewDepartment("");
  };

  const deleteDepartment = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="p-4 w-100 bg-light" style={{ minHeight: "100vh" }}>
        <h3 className="mb-4">Department Management</h3>

        {/* Add Department */}
        <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: "500px" }}>
          <h5 className="mb-3">Add New Department</h5>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Department Name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addDepartment}>
              Add
            </button>
          </div>
        </div>

        {/* Departments List */}
        <div className="card shadow-sm p-4">
          <h5 className="mb-3">Existing Departments</h5>

          {departments.length === 0 ? (
            <p className="text-muted">No departments available</p>
          ) : (
            <ul className="list-group">
              {departments.map((d) => (
                <li
                  key={d.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {d.name}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteDepartment(d.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
