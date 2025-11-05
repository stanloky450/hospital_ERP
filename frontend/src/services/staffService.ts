import apiClient from '@/lib/axios';

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  employeeId: string;
  isActive: boolean;
  status: string;
  profilePicture?: string;
}

class StaffService {
  async getStaff(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    department?: string;
  }) {
    const response = await apiClient.get('/staff', { params });
    return response.data;
  }

  async getStaffById(id: string) {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data.data;
  }

  async getStaffByRole(role: string) {
    const response = await apiClient.get('/staff', { params: { role } });
    return response.data;
  }

  async getStaffStats() {
    const response = await apiClient.get('/staff/stats');
    return response.data;
  }
}

export default new StaffService();
