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
<Form.Group className="mb-3" controlId="address">
  <Form.Label>Address</Form.Label>
  <Form.Control type="text" placeholder="Street address" value={address} onChange={(e) => setAddress(e.target.value)} />
</Form.Group>

<Form.Group className="mb-3" controlId="city">
  <Form.Label>City/Area</Form.Label>
  <Form.Control type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
</Form.Group>

<Form.Group className="mb-3" controlId="district">
  <Form.Label>District</Form.Label>
  <Form.Select value={district} onChange={(e) => setDistrict(e.target.value)}>
    <option value="">Select a district</option>
    <option>Colombo</option>
    <option>Gampaha</option>
    <option>Kandy</option>
  </Form.Select>
</Form.Group>
<Button variant="outline-primary" onClick={() => { setLat('6.9271'); setLng('79.8612'); }}>
  Pick Location on Map
</Button>
<div>
  {lat && lng ? `Latitude: ${lat}, Longitude: ${lng}` : "No location selected"}
</div>
<Form.Group controlId="photo">
  <Form.Label>Photo (optional)</Form.Label>
  <Form.Control type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setPhoto(e.target.files[0])} />
</Form.Group>
<Form.Group controlId="incidentDate">
  <Form.Label>Incident Date</Form.Label>
  <Form.Control type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
</Form.Group>

<Form.Group controlId="urgency">
  <Form.Label>Urgency Level</Form.Label>
  <Form.Check type="radio" label="Low" value="Low" checked={urgency === 'Low'} onChange={(e) => setUrgency(e.target.value)} />
  <Form.Check type="radio" label="Medium" value="Medium" checked={urgency === 'Medium'} onChange={(e) => setUrgency(e.target.value)} />
  <Form.Check type="radio" label="High" value="High" checked={urgency === 'High'} onChange={(e) => setUrgency(e.target.value)} />
</Form.Group>

<Form.Group controlId="preferredContact">
  <Form.Label>Preferred Contact</Form.Label>
  <Form.Check type="radio" label="SMS" value="SMS" checked={preferredContact==='SMS'} onChange={(e)=>setPreferredContact(e.target.value)} />
  <Form.Check type="radio" label="Phone" value="Phone" checked={preferredContact==='Phone'} onChange={(e)=>setPreferredContact(e.target.value)} />
</Form.Group>

<Form.Group controlId="declaration">
  <Form.Check type="checkbox" label="I confirm that information is accurate." checked={declaration} onChange={(e)=>setDeclaration(e.target.checked)} />
</Form.Group>
