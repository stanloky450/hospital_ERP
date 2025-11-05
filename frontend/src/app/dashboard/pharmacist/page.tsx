'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import drugService from '@/services/drugService';

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [lowStockDrugs, setLowStockDrugs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== 'Pharmacist') {
      router.push('/dashboard');
      return;
    }
    fetchPharmacyData();
  }, [user, router]);

  const fetchPharmacyData = async () => {
    try {
      setLoading(true);

      // Fetch pharmacy data
      const [drugsRes, lowStockRes] = await Promise.all([
        drugService.getDrugs({ limit: 20 }),
        drugService.getLowStockDrugs().catch(() => ({ data: [] })),
      ]);

      const allDrugs = drugsRes.data || [];
      setDrugs(allDrugs);
      setLowStockDrugs(lowStockRes.data || []);

      // Calculate stats
      const totalDrugs = drugsRes.total || allDrugs.length;
      const availableDrugs = allDrugs.filter((d: any) => d.isAvailable).length;
      const outOfStock = allDrugs.filter((d: any) => d.stock?.quantity === 0).length;

      setStats({
        totalDrugs,
        availableDrugs,
        outOfStock,
        lowStock: lowStockRes.data?.length || allDrugs.filter((d: any) =>
          d.stock?.quantity > 0 && d.stock?.quantity <= d.stock?.reorderLevel
        ).length || 0,
      });
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Drugs',
      value: stats?.totalDrugs || 0,
      color: 'bg-blue-500',
      icon: '💊',
      description: 'In inventory'
    },
    {
      label: 'Available',
      value: stats?.availableDrugs || 0,
      color: 'bg-green-500',
      icon: '✅',
      description: 'In stock'
    },
    {
      label: 'Low Stock',
      value: stats?.lowStock || 0,
      color: 'bg-yellow-500',
      icon: '⚠️',
      description: 'Need reorder'
    },
    {
      label: 'Out of Stock',
      value: stats?.outOfStock || 0,
      color: 'bg-red-500',
      icon: '❌',
      description: 'Unavailable'
    },
  ];

  // Identify low stock items from the drugs list
  const identifiedLowStock = drugs.filter((drug: any) =>
    drug.stock?.quantity > 0 &&
    drug.stock?.quantity <= drug.stock?.reorderLevel
  );

  const displayLowStock = lowStockDrugs.length > 0 ? lowStockDrugs : identifiedLowStock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
        <p className="text-purple-100 mt-2">
          Medication inventory and dispensing management
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Pharmacist {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{user?.department || 'Pharmacy'}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`w-16 h-16 ${stat.color} rounded-lg flex items-center justify-center text-3xl flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-yellow-500 mr-2">⚠️</span>
              Low Stock Alerts
            </h3>
            <button
              onClick={() => router.push('/pharmacy/low-stock')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {displayLowStock.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-500 text-lg">No low stock items</p>
                <p className="text-gray-400 text-sm mt-2">All medications are well stocked</p>
              </div>
            ) : (
              displayLowStock.slice(0, 6).map((drug) => (
                <div
                  key={drug._id}
                  className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg hover:bg-yellow-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{drug.name}</p>
                      <p className="text-sm text-gray-600">{drug.genericName || drug.brandName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Stock: <span className="font-semibold text-yellow-600">
                            {drug.stock?.quantity} {drug.stock?.unit}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Reorder at: {drug.stock?.reorderLevel} {drug.stock?.unit}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/pharmacy/drugs/${drug._id}/reorder`)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm font-medium"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Prescriptions</h3>
            <button
              onClick={() => router.push('/pharmacy/prescriptions')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {/* Placeholder for prescriptions - would come from backend */}
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No pending prescriptions</p>
              <p className="text-gray-400 text-sm mt-2">New prescriptions will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drug Inventory */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Drug Inventory</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/pharmacy/drugs/new')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              + Add Drug
            </button>
            <button
              onClick={() => router.push('/pharmacy/drugs')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drug Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drugs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No drugs in inventory
                  </td>
                </tr>
              ) : (
                drugs.slice(0, 10).map((drug) => (
                  <tr key={drug._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                      <div className="text-xs text-gray-500">{drug.genericName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{drug.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {drug.stock?.quantity} {drug.stock?.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Reorder: {drug.stock?.reorderLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${drug.pricing?.sellingPrice?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        drug.stock?.quantity === 0 ? 'bg-red-100 text-red-800' :
                        drug.stock?.quantity <= drug.stock?.reorderLevel ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {drug.stock?.quantity === 0 ? 'Out of Stock' :
                         drug.stock?.quantity <= drug.stock?.reorderLevel ? 'Low Stock' :
                         'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => router.push(`/pharmacy/drugs/${drug._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/pharmacy/dispense')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">💊</div>
            <p className="text-sm font-medium text-purple-600">Dispense Drug</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy/drugs')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="text-sm font-medium text-blue-600">Manage Inventory</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy/prescriptions')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-medium text-green-600">Prescriptions</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy/low-stock')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm font-medium text-yellow-600">Low Stock</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy/reports')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-indigo-600">Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
