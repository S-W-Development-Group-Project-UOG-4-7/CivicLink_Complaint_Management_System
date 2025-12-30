import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ButtonGroup } from 'react-bootstrap';

const PriorityBadge = ({ priority }) => {
  const map = { EMERGENCY: 'danger', HIGH: 'warning', NORMAL: 'secondary' };
  return <Badge bg={map[priority] || 'secondary'}>{priority}</Badge>;
};

const StatusBadge = ({ status }) => {
  const map = { PENDING: 'secondary', IN_PROGRESS: 'info', RESOLVED: 'success' };
  return <Badge bg={map[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
};

export default function OfficerEmergencyDashboard() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('EMERGENCIES');
  const [busyId, setBusyId] = useState(null);

  const loadEmergencies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/complaints/emergencies/', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load emergencies');
      const data = await res.json();
      setList(data || []);
    } catch (e) {
      setError('Failed to load emergencies. Make sure you are logged in as an officer.');
    } finally {
      setLoading(false);
    }
  };

  const loadByStatus = async (status) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/complaints/by-status?status=${encodeURIComponent(status)}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load by status');
      const data = await res.json();
      setList(data || []);
    } catch (e) {
      setError('Failed to load complaints by status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmergencies(); }, []);

  const onTab = (tab) => {
    setStatusFilter(tab);
    if (tab === 'EMERGENCIES') loadEmergencies(); else loadByStatus(tab);
  };

  const setStatus = async (id, newStatus) => {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/complaints/${id}/set-status/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setList((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (e) {
      setError('Failed to update status.');
    } finally {
      setBusyId(null);
    }
  };

  const header = useMemo(() => {
    if (statusFilter === 'EMERGENCIES') return 'Emergency Complaints';
    if (statusFilter === 'PENDING') return 'Pending Complaints';
    if (statusFilter === 'IN_PROGRESS') return 'In Progress Complaints';
    return 'Resolved Complaints';
  }, [statusFilter]);

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h2 className="h4">{header}</h2>
          <div className="text-muted">Officer dashboard</div>
        </Col>
        <Col className="text-end">
          <ButtonGroup>
            <Button variant={statusFilter === 'EMERGENCIES' ? 'danger' : 'outline-danger'} onClick={() => onTab('EMERGENCIES')}>Emergencies</Button>
            <Button variant={statusFilter === 'PENDING' ? 'secondary' : 'outline-secondary'} onClick={() => onTab('PENDING')}>Pending</Button>
            <Button variant={statusFilter === 'IN_PROGRESS' ? 'info' : 'outline-info'} onClick={() => onTab('IN_PROGRESS')}>In Progress</Button>
            <Button variant={statusFilter === 'RESOLVED' ? 'success' : 'outline-success'} onClick={() => onTab('RESOLVED')}>Resolved</Button>
          </ButtonGroup>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3" role="alert">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
      ) : list.length === 0 ? (
        <Alert variant="light" className="border">No complaints found.</Alert>
      ) : (
        <Row className="g-3">
          {list.map((c) => (
            <Col md={6} key={c.id}>
              <Card className={`shadow-sm ${c.is_emergency ? 'border-danger' : ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong>{c.title}</strong>
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="small text-muted mb-1">Ref: {c.reference_code} • Dept: {c.assigned_department}</div>
                    </div>
                  </div>
                  <p className="mb-2">{c.description}</p>
                  {(c.latitude && c.longitude) && (
                    <div className="small text-muted mb-2">Location: {c.latitude}, {c.longitude}</div>
                  )}
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-info" disabled={busyId === c.id || c.status === 'IN_PROGRESS'} onClick={() => setStatus(c.id, 'IN_PROGRESS')}>
                      {busyId === c.id ? 'Updating…' : 'Mark In Progress'}
                    </Button>
                    <Button size="sm" variant="outline-success" disabled={busyId === c.id || c.status === 'RESOLVED'} onClick={() => setStatus(c.id, 'RESOLVED')}>
                      {busyId === c.id ? 'Updating…' : 'Mark Resolved'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
