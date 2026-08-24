import { useState } from "react";
import "../Styles/PatientDashboard.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const requests = [
    {
      id: "REQ-1042",
      bloodGroup: "O+",
      units: 2,
      hospital: "Civil Hospital, Bhavnagar",
      status: "Matched",
      date: "22 Aug 2026",
    },
    {
      id: "REQ-1038",
      bloodGroup: "O+",
      units: 1,
      hospital: "Shree Krishna Hospital, Botad",
      status: "Pending",
      date: "15 Aug 2026",
    },
    {
      id: "REQ-1021",
      bloodGroup: "O+",
      units: 3,
      hospital: "Sardar Hospital",
      status: "Fulfilled",
      date: "02 Jul 2026",
    },
  ];

  const donorMatches = [
    { name: "Rakesh Mehta", group: "O+", distance: "1.8 km", phone: "98******21" },
    { name: "Priya Sharma", group: "O+", distance: "3.4 km", phone: "97******08" },
    { name: "Anand Joshi", group: "O+", distance: "6.1 km", phone: "99******45" },
  ];

  const statusClass = (status) => {
    if (status === "Fulfilled") return "status-pill status-fulfilled";
    if (status === "Matched") return "status-pill status-matched";
    return "status-pill status-pending";
  };

  return (
    <div className="patient-dashboard">
      <div className="container-fluid">
        <div className="row">
          {/* ===== Sidebar ===== */}
          <aside className="col-lg-2 d-none d-lg-block sidebar">
            <div className="sidebar-inner">
              <div className="patient-profile-mini text-center mb-4">
                <img
                  src="https://ui-avatars.com/api/?name=Patient+User&background=b3161b&color=fff&bold=true"
                  alt="Patient Avatar"
                  className="mini-avatar"
                />
                <h6 className="mt-2 mb-0">Patient User</h6>
                <small className="text-muted">ID: PT-2026-0417</small>
              </div>

              <ul className="nav flex-column sidebar-nav">
                {[
                  { key: "overview", label: "Overview", icon: "📊" },
                  { key: "requests", label: "My Requests", icon: "🩸" },
                  { key: "donors", label: "Matched Donors", icon: "🤝" },
                  { key: "records", label: "Medical Records", icon: "📁" },
                  { key: "settings", label: "Settings", icon: "⚙️" },
                ].map((item) => (
                  <li className="nav-item" key={item.key}>
                    <button
                      className={
                        "sidebar-link" +
                        (activeTab === item.key ? " active" : "")
                      }
                      onClick={() => setActiveTab(item.key)}
                    >
                      <span className="me-2">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ===== Main Content ===== */}
          <main className="col-lg-10 dashboard-main">
            {/* Top bar */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 dashboard-topbar">
              <div>
                <h3 className="mb-1">
                  Welcome back, <span className="text-gold">Patient</span>
                </h3>
                <p className="text-muted mb-0">
                  Track your blood requests and find nearby donors.
                </p>
              </div>
              <button className="btn btn-gold px-4">
                + New Blood Request
              </button>
            </div>

            {/* Stat cards */}
            <div className="row g-3 g-md-4 my-2">
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🩸</span>
                  <h4>3</h4>
                  <p>Active Requests</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">✅</span>
                  <h4>7</h4>
                  <p>Fulfilled Requests</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🤝</span>
                  <h4>12</h4>
                  <p>Donors Matched</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">⏱</span>
                  <h4>4 hrs</h4>
                  <p>Avg. Match Time</p>
                </div>
              </div>
            </div>

            {/* Requests table */}
            <div className="dashboard-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="mb-0">My Blood Requests</h5>
                <a href="#allRequests" className="btn btn-outline-gold btn-sm">
                  View All
                </a>
              </div>
              <div className="table-responsive">
                <table className="table align-middle dashboard-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Hospital</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-semibold">{r.id}</td>
                        <td>
                          <span className="blood-group-chip-sm">
                            {r.bloodGroup}
                          </span>
                        </td>
                        <td>{r.units}</td>
                        <td>{r.hospital}</td>
                        <td>{r.date}</td>
                        <td>
                          <span className={statusClass(r.status)}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matched donors + quick actions */}
            <div className="row g-4 mt-1">
              <div className="col-lg-7">
                <div className="dashboard-card h-100">
                  <h5 className="mb-3">Nearby Matched Donors</h5>
                  <div className="donor-match-list">
                    {donorMatches.map((d, i) => (
                      <div className="donor-match-row" key={i}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              d.name
                            )}&background=d4af37&color=1a1a1a&bold=true`}
                            alt={d.name}
                            className="match-avatar"
                          />
                          <div>
                            <p className="mb-0 fw-semibold">{d.name}</p>
                            <small className="text-muted">
                              📍 {d.distance} away
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="blood-group-chip-sm">
                            {d.group}
                          </span>
                          <button className="btn btn-outline-gold btn-sm">
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="dashboard-card h-100">
                  <h5 className="mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-gold text-start px-3">
                      🩸 Request Blood Now
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      📁 Upload Medical Records
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      📞 Contact Support
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      🏥 Find Nearby Hospitals
                    </button>
                  </div>

                  <hr className="my-4" />

                  <h6 className="mb-2">Emergency Helpline</h6>
                  <p className="text-muted small mb-0">
                    Call our 24/7 helpline for critical requirements.
                  </p>
                  <p className="helpline-number mt-1">📞 1800-XXX-XXXX</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;