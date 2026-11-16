import React, { useState } from 'react';

export default function PasswordInput({
  label = 'Password',
  id = 'password',
  name = 'password',
  value,
  onChange,
  placeholder = '••••••••',
  error,
  helperText,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={id} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0 text-muted" aria-hidden="true">
          <i className="bi bi-lock-fill"></i>
        </span>
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-control border-start-0 border-end-0 ${error ? 'is-invalid' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
        />
        <button
          type="button"
          className="btn btn-outline-secondary border-start-0 bg-white text-muted"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
        </button>
      </div>
      {error ? (
        <div id={`${id}-error`} className="text-danger small mt-1">{error}</div>
      ) : helperText ? (
        <div id={`${id}-help`} className="text-muted small mt-1">{helperText}</div>
      ) : null}
    </div>
  );
}
