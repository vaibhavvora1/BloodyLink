import axios from 'axios';
import { mockStats, mockDonors, mockRequests } from '../data/mockData';
import { initialBloodStock } from '../data/bloodStock';
import { getStockStatus, isExpiringSoon } from '../utils/stockStatus';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
let localStock = [...initialBloodStock];
let localRequests = [...mockRequests];

export const api = {
  async login(creds) {
    await delay();
    return {
      success: true,
      message: 'Login successful',
      data: {
        id: `usr-${Date.now()}`,
        name: creds.email.split('@')[0],
        email: creds.email,
        role: creds.role || 'donor',
        bloodGroup: 'O+',
        city: 'Mumbai',
        maskedPhone: '+91 98*** **123'
      }
    };
  },

  async register(u) {
    await delay();
    return {
      success: true,
      message: 'Account created',
      data: { id: `usr-${Date.now()}`, ...u, maskedPhone: '+91 98*** **123' }
    };
  },

  async forgotPassword(email) {
    await delay();
    return { success: true, message: `Instructions sent to ${email}` };
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

  async getPublicStockAvailability() {
    await delay();
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const summary = groups.map((g) => {
      const units = localStock.filter((i) => i.bloodGroup === g).reduce((acc, curr) => acc + curr.units, 0);
      return { bloodGroup: g, totalUnits: units, status: getStockStatus(units) };
    });
    return { success: true, data: summary };
  },

  async addStock(entry) {
    await delay();
    const item = { ...entry, id: `stk-${Date.now()}`, units: Number(entry.units), lastUpdated: new Date().toISOString() };
    localStock.unshift(item);
    return { success: true, message: 'Stock batch added', data: item };
  },

  async updateStock(id, units) {
    await delay();
    const idx = localStock.findIndex((i) => i.id === id);
    if (idx === -1) throw { success: false, message: 'Item not found' };
    localStock[idx] = { ...localStock[idx], units: Number(units), lastUpdated: new Date().toISOString() };
    return { success: true, message: 'Units updated', data: localStock[idx] };
  }
};

export default api;
