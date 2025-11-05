'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import appointmentService from '@/services/appointmentService';
import patientService from '@/services/patientService';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== 'Doctor') {
      router.push('/dashboard');
      return;
    }
    fetchDoctorData();
  }, [user, router]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);

      // Fetch doctor's appointments and patients
      const [appointmentsRes, patientsRes] = await Promise.all([
        appointmentService.getTodayAppointments(),
        patientService.getPatients({ limit: 10 }),
      ]);

      // Filter appointments for this doctor
      const myAppointments = appointmentsRes.data?.filter(
        (apt: any) => apt.doctor?._id === user?._id || apt.doctor?.staff?._id === user?._id
      ) || [];

      setTodaySchedule(myAppointments);
      setRecentPatients(patientsRes.data || []);

      // Calculate stats
      setStats({
        totalAppointments: myAppointments.length,
        completed: myAppointments.filter((a: any) => a.status === 'Completed').length,
        pending: myAppointments.filter((a: any) => a.status === 'Scheduled').length,
        inProgress: myAppointments.filter((a: any) => a.status === 'In Progress').length,
      });
    } catch (error) {
      console.error('Error fetching doctor data:', error);
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
      label: 'Today\'s Appointments',
      value: stats?.totalAppointments || 0,
      color: 'bg-blue-500',
      icon: '📅',
      description: 'Total scheduled'
    },
    {
      label: 'Completed',
      value: stats?.completed || 0,
      color: 'bg-green-500',
      icon: '✅',
      description: 'Consultations done'
    },
    {
      label: 'Pending',
      value: stats?.pending || 0,
      color: 'bg-yellow-500',
      icon: '⏳',
      description: 'Waiting for you'
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      color: 'bg-purple-500',
      icon: '👨‍⚕️',
      description: 'Currently consulting'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-green-100 mt-2">
          Manage your schedule and patient consultations
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Dr. {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{user?.department || 'General Medicine'}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <button
              onClick={() => router.push('/appointments')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
                <p className="text-gray-400 text-sm mt-2">Enjoy your day!</p>
              </div>
            ) : (
              todaySchedule.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:border-green-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
                          {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Patient ID: {appointment.patient?.patientId}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.reasonForVisit || 'General Consultation'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {appointment.appointmentTime}
                      </p>
                      <span className={`inline-block text-xs px-3 py-1 rounded-full mt-2 ${
                        appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => router.push(`/appointments/${appointment._id}`)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Start Consultation
                    </button>
                    <button
                      onClick={() => router.push(`/patients/${appointment.patient?._id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                    >
                      View Records
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Patients - Takes 1 column */}
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
              recentPatients.slice(0, 8).map((patient) => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/patients/${patient._id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{patient.patientId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{patient.bloodGroup || 'N/A'}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/prescriptions/new')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm font-medium text-green-600">New Prescription</p>
          </button>
          <button
            onClick={() => router.push('/laboratory/request')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧪</div>
            <p className="text-sm font-medium text-purple-600">Request Lab Test</p>
          </button>
          <button
            onClick={() => router.push('/radiology/request')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">🔬</div>
            <p className="text-sm font-medium text-blue-600">Request Imaging</p>
          </button>
          <button
            onClick={() => router.push('/patients')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-yellow-600">Patient Records</p>
          </button>
          <button
            onClick={() => router.push('/appointments')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-indigo-600">My Schedule</p>
          </button>
        </div>
      </div>
    </div>
  );
}
