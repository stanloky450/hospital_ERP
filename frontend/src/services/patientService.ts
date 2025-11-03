import apiClient from '@/lib/axios';

export interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Patient[];
}

export interface PatientResponse {
  success: boolean;
  data: Patient;
}

class PatientService {
  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PatientsResponse> {
    const response = await apiClient.get<PatientsResponse>('/patients', { params });
    return response.data;
  }

  async getPatient(id: string): Promise<Patient> {
    const response = await apiClient.get<PatientResponse>(`/patients/${id}`);
    return response.data.data;
  }

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.post<PatientResponse>('/patients', data);
    return response.data.data;
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.put<PatientResponse>(`/patients/${id}`, data);
    return response.data.data;
  }

  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  }
}

export default new PatientService();
