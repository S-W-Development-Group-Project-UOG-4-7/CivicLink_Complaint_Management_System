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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${navbarBg}`} style={{ transition: '0.5s' }}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src="/assets/images/civiclink-logo.png"
            alt="CivicLink Logo"
            style={{ height: '70px' }}
          />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className={`nav-link ${linkColor}`} href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${linkColor}`} href="/complaint">Add Complaint</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${linkColor}`} href="/news">News</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${linkColor}`} href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${linkColor}`} href="/history">Complaint History</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
