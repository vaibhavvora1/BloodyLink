import React from 'react';

const compatibilityData = [
  { group: 'O-', canGiveTo: 'Everyone (Universal Donor)', canReceiveFrom: 'O-' },
  { group: 'O+', canGiveTo: 'O+, A+, B+, AB+', canReceiveFrom: 'O+, O-' },
  { group: 'A-', canGiveTo: 'A-, A+, AB-, AB+', canReceiveFrom: 'A-, O-' },
  { group: 'A+', canGiveTo: 'A+, AB+', canReceiveFrom: 'A+, A-, O+, O-' },
  { group: 'B-', canGiveTo: 'B-, B+, AB-, AB+', canReceiveFrom: 'B-, O-' },
  { group: 'B+', canGiveTo: 'B+, AB+', canReceiveFrom: 'B+, B-, O+, O-' },
  { group: 'AB-', canGiveTo: 'AB-, AB+', canReceiveFrom: 'AB-, A-, B-, O-' },
  { group: 'AB+', canGiveTo: 'AB+ only', canReceiveFrom: 'Everyone (Universal Recipient)' }
];

export default function CompatibilityChart() {
  return (
    <section className="py-5" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container app-container py-lg-4">
        <div className="text-center mb-5">
          <span className="text-danger fw-semibold small text-uppercase tracking-wide">
            Medical Match Guide
          </span>
          <h2 className="fw-bold mb-2">Blood Group Compatibility</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
            Check which blood groups you can safely donate to and receive from during medical emergencies.
          </p>
        </div>

        <div className="premium-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Can Donate To</th>
                  <th className="py-3 px-4">Can Receive From</th>
                </tr>
              </thead>
              <tbody>
                {compatibilityData.map((row) => (
                  <tr key={row.group}>
                    <td className="py-3 px-4">
                      <span className="blood-badge fs-6">{row.group}</span>
                    </td>
                    <td className="py-3 px-4 small fw-medium text-dark">{row.canGiveTo}</td>
                    <td className="py-3 px-4 small text-muted">{row.canReceiveFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
