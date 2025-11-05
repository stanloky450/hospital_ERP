import apiClient from '@/lib/axios';

export interface Appointment {
  _id: string;
  appointmentId: string;
  patient: any;
  doctor: any;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: string;
  purpose: string;
  consultationFee: number;
  paymentStatus: string;
}

class AppointmentService {
  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    doctorId?: string;
    patientId?: string;
    date?: string;
  }) {
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  }

  async getAppointmentById(id: string) {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data.data;
  }

  async createAppointment(data: Partial<Appointment>) {
    const response = await apiClient.post('/appointments', data);
    return response.data.data;
  }

  async updateAppointment(id: string, data: Partial<Appointment>) {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data.data;
  }

  async cancelAppointment(id: string, reason: string) {
    const response = await apiClient.put(`/appointments/${id}/cancel`, { reason });
    return response.data.data;
  }

  async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get('/appointments', {
      params: { date: today, limit: 100 }
    });
    return response.data;
  }
}

export default new AppointmentService();
