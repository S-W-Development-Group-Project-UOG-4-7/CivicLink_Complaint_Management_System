import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function RegisterCitizen() {
  const [values, setValues] = useState({ username: '', password: '', nic: '', full_name: '', address: '', gn_division: '' });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState({ type: '', message: '' });

  const validators = useMemo(() => ({
    username: (v) => (v ? '' : 'Username is required.'),
    password: (v) => (v && v.length >= 8 ? '' : 'Password must be at least 8 characters.'),
    nic: (v) => (v ? /^(?:\d{9}[VvXx]|\d{12})$/.test(v) ? '' : 'NIC must be 9 digits + V/X or 12 digits.' : 'NIC is required.'),
    full_name: (v) => (v ? '' : 'Full name is required.'),
    address: (v) => (v ? '' : 'Address is required.'),
    gn_division: (v) => (v ? '' : 'GN division is required.'),
  }), []);

  const validate = () => {
    const e = {};
    Object.keys(values).forEach((k) => {
      const fn = validators[k];
      if (fn) e[k] = fn(values[k]);
    });
    setErrors(e);
    return Object.values(e).every((msg) => !msg);
  };

  const onChange = (e) => setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (!validate()) return;
    setSubmitting(true);
    setBanner({ type: '', message: '' });
    try {
      const res = await fetch('/api/citizens/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data && typeof data === 'object') setErrors((prev) => ({ ...prev, ...data }));
        setBanner({ type: 'danger', message: 'Failed to register citizen.' });
        return;
      }
      setBanner({ type: 'success', message: 'Citizen registered successfully.' });
      setValues({ username: '', password: '', nic: '', full_name: '', address: '', gn_division: '' });
      setTouched({});
    } catch {
      setBanner({ type: 'danger', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-sm">
            <Card.Header>
              <strong>Register Citizen</strong>
              <div className="text-muted small">Officer only</div>
            </Card.Header>
            <Card.Body>
              {banner.message && <Alert variant={banner.type} className="mb-3">{banner.message}</Alert>}
              <Form noValidate onSubmit={onSubmit}>
                <Row className="gy-3">
                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" name="username" value={values.username} onChange={onChange} onBlur={onBlur} isInvalid={touched.username && !!errors.username} required />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" name="password" value={values.password} onChange={onChange} onBlur={onBlur} isInvalid={touched.password && !!errors.password} required minLength={8} />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="nic">
                      <Form.Label>NIC</Form.Label>
                      <Form.Control type="text" name="nic" value={values.nic} onChange={onChange} onBlur={onBlur} isInvalid={touched.nic && !!errors.nic} placeholder="123456789V or 200012345678" required />
                      <Form.Control.Feedback type="invalid">{errors.nic}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="full_name">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" name="full_name" value={values.full_name} onChange={onChange} onBlur={onBlur} isInvalid={touched.full_name && !!errors.full_name} required />
                      <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control as="textarea" rows={2} name="address" value={values.address} onChange={onChange} onBlur={onBlur} isInvalid={touched.address && !!errors.address} required />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="gn_division">
                      <Form.Label>GN Division</Form.Label>
                      <Form.Control type="text" name="gn_division" value={values.gn_division} onChange={onChange} onBlur={onBlur} isInvalid={touched.gn_division && !!errors.gn_division} required />
                      <Form.Control.Feedback type="invalid">{errors.gn_division}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Registering…' : 'Register Citizen'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
