import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="civic-footer mt-5">
      {/* Main Footer */}
      <div className="container py-5">
        <div className="row">

          {/* Logo & Description */}
          <div className="col-md-4 mb-4">
            <img
              src="/assets/images/civiclink-logo.png"
              alt="CivicLink Logo"
              style={{ height: "80px", marginBottom: "15px" }}
            />
            <p className="footer-text">
              CivicLink is a digital platform designed to connect citizens
              with local authorities to submit, track, and resolve public
              complaints efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Add Complaint</a></li>
              <li><a href="#">Complaint History</a></li>
              <li><a href="#">News</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text mb-1">📍 Ministry of Public Administration</p>
            <p className="footer-text mb-1">📞 +94 11 234 5678</p>
            <p className="footer-text">✉ support@civiclink.lk</p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom text-center py-3">
        <p className="mb-0">
          © 2025 <strong>CivicLink</strong>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
