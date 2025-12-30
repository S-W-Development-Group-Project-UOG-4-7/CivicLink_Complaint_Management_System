import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiCheckCircle } from 'react-icons/fi';

export default function ComplaintSuccess({ referenceId = 'CL-000000', onSubmitAnother, onBackHome }) {
  const handleSubmitAnother = () => {
    if (onSubmitAnother) onSubmitAnother();
  };

  const handleBackHome = () => {
    if (onBackHome) onBackHome();
  };

  return (
    <Container className="py-5">
      <style>{`
        .success-hero {
          display: grid;
          place-items: center;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          border-radius: 9999px;
          background: linear-gradient(180deg, #ecfdf5, #e7f9f0);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2), inset 0 0 0 1px #d1fae5;
          position: relative;
        }
        .success-hero::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 9999px;
          background: radial-gradient(closest-side, rgba(16,185,129,0.15), transparent 70%);
          z-index: 0;
        }
        .success-icon {
          color: #16a34a;
          filter: drop-shadow(0 4px 8px rgba(22, 163, 74, 0.25));
        }
        .ref-card {
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          border-radius: 12px;
          background: #ffffff;
        }
        .muted { color: #6b7280; }
      `}</style>

      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={7}>
          <Card className="border-0 shadow-sm p-3 p-sm-4" style={{ borderRadius: 16 }}>
            <Card.Body className="text-center">
              <div className="success-hero mb-3 mb-sm-4">
                <FiCheckCircle className="success-icon" size={72} aria-hidden="true" />
              </div>

              <h1 className="h3 h2-sm mb-2" style={{ fontWeight: 700 }}>Complaint Submitted Successfully!</h1>
              <p className="muted mb-4" style={{ lineHeight: 1.6 }}>
                Thank you for submitting your complaint. Our team will review the information and forward it to the relevant authority.
                Please keep your reference ID for future inquiries.
              </p>

              <div className="ref-card p-3 p-sm-4 mb-4" aria-live="polite" aria-atomic="true">
                <div className="muted small mb-1">Reference ID</div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.5 }}>{referenceId}</div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleSubmitAnother}
                  style={{ minWidth: 240, borderRadius: 10 }}
                >
                  Submit Another Complaint
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={handleBackHome}
                  style={{ borderRadius: 10 }}
                >
                  Back to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
