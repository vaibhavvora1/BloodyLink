import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import api from '../../services/api';
import StockSkeleton from '../../components/stock/StockSkeleton';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 1420, activeDonors: 1120, pendingRequests: 4 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (id, newStatus) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    toast.info(`Request ${id} marked as ${newStatus}`);
  };

  return (
    <div className="container app-container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Admin Command Center</h1>
          <p className="text-muted small mb-0">Platform overview, moderation, and inventory management</p>
        </div>
        <Link to="/admin/blood-stock" className="btn btn-blood-secondary">
          <i className="bi bi-box-seam-fill me-1"></i> Manage Blood Stock
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 d-flex align-items-center gap-3">
            <div className="bg-light p-3 rounded-circle text-danger fs-4"><i className="bi bi-people-fill"></i></div>
            <div>
              <span className="text-muted small d-block">Registered Donors</span>
              <span className="fs-5 fw-bold">{stats.activeDonors}</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 d-flex align-items-center gap-3">
            <div className="bg-light p-3 rounded-circle text-warning fs-4"><i className="bi bi-bell-fill"></i></div>
            <div>
              <span className="text-muted small d-block">Pending Requests</span>
              <span className="fs-5 fw-bold text-warning">{requests.filter((r) => r.status === 'Pending').length}</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-3 d-flex align-items-center gap-3">
            <div className="bg-light p-3 rounded-circle text-success fs-4"><i className="bi bi-heart-pulse-fill"></i></div>
            <div>
              <span className="text-muted small d-block">Fulfilled Cases</span>
              <span className="fs-5 fw-bold text-success">{requests.filter((r) => r.status === 'Fulfilled').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="premium-card p-3">
            <h2 className="h6 fw-bold mb-3 text-uppercase text-muted">Admin Quick Menu</h2>
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header><i className="bi bi-shield-check me-2"></i> Verification</Accordion.Header>
                <Accordion.Body className="small text-muted">
                  Donor identity checks and background verification queue.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header><i className="bi bi-hospital me-2"></i> Hospitals</Accordion.Header>
                <Accordion.Body className="small text-muted">
                  45 partner healthcare centers and emergency transfusions.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header><i className="bi bi-gear me-2"></i> Settings</Accordion.Header>
                <Accordion.Body className="small text-muted">
                  System logs, safety thresholds, and alerts dispatch.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="premium-card p-4">
            <h2 className="h5 fw-bold mb-3">Emergency Request Approvals</h2>
            {loading ? (
              <StockSkeleton count={3} type="table" />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small">Patient</th>
                      <th className="small">Blood</th>
                      <th className="small">Hospital</th>
                      <th className="small">Status</th>
                      <th className="small text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td className="small fw-semibold">{r.patientName}</td>
                        <td><span className="blood-badge py-0 px-2">{r.bloodGroup}</span></td>
                        <td className="small text-muted">{r.hospital}</td>
                        <td><span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                        <td className="text-end">
                          {r.status === 'Pending' ? (
                            <div className="d-flex justify-content-end gap-1">
                              <button type="button" className="btn btn-sm btn-outline-success py-0 px-2" onClick={() => handleAction(r.id, 'Approved')}>
                                Approve
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => handleAction(r.id, 'Rejected')}>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="small text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
