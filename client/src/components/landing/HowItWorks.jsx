import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Register',
    desc: 'Sign up in 60 seconds with your blood group and verified city location.',
    icon: 'bi-person-plus-fill'
  },
  {
    num: '02',
    title: 'Match & Request',
    desc: 'Patients submit urgent requirements; our algorithm alerts nearby matching donors.',
    icon: 'bi-bell-fill'
  },
  {
    num: '03',
    title: 'Direct Handshake',
    desc: 'Contact details are shared upon mutual approval to coordinate hospital donation.',
    icon: 'bi-shield-check'
  },
  {
    num: '04',
    title: 'Save Lives',
    desc: 'Blood reaches the critical recipient rapidly, making a direct life-saving impact.',
    icon: 'bi-heart-pulse-fill'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-5">
      <div className="container app-container py-lg-4">
        <div className="text-center mb-5">
          <span className="text-danger fw-semibold small text-uppercase tracking-wide">Simple Process</span>
          <h2 className="fw-bold mb-2">How Bloodlink Works</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '540px' }}>
            Four streamlined steps connecting donors directly with those in urgent need.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((st, i) => (
            <motion.div
              key={st.num}
              className="col-12 col-sm-6 col-lg-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="premium-card h-100 p-4 text-center">
                <span className="badge rounded-pill bg-light text-danger fw-bold mb-3 border">
                  STEP {st.num}
                </span>
                <div className="fs-1 text-danger mb-3" aria-hidden="true">
                  <i className={`bi ${st.icon}`}></i>
                </div>
                <h3 className="h5 fw-bold mb-2">{st.title}</h3>
                <p className="text-muted small mb-0">{st.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
