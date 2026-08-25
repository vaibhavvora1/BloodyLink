import { Link } from "react-router-dom";
import "../Styles/Home.css";

const Home = () => {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-8">
              <p className="home-eyebrow">A community that gives back</p>
              <h1>One donation can become someone&apos;s tomorrow.</h1>
              <p className="home-lead">
                Bloodlink brings donors, patients, hospitals, and care teams
                together when every minute matters.
              </p>
              <div className="home-actions">
                <Link to="/register" className="btn btn-home-primary">
                  Become a donor
                </Link>
                <Link to="/patient-dashboard" className="btn btn-home-secondary">
                  Find blood support
                </Link>
              </div>
              <div className="home-proof">
                <span>12,480+</span>
                <small>donations coordinated by people who showed up</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-values">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <article className="value-item">
                <span className="value-number">01</span>
                <h2>Donate with clarity</h2>
                <p>See your eligibility, nearby requests, and donation history in one place.</p>
              </article>
            </div>
            <div className="col-md-4">
              <article className="value-item">
                <span className="value-number">02</span>
                <h2>Respond with confidence</h2>
                <p>Verified requests help donors make informed decisions when time is critical.</p>
              </article>
            </div>
            <div className="col-md-4">
              <article className="value-item">
                <span className="value-number">03</span>
                <h2>Keep care moving</h2>
                <p>Patients and hospitals can coordinate support without losing precious time.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;