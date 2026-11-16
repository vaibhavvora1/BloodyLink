import React from 'react';
import BloodGroupSelect from '../forms/BloodGroupSelect';

export default function StockFilters({ filters, onChange }) {
  return (
    <div className="row g-2 align-items-center mb-3">
      <div className="col-12 col-md-5">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search component..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="col-6 col-md-4">
        <BloodGroupSelect
          includeAllOption
          allLabel="All Blood Groups"
          value={filters.bloodGroup}
          onChange={(e) => onChange({ ...filters, bloodGroup: e.target.value })}
        />
      </div>
      <div className="col-6 col-md-3">
        <select
          className="form-select form-select-sm mb-3"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Low">Low</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>
  );
}
