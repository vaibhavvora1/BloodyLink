import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container app-container py-5 text-center my-auto">
      <div className="premium-card py-5 mx-auto" style={{ maxWidth: '500px' }}>
        <i className="bi bi-exclamation-triangle text-warning display-1 mb-3"></i>
        <h2 className="fw-bold mb-2">404 - Page Not Found</h2>
        <p className="text-muted mb-4">
          The requested page could not be found or has moved.
        </p>
        <Link to="/" className="btn btn-blood-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
