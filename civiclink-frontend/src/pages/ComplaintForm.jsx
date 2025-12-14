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
