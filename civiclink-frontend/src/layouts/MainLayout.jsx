// src/layouts/MainLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {/* Add margin top to avoid navbar overlapping content */}
      <div style={{ marginTop: '100px', minHeight: '80vh' }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
