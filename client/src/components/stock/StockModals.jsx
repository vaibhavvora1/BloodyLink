import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FormInput from '../forms/FormInput';
import BloodGroupSelect from '../forms/BloodGroupSelect';

const COMPONENTS = ['Whole Blood', 'Plasma', 'Platelets', 'RBC'];

export function AddStockModal({ show, onHide, onAdd }) {
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    component: 'Whole Blood',
    units: 1,
    expiryDate: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.units || Number(formData.units) <= 0) {
      setError('Units must be a positive integer.');
      return;
    }
    if (!formData.expiryDate || new Date(formData.expiryDate) < new Date().setHours(0, 0, 0, 0)) {
      setError('Expiry date must be today or in the future.');
      return;
    }
    setError('');
    onAdd(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Add Blood Stock Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger small py-2">{error}</div>}
          <BloodGroupSelect
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            required
          />
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark mb-1">Component</label>
            <select
              className="form-select"
              value={formData.component}
              onChange={(e) => setFormData({ ...formData, component: e.target.value })}
            >
              {COMPONENTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FormInput
            label="Units"
            name="units"
            type="number"
            min="1"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
            required
          />
          <FormInput
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onHide}>
            Cancel
          </button>
          <button type="submit" className="btn btn-sm btn-blood-primary">
            Add Stock
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export function UpdateUnitsModal({ show, onHide, item, onUpdate }) {
  const [units, setUnits] = useState(item?.units || 1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!units || Number(units) < 0) {
      setError('Units must be zero or a positive integer.');
      return;
    }
    if (Number(units) < item.units && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    setError('');
    setShowConfirm(false);
    onUpdate(item.id, Number(units));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">Update Units ({item?.bloodGroup} - {item?.component})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger small py-2">{error}</div>}
        {showConfirm && (
          <div className="alert alert-warning small py-2">
            <i className="bi bi-exclamation-triangle-fill me-1"></i>
            You are decreasing stock units from {item?.units} to {units}. Please confirm.
          </div>
        )}
        <FormInput
          label="Available Units"
          name="units"
          type="number"
          min="0"
          value={units}
          onChange={(e) => {
            setUnits(e.target.value);
            setShowConfirm(false);
          }}
          required
        />
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onHide}>
          Cancel
        </button>
        <button
          type="button"
          className={`btn btn-sm ${showConfirm ? 'btn-danger' : 'btn-blood-primary'}`}
          onClick={handleSave}
        >
          {showConfirm ? 'Confirm Decrease' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
