  import React, { useEffect, useState } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';

  const Navbar = () => {
    const [navbarBg, setNavbarBg] = useState('bg-transparent');
    const [linkColor, setLinkColor] = useState('text-white');

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setNavbarBg('bg-white shadow');
          setLinkColor('text-dark');
        } else {
          setNavbarBg('bg-transparent');
          setLinkColor('text-white');
        }
      };

      window.addEventListener('scroll', handleScroll);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
      <nav className={`navbar navbar-expand-lg fixed-top transition ${navbarBg}`} style={{ transition: 'background-color 0.5s' }}>
        <div className="container">
          {/* Logo / Brand */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="/assets/images/civiclink-logo.png"
              alt="CivicLink Logo"
              style={{
                height: '90px',
                width: 'auto',
                objectFit: 'contain',
                marginTop: '-20px',
              }}
            />
          </a>

          {/* Hamburger Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <li className="nav-item">
                <a className={`nav-link ${linkColor}`} href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${linkColor}`} href="#">Add complain</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${linkColor}`} href="#">News</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${linkColor}`} href="#">About</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${linkColor}`} href="#">Complain history</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
