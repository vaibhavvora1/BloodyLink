import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/DonorHome.css";

const DonorHome = () => {
  return (
    <div className="donor-home">
      {/* ===== Hero / Welcome Banner ===== */}
      <header className="donor-hero">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <h1 className="hero-title">
                Every Drop Counts, <span className="text-gold">Vaibhav</span>
              </h1>
              <p className="hero-subtitle">
                Share life, give blood. Your last donation helped save up to
                3 lives. Check your eligibility and find a request near you today.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#requests" className="btn btn-gold btn-lg px-4">
                  Donate Now
                </a>
                <a href="#history" className="btn btn-outline-light btn-lg px-4">
                  View My History
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="eligibility-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Eligibility Status</h5>
                  <span className="status-dot"></span>
                </div>
                <div className="eligibility-status-eligible">
                  <span className="fs-4">✅</span>
                  <div>
                    <p className="mb-0 fw-bold">You are eligible to donate</p>
                    <small className="text-muted">Next donation available now</small>
                  </div>
                </div>
                <hr className="border-secondary" />
                <div className="row text-center g-2">
                  <div className="col-4">
                    <p className="stat-number">O+</p>
                    <small>Blood Group</small>
                  </div>
                  <div className="col-4">
                    <p className="stat-number">12</p>
                    <small>Total Donations</small>
                  </div>
                  <div className="col-4">
                    <p className="stat-number">36</p>
                    <small>Lives Saved</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Quick Stats Strip ===== */}
      <section className="quick-stats py-4">
        <div className="container">
          <div className="row g-3 g-md-4 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <span className="stat-icon">🩸</span>
                <h4>12</h4>
                <p>Donations Made</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <span className="stat-icon">❤️</span>
                <h4>36+</h4>
                <p>Lives Impacted</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <span className="stat-icon">📅</span>
                <h4>78 days</h4>
                <p>Since Last Donation</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <span className="stat-icon">🏆</span>
                <h4>Gold Tier</h4>
                <p>Donor Rank</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Nearby / Urgent Blood Requests ===== */}
      <section id="requests" className="py-5 requests-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="section-title">Urgent Requests Near You</h2>
              <p className="section-subtitle">
                Matching your blood group and location
              </p>
            </div>
            <a href="#allRequests" className="btn btn-outline-gold btn-sm">
              View All
            </a>
          </div>

          <div className="row g-4">
            {[
              {
                name: "Rakesh Mehta",
                group: "O+",
                hospital: "Civil Hospital, Bhavnagar",
                distance: "2.4 km",
                urgency: "Critical",
                time: "Needed within 4 hrs",
              },
              {
                name: "Priya Sharma",
                group: "O+",
                hospital: "Shree Krishna Hospital, Botad",
                distance: "5.1 km",
                urgency: "Urgent",
                time: "Needed within 12 hrs",
              },
              {
                name: "Anand Trust",
                group: "O+",
                hospital: "Sardar Hospital",
                distance: "8.7 km",
                urgency: "Scheduled",
                time: "Needed within 2 days",
              },
            ].map((req, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="request-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="blood-group-chip">{req.group}</div>
                    <span
                      className={`urgency-badge urgency-${req.urgency.toLowerCase()}`}
                    >
                      {req.urgency}
                    </span>
                  </div>
                  <h5 className="mb-1">{req.name}</h5>
                  <p className="hospital-name mb-1">🏥 {req.hospital}</p>
                  <p className="text-muted small mb-3">
                    📍 {req.distance} away &nbsp;•&nbsp; ⏱ {req.time}
                  </p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-gold btn-sm flex-grow-1">
                      Accept Request
                    </button>
                    <button className="btn btn-outline-light btn-sm">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Donation History ===== */}
      <section id="history" className="py-5 history-section">
        <div className="container">
          <h2 className="section-title mb-4">Your Donation History</h2>
          <div className="table-responsive history-table-wrapper">
            <table className="table table-dark table-borderless align-middle history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "12 Jun 2026",
                    loc: "Civil Hospital Blood Camp",
                    group: "O+",
                    units: "1 Unit",
                    status: "Completed",
                  },
                  {
                    date: "02 Mar 2026",
                    loc: "BrainyBeam CSR Camp, Botad",
                    group: "O+",
                    units: "1 Unit",
                    status: "Completed",
                  },
                  {
                    date: "18 Nov 2025",
                    loc: "Red Cross Society, Bhavnagar",
                    group: "O+",
                    units: "1 Unit",
                    status: "Completed",
                  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.loc}</td>
                    <td>
                      <span className="blood-group-chip-sm">{row.group}</span>
                    </td>
                    <td>{row.units}</td>
                    <td>
                      <span className="status-pill">{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== Upcoming Camps ===== */}
      <section id="camps" className="py-5 camps-section">
        <div className="container">
          <h2 className="section-title mb-4">Upcoming Blood Donation Camps</h2>
          <div className="row g-4">
            {[
              {
                title: "World Blood Donor Day Camp",
                date: "14 Sep 2026",
                place: "Botad Municipal Ground",
              },
              {
                title: "College Blood Drive",
                date: "22 Sep 2026",
                place: "Swami Sahajanand College, Bhavnagar",
              },
              {
                title: "Corporate Donation Camp",
                date: "05 Oct 2026",
                place: "BrainyBeam Info-Tech Office",
              },
            ].map((camp, i) => (
              <div className="col-md-4" key={i}>
                <div className="camp-card h-100">
                  <div className="camp-date-box">
                    <span className="camp-day">
                      {camp.date.split(" ")[0]}
                    </span>
                    <span className="camp-month">
                      {camp.date.split(" ")[1]}
                    </span>
                  </div>
                  <h6 className="mt-3 mb-1">{camp.title}</h6>
                  <p className="text-muted small mb-3">📍 {camp.place}</p>
                  <button className="btn btn-outline-gold btn-sm w-100">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="donor-footer py-4">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <p className="mb-0">
            © 2026 Blood<span className="text-gold">link</span> — Share Life, Give Blood
          </p>
          <div className="d-flex gap-3">
            <a href="#">Privacy Policy</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DonorHome;