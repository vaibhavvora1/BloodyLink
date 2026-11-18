import apiClient from './apiClient';

const body = (promise) => promise.then((response) => response.data);

const api = {
  login: (role, credentials) => body(apiClient.post(`/auth/${role}/login`, credentials)),
  register: (role, data) => body(apiClient.post(`/auth/${role}/register`, data)),
  refresh: () => body(apiClient.post('/auth/refresh')),
  logout: () => body(apiClient.post('/auth/logout')),
  getMe: () => body(apiClient.get('/auth/me')),

  getDonorDashboard: () => body(apiClient.get('/donor/dashboard')),
  getDonorProfile: () => body(apiClient.get('/donor/profile')),
  updateDonorProfile: (data) => body(apiClient.put('/donor/profile', data)),
  updateDonorAvailability: (isAvailable) => body(apiClient.patch('/donor/availability', { isAvailable })),
  getDonorRequests: () => body(apiClient.get('/donor/requests')),
  acceptBloodRequest: (id) => body(apiClient.post(`/donor/requests/${id}/accept`)),
  confirmDonation: (id) => body(apiClient.post(`/donor/requests/${id}/accept`)),
  getMyDonationRequests: (page = 1) => body(apiClient.get('/donations/my', { params: { page } })),
  createDonationRequest: (data, idempotencyKey) => body(apiClient.post('/donations/request', data, { headers: { 'Idempotency-Key': idempotencyKey } })),
  cancelDonationRequest: (id) => body(apiClient.patch(`/donations/${id}/cancel`)),
  getDonorOffers: () => body(apiClient.get('/donor/offers')),
  createDonationOffer: (data) => body(apiClient.post('/donor/offers', data)),
  getDonorMatches: () => body(apiClient.get('/donor/matches')),
  getDonorNotifications: () => body(apiClient.get('/donor/notifications')),

  getPatientProfile: () => body(apiClient.get('/patient/profile')),
  updatePatientProfile: (data) => body(apiClient.put('/patient/profile', data)),
  getPatientDashboard: () => body(apiClient.get('/patient/dashboard')),
  getPatientRequests: () => body(apiClient.get('/patient/requests')),
  createBloodRequest: (data) => body(apiClient.post('/patient/requests', data)),
  getDonationOffers: (filters = {}) => body(apiClient.get('/patient/offers', { params: filters })),
  requestDonationOffer: (id) => body(apiClient.post(`/patient/offers/${id}/request`)),
  getPatientMatches: () => body(apiClient.get('/patient/matches')),
  getPatientNotifications: () => body(apiClient.get('/patient/notifications')),

  getPublicStock: (filters = {}) => body(apiClient.get('/public/stock', { params: filters })),
  getPublicStockAvailability: () => body(apiClient.get('/public/stock/summary')),

  getAdminDashboard: () => body(apiClient.get('/admin/dashboard')),
  getAdminRequests: (filters = {}) => body(apiClient.get('/admin/requests', { params: filters })),
  getAdminDonations: (filters = {}) => body(apiClient.get('/admin/donations', { params: filters })),
  updateAdminDonation: (id, action) => body(apiClient.patch(`/admin/donations/${id}/${action}`)),
  getBloodStock: () => body(apiClient.get('/stock')),
  updateAdminRequestStatus: (id, status) => body(apiClient.patch(`/admin/requests/${id}/status`, { status })),
  getAdminOffers: (filters = {}) => body(apiClient.get('/admin/offers', { params: filters })),
  deleteAdminOffer: (id) => body(apiClient.delete(`/admin/offers/${id}`)),
  updateAdminOfferStatus: (id, isActive) => body(apiClient.patch(`/admin/offers/${id}/status`, { isActive })),
  getAdminMatches: (filters = {}) => body(apiClient.get('/admin/matches', { params: filters })),
  updateMatchStatus: (id, status, rejectionReason = '') => body(apiClient.patch(`/admin/matches/${id}/status`, { status, rejectionReason })),
  scheduleMatch: (id, data) => body(apiClient.post(`/admin/matches/${id}/schedule`, data)),
  getAdminDonors: () => body(apiClient.get('/admin/donors')),
  updateAdminDonorStatus: (id, status) => body(apiClient.patch(`/admin/donors/${id}/status`, status)),
  deleteAdminDonor: (id) => body(apiClient.delete(`/admin/donors/${id}`)),
  getAdminPatients: () => body(apiClient.get('/admin/patients')),
  deleteAdminPatient: (id) => body(apiClient.delete(`/admin/patients/${id}`)),
  getAdminHospitals: () => body(apiClient.get('/admin/hospitals')),
  getAdminMessages: () => body(apiClient.get('/admin/messages')),
  createHospital: (data) => body(apiClient.post('/admin/hospitals', data)),
  updateHospital: (id, data) => body(apiClient.put(`/admin/hospitals/${id}`, data)),
  deleteHospital: (id) => body(apiClient.delete(`/admin/hospitals/${id}`)),
  contactHospital: (requestId, hospitalId, notes = '') => body(apiClient.post(`/admin/requests/${requestId}/contact`, { hospitalId, notes })),

  getStockList: (filters = {}) => body(apiClient.get('/admin/stock', { params: filters })),
  addStock: (item) => body(apiClient.post('/admin/stock', item)),
  updateStock: (id, updates) => body(apiClient.put(`/admin/stock/${id}`, typeof updates === 'object' ? updates : { availableUnits: Number(updates) })),
  deleteStock: (id) => body(apiClient.delete(`/admin/stock/${id}`))
};

export { api };
export default api;
