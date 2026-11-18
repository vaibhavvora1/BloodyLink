import React from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodGroupSelect({
  label,
  id,
  name,
  value,
  onChange,
  error,
  required = false,
  includeAllOption = false,
  allLabel = 'All Blood Groups'
}) {
  const selectId = id || name;

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={selectId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
      >
        {includeAllOption ? <option value="">{allLabel}</option> : <option value="" disabled>Select a blood group</option>}
        {BLOOD_GROUPS.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
