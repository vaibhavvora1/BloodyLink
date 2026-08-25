import { useState } from "react";
import "../Styles/Profile.css";

const initialProfile = {
  name: "Vaibhav Vora",
  email: "vaibhav@example.com",
  phone: "9876543210",
  bloodGroup: "O+",
  dob: "2003-05-14",
  gender: "Male",
  city: "Botad",
  address: "123, Station Road, Botad, Gujarat",
  emergencyContact: "9998887770",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const calcAge = (dobStr) => {
  if (!dobStr) return "—";
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const stats = {
    totalDonations: 12,
    livesSaved: 36,
    lastDonation: "12 Jun 2026",
    nextEligible: "Eligible now",
    donorRank: "Gold Tier",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    if (!form.bloodGroup) newErrors.bloodGroup = "Select a blood group.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (form.emergencyContact && !/^[6-9]\d{9}$/.test(form.emergencyContact.trim()))
      newErrors.emergencyContact = "Enter a valid 10-digit number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setForm(profile);
    setErrors({});
    setSaved(false);
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setErrors({});
    setEditMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      // Replace with real API call, e.g. await axios.put("/api/donors/me", form);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile(form);
      setEditMode(false);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (name) =>
    "form-control" + (errors[name] ? " is-invalid" : "");

  return (
    <div className="profile-page py-5">
      <div className="container">
        <div className="row g-4">
          {/* ===== Left: Identity card ===== */}
          <div className="col-lg-4">
            <div className="profile-card text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=b3161b&color=fff&bold=true&size=128`}
                alt={profile.name}
                className="profile-avatar"
              />
              <h4 className="mt-3 mb-0">{profile.name}</h4>
              <p className="text-muted mb-2">{profile.city}</p>
              <span className="blood-group-chip">{profile.bloodGroup}</span>

              <hr className="my-4" />

              <div className="row text-center g-2">
                <div className="col-4">
                  <p className="stat-number mb-0">{stats.totalDonations}</p>
                  <small className="text-muted">Donations</small>
                </div>
                <div className="col-4">
                  <p className="stat-number mb-0">{stats.livesSaved}</p>
                  <small className="text-muted">Lives Saved</small>
                </div>
                <div className="col-4">
                  <p className="stat-number mb-0">{calcAge(profile.dob)}</p>
                  <small className="text-muted">Age</small>
                </div>
              </div>

              <hr className="my-4" />

              <div className="text-start small">
                <p className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Last Donation</span>
                  <span className="fw-semibold">{stats.lastDonation}</span>
                </p>
                <p className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Status</span>
                  <span className="fw-semibold text-success">
                    {stats.nextEligible}
                  </span>
                </p>
                <p className="d-flex justify-content-between mb-0">
                  <span className="text-muted">Donor Rank</span>
                  <span className="fw-semibold text-gold">
                    {stats.donorRank}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ===== Right: Editable details ===== */}
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h5 className="mb-0">Personal Information</h5>
                {!editMode ? (
                  <button className="btn btn-outline-gold btn-sm" onClick={handleEdit}>
                    Edit Profile
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-gold btn-sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {saved && !editMode && (
                <div className="alert alert-success" role="alert">
                  Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleSave} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className={fieldClass("name")}
                      value={form.name}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className={fieldClass("email")}
                      value={form.email}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={fieldClass("phone")}
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      className={fieldClass("bloodGroup")}
                      value={form.bloodGroup}
                      onChange={handleChange}
                      disabled={!editMode}
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

                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      value={form.dob}
                      onChange={handleChange}
                      disabled={!editMode}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label d-block">Gender</label>
                    <div className="d-flex gap-3 pt-1">
                      {["Male", "Female", "Other"].map((g) => (
                        <div className="form-check" key={g}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id={`gender-${g}`}
                            value={g}
                            checked={form.gender === g}
                            onChange={handleChange}
                            disabled={!editMode}
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
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className={fieldClass("city")}
                      value={form.city}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      className={fieldClass("emergencyContact")}
                      value={form.emergencyContact}
                      onChange={handleChange}
                      disabled={!editMode}
                      maxLength={10}
                    />
                    {errors.emergencyContact && (
                      <div className="invalid-feedback">
                        {errors.emergencyContact}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows={2}
                      value={form.address}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
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

export default Profile;