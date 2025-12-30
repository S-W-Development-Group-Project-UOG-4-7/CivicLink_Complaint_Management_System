import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function OfficerLayout({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const isActive = (path) => (loc.pathname.startsWith(path) ? 'active fw-semibold' : '');
  return (
    <Container fluid className="py-3">
      <Row>
        <Col md={3} lg={2} className="mb-3">
          <div className="border rounded p-3">
            <div className="mb-3">
              <div className="small text-muted">Signed in as</div>
              <div className="fw-semibold">{user?.username || 'Officer'}</div>
            </div>
            <Nav className="flex-column gap-1">
              <Nav.Item>
                <Link className={`nav-link ${isActive('/officer/emergencies')}`} to="/officer/emergencies">🚨 Emergencies</Link>
              </Nav.Item>
              <Nav.Item>
                <Link className={`nav-link ${isActive('/officer/register-citizen')}`} to="/officer/register-citizen">👤 Register Citizen</Link>
              </Nav.Item>
              <hr />
              <button className="btn btn-outline-secondary w-100" onClick={logout}>Sign out</button>
            </Nav>
          </div>
        </Col>
        <Col md={9} lg={10}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}
