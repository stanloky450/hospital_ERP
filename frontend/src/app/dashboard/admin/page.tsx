'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import dashboardService from '@/services/dashboardService';
import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';
import staffService from '@/services/staffService';
import wardService from '@/services/wardService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    if (user && !['Super Admin', 'Admin'].includes(user.role)) {
      router.push('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all admin data in parallel
      const [statsData, patientsRes, appointmentsRes, wardsRes] = await Promise.all([
        dashboardService.getOverviewStats(),
        patientService.getPatients({ limit: 10 }),
        appointmentService.getTodayAppointments(),
        wardService.getWards().catch(() => ({ data: [] })),
      ]);

      setStats(statsData);
      setRecentPatients(patientsRes.data || []);
      setTodayAppointments(appointmentsRes.data || []);
      setWards(wardsRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
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

  const overviewStats = [
    {
      label: 'Total Patients',
      value: stats?.totalPatients || 0,
      change: '+12%',
      color: 'bg-blue-500',
      icon: '👥',
      description: 'Registered patients'
    },
    {
      label: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      change: '+8%',
      color: 'bg-green-500',
      icon: '📅',
      description: 'All time'
    },
    {
      label: 'Total Beds',
      value: stats?.totalBeds || 0,
      change: 'Steady',
      color: 'bg-purple-500',
      icon: '🛏️',
      description: 'Hospital capacity'
    },
    {
      label: 'Available Beds',
      value: stats?.availableBeds || 0,
      change: '-3%',
      color: 'bg-orange-500',
      icon: '✅',
      description: 'Currently vacant'
    },
    {
      label: 'Total Drugs',
      value: stats?.totalDrugs || 0,
      change: '+5%',
      color: 'bg-yellow-500',
      icon: '💊',
      description: 'In inventory'
    },
    {
      label: 'Today\'s Appointments',
      value: todayAppointments.length,
      change: '+15%',
      color: 'bg-indigo-500',
      icon: '📋',
      description: 'Scheduled today'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-blue-100 mt-2">
          Complete hospital overview and management
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Welcome, {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change}</p>
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
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
            <button
              onClick={() => router.push('/patients')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent patients</p>
            ) : (
              recentPatients.slice(0, 5).map((patient) => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{patient.patientId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{patient.bloodGroup || 'N/A'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(patient.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
            <button
              onClick={() => router.push('/appointments')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments today</p>
            ) : (
              todayAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {appointment.doctor?.firstName || 'TBA'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {appointment.appointmentTime}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ward Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ward Status</h3>
          <button
            onClick={() => router.push('/wards')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Manage Wards →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wards.length === 0 ? (
            <p className="text-gray-500 col-span-4 text-center py-8">No wards data available</p>
          ) : (
            wards.map((ward) => (
              <div
                key={ward._id}
                className="border rounded-lg p-4 hover:border-blue-500 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                  <span className={`w-3 h-3 rounded-full ${
                    ward.availableBeds > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{ward.type} - Floor {ward.floor}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Beds:</span>
                  <span className="font-semibold text-gray-900">
                    {ward.availableBeds}/{ward.totalBeds} available
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      ward.availableBeds / ward.totalBeds > 0.5 ? 'bg-green-500' :
                      ward.availableBeds / ward.totalBeds > 0.2 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(ward.availableBeds / ward.totalBeds) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => router.push('/patients/new')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="text-sm font-medium text-blue-600">Add Patient</p>
          </button>
          <button
            onClick={() => router.push('/staff')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <p className="text-sm font-medium text-green-600">Manage Staff</p>
          </button>
          <button
            onClick={() => router.push('/appointments')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-purple-600">Appointments</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">💊</div>
            <p className="text-sm font-medium text-yellow-600">Pharmacy</p>
          </button>
          <button
            onClick={() => router.push('/laboratory')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧪</div>
            <p className="text-sm font-medium text-indigo-600">Laboratory</p>
          </button>
          <button
            onClick={() => router.push('/reports')}
            className="p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-red-600">Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
