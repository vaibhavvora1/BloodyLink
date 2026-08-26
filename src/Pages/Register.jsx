import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Auth.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name": {
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 3) return "Name must be at least 3 characters.";
        if (!/^[A-Za-z\s.'-]+$/.test(value.trim()))
          return "Name can only contain letters and spaces.";
        return "";
      }
      case "email": {
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return "Enter a valid email address.";
        return "";
      }
      case "phone": {
        if (!value.trim()) return "Mobile number is required.";
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return "Enter a valid 10-digit mobile number.";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return "";
      }
      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
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
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    if (!newErrors.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateAll()) return;

    try {
      setSubmitting(true);
      // Simulate registration request
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect to login page on success
      navigate("/login", { state: { registered: true, email: form.email } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Something went wrong while registering. Please try again."
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
                  Create <span className="text-gold">Account</span>
                </h2>
                <p className="auth-subtitle mb-0">
                  Join Bloodlink to share life and connect with donors.
                </p>
              </div>

              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={fieldClass("name")}
                      placeholder="e.g. Vaibhav Vora"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

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
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Mobile No. */}
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={fieldClass("phone")}
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={fieldClass("password")}
                        placeholder="At least 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
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

                  {/* Confirm Password */}
                  <div className="col-12">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={fieldClass("confirmPassword")}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-gold btn-lg w-100"
                      disabled={submitting}
                    >
                      {submitting ? "Creating Account..." : "Register"}
                    </button>
                  </div>

                  {/* Switch to Login */}
                  <div className="col-12 text-center mt-3">
                    <p className="mb-0 text-muted">
                      Already have an account?{" "}
                      <Link to="/login" className="fw-semibold">
                        Log In
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

export default Register;