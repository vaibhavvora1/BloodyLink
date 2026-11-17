import apiClient from './apiClient';
import { initialBloodStock } from '../data/bloodStock';
import { mockDonors, mockRequests } from '../data/mockData';
import { getStockStatus, isExpiringSoon } from '../utils/stockStatus';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
let localStock = [...initialBloodStock];
let localRequests = [...mockRequests];

export const api = {
  async login(role, creds) {
    const res = await apiClient.post(`/auth/${role}/login`, creds);
    return res.data;
  },
  async register(role, data) {
    const res = await apiClient.post(`/auth/${role}/register`, data);
    return res.data;
  },
  async refresh() {
    const res = await apiClient.post('/auth/refresh');
    return res.data;
  },
  async logout() {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  async getDonorDashboard() {
    const res = await apiClient.get('/donor/dashboard');
    return res.data;
  },
  async getDonorProfile() {
    const res = await apiClient.get('/donor/profile');
    return res.data;
  },
  async updateDonorProfile(data) {
    const res = await apiClient.put('/donor/profile', data);
    return res.data;
  },
  async updateDonorAvailability(isAvailable) {
    const res = await apiClient.patch('/donor/availability', { isAvailable });
    return res.data;
  },
  async getDonorRequests() {
    const res = await apiClient.get('/donor/requests');
    return res.data;
  },
  async confirmDonation(id) {
    const res = await apiClient.post(`/donor/requests/${id}/confirm`);
    return res.data;
  },
  async getPatientProfile() {
    const res = await apiClient.get('/patient/profile');
    return res.data;
  },
  async updatePatientProfile(data) {
    const res = await apiClient.put('/patient/profile', data);
    return res.data;
  },
  async getPatientDashboard() {
    const res = await apiClient.get('/patient/dashboard');
    return res.data;
  },
  async getAdminDashboard() {
    const res = await apiClient.get('/admin/dashboard');
    return res.data;
  },
  async forgotPassword(email) {
    await delay();
    return { success: true, message: `Reset link sent to ${email}` };
  },
  async getDonors(filters = {}) {
    await delay();
    const data = mockDonors.filter((d) => {
      const matchG = !filters.bloodGroup || d.bloodGroup === filters.bloodGroup;
      const matchC = !filters.city || d.city.toLowerCase().includes(filters.city.toLowerCase());
      return matchG && matchC;
    });
    return { success: true, data };
  },
  async getRequests() {
    await delay();
    return { success: true, data: localRequests };
  },
  async createBloodRequest(reqData) {
    await delay();
    const newReq = {
      id: `req-${Date.now()}`,
      ...reqData,
      units: Number(reqData.units),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    localRequests.unshift(newReq);
    return { success: true, message: 'Emergency request registered', data: newReq };
  },
  async scheduleDonation(slotData) {
    await delay();
    return { success: true, message: 'Donation slot confirmed', data: slotData };
  },
  async getPublicStockAvailability() {
    await delay();
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const data = groups.map((bg) => {
      const totalUnits = localStock
        .filter((i) => i.bloodGroup === bg)
        .reduce((sum, item) => sum + item.units, 0);
      return { bloodGroup: bg, totalUnits, status: getStockStatus(totalUnits) };
    });
    return { success: true, data };
  },
  async getStockList(filters = {}) {
    await delay();
    let data = localStock.map((i) => ({ ...i, status: getStockStatus(i.units), isExpiring: isExpiringSoon(i.expiryDate) }));
    if (filters.bloodGroup) data = data.filter((i) => i.bloodGroup === filters.bloodGroup);
    if (filters.status) data = data.filter((i) => i.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((i) => i.bloodGroup.toLowerCase().includes(q) || i.component.toLowerCase().includes(q));
    }
    return { success: true, data };
  },
  async getStockSummary() {
    await delay();
    const totalUnits = localStock.reduce((acc, curr) => acc + curr.units, 0);
    const criticalCount = localStock.filter((i) => getStockStatus(i.units) === 'Critical').length;
    const lowCount = localStock.filter((i) => getStockStatus(i.units) === 'Low').length;
    const expiringCount = localStock.filter((i) => isExpiringSoon(i.expiryDate)).length;
    return { success: true, data: { totalUnits, criticalCount, lowCount, expiringCount } };
  },
  async addStock(item) {
    await delay();
    const newItem = { id: `stk-${Date.now()}`, ...item, units: Number(item.units), lastUpdated: 'Just now' };
    localStock.unshift(newItem);
    return { success: true, message: 'Stock item added', data: newItem };
  },
  async updateStock(id, newUnits) {
    await delay();
    localStock = localStock.map((i) => (i.id === id ? { ...i, units: Number(newUnits), lastUpdated: 'Just now' } : i));
    return { success: true, message: 'Stock units updated' };
  }
};

export default api;
