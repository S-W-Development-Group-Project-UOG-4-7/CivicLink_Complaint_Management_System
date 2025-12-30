// UserDetailsForm.jsx
// A professional user registration / verification form
// Step 1 of 2: Collect user details prior to OTP verification
// Uses react-bootstrap, react-icons, and accessible validation

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tooltip,
  Alert,
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCity,
  FaMapMarkedAlt,
  FaIdCard,
  FaBirthdayCake,
  FaShieldAlt,
} from 'react-icons/fa';

const UserDetailsForm = ({ onSubmit }) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    nic: '',
    age: '',
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const illustrationUrl =
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop';

  // Validation rules
  const validators = useMemo(
    () => ({
      firstName: (v) => (v ? '' : 'First name is required.'),
      lastName: (v) => (v ? '' : 'Last name is required.'),
      email: (v) =>
        v
          ? /\S+@\S+\.\S+/.test(v)
            ? ''
            : 'Please enter a valid email address.'
          : 'Email is required.',
      phone: (v) =>
        v
          ? /^\+94\s?\d{9}$/.test(v)
            ? ''
            : 'Phone must include country code +94 followed by 9 digits.'
          : 'Phone number is required.',
      address: (v) => (v ? '' : 'Address is required.'),
      city: (v) => (v ? '' : 'City is required.'),
      province: (v) => (v ? '' : 'Province is required.'),
      zip: (v) =>
        v
          ? /^\d{5}$/.test(v)
            ? ''
            : 'Postal code must be 5 digits.'
          : 'Postal code is required.',
      nic: (v) =>
        v
          ? /^(?:\d{9}[VvXx]|\d{12})$/.test(v)
            ? ''
            : 'NIC must be 9 digits followed by V/X or 12 digits.'
          : 'NIC is required.',
      age: (v) => {
        if (!v && v !== 0) return 'Age is required.';
        const num = Number(v);
        if (Number.isNaN(num)) return 'Age must be a number.';
        if (num < 18) return 'You must be at least 18 years old.';
        if (num > 120) return 'Please enter a realistic age.';
        return '';
      },
    }),
    []
  );

  const errors = useMemo(() => {
    const e = {};
    Object.keys(values).forEach((k) => {
      const fn = validators[k];
      e[k] = fn ? fn(values[k]) : '';
    });
    return e;
  }, [values, validators]);

  const isFormValid = useMemo(() => Object.values(errors).every((msg) => !msg), [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (!isFormValid) {
      const firstInvalid = Object.keys(errors).find((k) => errors[k]);
      if (firstInvalid) {
        const el = document.querySelector(`[name="${firstInvalid}"]`);
        if (el && typeof el.focus === 'function') el.focus();
      }
      return;
    }

    try {
      setSubmitError('');
      setSubmitting(true);

      // Simulate API call
      await new Promise((res) => setTimeout(res, 800));

      if (typeof onSubmit === 'function') {
        onSubmit({ ...values, age: Number(values.age) });
      }
    } catch (err) {
      setSubmitError('Something went wrong while verifying your details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderIconTip = (msg) => <Tooltip>{msg}</Tooltip>;

  return (
    <Container className="py-4 py-md-5" fluid="md">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}>
          <Card className="shadow-sm border-0 overflow-hidden">
            <Card.Header className="bg-white border-0 p-4 pb-0">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaShieldAlt size={20} className="text-primary" aria-hidden="true" />
                <div>
                  <h5 className="mb-0">User Registration</h5>
                  <small className="text-muted">
                    Step 1 of 2 · Provide your personal details to proceed
                  </small>
                </div>
              </div>
              <ProgressBar now={50} label="Step 1" visuallyHidden className="mb-3" />
            </Card.Header>

            <Row className="g-0">
              <Col md={5} className="bg-light d-none d-md-block">
                <div className="h-100 w-100 p-3 p-lg-4 d-flex align-items-center">
                  <div>
                    <Image
                      src={illustrationUrl}
                      alt="Illustration representing secure user verification"
                      rounded
                      fluid
                      className="mb-3"
                    />
                    <div className="px-1">
                      <h6 className="mb-1">Why we ask for your details</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        Your information helps us verify your identity and keep your account secure. We
                        only use it for this purpose.
                      </p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={7}>
                <Card.Body className="p-4 p-lg-4">
                  {submitError && (
                    <Alert variant="danger" role="alert" className="mb-4">
                      {submitError}
                    </Alert>
                  )}

                  <Form noValidate onSubmit={handleSubmit}>
                    <Row className="gy-3">
                      {/* First Name */}
                      <Col md={6}>
                        <Form.Group controlId="firstName">
                          <Form.Label>First Name</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Your given name')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaUser />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="Adeepa"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.firstName && !!errors.firstName}
                              aria-invalid={touched.firstName && !!errors.firstName}
                              aria-describedby="firstNameFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="firstNameFeedback">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Last Name */}
                      <Col md={6}>
                        <Form.Group controlId="lastName">
                          <Form.Label>Last Name</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Your family name')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaUser />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder="Gunasekara"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.lastName && !!errors.lastName}
                              aria-invalid={touched.lastName && !!errors.lastName}
                              aria-describedby="lastNameFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="lastNameFeedback">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Email */}
                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('We will send updates here')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaEnvelope />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="adeepa123@example.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.email && !!errors.email}
                              aria-invalid={touched.email && !!errors.email}
                              aria-describedby="emailHelp emailFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="emailFeedback">
                            {errors.email}
                          </Form.Control.Feedback>
                          <Form.Text id="emailHelp" muted>
                            Use an active email address.
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* Phone */}
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label>Mobile Number</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Use +94 followed by 9 digits')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaPhone />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="tel"
                              name="phone"
                              placeholder="+94 771234567"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.phone && !!errors.phone}
                              aria-invalid={touched.phone && !!errors.phone}
                              aria-describedby="phoneHelp phoneFeedback"
                              inputMode="tel"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="phoneFeedback">
                            {errors.phone}
                          </Form.Control.Feedback>
                          <Form.Text id="phoneHelp" muted>
                            Include country code +94.
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      {/* City */}
                      <Col md={4}>
                        <Form.Group controlId="city">
                          <Form.Label>City</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Your city')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaCity />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="city"
                              placeholder="Colombo"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.city && !!errors.city}
                              aria-invalid={touched.city && !!errors.city}
                              aria-describedby="cityFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="cityFeedback">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Province */}
                      <Col md={4}>
                        <Form.Group controlId="province">
                          <Form.Label>Province</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Your province')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaMapMarkedAlt />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="province"
                              placeholder="Western"
                              value={values.province}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.province && !!errors.province}
                              aria-invalid={touched.province && !!errors.province}
                              aria-describedby="provinceFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="provinceFeedback">
                            {errors.province}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* ZIP */}
                      <Col md={4}>
                        <Form.Group controlId="zip">
                          <Form.Label>Postal Code</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Postal code')}>
                              <InputGroup.Text aria-hidden="true">#</InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="zip"
                              placeholder="00100"
                              value={values.zip}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.zip && !!errors.zip}
                              aria-invalid={touched.zip && !!errors.zip}
                              aria-describedby="zipFeedback"
                              inputMode="numeric"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="zipFeedback">
                            {errors.zip}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* NIC */}
                      <Col md={6}>
                        <Form.Group controlId="nic">
                          <Form.Label>National Identity Card (NIC)</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('Government-issued ID')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaIdCard />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="text"
                              name="nic"
                              placeholder="123456789V"
                              value={values.nic}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.nic && !!errors.nic}
                              aria-invalid={touched.nic && !!errors.nic}
                              aria-describedby="nicFeedback"
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="nicFeedback">
                            {errors.nic}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Age */}
                      <Col md={6}>
                        <Form.Group controlId="age">
                          <Form.Label>Age</Form.Label>
                          <InputGroup>
                            <OverlayTrigger placement="top" overlay={renderIconTip('You must be at least 18')}>
                              <InputGroup.Text aria-hidden="true">
                                <FaBirthdayCake />
                              </InputGroup.Text>
                            </OverlayTrigger>
                            <Form.Control
                              type="number"
                              name="age"
                              placeholder="18"
                              value={values.age}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.age && !!errors.age}
                              aria-invalid={touched.age && !!errors.age}
                              aria-describedby="ageFeedback"
                              min={18}
                              required
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" id="ageFeedback">
                            {errors.age}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Actions */}
                      <Col xs={12} className="pt-2">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            Verify your information before continuing to OTP verification.
                          </div>
                          <Button
                            type="submit"
                            variant="primary"
                            className="px-4"
                            disabled={submitting}
                            aria-live="polite"
                          >
                            {submitting ? 'Verifying…' : 'Verify & Continue'}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

UserDetailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default UserDetailsForm;
