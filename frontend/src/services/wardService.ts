import apiClient from '@/lib/axios';

export interface Ward {
  _id: string;
  wardId: string;
  name: string;
  type: string;
  floor: number;
  totalBeds: number;
  availableBeds: number;
  beds: Array<{
    bedNumber: string;
    isOccupied: boolean;
    patient?: any;
    admissionDate?: string;
  }>;
  nurseInCharge: any;
  isActive: boolean;
}

class WardService {
  async getWards(params?: { type?: string }) {
    const response = await apiClient.get('/wards', { params });
    return response.data;
  }

  async getWardById(id: string) {
    const response = await apiClient.get(`/wards/${id}`);
    return response.data.data;
  }

  async getWardStats() {
    const response = await apiClient.get('/wards/stats');
    return response.data;
  }

  async admitPatient(wardId: string, bedNumber: string, patientId: string) {
    const response = await apiClient.post(`/wards/${wardId}/admit`, {
      bedNumber,
      patientId
    });
    return response.data;
  }

  async dischargePatient(wardId: string, bedNumber: string) {
    const response = await apiClient.post(`/wards/${wardId}/discharge`, {
      bedNumber
    });
    return response.data;
  }
}

export default new WardService();
