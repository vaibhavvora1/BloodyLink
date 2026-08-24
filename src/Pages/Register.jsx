import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Register.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  bloodGroup: "",
  dob: "",
  gender: "",
  city: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear the field-level error as soon as the user edits it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName": {
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
        if (!value.trim()) return "Phone number is required.";
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return "Enter a valid 10-digit mobile number.";
        return "";
      }
      case "bloodGroup": {
        if (!value) return "Please select your blood group.";
        return "";
      }
      case "dob": {
        if (!value) return "Date of birth is required.";
        const dob = new Date(value);
        if (Number.isNaN(dob.getTime())) return "Enter a valid date.";
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 18) return "You must be at least 18 years old to register.";
        if (age > 65) return "Donor age must be 65 or below.";
        return "";
      }
      case "gender": {
        if (!value) return "Please select your gender.";
        return "";
      }
      case "city": {
        if (!value.trim()) return "City is required.";
        if (value.trim().length < 2) return "Enter a valid city name.";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Password needs an uppercase letter, a lowercase letter, and a number.";
        return "";
      }
      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        return "";
      }
      case "terms": {
        if (!value) return "You must accept the terms to continue.";
        return "";
      }
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const error = validateField(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    // Re-check confirmPassword against the latest password value
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

      // Replace with your real API call, e.g.:
      // await axios.post("/api/donors/register", form);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/", { state: { registered: true } });
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
    <div className="register-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <div className="register-card">
              <div className="text-center mb-4">
                <h2 className="mb-1">
                  Become a <span className="text-gold">Bloodlink</span> Donor
                </h2>
                <p className="text-muted mb-0">
                  Share life, give blood — register in a few minutes.
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
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className={fieldClass("fullName")}
                      placeholder="e.g. Vaibhav Vora"
                      value={form.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={fieldClass("email")}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
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

                  {/* Blood Group */}
                  <div className="col-md-6">
                    <label htmlFor="bloodGroup" className="form-label">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      className={fieldClass("bloodGroup")}
                      value={form.bloodGroup}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <div className="invalid-feedback">{errors.bloodGroup}</div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6">
                    <label htmlFor="dob" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className={fieldClass("dob")}
                      value={form.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {errors.dob && (
                      <div className="invalid-feedback">{errors.dob}</div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="col-md-6">
                    <label className="form-label d-block">Gender</label>
                    <div className="d-flex gap-3 pt-1">
                      {["Male", "Female", "Other"].map((g) => (
                        <div className="form-check" key={g}>
                          <input
                            className={
                              "form-check-input" +
                              (errors.gender ? " is-invalid" : "")
                            }
                            type="radio"
                            name="gender"
                            id={`gender-${g}`}
                            value={g}
                            checked={form.gender === g}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`gender-${g}`}
                          >
                            {g}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.gender && (
                      <div className="text-danger small mt-1">
                        {errors.gender}
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div className="col-12">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className={fieldClass("city")}
                      placeholder="e.g. Botad"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={fieldClass("password")}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={fieldClass("confirmPassword")}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className={
                          "form-check-input" +
                          (errors.terms ? " is-invalid" : "")
                        }
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={form.terms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the{" "}
                        <Link to="/terms">Terms &amp; Conditions</Link> and{" "}
                        <Link to="/privacy">Privacy Policy</Link>.
                      </label>
                      {errors.terms && (
                        <div className="text-danger small mt-1">
                          {errors.terms}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-gold btn-lg w-100"
                      disabled={submitting}
                    >
                      {submitting ? "Registering..." : "Register as Donor"}
                    </button>
                  </div>

                  <div className="col-12 text-center mt-2">
                    <p className="mb-0 text-muted">
                      Already have an account? Contact support to access your
                      account.
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