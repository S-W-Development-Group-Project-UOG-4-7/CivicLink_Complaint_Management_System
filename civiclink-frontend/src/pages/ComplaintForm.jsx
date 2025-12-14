import React, { useMemo, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
  Alert,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import {
  FiArrowLeft,
  FiUpload,
  FiMapPin,
  FiCheckCircle,
} from 'react-icons/fi';
import MapPicker from './MapPicker';
import ComplaintSuccess from './ComplaintSuccess';

export default function ComplaintForm({ userData = {}, onSuccess, googleMapsApiKey, successRedirectPath }) {
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
  const [photoPreview, setPhotoPreview] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [urgency, setUrgency] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [declaration, setDeclaration] = useState(false);

  // UI state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState('');

  const allowedImageTypes = useMemo(() => ['image/jpeg', 'image/jpg', 'image/png'], []);
  const maxFileSizeBytes = 5 * 1024 * 1024; // 5MB

  const validate = () => {
    const e = {};
    if (!department) e.department = 'Please select a responsible department.';
    if (!category) e.category = 'Please select a complaint category.';
    if (!title.trim()) e.title = 'Please provide a title for your complaint.';
    if (title.length > 100) e.title = 'Title must be at most 100 characters.';
    if (!description.trim() || description.trim().length < 20)
      e.description = 'Description must be at least 20 characters.';
    if (!address.trim()) e.address = 'Please provide the address related to the complaint.';
    if (!district) e.district = 'Please select your district in Sri Lanka.';
    if (!incidentDate) e.incidentDate = 'Please select the incident date.';
    if (!urgency) e.urgency = 'Please select an urgency level.';
    if (!preferredContact) e.preferredContact = 'Please select a preferred contact method.';
    if (photo) {
      if (!allowedImageTypes.includes(photo.type)) e.photo = 'Only JPG and PNG image files are allowed.';
      if (photo.size > maxFileSizeBytes) e.photo = 'Image must be 5MB or smaller.';
    }
    if (!declaration) e.declaration = 'You must confirm the declaration to proceed.';
    return e;
  };

  const isFormValid = useMemo(() => {
    const e = validate();
    return Object.keys(e).length === 0;
  }, [department, category, title, description, address, district, incidentDate, urgency, preferredContact, declaration, photo]);

  const handleFileChange = (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) {
      setPhoto(null);
      setPhotoPreview('');
      setErrors((prev) => ({ ...prev, photo: undefined }));
      return;
    }
    let errorText = '';
    if (!allowedImageTypes.includes(file.type)) {
      errorText = 'Only JPG and PNG image files are allowed.';
    } else if (file.size > maxFileSizeBytes) {
      errorText = 'Image must be 5MB or smaller.';
    }
    setPhoto(file);
    try {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } catch (e) {
      setPhotoPreview('');
    }
    setErrors((prev) => ({ ...prev, photo: errorText || undefined }));
  };

  const handlePickLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(String(latitude));
          setLng(String(longitude));
        },
        () => {
          // Fallback center: Colombo
          setLat('6.9271');
          setLng('79.8612');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      // Fallback center: Colombo
      setLat('6.9271');
      setLng('79.8612');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSuccessRef('');

    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1200));

    const ref = `CL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSuccessRef(ref);
    setSubmitting(false);

    if (onSuccess) {
      try {
        onSuccess(ref);
      } catch {}
    }

    if (successRedirectPath && typeof window !== 'undefined') {
      try {
        const url = `${successRedirectPath}${successRedirectPath.includes('?') ? '&' : '?'}ref=${encodeURIComponent(ref)}`;
        window.location.assign(url);
        return; // stop further reset if navigating away
      } catch {}
    }

    // Optional reset of fields after success (keep location and file cleared)
    setDepartment('');
    setCategory('');
    setTitle('');
    setDescription('');
    setAddress('');
    setCity('');
    setLat('');
    setLng('');
    setPhoto(null);
    setPhotoPreview('');
    setIncidentDate('');
    setUrgency('');
    setPreferredContact('');
    setDeclaration(false);
  };

  const goBack = () => {
    if (window && window.history) window.history.back();
  };

  if (successRef && !successRedirectPath) {
    return (
      <ComplaintSuccess
        referenceId={successRef}
        onSubmitAnother={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
        onBackHome={() => {
          if (typeof window !== 'undefined' && window.history) {
            window.history.back();
          }
        }}
      />
    );
  }

  return (
    <Container className="py-4">
      {/* Inline styles for simple animations to avoid external CSS files */}
      <style>{`
        @keyframes floatY { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
      `}</style>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Button
            variant="link"
            onClick={goBack}
            className="px-0 mb-2 text-decoration-none"
            aria-label="Go back to OTP verification"
          >
            <FiArrowLeft className="me-1" /> Back to OTP Verification
          </Button>

          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="me-3">
                  <h2 className="h4 mb-1">Submit a Complaint</h2>
                  <div className="text-muted">Provide details about the issue you are facing in Sri Lanka</div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ minWidth: 160 }} aria-label="Progress: Step 3 of 3">
                    <div className="small text-muted text-end mb-1">Step 3 of 3</div>
                    <ProgressBar now={100} visuallyHidden label="100%" />
                  </div>
                  {/* Simple animated SVG illustration */}
                  <svg width="56" height="56" viewBox="0 0 24 24" role="img" aria-label="Complaint illustration"
                       style={{ color: '#0d6efd', animation: 'floatY 3s ease-in-out infinite' }}>
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7v3.268l-1.447 2.894A1 1 0 0 0 4.447 17H7v2a3 3 0 0 0 3 3h4a7 7 0 0 0 7-7V9a7 7 0 0 0-7-7h-2Zm-1 7h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2Zm0 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2Z"/>
                  </svg>
                </div>
              </div>

              {successRef && (
                <Alert variant="success" className="d-flex align-items-start" role="alert">
                  <FiCheckCircle className="me-2 mt-1" />
                  <div>
                    Your complaint has been submitted successfully. Reference ID: <strong>{successRef}</strong>
                  </div>
                </Alert>
              )}

              {/* Verified user details (read-only) */}
              {(userData?.name || userData?.nic || userData?.phone) && (
                <Card className="mb-3" bg="light" border="secondary" aria-label="Verified user details">
                  <Card.Body className="py-3">
                    <Row>
                      <Col sm={4} className="mb-2">
                        <div className="text-muted small">Name</div>
                        <div className="fw-semibold" aria-label="Verified name">{userData.name || '—'}</div>
                      </Col>
                      <Col sm={4} className="mb-2">
                        <div className="text-muted small">NIC</div>
                        <div className="fw-semibold" aria-label="Verified NIC">{userData.nic || '—'}</div>
                      </Col>
                      <Col sm={4} className="mb-2">
                        <div className="text-muted small">Mobile</div>
                        <div className="fw-semibold" aria-label="Verified mobile">{userData.phone || userData.mobile || '—'}</div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                {/* Department */}
                <Form.Group className="mb-3" controlId="department">
                  <Form.Label>Responsible Department</Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    aria-invalid={!!errors.department}
                    aria-describedby={errors.department ? 'department-error' : undefined}
                    required
                  >
                    <option value="">Select a department</option>
                    <option>National Water Supply & Drainage Board (NWSDB)</option>
                    <option>Ceylon Electricity Board (CEB)</option>
                    <option>Sri Lanka Railways</option>
                    <option>Maharagama Municipal Council</option>
                    <option>Central Transport Board (CTB)</option>
                  </Form.Select>
                  {errors.department && (
                    <Form.Text id="department-error" className="text-danger">{errors.department}</Form.Text>
                  )}
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Complaint Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    required
                  >
                    <option value="">Select a category</option>
                    <option>Service interruption</option>
                    <option>Billing issue</option>
                    <option>Infrastructure damage</option>
                    <option>Safety concern</option>
                    <option>Delay or negligence</option>
                    <option>Other</option>
                  </Form.Select>
                  {errors.category && (
                    <Form.Text id="category-error" className="text-danger">{errors.category}</Form.Text>
                  )}
                </Form.Group>

                {/* Title */}
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Complaint Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Frequent power cuts in the area"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : 'title-help'}
                    required
                  />
                  <div className="d-flex justify-content-between">
                    <Form.Text id="title-help" muted>
                      Max 100 characters
                    </Form.Text>
                    <Form.Text muted>
                      {title.length}/100
                    </Form.Text>
                  </div>
                  {errors.title && (
                    <Form.Text id="title-error" className="text-danger d-block">{errors.title}</Form.Text>
                  )}
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Complaint Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe what happened, when it occurred, and its impact. Include any relevant details that can help the authorities respond."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : 'description-help'}
                    required
                  />
                  <Form.Text id="description-help" muted>
                    Minimum 20 characters
                  </Form.Text>
                  {errors.description && (
                    <Form.Text id="description-error" className="text-danger d-block">{errors.description}</Form.Text>
                  )}
                </Form.Group>

                {/* Location */}
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Street address, landmark, etc. (e.g., No. 10, High Level Rd)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        aria-invalid={!!errors.address}
                        aria-describedby={errors.address ? 'address-error' : undefined}
                        required
                      />
                      {errors.address && (
                        <Form.Text id="address-error" className="text-danger d-block">{errors.address}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City/Area</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Maharagama"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        aria-label="City or Area"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* District (Sri Lanka) */}
                <Form.Group className="mb-3" controlId="district">
                  <Form.Label>District (Sri Lanka)</Form.Label>
                  <Form.Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    aria-invalid={!!errors.district}
                    aria-describedby={errors.district ? 'district-error' : undefined}
                    required
                  >
                    <option value="">Select a district</option>
                    <option>Colombo</option>
                    <option>Gampaha</option>
                    <option>Kalutara</option>
                    <option>Kandy</option>
                    <option>Matale</option>
                    <option>Nuwara Eliya</option>
                    <option>Galle</option>
                    <option>Matara</option>
                    <option>Hambantota</option>
                    <option>Jaffna</option>
                    <option>Kilinochchi</option>
                    <option>Mannar</option>
                    <option>Vavuniya</option>
                    <option>Mullaitivu</option>
                    <option>Batticaloa</option>
                    <option>Ampara</option>
                    <option>Trincomalee</option>
                    <option>Kurunegala</option>
                    <option>Puttalam</option>
                    <option>Anuradhapura</option>
                    <option>Polonnaruwa</option>
                    <option>Badulla</option>
                    <option>Monaragala</option>
                    <option>Ratnapura</option>
                    <option>Kegalle</option>
                  </Form.Select>
                  {errors.district && (
                    <Form.Text id="district-error" className="text-danger">{errors.district}</Form.Text>
                  )}
                </Form.Group>

                <Card className="mb-3 border-0" bg="light">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <FiMapPin aria-hidden="true" />
                        <div>
                          <div className="fw-semibold">GPS Location</div>
                          <div className="text-muted small">
                            {lat && lng ? (
                              <span>Latitude: {lat}, Longitude: {lng}</span>
                            ) : (
                              <span>No location selected</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline-primary" onClick={handlePickLocation}>
                        <FiMapPin className="me-1" /> Pick Location on Map
                      </Button>
                    </div>

                    <div className="mt-3">
                      <MapPicker
                        apiKey={googleMapsApiKey}
                        value={{ lat, lng }}
                        onChange={(pos) => {
                          setLat(String(pos.lat));
                          setLng(String(pos.lng));
                        }}
                        height="260px"
                        center={{
                          lat: lat ? parseFloat(lat) : 7.8731,
                          lng: lng ? parseFloat(lng) : 80.7718,
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>

                {/* Photo upload */}
                <Form.Group className="mb-3" controlId="photo">
                  <Form.Label>Photo (optional)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="photo-addon">
                      <FiUpload aria-hidden="true" />
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleFileChange}
                      aria-describedby={errors.photo ? 'photo-error' : 'photo-help'}
                    />
                  </InputGroup>
                  <div className="d-flex justify-content-between">
                    <Form.Text id="photo-help" muted>
                      Accepted types: JPG, PNG. Max size: 5MB.
                    </Form.Text>
                    {photo && (
                      <Form.Text muted>
                        Selected: {photo.name}
                      </Form.Text>
                    )}
                  </div>
                  {errors.photo && (
                    <Form.Text id="photo-error" className="text-danger d-block">{errors.photo}</Form.Text>
                  )}
                  {photoPreview && !errors.photo && (
                    <div className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Selected evidence preview"
                        style={{ maxHeight: 120, borderRadius: 6, border: '1px solid #e5e7eb' }}
                      />
                    </div>
                  )}
                </Form.Group>

                {/* Incident date */}
                <Form.Group className="mb-3" controlId="incidentDate">
                  <Form.Label>Incident Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    aria-invalid={!!errors.incidentDate}
                    aria-describedby={errors.incidentDate ? 'incidentDate-error' : undefined}
                    required
                  />
                  {errors.incidentDate && (
                    <Form.Text id="incidentDate-error" className="text-danger d-block">{errors.incidentDate}</Form.Text>
                  )}
                </Form.Group>

                {/* Urgency */}
                <Form.Group className="mb-3" controlId="urgency">
                  <Form.Label>Urgency Level</Form.Label>
                  <div role="radiogroup" aria-labelledby="urgency">
                    <Form.Check
                      type="radio"
                      name="urgency"
                      id="urgency-low"
                      label="Low"
                      value="Low"
                      checked={urgency === 'Low'}
                      onChange={(e) => setUrgency(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      name="urgency"
                      id="urgency-medium"
                      label="Medium"
                      value="Medium"
                      checked={urgency === 'Medium'}
                      onChange={(e) => setUrgency(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      name="urgency"
                      id="urgency-high"
                      label="High"
                      value="High"
                      checked={urgency === 'High'}
                      onChange={(e) => setUrgency(e.target.value)}
                    />
                  </div>
                  {errors.urgency && (
                    <Form.Text className="text-danger d-block">{errors.urgency}</Form.Text>
                  )}
                </Form.Group>

                {/* Preferred contact */}
                <Form.Group className="mb-3" controlId="preferredContact">
                  <Form.Label>Preferred Contact Method</Form.Label>
                  <div role="radiogroup" aria-labelledby="preferredContact">
                    <Form.Check
                      type="radio"
                      name="prefContact"
                      id="pref-sms"
                      label="SMS"
                      value="SMS"
                      checked={preferredContact === 'SMS'}
                      onChange={(e) => setPreferredContact(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      name="prefContact"
                      id="pref-phone"
                      label="Phone call"
                      value="Phone call"
                      checked={preferredContact === 'Phone call'}
                      onChange={(e) => setPreferredContact(e.target.value)}
                    />
                  </div>
                  {errors.preferredContact && (
                    <Form.Text className="text-danger d-block">{errors.preferredContact}</Form.Text>
                  )}
                </Form.Group>

                {/* Declaration */}
                <Form.Group className="mb-3" controlId="declaration">
                  <Form.Check
                    type="checkbox"
                    label="I confirm that the information provided is accurate to the best of my knowledge."
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    aria-invalid={!!errors.declaration}
                    aria-describedby={errors.declaration ? 'declaration-error' : undefined}
                    required
                  />
                  {errors.declaration && (
                    <Form.Text id="declaration-error" className="text-danger d-block">{errors.declaration}</Form.Text>
                  )}
                </Form.Group>

                {/* Actions */}
                <div className="d-flex gap-2 justify-content-between">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={goBack}
                    aria-label="Go back to OTP verification"
                  >
                    <FiArrowLeft className="me-1" /> Back
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!isFormValid || submitting}
                    aria-disabled={!isFormValid || submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Complaint'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
