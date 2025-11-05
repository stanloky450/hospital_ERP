import apiClient from '@/lib/axios';

export interface Drug {
  _id: string;
  drugId: string;
  name: string;
  genericName: string;
  brandName: string;
  category: string;
  formulation: string;
  strength: {
    value: number;
    unit: string;
  };
  stock: {
    quantity: number;
    unit: string;
    reorderLevel: number;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    mrp: number;
  };
  isActive: boolean;
  isAvailable: boolean;
}

class DrugService {
  async getDrugs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const response = await apiClient.get('/pharmacy/drugs', { params });
    return response.data;
  }

  async getDrugById(id: string) {
    const response = await apiClient.get(`/pharmacy/drugs/${id}`);
    return response.data.data;
  }

  async getLowStockDrugs() {
    const response = await apiClient.get('/pharmacy/drugs/low-stock');
    return response.data;
  }

  async getExpiringDrugs() {
    const response = await apiClient.get('/pharmacy/drugs/expiring');
    return response.data;
  }

  async updateStock(id: string, quantity: number) {
    const response = await apiClient.put(`/pharmacy/drugs/${id}/stock`, { quantity });
    return response.data;
  }
}

export default new DrugService();
