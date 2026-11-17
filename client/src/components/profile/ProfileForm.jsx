import React, { useState, useEffect } from 'react';

const renderInput = (f, val, onChange, error) => {
  if (f.readOnly) {
    return (
      <div className="input-group">
        <input type="text" className="form-control form-control-sm bg-light" value={val || ''} disabled readOnly />
        <span className="input-group-text bg-light text-muted"><i className="bi bi-lock-fill"></i></span>
      </div>
    );
  }
  if (f.type === 'select') {
    return (
      <select name={f.name} className={`form-select form-select-sm ${error ? 'is-invalid' : ''}`} value={val ?? ''} onChange={onChange}>
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  if (f.type === 'checkbox') {
    return (
      <div className="form-check form-switch mt-2">
        <input className="form-check-input" type="checkbox" id={f.name} name={f.name} checked={!!val} onChange={onChange} />
        <label className="form-check-label small" htmlFor={f.name}>{f.checkboxLabel || f.label}</label>
      </div>
    );
  }
  return (
    <input
      name={f.name}
      type={f.type || 'text'}
      className={`form-control form-control-sm ${error ? 'is-invalid' : ''}`}
      placeholder={f.placeholder}
      value={val ?? ''}
      onChange={onChange}
    />
  );
};

export default function ProfileForm({ title, subtitle, initialData, fieldsConfig, onSave, isSaving, validate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const sanitized = { ...initialData };
      if (sanitized.dateOfBirth) sanitized.dateOfBirth = sanitized.dateOfBirth.split('T')[0];
      if (sanitized.lastDonationDate) sanitized.lastDonationDate = sanitized.lastDonationDate.split('T')[0];
      setFormData(sanitized);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate) {
      const { isValid, errs } = validate(formData);
      if (!isValid) return setErrors(errs);
    }
    const success = await onSave(formData);
    if (success) setIsEditing(false);
  };

  return (
    <div className="profile-container py-4">
      <div className="profile-card">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-3 border-bottom">
          <div>
            <h1 className="h4 fw-bold mb-1 text-dark">{title}</h1>
            <p className="text-muted small mb-0">{subtitle}</p>
          </div>
          {!isEditing && (
            <button type="button" className="btn btn-sm btn-blood-primary d-flex align-items-center gap-2" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil-square"></i><span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {fieldsConfig.map((f) => (
                <div key={f.name} className={f.col || 'col-12 col-md-6'}>
                  <label className="form-label small fw-semibold text-dark mb-1">
                    {f.label} {f.required && <span className="text-danger">*</span>}
                  </label>
                  {renderInput(f, formData[f.name], handleChange, errors[f.name])}
                  {errors[f.name] && <div className="invalid-feedback d-block small mt-1">{errors[f.name]}</div>}
                  {f.help && !errors[f.name] && <div className="form-text small text-muted">{f.help}</div>}
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={() => { setFormData(initialData || {}); setErrors({}); setIsEditing(false); }} disabled={isSaving}>Cancel</button>
              <button type="submit" className="btn btn-sm btn-blood-primary px-4 d-flex align-items-center gap-2" disabled={isSaving}>
                {isSaving ? <><span className="spinner-border spinner-border-sm" role="status"></span><span>Saving...</span></> : <><i className="bi bi-check2-circle"></i><span>Save Changes</span></>}
              </button>
            </div>
          </form>
        ) : (
          <div className="row g-4">
            {fieldsConfig.map((f) => (
              <div key={f.name} className={f.col || 'col-12 col-md-6'}>
                <div className="profile-field-label">{f.label}</div>
                <div className="profile-field-value">
                  {f.type === 'checkbox' ? (
                    formData[f.name] ? <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i>Active</span> : <span className="badge bg-secondary-subtle text-secondary px-2 py-1 rounded-pill">Paused</span>
                  ) : f.name === 'bloodGroup' ? (
                    <span className="badge bg-danger fs-6">{formData[f.name] || 'Not specified'}</span>
                  ) : (
                    formData[f.name] ? String(formData[f.name]) : <span className="text-muted fst-italic">Not provided</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
