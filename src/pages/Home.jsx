import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";



function Home() {

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);



  

  return (
    <>
      <Navbar />

      {/* Carousel Section */}
      <div className="mt-0 position-relative">
        {/* ONE CAPTION FOR ALL SLIDES */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y text-white p-4"
          style={{
            zIndex: 10,
            width: "40%",
            backgroundColor: "rgba(0,0,0,0.35)",
            borderRadius: "10px",
            marginLeft: "40px",
          }}
        >
          <h2 className="fw-bold">Welcome to CivicLink</h2>
          <p className="mb-0">Report issues and improve your community through a centralized digital platform. CivicLink enables citizens to submit civic complaints, monitor real-time status updates, and communicate with authorities, helping create safer, cleaner, and more responsive cities.</p>
           <p></p>
           
            <Link to="/about" className="btn btn-outline-light px-4">
    Read More
  </Link>
        </div>

        <Carousel fade interval={2000} controls={false} indicators={true}>
          {[
            "/assets/images/Lotus-Tower-1.jpg",
            "/assets/images/demodara.jpg",
            "/assets/images/SL_Kandy.jpg",
            "/assets/images/mirissa.JPG",
            "/assets/images/maharagama.jpg",
            "/assets/images/Sigiriya.jpeg",
            "/assets/images/nuwaraeliya.jpg",
          ].map((src, index) => (
            <Carousel.Item key={index}>
              <div className="position-relative">
                <img
                  className="d-block w-100"
                  src={src}
                  alt={`Slide ${index + 1}`}
                  style={{
                    height: "700px",
                    objectFit: "cover",
                    imageRendering: "auto",
                  }}
                />
                {/* optional subtle gradient overlay */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: "linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0))",
                  }}
                ></div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
   {/* How It Works Section */}
<section className="container my-5 fade-in-section text-center">
  <h2 className="fw-bold mb-4">How CivicLink Works</h2>
  <div className="row g-4">
    {[
      { step: 1, title: "Register / Login", icon: "bi-person-circle" },
      { step: 2, title: "Submit Complaint", icon: "bi-file-earmark-text" },
      { step: 3, title: "Track Progress", icon: "bi-clock-history" },
      { step: 4, title: "Get Resolution", icon: "bi-check-circle" },
    ].map((item, index) => (
      <div className="col-md-3" key={index}>
        <div className="card p-4 shadow-sm h-100">
          <i className={`bi ${item.icon} fs-1 text-primary mb-3`}></i>
          <h5 className="fw-bold">{item.title}</h5>
          <p className="text-muted">Step {item.step} in the process</p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Choose District Section */}
<header className="civic-section text-white text-center py-5 fade-in-section">
  <div className="container">
    <h1 className="fw-bold">Choose District Affected</h1>
    <p className="lead mt-3">
      Choose the correct district to submit your complaint
    </p>
  </div>
</header>


{/* District Carousel Section */}
<div className="container my-5">

  {/* Search Bar */}
  <div className="row mb-4">
    <div className="col-md-6 mx-auto position-relative">
      <i className="bi bi-search search-icon"></i>
      <input
        type="text"
        className="form-control form-control-lg ps-5 shadow-sm"
        placeholder="Search your district..."
      />
    </div>
  </div>

  
<div className="container my-5 fade-in-section">
  <Carousel
    indicators={false}
    controls={true}      // ✅ arrows ON
    interval={null}      // ❌ no auto slide
    touch={true}
    className="district-carousel"
  >
    {/* Slide 1 */}
    <Carousel.Item>
      
      <div className="row justify-content-center g-4">

        {[
          { name: "Colombo", img: "/assets/images/colomboButton.webp" },
          { name: "Gampaha", img: "/assets/images/GampahaButton.webp" },
          { name: "Kandy", img: "/assets/images/kandyButton.webp" },
          { name: "Galle", img: "/assets/images/gallebutton.jpg" },
        ].map((district, index) => (
          <div className="col-md-3" key={index}>
            <div className="district-card position-relative">
              <img
                src={district.img}
                alt={district.name}
                className="img-fluid rounded"
              />
              <div className="district-overlay">
                <h5>{district.name}</h5>
              </div>
            </div>
          </div>
        ))}

      </div>
    
    </Carousel.Item>

    {/* Slide 2 */}
    <Carousel.Item>
      
      <div className="row justify-content-center g-4">

        {[
          { name: "Jaffna", img: "/images/jaffna.jpg" },
          { name: "Kurunegala", img: "/images/kurunegala.jpg" },
          { name: "Matara", img: "/images/matara.jpg" },
          { name: "Anuradhapura", img: "/images/anuradhapura.jpg" },
        ].map((district, index) => (
          <div className="col-md-3" key={index}>
            <div className="district-card position-relative">
              <img
                src={district.img}
                alt={district.name}
                className="img-fluid rounded"
              />
              <div className="district-overlay">
                <h5>{district.name}</h5>
              </div>
            </div>
          </div>
        ))}

      </div>
    </Carousel.Item>
  </Carousel>
  </div>
</div>


 
{/* Complaint Categories Section */}
<section className="bg-light py-5 fade-in-section text-center">
  <h2 className="fw-bold mb-4">Report a Complaint</h2>
  <div className="container">
    <div className="row g-4 justify-content-center">
      {[
        { name: "Roads & Railway tracks", img: "/assets/images/roads.jpg" },
        { name: "Electricity board", img: "/assets/images/electricity.jpg" },
        { name: "Water board", img: "/assets/images/water.jpg" },
        { name: "Public transport facilities", img: "/assets/images/publictransport.jpg" },
        { name: "Public places", img: "/assets/images/public.webp" },
        { name: "Garbage issues", img: "/assets/images/garbage.jpg" },
        { name: "Drainage issues", img: "/assets/images/drainage.jpg" },
      ].map((cat, index) => (
        <div className="col-md-3" key={index}>
          <div className="card shadow-sm h-100 category-card">
            <img
              src={cat.img}
              alt={cat.name}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">{cat.name}</h5>
<Link
  to="/submit-complaint"
  className="btn mt-2 text-white w-100"
  style={{ backgroundColor: "#0f2a44", borderColor: "#081c2fff" }}
>
  Report Now
</Link>

            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


{/* Statistics Section */}
<section className="py-5 fade-in-section text-center text-white" style={{backgroundColor: "#0f2a44"}}>
  <h2 className="fw-bold mb-4">Our Impact</h2>
  <div className="container">
    <div className="row g-4 justify-content-center">
      {[
        { label: "Total Complaints", value: 1250, icon: "bi-file-earmark-text" },
        { label: "Resolved", value: 980, icon: "bi-check-circle" },
        { label: "Active Cities", value: 15, icon: "bi-geo-alt" },
      ].map((stat, index) => (
        <div className="col-md-3" key={index}>
          <div className="card shadow-sm h-100 p-4">
            <i className={`bi ${stat.icon} fs-1 text-warning mb-2`}></i>
            <h3 className="fw-bold">{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Section */}
<section className="container py-5 fade-in-section text-center">
  <h2 className="fw-bold mb-4">What Citizens Say</h2>
  <div className="row g-4">
    {[
      { name: "Anura - Colombo", text: "CivicLink helped me report a broken road near my house. It was fixed quickly!" },
      { name: "Kavitha - Kandy", text: "I could track my complaint in real-time. Very user-friendly platform." },
      { name: "Ravi - Galle", text: "This system makes it easier for citizens to communicate with authorities." },
    ].map((testimonial, index) => (
      <div className="col-md-4" key={index}>
        <div className="card shadow-sm h-100 p-4">
          <p>"{testimonial.text}"</p>
          <h6 className="fw-bold mt-3">{testimonial.name}</h6>
        </div>
      </div>
    ))}
  </div>
</section>


 

      <Footer />
    </>
  );
}

export default Home;
