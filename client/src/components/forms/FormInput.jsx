import React from 'react';

export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  min,
  max,
  required = false
}) {
  const inputId = id || name;

  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={inputId} className="form-label small fw-semibold text-dark mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-white border-end-0 text-muted" aria-hidden="true">
            <i className={`bi ${icon}`}></i>
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          className={`form-control ${icon ? 'border-start-0' : ''} ${error ? 'is-invalid' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
        />
      </div>
      {error ? (
        <div id={`${inputId}-error`} className="text-danger small mt-1">
          {error}
        </div>
      ) : helperText ? (
        <div id={`${inputId}-help`} className="text-muted small mt-1">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
