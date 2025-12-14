// Complaint form for CivicLink public users
import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';

export default function ComplaintForm() {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form></Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';

export default function ComplaintForm() {
  // Form state
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [photo, setPhoto] = useState(null);
  const [incidentDate, setIncidentDate] = useState('');
  const [urgency, setUrgency] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [declaration, setDeclaration] = useState(false);

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form></Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
<Form.Group className="mb-3" controlId="department">
  <Form.Label>Responsible Department</Form.Label>
  <Form.Select value={department} onChange={(e) => setDepartment(e.target.value)}>
    <option value="">Select a department</option>
    <option>National Water Supply & Drainage Board (NWSDB)</option>
    <option>Ceylon Electricity Board (CEB)</option>
    <option>Sri Lanka Railways</option>
    <option>Maharagama Municipal Council</option>
    <option>Central Transport Board (CTB)</option>
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3" controlId="category">
  <Form.Label>Complaint Category</Form.Label>
  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="">Select a category</option>
    <option>Service interruption</option>
    <option>Billing issue</option>
    <option>Infrastructure damage</option>
    <option>Safety concern</option>
    <option>Delay or negligence</option>
    <option>Other</option>
  </Form.Select>
</Form.Group>
<Form.Group className="mb-3" controlId="title">
  <Form.Label>Complaint Title</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter title"
    value={title}
    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
  />
</Form.Group>

<Form.Group className="mb-3" controlId="description">
  <Form.Label>Complaint Description</Form.Label>
  <Form.Control
    as="textarea"
    rows={5}
    placeholder="Describe your complaint"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</Form.Group>
