import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import BlurText from '../reactbits/BlurText';
import StaticBloodDrop from '../StaticBloodDrop';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const BloodDrop3D = lazy(() => import('../BloodDrop3D'));

export default function HeroSection() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-5 bg-hero-radial overflow-hidden position-relative">
      <div className="container app-container py-lg-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-7 text-center text-lg-start">
            <span className="badge bg-danger-subtle text-danger fw-semibold px-3 py-2 rounded-pill mb-3">
              <i className="bi bi-heart-pulse-fill me-1"></i> Rapid Emergency Blood Network
            </span>
            <h1 className="display-4 fw-bold mb-3 lh-sm">
              <BlurText text="Every Drop Can Save a Precious Life" />
            </h1>
            <p className="lead text-muted mb-4 pe-lg-4">
              Directly connecting verified voluntary donors with patients across India. Fast, transparent, and completely free of intermediaries.
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
              <Link to="/register" className="btn btn-blood-primary px-4 py-2">
                <i className="bi bi-droplet-fill me-1"></i> Donate Blood
              </Link>
              <Link to="/patient/request" className="btn btn-blood-secondary px-4 py-2">
                <i className="bi bi-telephone-plus-fill me-1"></i> Request Blood
              </Link>
            </div>
          </div>

          <div className="col-12 col-lg-5 d-flex justify-content-center">
            {shouldReduce ? (
              <StaticBloodDrop size={280} />
            ) : (
              <Suspense fallback={<StaticBloodDrop size={280} />}>
                <BloodDrop3D />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
