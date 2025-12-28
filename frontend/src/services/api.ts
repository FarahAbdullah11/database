import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients API
export const patientsAPI = {
  getAll: () => api.get('/patients'),
  getById: (id: number) => api.get(`/patients/${id}`),
  getDoctors: () => api.get('/patients/form/doctors'),
  create: (data: any) => api.post('/patients', data),
  update: (id: number, data: any) => api.put(`/patients/${id}`, data),
};

// Doctors API
export const doctorsAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id: number) => api.get(`/doctors/${id}`),
};

// Admissions API
export const admissionsAPI = {
  getAll: () => api.get('/admissions'),
  getFormData: () => api.get('/admissions/form-data'),
  create: (data: any) => api.post('/admissions', data),
  discharge: (id: number) => api.post(`/admissions/${id}/discharge`),
};

// Billing API
export const billingAPI = {
  getAll: () => api.get('/billing'),
  generate: (patientId: number) => api.get(`/billing/generate/${patientId}`),
  create: (data: any) => api.post('/billing', data),
  getByPatient: (patientId: number) => api.get(`/billing/patient/${patientId}`),
};

// Reports API
export const reportsAPI = {
  getNearestHospitalFormData: () => api.get('/reports/nearest-hospital/form-data'),
  getNearestHospital: (patientId: number, specialization?: string) => 
    api.get('/reports/nearest-hospital', { params: { patientId, specialization } }),
};

export default api;

