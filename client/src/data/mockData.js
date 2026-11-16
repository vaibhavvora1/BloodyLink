export const mockStats = {
  activeDonors: 1240,
  urgentRequests: 18,
  livesSaved: 3820,
  bloodBanks: 45
};

export const mockDonors = [
  {
    id: 'd1',
    name: 'Rahul Sharma',
    bloodGroup: 'O+',
    city: 'Mumbai',
    isAvailable: true,
    maskedPhone: '+91 98*** **120',
    maskedEmail: 'r****@example.com',
    lastDonation: '2026-08-15'
  },
  {
    id: 'd2',
    name: 'Priya Patel',
    bloodGroup: 'A+',
    city: 'Ahmedabad',
    isAvailable: true,
    maskedPhone: '+91 91*** **842',
    maskedEmail: 'p****@example.com',
    lastDonation: '2026-09-02'
  },
  {
    id: 'd3',
    name: 'Ananya Roy',
    bloodGroup: 'B-',
    city: 'Kolkata',
    isAvailable: false,
    maskedPhone: '+91 97*** **339',
    maskedEmail: 'a****@example.com',
    lastDonation: '2026-10-10'
  }
];

export const mockRequests = [
  {
    id: 'req-1',
    patientName: 'Aarav Mehta',
    bloodGroup: 'O-',
    units: 2,
    hospital: 'City Care Hospital',
    city: 'Mumbai',
    urgency: 'Immediate',
    status: 'Pending',
    createdAt: '2026-11-15T08:30:00Z'
  },
  {
    id: 'req-2',
    patientName: 'Sunita Rao',
    bloodGroup: 'AB+',
    units: 1,
    hospital: 'Apollo Multi-Specialty',
    city: 'Bangalore',
    urgency: 'Normal',
    status: 'Approved',
    createdAt: '2026-11-14T14:15:00Z'
  }
];

export const mockStock = [
  { bloodGroup: 'A+', unitsAvailable: 34, status: 'Adequate' },
  { bloodGroup: 'A-', unitsAvailable: 8, status: 'Low' },
  { bloodGroup: 'B+', unitsAvailable: 42, status: 'Adequate' },
  { bloodGroup: 'B-', unitsAvailable: 5, status: 'Critical' },
  { bloodGroup: 'AB+', unitsAvailable: 19, status: 'Adequate' },
  { bloodGroup: 'AB-', unitsAvailable: 3, status: 'Critical' },
  { bloodGroup: 'O+', unitsAvailable: 58, status: 'Adequate' },
  { bloodGroup: 'O-', unitsAvailable: 4, status: 'Critical' }
];
