import React from 'react';
import SpotlightCard from '../reactbits/SpotlightCard';

const features = [
  {
    icon: 'bi-geo-alt-fill',
    title: 'Hyper-Local Discovery',
    desc: 'Instant city and hospital-radius matching ensures donors are physically nearby when hours count.'
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Privacy Guaranteed',
    desc: 'Your phone number and email remain strictly masked until an emergency request is mutually approved.'
  },
  {
    icon: 'bi-patch-check-fill',
    title: '100% Free & Transparent',
    desc: 'Bloodlink is a community-first platform without middleman fees, referral commissions, or barriers.'
  },
  {
    icon: 'bi-bell-ring-fill',
    title: 'Real-Time Alert Dispatch',
    desc: 'Direct hospital coordination signals urgent requirements instantly across emergency cohorts.'
  }
];

export default function WhyBloodlink() {
  return (
    <section className="py-5">
      <div className="container app-container py-lg-4">
        <div className="text-center mb-5">
          <span className="text-danger fw-semibold small text-uppercase tracking-wide">Our Mission</span>
          <h2 className="fw-bold mb-2">Why Bloodlink Matters</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '540px' }}>
            Built to eliminate frantic social media searches during critical medical emergencies.
          </p>
        </div>

        <div className="row g-4">
          {features.map((f, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <SpotlightCard className="p-4 h-100">
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 p-3 text-danger fs-3"
                    style={{ backgroundColor: 'var(--color-primary-light)', minWidth: '56px', minHeight: '56px' }}
                    aria-hidden="true"
                  >
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">{f.title}</h3>
                    <p className="text-muted small mb-0">{f.desc}</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
