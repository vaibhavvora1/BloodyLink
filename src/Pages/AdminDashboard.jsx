import { useState, useMemo } from "react";
import "../Styles/AdminDashboard.css";

const initialRequests = [
  {
    id: "REQ-2210",
    patient: "Meera Iyer",
    group: "O+",
    units: 2,
    hospital: "Civil Hospital, Bhavnagar",
    date: "24 Aug 2026",
    status: "Pending",
  },
  {
    id: "REQ-2209",
    patient: "Kiran Patel",
    group: "B-",
    units: 1,
    hospital: "Sardar Hospital",
    date: "23 Aug 2026",
    status: "Pending",
  },
  {
    id: "REQ-2205",
    patient: "Arjun Nair",
    group: "A+",
    units: 3,
    hospital: "Shree Krishna Hospital, Botad",
    date: "21 Aug 2026",
    status: "Approved",
  },
  {
    id: "REQ-2198",
    patient: "Sanya Gupta",
    group: "AB+",
    units: 1,
    hospital: "Red Cross Society, Bhavnagar",
    date: "18 Aug 2026",
    status: "Fulfilled",
  },
  {
    id: "REQ-2190",
    patient: "Devansh Rao",
    group: "O-",
    units: 2,
    hospital: "Civil Hospital, Bhavnagar",
    date: "14 Aug 2026",
    status: "Rejected",
  },
];

const donorRegistrations = [
  { name: "Rohan Mehta", group: "O+", city: "Botad", date: "23 Aug 2026", status: "Pending" },
  { name: "Ishita Shah", group: "A-", city: "Bhavnagar", date: "22 Aug 2026", status: "Verified" },
  { name: "Karan Thakkar", group: "B+", city: "Botad", date: "21 Aug 2026", status: "Verified" },
  { name: "Neha Joshi", group: "AB-", city: "Ahmedabad", date: "20 Aug 2026", status: "Pending" },
];

const initialStock = [
  { group: "A+", units: 45, threshold: 20, updated: "24 Aug 2026" },
  { group: "A-", units: 12, threshold: 20, updated: "23 Aug 2026" },
  { group: "B+", units: 60, threshold: 20, updated: "24 Aug 2026" },
  { group: "B-", units: 8, threshold: 20, updated: "22 Aug 2026" },
  { group: "AB+", units: 30, threshold: 15, updated: "23 Aug 2026" },
  { group: "AB-", units: 15, threshold: 15, updated: "21 Aug 2026" },
  { group: "O+", units: 90, threshold: 30, updated: "24 Aug 2026" },
  { group: "O-", units: 20, threshold: 30, updated: "24 Aug 2026" },
];

const getLevel = (units, threshold = 20) => {
  if (units < threshold) return { label: "Critical", className: "level-critical" };
  if (units < threshold * 2.5) return { label: "Low", className: "level-low" };
  if (units < threshold * 4) return { label: "Adequate", className: "level-adequate" };
  return { label: "Well Stocked", className: "level-good" };
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState(initialRequests);

  const [stock, setStock] = useState(initialStock);
  const [stockSearch, setStockSearch] = useState("");
  const [stockLevelFilter, setStockLevelFilter] = useState("all");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editUnits, setEditUnits] = useState("");

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
  };

  const statusClass = (status) => {
    if (status === "Fulfilled") return "status-pill status-fulfilled";
    if (status === "Approved") return "status-pill status-approved";
    if (status === "Rejected") return "status-pill status-rejected";
    return "status-pill status-pending";
  };

  const stockRows = useMemo(() => {
    let result = stock.map((s) => ({ ...s, level: getLevel(s.units, s.threshold) }));

    if (stockSearch.trim()) {
      result = result.filter((r) =>
        r.group.toLowerCase().includes(stockSearch.trim().toLowerCase())
      );
    }
    if (stockLevelFilter !== "all") {
      result = result.filter((r) => r.level.className === stockLevelFilter);
    }
    return result;
  }, [stock, stockSearch, stockLevelFilter]);

  const stockTotals = useMemo(() => {
    const totalUnits = stock.reduce((sum, s) => sum + s.units, 0);
    const criticalCount = stock.filter(
      (s) => getLevel(s.units, s.threshold).className === "level-critical"
    ).length;
    return { totalUnits, criticalCount };
  }, [stock]);

  const adjustUnits = (group, delta) => {
    // Replace with real API call, e.g. axios.patch(`/api/inventory/${group}`, { delta });
    setStock((prev) =>
      prev.map((s) =>
        s.group === group
          ? { ...s, units: Math.max(0, s.units + delta), updated: todayLabel() }
          : s
      )
    );
  };

  const startEdit = (row) => {
    setEditingGroup(row.group);
    setEditUnits(String(row.units));
  };

  const cancelEdit = () => {
    setEditingGroup(null);
    setEditUnits("");
  };

  const saveEdit = (group) => {
    const parsed = parseInt(editUnits, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;

    // Replace with real API call, e.g. axios.patch(`/api/inventory/${group}`, { units: parsed });
    setStock((prev) =>
      prev.map((s) =>
        s.group === group ? { ...s, units: parsed, updated: todayLabel() } : s
      )
    );
    setEditingGroup(null);
    setEditUnits("");
  };

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        <div className="row">
          {/* ===== Sidebar ===== */}
          <aside className="col-lg-2 d-none d-lg-block sidebar">
            <div className="sidebar-inner">
              <div className="patient-profile-mini text-center mb-4">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=b3161b&color=fff&bold=true"
                  alt="Admin Avatar"
                  className="mini-avatar"
                />
                <h6 className="mt-2 mb-0">Admin User</h6>
                <small className="text-muted">Super Admin · ADM-2026-001</small>
              </div>

              <ul className="nav flex-column sidebar-nav">
                {[
                  { key: "overview", label: "Overview", icon: "📊" },
                  { key: "donors", label: "Donors", icon: "🧑‍🤝‍🧑" },
                  { key: "requests", label: "Requests", icon: "🩸" },
                  { key: "camps", label: "Camps", icon: "⛺" },
                  { key: "inventory", label: "Inventory", icon: "🧪" },
                  { key: "reports", label: "Reports", icon: "📈" },
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

              <div className="sidebar-footer mt-4 pt-3">
                <button className="sidebar-link logout-link">
                  <span className="me-2">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* ===== Main Content ===== */}
          <main className="col-lg-10 dashboard-main">
            {/* Top bar */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 dashboard-topbar">
              <div>
                <h3 className="mb-1">
                  Admin <span className="text-gold">Control Center</span>
                </h3>
                <p className="text-muted mb-0">
                  Monitor donors, requests, and blood stock in real time.
                </p>
              </div>
              <div className="d-flex align-items-center gap-3 topbar-actions">
                <div className="topbar-search d-none d-md-flex">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search donors, requests..."
                  />
                </div>
                <button className="notif-bell" aria-label="Notifications">
                  🔔
                  <span className="notif-badge">3</span>
                </button>
                <button className="btn btn-gold px-4">+ Add Camp</button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="row g-3 g-md-4 my-2">
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">👥</span>
                  <h4>1,284</h4>
                  <p>Total Donors</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">🧑‍⚕️</span>
                  <h4>356</h4>
                  <p>Total Patients</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">⏳</span>
                  <h4>18</h4>
                  <p>Pending Requests</p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="dash-stat-card">
                  <span className="dash-stat-icon">⛺</span>
                  <h4>6</h4>
                  <p>Active Camps</p>
                </div>
              </div>
            </div>

            {/* Blood Stock Table */}
            <div className="dashboard-card mt-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <h5 className="mb-1">Blood Stock</h5>
                  <p className="text-muted small mb-0">
                    {stockTotals.totalUnits} total units
                    {stockTotals.criticalCount > 0 && (
                      <span className="critical-flag ms-2">
                        ⚠ {stockTotals.criticalCount} group
                        {stockTotals.criticalCount > 1 ? "s" : ""} critical
                      </span>
                    )}
                  </p>
                </div>
                <button className="btn btn-gold btn-sm px-3">
                  + Log New Stock
                </button>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-sm-6 col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search blood group..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                  />
                </div>
                <div className="col-sm-6 col-md-4">
                  <select
                    className="form-select form-select-sm"
                    value={stockLevelFilter}
                    onChange={(e) => setStockLevelFilter(e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="level-critical">Critical</option>
                    <option value="level-low">Low</option>
                    <option value="level-adequate">Adequate</option>
                    <option value="level-good">Well Stocked</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle dashboard-table stock-table">
                  <thead>
                    <tr>
                      <th>Blood Group</th>
                      <th>Units Available</th>
                      <th>Stock Level</th>
                      <th>Threshold</th>
                      <th>Last Updated</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No blood groups match your filters.
                        </td>
                      </tr>
                    ) : (
                      stockRows.map((r) => (
                        <tr key={r.group}>
                          <td>
                            <span className="blood-group-chip-sm">{r.group}</span>
                          </td>
                          <td>
                            {editingGroup === r.group ? (
                              <input
                                type="number"
                                min={0}
                                className="form-control form-control-sm units-input"
                                value={editUnits}
                                onChange={(e) => setEditUnits(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="qty-btn"
                                  aria-label={`Decrease ${r.group} stock`}
                                  onClick={() => adjustUnits(r.group, -1)}
                                >
                                  −
                                </button>
                                <span className="fw-semibold">{r.units}</span>
                                <button
                                  className="qty-btn"
                                  aria-label={`Increase ${r.group} stock`}
                                  onClick={() => adjustUnits(r.group, 1)}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="level-cell">
                              <div className="level-bar-track">
                                <div
                                  className={`level-bar-fill ${r.level.className}`}
                                  style={{
                                    width: `${Math.min(
                                      (r.units / (r.threshold * 4)) * 100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className={`level-tag ${r.level.className}`}>
                                {r.level.label}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted">{r.threshold} units</td>
                          <td className="text-muted">{r.updated}</td>
                          <td className="text-end">
                            {editingGroup === r.group ? (
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  className="btn btn-outline-light btn-sm"
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-gold btn-sm"
                                  onClick={() => saveEdit(r.group)}
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-outline-gold btn-sm"
                                onClick={() => startEdit(r)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="dashboard-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="mb-0">Recent Blood Requests</h5>
                <a href="#allRequests" className="btn btn-outline-gold btn-sm">
                  View All
                </a>
              </div>
              <div className="table-responsive">
                <table className="table align-middle dashboard-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Patient</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Hospital</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-semibold">{r.id}</td>
                        <td>{r.patient}</td>
                        <td>
                          <span className="blood-group-chip-sm">
                            {r.group}
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
                        <td>
                          {r.status === "Pending" ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-approve btn-sm"
                                onClick={() => handleApprove(r.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-reject btn-sm"
                                onClick={() => handleReject(r.id)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Donor registrations + Quick actions */}
            <div className="row g-4 mt-1">
              <div className="col-lg-7">
                <div className="dashboard-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="mb-0">Recent Donor Registrations</h5>
                    <a href="#allDonors" className="btn btn-outline-gold btn-sm">
                      View All
                    </a>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle dashboard-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Blood Group</th>
                          <th>City</th>
                          <th>Registered On</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donorRegistrations.map((d, i) => (
                          <tr key={i}>
                            <td className="fw-semibold">{d.name}</td>
                            <td>
                              <span className="blood-group-chip-sm">
                                {d.group}
                              </span>
                            </td>
                            <td>{d.city}</td>
                            <td>{d.date}</td>
                            <td>
                              {d.status === "Verified" ? (
                                <span className="status-pill status-fulfilled">
                                  Verified
                                </span>
                              ) : (
                                <button className="btn btn-outline-gold btn-sm">
                                  Verify
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="dashboard-card mb-4">
                  <h5 className="mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-gold text-start px-3">
                      + Add New Camp
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      📢 Send Alert Broadcast
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      📊 Export Reports
                    </button>
                    <button className="btn btn-outline-light text-start px-3">
                      🛡 Manage Admin Roles
                    </button>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h5 className="mb-3">System Alerts</h5>
                  <ul className="alert-list">
                    <li>
                      <span className="alert-dot alert-critical"></span>
                      O- stock is below the 20-unit threshold
                    </li>
                    <li>
                      <span className="alert-dot alert-warning"></span>
                      3 donor verifications pending
                    </li>
                    <li>
                      <span className="alert-dot alert-info"></span>
                      Botad camp starts tomorrow at 9 AM
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;