import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { notify } from "../Components/NotificationToast";
import "../Styles/Notification.css";

const NotificationDemo = () => {
  const loadingToastRef = useRef(null);
  const [activeLoading, setActiveLoading] = useState(false);

  const handleSuccess = () => {
    notify.success(
      "Donation request submitted successfully.",
      "Success"
    );
  };

  const handleError = () => {
    notify.error(
      "Unable to complete this action. Please try again.",
      "Something went wrong"
    );
  };

  const handleWarning = () => {
    notify.warning(
      "Please complete all required information before proceeding.",
      "Attention"
    );
  };

  const handleInfo = () => {
    notify.info(
      "Your request is currently being processed by our coordination desk.",
      "Information"
    );
  };

  const handleLoadingToggle = () => {
    if (activeLoading && loadingToastRef.current) {
      // Resolve the loading toast
      notify.update(loadingToastRef.current, {
        type: "success",
        title: "Completed",
        message: "Your donation request has been confirmed!",
      });
      loadingToastRef.current = null;
      setActiveLoading(false);
    } else {
      // Start a loading toast
      const id = notify.loading(
        "Processing your request...",
        "Processing"
      );
      loadingToastRef.current = id;
      setActiveLoading(true);
    }
  };

  const handleLongMessage = () => {
    notify.info(
      "Your donation request has been successfully submitted. Our team will review the information and contact you with the next available donation appointment within 24 hours.",
      "Request Received"
    );
  };

  const handleMultipleToasts = () => {
    notify.success("Profile details updated successfully.", "Profile Updated");
    setTimeout(() => {
      notify.info("Blood bank inventory refreshed.", "Inventory Sync");
    }, 200);
    setTimeout(() => {
      notify.warning("Your next donation window opens in 7 days.", "Eligibility Reminder");
    }, 400);
  };

  const handleClearAll = () => {
    notify.dismiss();
    setActiveLoading(false);
    loadingToastRef.current = null;
  };

  return (
    <div className="notif-demo-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <Link to="/" className="text-muted text-decoration-none small">Home</Link>
          <span className="mx-2 text-muted small">/</span>
          <span className="text-dark small fw-semibold">Notification System UI Demo</span>
        </nav>

        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="notif-demo-card">
              <div className="text-center mb-4">
                <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill mb-2 fw-semibold">
                  UI Preview &amp; Demo
                </span>
                <h1 className="mb-2">
                  Notification <span className="text-gold">System</span>
                </h1>
                <p className="text-muted mx-auto" style={{ maxWidth: "560px" }}>
                  A custom, premium React Toastify notification design system tailored for
                  BloodLink with custom icons, distinct status accents, and fluid animations.
                </p>
              </div>

              <hr className="border-secondary-subtle my-4" />

              {/* Standard Notification Triggers */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">1. Standard Notification States</h5>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-toast-trigger btn-trigger-success"
                    onClick={handleSuccess}
                  >
                    <span>✓</span> Success Toast
                  </button>

                  <button
                    type="button"
                    className="btn-toast-trigger btn-trigger-error"
                    onClick={handleError}
                  >
                    <span>✕</span> Error Toast
                  </button>

                  <button
                    type="button"
                    className="btn-toast-trigger btn-trigger-warning"
                    onClick={handleWarning}
                  >
                    <span>⚠️</span> Warning Toast
                  </button>

                  <button
                    type="button"
                    className="btn-toast-trigger btn-trigger-info"
                    onClick={handleInfo}
                  >
                    <span>ℹ️</span> Info Toast
                  </button>

                  <button
                    type="button"
                    className="btn-toast-trigger btn-trigger-loading"
                    onClick={handleLoadingToggle}
                  >
                    <span>⏳</span> {activeLoading ? "Resolve Loading Toast" : "Loading Toast"}
                  </button>
                </div>
              </div>

              {/* Advanced UI Scenarios */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">2. Advanced UX Scenarios</h5>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark px-3 py-2 fw-semibold rounded-3"
                    onClick={handleLongMessage}
                  >
                    📄 Test Long Message Wrapping
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark px-3 py-2 fw-semibold rounded-3"
                    onClick={handleMultipleToasts}
                  >
                    📚 Test Multiple Stacked Toasts
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger px-3 py-2 fw-semibold rounded-3"
                    onClick={handleClearAll}
                  >
                    🗑️ Clear All Active
                  </button>
                </div>
              </div>

              {/* Specifications Review */}
              <div className="bg-light p-3 rounded-4 border border-secondary-subtle mt-4">
                <h6 className="fw-bold mb-2 text-dark">📋 Component Features:</h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li><strong>Single Global Container:</strong> Positioned at top-right on desktop, responsive full-width on mobile.</li>
                  <li><strong>Custom Design System:</strong> Replaces default Toastify UI with BloodLink ivory/gold/crimson styling, soft shadows, and clean SVG badges.</li>
                  <li><strong>Accessible &amp; Interactive:</strong> Accessible close button, pause-on-hover, swipeable dismissal, and animated progress indicator.</li>
                  <li><strong>Auto-close Timers:</strong> Success (4s), Info (4s), Warning (5s), Error (5.5s), Loading (Manual).</li>
                </ul>
              </div>

              <div className="text-center mt-4">
                <Link to="/" className="text-gold fw-semibold small text-decoration-none">
                  ← Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
