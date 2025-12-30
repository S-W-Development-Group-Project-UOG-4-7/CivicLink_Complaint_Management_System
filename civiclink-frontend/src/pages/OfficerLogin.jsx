import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OfficerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state && location.state.from) || '/officer/emergencies';

  const [values, setValues] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(values.username, values.password);
      navigate(redirectTo, { replace: true });
    } catch (e1) {
      setError(e1?.message || 'Invalid credentials or not an Officer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Header><strong>Officer Login</strong></Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" value={values.username} onChange={(e) => setValues((p) => ({ ...p, username: e.target.value }))} autoComplete="username" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={values.password} onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))} autoComplete="current-password" required />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
