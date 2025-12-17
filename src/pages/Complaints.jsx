import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const complaintsData = [
  {
    id: 1,
    title: "Potholes in Main Street",
    status: "Pending",
    user: {
      name: "Kamal Perera",
      userId: "U1023",
      email: "kamal@gmail.com",
      phone: "0771234567",
      address: "No 45, Main Street, Colombo",
    },
    location: {
      district: "Colombo",
      province: "Western",
      placeAffected: "Main Street Junction",
    },
    description: "Large potholes causing traffic and accidents.",
    photos: ["/assets/images/roads.jpg"],
    officerComment: "Inspection pending",
  },
  {
    id: 2,
    title: "Water leakage in Kandy",
    status: "Resolved",
    user: {
      name: "Nimal Silva",
      userId: "U2045",
      email: "nimal@gmail.com",
      phone: "0719876543",
      address: "Temple Road, Kandy",
    },
    location: {
      district: "Kandy",
      province: "Central",
      placeAffected: "Temple Road",
    },
    description: "Water pipe leaking continuously.",
    photos: ["/assets/images/water.jpg"],
    officerComment: "Leak fixed successfully",
  },
];

const Complaints = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="p-4 w-100 bg-light">
        <h3 className="mb-4">Complaints Management</h3>

        <div className="accordion" id="complaintsAccordion">
          {complaintsData.map((c, index) => (
            <div className="accordion-item mb-3 shadow-sm" key={c.id}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#complaint-${c.id}`}
                >
                  <strong>Complaint ID #{c.id}</strong> &nbsp;–&nbsp; {c.title}
                  &nbsp;
                  <span className="badge bg-secondary ms-auto">
                    {c.status}
                  </span>
                </button>
              </h2>

              <div
                id={`complaint-${c.id}`}
                className="accordion-collapse collapse"
                data-bs-parent="#complaintsAccordion"
              >
                <div className="accordion-body">
                  
                  {/* User Details */}
                  <h6 className="fw-bold">Complainant Details</h6>
                  <p>
                    <strong>Name:</strong> {c.user.name}<br />
                    <strong>User ID:</strong> {c.user.userId}<br />
                    <strong>Email:</strong> {c.user.email}<br />
                    <strong>Phone:</strong> {c.user.phone}<br />
                    <strong>Address:</strong> {c.user.address}
                  </p>

                  {/* Location Details */}
                  <h6 className="fw-bold">Location Information</h6>
                  <p>
                    <strong>District:</strong> {c.location.district}<br />
                    <strong>Province:</strong> {c.location.province}<br />
                    <strong>Place Affected:</strong> {c.location.placeAffected}
                  </p>

                  {/* Description */}
                  <h6 className="fw-bold">Complaint Description</h6>
                  <p>{c.description}</p>

                  {/* Photos */}
                  <h6 className="fw-bold">Attached Photos</h6>
                  <div className="d-flex gap-3 mb-3">
                    {c.photos.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Complaint"
                        style={{
                          width: "120px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </div>

                  {/* Officer Comment */}
                  <h6 className="fw-bold">Verification Officer Comment</h6>
                  <p className="text-muted">{c.officerComment}</p>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Complaints;
