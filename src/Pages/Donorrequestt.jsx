import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../Styles/Donorrequest.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DONATION_TYPES = [
  {
    id: "whole-blood",
    title: "Whole Blood",
    icon: "🩸",
    description: "Standard blood donation — most common and versatile for emergency and surgery needs.",
  },
  {
    id: "power-red",
    title: "Power Red",
    icon: "💉",
    description: "Donates a concentrated dose of red cells, ideal for trauma and surgery patients.",
  },
  {
    id: "platelets",
    title: "Platelets",
    icon: "🔬",
    description: "Vital for patients undergoing cancer therapy, organ transplants, and surgeries.",
  },
  {
    id: "plasma",
    title: "Plasma",
    icon: "🧪",
    description: "Supports burn patients, trauma victims, and complex medical emergencies.",
  },
];

const TIME_SLOTS = [
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
];

const DONATION_CENTERS = [
  {
    id: "civil-bhavnagar",
    name: "Civil Hospital Blood Bank",
    address: "Jail Road, Bhavnagar",
    distance: "2.4 km away",
    hours: "Open 24/7 • Walk-ins & Appointments",
  },
  {
    id: "sardar-hospital",
    name: "Sardar Hospital Blood Bank",
    address: "Station Road, Botad",
    distance: "5.1 km away",
    hours: "8:00 AM – 8:00 PM daily",
  },
  {
    id: "redcross-bhavnagar",
    name: "Red Cross Society Blood Center",
    address: "Ghogha Circle, Bhavnagar",
    distance: "3.8 km away",
    hours: "9:00 AM – 6:00 PM (Mon-Sat)",
  },
  {
    id: "shree-krishna-botad",
    name: "Shree Krishna Charitable Center",
    address: "Main Road, Botad",
    distance: "8.7 km away",
    hours: "9:00 AM – 5:00 PM daily",
  },
];

const CONTACT_PREFERENCES = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "call", label: "Phone Call", icon: "📞" },
  { id: "sms", label: "SMS", icon: "📱" },
  { id: "email", label: "Email", icon: "✉️" },
];

const DonorRequests = () => {
  // Pre-filled donor info from existing profile
  const [form, setForm] = useState({
    fullName: "Vaibhav Vora",
    phone: "9876543210",
    email: "vaibhav@example.com",
    bloodGroup: "O+",
    donationType: "whole-blood",
    preferredDate: "",
    preferredTime: "10:00 AM – 11:00 AM",
    alternativeDate: "",
    locationId: "civil-bhavnagar",
    hasDonatedBefore: "yes",
    lastDonationDate: "2026-06-12",
    contactPreference: "whatsapp",
    additionalMessage: "",
    consent: false,
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Filtered donation centers
  const filteredCenters = useMemo(() => {
    if (!locationSearch.trim()) return DONATION_CENTERS;
    const query = locationSearch.toLowerCase();
    return DONATION_CENTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
    );
  }, [locationSearch]);

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

  const handleSelectField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.bloodGroup) newErrors.bloodGroup = "Please select your blood group.";
    if (!form.preferredDate) newErrors.preferredDate = "Please select your preferred donation date.";
    if (!form.locationId) newErrors.locationId = "Please select a donation location.";
    if (!form.consent) newErrors.consent = "Please confirm the declaration before submitting.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate API request processing
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);

    const selectedCenter = DONATION_CENTERS.find((c) => c.id === form.locationId);
    const selectedType = DONATION_TYPES.find((t) => t.id === form.donationType);

    setSubmittedData({
      ...form,
      centerName: selectedCenter ? selectedCenter.name : "BloodLink Donation Center",
      typeTitle: selectedType ? selectedType.title : "Whole Blood",
    });
  };

  const handleReset = () => {
    setSubmittedData(null);
    setForm({
      fullName: "Vaibhav Vora",
      phone: "9876543210",
      email: "vaibhav@example.com",
      bloodGroup: "O+",
      donationType: "whole-blood",
      preferredDate: "",
      preferredTime: "10:00 AM – 11:00 AM",
      alternativeDate: "",
      locationId: "civil-bhavnagar",
      hasDonatedBefore: "yes",
      lastDonationDate: "2026-06-12",
      contactPreference: "whatsapp",
      additionalMessage: "",
      consent: false,
    });
    setErrors({});
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="donor-donate-page py-4 py-md-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="donor-breadcrumb">
          <Link to="/donor">Donor Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-dark fw-semibold">Donate Request</span>
        </nav>

        {submittedData ? (
          /* ===================== SUCCESS SCREEN ===================== */
          <div className="success-screen-card animate__animated animate__fadeIn">
            <div className="success-icon-badge">✓</div>
            <h1 className="success-title">Donation Request Submitted</h1>
            <p className="success-subtitle">
              Thank you for choosing to donate blood, <strong>{submittedData.fullName}</strong>.
              Your request has been received and our coordination team will reach out shortly.
            </p>

            <div className="request-summary-box">
              <div className="summary-title">Request Summary</div>
              <div className="summary-row">
                <span className="summary-label">Donation Type</span>
                <span className="summary-value">{submittedData.typeTitle}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Blood Group</span>
                <span className="summary-value text-red fw-bold">{submittedData.bloodGroup}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Preferred Date</span>
                <span className="summary-value">
                  {new Date(submittedData.preferredDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Preferred Time</span>
                <span className="summary-value">{submittedData.preferredTime}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Location</span>
                <span className="summary-value">{submittedData.centerName}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Contact Via</span>
                <span className="summary-value text-capitalize">{submittedData.contactPreference}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Status</span>
                <span className="status-pill-pending">Pending Confirmation</span>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/donor" className="btn btn-gold px-4 py-2">
                Back to Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-outline-light px-4 py-2"
                onClick={handleReset}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* ===================== DONATE REQUEST FORM ===================== */
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              {/* Main Heading & Subtitle */}
              <div className="mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-2">
                  <h1 className="page-main-heading mb-0">
                    <span className="header-icon-heart">🩸</span>
                    Donate Blood
                  </h1>
                  <div className="trust-indicator-strip">
                    <span className="trust-dot"></span>
                    Safe • Simple • Secure
                  </div>
                </div>
                <p className="page-subtitle">
                  Your one donation can make a meaningful difference. Tell us when you're
                  available and we'll help coordinate your donation smoothly.
                </p>
              </div>

              {/* Hero Introductory Card */}
              <div className="hero-intro-card">
                <div className="row align-items-center gy-3">
                  <div className="col-md-7">
                    <h3 className="hero-intro-title">Ready to Make a Difference?</h3>
                    <p className="hero-intro-text">
                      Your decision to donate could help someone when they need it most.
                      Every unit goes through rigorous screening to save lives across local hospitals.
                    </p>
                  </div>
                  <div className="col-md-5">
                    <div className="hero-illustration-box">
                      <svg
                        className="hero-svg-graphic"
                        viewBox="0 0 280 140"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        {/* Flowing connection curve */}
                        <path
                          d="M20 70 C 80 20, 140 120, 260 70"
                          stroke="url(#goldGrad)"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                          opacity="0.6"
                        />
                        {/* Medical Cross Circle */}
                        <circle cx="50" cy="70" r="28" fill="#FAF6EC" stroke="#B8860B" strokeWidth="1.5" />
                        <path d="M50 58 V82 M38 70 H62" stroke="#B8860B" strokeWidth="3" strokeLinecap="round" />
                        {/* Central Blood Drop Heart Motif */}
                        <circle cx="140" cy="70" r="38" fill="#FFFFFF" stroke="#E5E1D8" strokeWidth="2" />
                        <path
                          d="M140 46 C132 58 122 68 122 79 C122 90 130 98 140 98 C150 98 158 90 158 79 C158 68 148 58 140 46 Z"
                          fill="url(#redGrad)"
                        />
                        <path
                          d="M136 72 C134 76 130 79 127 79"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                        {/* Helping Hand / Star Circle */}
                        <circle cx="230" cy="70" r="28" fill="#FAF6EC" stroke="#B8860B" strokeWidth="1.5" />
                        <path
                          d="M222 74 C225 78 235 78 238 74 M230 60 V64"
                          stroke="#B8860B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="230" cy="68" r="2" fill="#B8860B" />
                        {/* Gradients */}
                        <defs>
                          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#B8860B" />
                          </linearGradient>
                          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D62839" />
                            <stop offset="100%" stopColor="#B3161B" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Stepper Indicator */}
              <div className="form-stepper-wrapper">
                <ol className="stepper-nav">
                  <li className="stepper-item active">
                    <span className="stepper-number">01</span>
                    <span>Details</span>
                  </li>
                  <li className="stepper-divider"></li>
                  <li className="stepper-item active">
                    <span className="stepper-number">02</span>
                    <span>Donation</span>
                  </li>
                  <li className="stepper-divider"></li>
                  <li className="stepper-item active">
                    <span className="stepper-number">03</span>
                    <span>Availability</span>
                  </li>
                  <li className="stepper-divider"></li>
                  <li className="stepper-item">
                    <span className="stepper-number">04</span>
                    <span>Confirm</span>
                  </li>
                </ol>
              </div>

              {/* Form Container */}
              <div className="main-form-card">
                <form onSubmit={handleSubmit} noValidate>
                  {/* ===================== SECTION 01 — YOUR DETAILS ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 01</span>
                    <h2 className="section-head-title">Your Details</h2>
                    <p className="section-head-subtitle">Let's confirm your basic information.</p>

                    <div className="row g-3">
                      {/* Full Name */}
                      <div className="col-md-6">
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                          <span className="verified-badge">✓ Verified</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                          placeholder="Enter your full name"
                          value={form.fullName}
                          onChange={handleChange}
                        />
                        {errors.fullName && (
                          <div className="invalid-feedback-custom">⚠️ {errors.fullName}</div>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">
                          Mobile Number
                          <span className="verified-badge">✓ Verified</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                          placeholder="Enter your mobile number"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={10}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback-custom">⚠️ {errors.phone}</div>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email Address
                          <span className="verified-badge">✓ Verified</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          placeholder="Enter your email address"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="invalid-feedback-custom">⚠️ {errors.email}</div>
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
                          className={`form-select ${errors.bloodGroup ? "is-invalid" : ""}`}
                          value={form.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value="">Select blood group</option>
                          {BLOOD_GROUPS.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                        {errors.bloodGroup && (
                          <div className="invalid-feedback-custom">⚠️ {errors.bloodGroup}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===================== SECTION 02 — DONATION DETAILS ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 02</span>
                    <h2 className="section-head-title">Donation Details</h2>
                    <p className="section-head-subtitle">
                      Tell us what type of donation you'd prefer to make.
                    </p>

                    <label className="form-label d-block mb-2">What would you like to donate?</label>
                    <div className="selectable-card-grid">
                      {DONATION_TYPES.map((type) => {
                        const isSelected = form.donationType === type.id;
                        return (
                          <div
                            key={type.id}
                            className={`donation-type-card ${isSelected ? "active" : ""}`}
                            onClick={() => handleSelectField("donationType", type.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleSelectField("donationType", type.id);
                              }
                            }}
                          >
                            <div className="card-top-row">
                              <div className="type-icon">{type.icon}</div>
                              <div className="card-check-indicator">✓</div>
                            </div>
                            <h4 className="type-title">{type.title}</h4>
                            <p className="type-desc">{type.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===================== SECTION 03 — WHEN CAN YOU DONATE? ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 03</span>
                    <h2 className="section-head-title">When Can You Donate?</h2>
                    <p className="section-head-subtitle">
                      Choose your preferred appointment schedule.
                    </p>

                    <div className="row g-3">
                      {/* Preferred Date */}
                      <div className="col-md-6">
                        <label htmlFor="preferredDate" className="form-label">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          id="preferredDate"
                          name="preferredDate"
                          className={`form-control ${errors.preferredDate ? "is-invalid" : ""}`}
                          min={minDateStr}
                          value={form.preferredDate}
                          onChange={handleChange}
                        />
                        {errors.preferredDate && (
                          <div className="invalid-feedback-custom">⚠️ {errors.preferredDate}</div>
                        )}
                      </div>

                      {/* Alternative Date (Optional) */}
                      <div className="col-md-6">
                        <label htmlFor="alternativeDate" className="form-label">
                          Alternative Date <span className="text-muted fw-normal">(Optional)</span>
                        </label>
                        <input
                          type="date"
                          id="alternativeDate"
                          name="alternativeDate"
                          className="form-control"
                          min={minDateStr}
                          value={form.alternativeDate}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Preferred Time Slots */}
                      <div className="col-12 mt-3">
                        <label className="form-label d-block mb-1">Preferred Time Slot</label>
                        <div className="time-slots-grid">
                          {TIME_SLOTS.map((slot) => {
                            const isSelected = form.preferredTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`time-slot-btn ${isSelected ? "active" : ""}`}
                                onClick={() => handleSelectField("preferredTime", slot)}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ===================== SECTION 04 — DONATION LOCATION ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 04</span>
                    <h2 className="section-head-title">Choose Donation Location</h2>
                    <p className="section-head-subtitle">
                      Select a convenient blood bank or partner hospital for your donation.
                    </p>

                    {/* Search filter */}
                    <div className="location-search-box">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search donation center by hospital name or city..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                      />
                    </div>

                    {filteredCenters.length === 0 ? (
                      <div className="empty-location-card">
                        <h5 className="mb-1 text-muted">No Donation Locations Available</h5>
                        <p className="text-muted small mb-0">
                          We couldn't find any available donation locations matching your search.
                        </p>
                      </div>
                    ) : (
                      <div className="location-cards-grid">
                        {filteredCenters.map((center) => {
                          const isSelected = form.locationId === center.id;
                          return (
                            <div
                              key={center.id}
                              className={`location-card ${isSelected ? "active" : ""}`}
                              onClick={() => handleSelectField("locationId", center.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleSelectField("locationId", center.id);
                                }
                              }}
                            >
                              <div className="location-header">
                                <h4 className="location-title">{center.name}</h4>
                                <span className="location-distance-badge">{center.distance}</span>
                              </div>
                              <p className="location-address">📍 {center.address}</p>
                              <p className="location-hours">⏱ {center.hours}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {errors.locationId && (
                      <div className="invalid-feedback-custom mt-2">⚠️ {errors.locationId}</div>
                    )}
                  </div>

                  {/* ===================== SECTION 05 — PREVIOUS DONATION ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 05</span>
                    <h2 className="section-head-title">Previous Donation</h2>
                    <p className="section-head-subtitle">Have you donated blood before?</p>

                    <div className="yes-no-grid">
                      <div
                        className={`yes-no-card ${form.hasDonatedBefore === "yes" ? "active" : ""}`}
                        onClick={() => handleSelectField("hasDonatedBefore", "yes")}
                        role="button"
                        tabIndex={0}
                      >
                        <span>👍</span> Yes, I have
                      </div>
                      <div
                        className={`yes-no-card ${form.hasDonatedBefore === "no" ? "active" : ""}`}
                        onClick={() => handleSelectField("hasDonatedBefore", "no")}
                        role="button"
                        tabIndex={0}
                      >
                        <span>🌟</span> First Time
                      </div>
                    </div>

                    {form.hasDonatedBefore === "yes" && (
                      <div className="slide-down-panel">
                        <div className="row g-2 align-items-center">
                          <div className="col-md-6">
                            <label htmlFor="lastDonationDate" className="form-label mb-1">
                              Last Donation Date
                            </label>
                            <input
                              type="date"
                              id="lastDonationDate"
                              name="lastDonationDate"
                              className="form-control"
                              value={form.lastDonationDate}
                              onChange={handleChange}
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="col-md-6">
                            <small className="text-muted d-block pt-md-4">
                              💡 standard whole blood donation interval is 56–90 days for donor safety.
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ===================== SECTION 06 — CONTACT PREFERENCE ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 06</span>
                    <h2 className="section-head-title">How Should We Contact You?</h2>
                    <p className="section-head-subtitle">
                      Choose your preferred communication method for appointment confirmation.
                    </p>

                    <div className="contact-pref-grid">
                      {CONTACT_PREFERENCES.map((pref) => {
                        const isSelected = form.contactPreference === pref.id;
                        return (
                          <div
                            key={pref.id}
                            className={`contact-pref-btn ${isSelected ? "active" : ""}`}
                            onClick={() => handleSelectField("contactPreference", pref.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <span className="icon">{pref.icon}</span>
                            <span>{pref.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===================== SECTION 07 — ADDITIONAL MESSAGE ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 07</span>
                    <h2 className="section-head-title">Anything Else?</h2>
                    <p className="section-head-subtitle">
                      Add any additional notes or requests for our donation coordination team (optional).
                    </p>

                    <textarea
                      name="additionalMessage"
                      id="additionalMessage"
                      rows={3}
                      className="form-control"
                      placeholder="Add any additional information you'd like our donation team to know..."
                      maxLength={300}
                      value={form.additionalMessage}
                      onChange={handleChange}
                    ></textarea>
                    <div className="char-counter">
                      {form.additionalMessage.length} / 300 characters
                    </div>
                  </div>

                  {/* ===================== SECTION 08 — CONFIRMATION ===================== */}
                  <div className="form-section-block">
                    <span className="section-tag-badge">Section 08</span>
                    <h2 className="section-head-title">Before You Submit</h2>

                    <div className="confirmation-box mt-3">
                      <p className="confirmation-statement">
                        "I confirm that the information I have provided is accurate. I understand that
                        final donation eligibility will be determined by qualified blood-bank /
                        medical staff at the center."
                      </p>

                      <div className="consent-check-wrapper">
                        <input
                          type="checkbox"
                          id="consent"
                          name="consent"
                          className={`form-check-input ${errors.consent ? "is-invalid" : ""}`}
                          checked={form.consent}
                          onChange={handleChange}
                        />
                        <div>
                          <label htmlFor="consent" className="consent-label mb-0">
                            I agree to the declaration and understand donation policies
                          </label>
                          <p className="consent-subtext">
                            By submitting this request, you agree to be contacted by BloodLink regarding
                            your donation appointment.
                          </p>
                        </div>
                      </div>
                      {errors.consent && (
                        <div className="invalid-feedback-custom mt-2">⚠️ {errors.consent}</div>
                      )}
                    </div>
                  </div>

                  {/* ===================== SUBMIT AREA ===================== */}
                  <div className="submit-area-wrapper">
                    <button
                      type="submit"
                      className="btn btn-submit-donation"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Donation Request"
                      )}
                    </button>
                    <p className="security-reassurance-msg">
                      <span>🔒</span> Your information is securely handled by BloodLink.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorRequests;