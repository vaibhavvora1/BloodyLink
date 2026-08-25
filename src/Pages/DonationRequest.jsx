import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/DonationRequest.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  { value: "Critical", desc: "Needed within a few hours" },
  { value: "Urgent", desc: "Needed within 24 hours" },
  { value: "Scheduled", desc: "Needed within a few days" },
];

const initialForm = {
  patientName: "",
  bloodGroup: "",
  units: 1,
  urgency: "",
  hospital: "",
  city: "",
  contactName: "",
  contactPhone: "",
  reason: "",
  requiredBy: "",
  terms: false,
};

const DonationRequest = () => {
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "patientName":
        if (!value.trim()) return "Patient name is required.";
        if (value.trim().length < 3) return "Name must be at least 3 characters.";
        return "";
      case "bloodGroup":
        if (!value) return "Select the required blood group.";
        return "";
      case "units":
        if (!value || Number(value) < 1) return "Enter at least 1 unit.";
        if (Number(value) > 10) return "For more than 10 units, contact support directly.";
        return "";
      case "urgency":
        if (!value) return "Select an urgency level.";
        return "";
      case "hospital":
        if (!value.trim()) return "Hospital name is required.";
        return "";
      case "city":
        if (!value.trim()) return "City is required.";
        return "";
      case "contactName":
        if (!value.trim()) return "Contact person's name is required.";
        return "";
      case "contactPhone":
        if (!value.trim()) return "Contact phone number is required.";
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return "Enter a valid 10-digit mobile number.";
        return "";
      case "requiredBy":
        if (!value) return "Select the date blood is required by.";
        return "";
      case "terms":
        if (!value) return "Please confirm the request details are accurate.";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, fieldValue) }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (key === "reason") return;
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateAll()) return;

    try {
      setSubmitting(true);
      // Replace with real API call, e.g. await axios.post("/api/requests", form);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/patient-dashboard", { state: { requestSubmitted: true } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Something went wrong while submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (name) =>
    "form-control" + (errors[name] ? " is-invalid" : "");

  return (
    <div className="donation-request-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="request-header text-center mb-4">
              <span className="badge request-badge mb-2">Blood Request</span>
              <h2 className="mb-1">
                Request <span className="text-gold">Blood Donation</span>
              </h2>
              <p className="text-muted mb-0">
                Fill in the patient and hospital details — matching donors
                nearby will be notified immediately.
              </p>
            </div>

            <div className="request-card">
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Patient details */}
                <h6 className="section-label">Patient Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Patient Name</label>
                    <input
                      type="text"
                      name="patientName"
                      className={fieldClass("patientName")}
                      placeholder="Full name"
                      value={form.patientName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.patientName && (
                      <div className="invalid-feedback">{errors.patientName}</div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      className={fieldClass("bloodGroup")}
                      value={form.bloodGroup}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select</option>
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

                  <div className="col-md-3">
                    <label className="form-label">Units Needed</label>
                    <input
                      type="number"
                      name="units"
                      min={1}
                      max={10}
                      className={fieldClass("units")}
                      value={form.units}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.units && (
                      <div className="invalid-feedback">{errors.units}</div>
                    )}
                  </div>
                </div>

                {/* Urgency */}
                <h6 className="section-label">Urgency Level</h6>
                <div className="row g-3 mb-4">
                  {URGENCY_LEVELS.map((level) => (
                    <div className="col-md-4" key={level.value}>
                      <label
                        className={
                          "urgency-option" +
                          (form.urgency === level.value ? " selected" : "") +
                          (errors.urgency ? " is-invalid" : "")
                        }
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={form.urgency === level.value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="d-none"
                        />
                        <span className="urgency-title">{level.value}</span>
                        <span className="urgency-desc">{level.desc}</span>
                      </label>
                    </div>
                  ))}
                  {errors.urgency && (
                    <div className="text-danger small mt-1 ps-1">
                      {errors.urgency}
                    </div>
                  )}
                </div>

                {/* Hospital details */}
                <h6 className="section-label">Hospital Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-7">
                    <label className="form-label">Hospital Name</label>
                    <input
                      type="text"
                      name="hospital"
                      className={fieldClass("hospital")}
                      placeholder="e.g. Civil Hospital"
                      value={form.hospital}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.hospital && (
                      <div className="invalid-feedback">{errors.hospital}</div>
                    )}
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className={fieldClass("city")}
                      placeholder="e.g. Bhavnagar"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  <div className="col-md-5">
                    <label className="form-label">Required By</label>
                    <input
                      type="date"
                      name="requiredBy"
                      className={fieldClass("requiredBy")}
                      value={form.requiredBy}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.requiredBy && (
                      <div className="invalid-feedback">{errors.requiredBy}</div>
                    )}
                  </div>

                  <div className="col-md-7">
                    <label className="form-label">
                      Reason / Notes <span className="text-muted">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="reason"
                      className="form-control"
                      placeholder="e.g. Scheduled surgery"
                      value={form.reason}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Contact details */}
                <h6 className="section-label">Contact Person</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      name="contactName"
                      className={fieldClass("contactName")}
                      placeholder="Who should donors reach?"
                      value={form.contactName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.contactName && (
                      <div className="invalid-feedback">{errors.contactName}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      className={fieldClass("contactPhone")}
                      placeholder="10-digit mobile number"
                      value={form.contactPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                    />
                    {errors.contactPhone && (
                      <div className="invalid-feedback">{errors.contactPhone}</div>
                    )}
                  </div>
                </div>

                {/* Confirmation */}
                <div className="form-check mb-4">
                  <input
                    className={
                      "form-check-input" + (errors.terms ? " is-invalid" : "")
                    }
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I confirm the above details are accurate to the best of my
                    knowledge.
                  </label>
                  {errors.terms && (
                    <div className="text-danger small mt-1">{errors.terms}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-gold btn-lg w-100"
                  disabled={submitting}
                >
                  {submitting ? "Submitting Request..." : "Submit Blood Request"}
                </button>

                <p className="text-center text-muted mt-3 mb-0">
                  Need urgent help? Call our 24/7 helpline{" "}
                  <span className="text-gold fw-semibold">1800-XXX-XXXX</span>
                </p>
              </form>
            </div>

            <div className="text-center mt-3">
              <Link to="/patient-dashboard" className="text-gold small">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRequest;