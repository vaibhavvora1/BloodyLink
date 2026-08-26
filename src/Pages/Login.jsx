import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    location.state?.registered
      ? "Account created successfully! Please sign in with your credentials."
      : ""
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email": {
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return "Enter a valid email address.";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return "";
      }
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    ["email", "password"].forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    if (!validateAll()) return;

    try {
      setSubmitting(true);
      // Simulate login authentication request
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect to donor home or destination after login
      navigate("/donor", { state: { loggedIn: true, userEmail: form.email } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Invalid email or password. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (name) =>
    "form-control" + (errors[name] ? " is-invalid" : "");

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="auth-card">
              <div className="text-center mb-4">
                <h2 className="mb-1">
                  Welcome <span className="text-gold">Back</span>
                </h2>
                <p className="auth-subtitle mb-0">
                  Log in to access your Bloodlink account.
                </p>
              </div>

              {successMsg && (
                <div className="alert alert-success py-2 text-center" role="alert">
                  {successMsg}
                </div>
              )}

              {serverError && (
                <div className="alert alert-danger py-2 text-center" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Email */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={fieldClass("email")}
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label mb-0">
                        Password
                      </label>
                    </div>
                    <div className="input-wrapper mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={fieldClass("password")}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={form.rememberMe}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="#forgot" className="small" onClick={(e) => { e.preventDefault(); alert("Password reset link will be sent to your registered email."); }}>
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-gold btn-lg w-100"
                      disabled={submitting}
                    >
                      {submitting ? "Signing in..." : "Log In"}
                    </button>
                  </div>

                  {/* Switch to Register */}
                  <div className="col-12 text-center mt-3">
                    <p className="mb-0 text-muted">
                      Don't have an account?{" "}
                      <Link to="/register" className="fw-semibold">
                        Register
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
