import { toast, ToastContainer } from "react-toastify";
import "../Styles/Notification.css";

// Clean inline SVG Icons for accessibility and consistency
const Icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  loading: (
    <div className="bl-toast-spinner" aria-hidden="true" />
  ),
};

/**
 * Custom Toast layout component
 */
const CustomToastContent = ({ type = "info", title, message, closeToast }) => {
  return (
    <div className={`bl-toast-wrapper bl-toast-${type}`} role="alert">
      <div className="bl-toast-icon-box">
        {Icons[type] || Icons.info}
      </div>
      <div className="bl-toast-content">
        <div className="bl-toast-title">
          {title}
        </div>
        <p className="bl-toast-message">{message}</p>
      </div>
      {closeToast && (
        <button
          type="button"
          className="bl-toast-close-btn"
          onClick={closeToast}
          aria-label="Close notification"
        >
          &times;
        </button>
      )}
    </div>
  );
};

/**
 * Reusable notification helper
 */
export const notify = {
  success: (message, title = "Success", options = {}) => {
    return toast.success(
      ({ closeToast }) => (
        <CustomToastContent
          type="success"
          title={title}
          message={message}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: 4000,
        ...options,
      }
    );
  },

  error: (message, title = "Something went wrong", options = {}) => {
    return toast.error(
      ({ closeToast }) => (
        <CustomToastContent
          type="error"
          title={title}
          message={message}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: 5500,
        ...options,
      }
    );
  },

  warning: (message, title = "Attention", options = {}) => {
    return toast.warning(
      ({ closeToast }) => (
        <CustomToastContent
          type="warning"
          title={title}
          message={message}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: 5000,
        ...options,
      }
    );
  },

  info: (message, title = "Information", options = {}) => {
    return toast.info(
      ({ closeToast }) => (
        <CustomToastContent
          type="info"
          title={title}
          message={message}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: 4000,
        ...options,
      }
    );
  },

  loading: (message = "Please wait...", title = "Processing", options = {}) => {
    return toast.loading(
      ({ closeToast }) => (
        <CustomToastContent
          type="loading"
          title={title}
          message={message}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: false,
        closeOnClick: false,
        ...options,
      }
    );
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  update: (toastId, { type = "success", title, message, ...options }) => {
    toast.update(toastId, {
      render: ({ closeToast }) => (
        <CustomToastContent
          type={type}
          title={title || (type === "success" ? "Success" : type === "error" ? "Error" : "Update")}
          message={message}
          closeToast={closeToast}
        />
      ),
      type,
      isLoading: false,
      autoClose: 4000,
      closeOnClick: true,
      ...options,
    });
  },
};

/**
 * Global Toast Container Component
 */
export const NotificationContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default notify;
