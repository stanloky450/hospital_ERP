'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import dashboardService from '@/services/dashboardService';
import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);

  useEffect(() => {
    // Redirect to role-specific dashboard
    if (user) {
      const roleDashboard = getRoleDashboard(user.role);
      if (roleDashboard && roleDashboard !== '/dashboard') {
        router.push(roleDashboard);
        return;
      }
    }

    fetchDashboardData();
  }, [user, router]);

  const getRoleDashboard = (role: string) => {
    const dashboards: { [key: string]: string } = {
      'Super Admin': '/dashboard/admin',
      'Admin': '/dashboard/admin',
      'Doctor': '/dashboard/doctor',
      'Nurse': '/dashboard/nurse',
      'Pharmacist': '/dashboard/pharmacist',
      'Lab Technician': '/dashboard/lab',
      'Radiologist': '/dashboard/radiology',
      'Receptionist': '/dashboard',
    };
    return dashboards[role];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch overview stats
      const statsData = await dashboardService.getOverviewStats();
      setStats(statsData);

      // Fetch recent patients
      const patientsRes = await patientService.getPatients({ limit: 5 });
      setRecentPatients(patientsRes.data || []);

      // Fetch today's appointments
      const appointmentsRes = await appointmentService.getTodayAppointments();
      setTodayAppointments(appointmentsRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      label: 'Total Patients',
      value: stats?.totalPatients || 0,
      change: '+12%',
      color: 'bg-blue-500',
      icon: '👥'
    },
    {
      label: 'Today\'s Appointments',
      value: todayAppointments.length,
      change: '+8%',
      color: 'bg-green-500',
      icon: '📅'
    },
    {
      label: 'Available Beds',
      value: `${stats?.availableBeds || 0}/${stats?.totalBeds || 0}`,
      change: '-3%',
      color: 'bg-purple-500',
      icon: '🛏️'
    },
    {
      label: 'Drugs in Stock',
      value: stats?.totalDrugs || 0,
      change: '+5%',
      color: 'bg-yellow-500',
      icon: '💊'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600 mt-1">
          Here's what's happening in your hospital today.
        </p>
        <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {user?.role} - {user?.department}
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
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Appointments
          </h3>
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments today</p>
            ) : (
              todayAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{appointment.appointmentTime}</span>
                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                      appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Patients
          </h3>
          <div className="space-y-4">
            {recentPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent patients</p>
            ) : (
              recentPatients.map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{patient.patientId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{patient.bloodGroup || 'N/A'}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(patient.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/patients/new')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="font-medium text-blue-600">New Patient</p>
          </button>
          <button
            onClick={() => router.push('/appointments/new')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="font-medium text-green-600">New Appointment</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition"
          >
            <div className="text-2xl mb-2">💊</div>
            <p className="font-medium text-purple-600">Pharmacy</p>
          </button>
          <button
            onClick={() => router.push('/laboratory')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition"
          >
            <div className="text-2xl mb-2">🧪</div>
            <p className="font-medium text-yellow-600">Lab Tests</p>
          </button>
        </div>
      </div>
    </div>
  );
}
