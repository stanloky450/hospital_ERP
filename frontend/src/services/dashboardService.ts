import apiClient from '@/lib/axios';

class DashboardService {
  async getAdminStats() {
    const response = await apiClient.get('/dashboard/admin/stats');
    return response.data;
  }

  async getDoctorStats() {
    const response = await apiClient.get('/dashboard/doctor/stats');
    return response.data;
  }

  async getNurseStats() {
    const response = await apiClient.get('/dashboard/nurse/stats');
    return response.data;
  }

  async getPharmacistStats() {
    const response = await apiClient.get('/dashboard/pharmacist/stats');
    return response.data;
  }

  async getLabStats() {
    const response = await apiClient.get('/dashboard/lab/stats');
    return response.data;
  }

  async getPatientStats(patientId: string) {
    const response = await apiClient.get(`/dashboard/patient/${patientId}/stats`);
    return response.data;
  }

  // Fallback: Calculate stats from available endpoints
  async getOverviewStats() {
    try {
      // Fetch data in parallel
      const [patientsRes, appointmentsRes, wardsRes, drugsRes] = await Promise.all([
        apiClient.get('/patients', { params: { limit: 1 } }),
        apiClient.get('/appointments', { params: { limit: 1 } }),
        apiClient.get('/wards').catch(() => ({ data: { data: [] } })),
        apiClient.get('/pharmacy/drugs', { params: { limit: 1 } }).catch(() => ({ data: { total: 0 } })),
      ]);

      return {
        totalPatients: patientsRes.data.total || 0,
        totalAppointments: appointmentsRes.data.total || 0,
        totalBeds: wardsRes.data.data?.reduce((sum: number, ward: any) => sum + ward.totalBeds, 0) || 0,
        availableBeds: wardsRes.data.data?.reduce((sum: number, ward: any) => sum + ward.availableBeds, 0) || 0,
        totalDrugs: drugsRes.data.total || 0,
      };
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      return {
        totalPatients: 0,
        totalAppointments: 0,
        totalBeds: 0,
        availableBeds: 0,
        totalDrugs: 0,
      };
    }
  }
}

export default new DashboardService();
