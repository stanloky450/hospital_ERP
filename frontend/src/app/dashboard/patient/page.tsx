'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import appointmentService from '@/services/appointmentService';

export default function PatientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Patient') {
      router.push('/dashboard');
      return;
    }
    fetchPatientData();
  }, [user, router]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);

      // Fetch patient's appointments
      const appointmentsRes = await appointmentService.getTodayAppointments();

      // In a real implementation, filter by patient ID
      // For now, we'll use all appointments as placeholder
      const allAppointments = appointmentsRes.data || [];

      setAppointments(allAppointments);
      setUpcomingAppointments(allAppointments.filter((apt: any) =>
        apt.status === 'Scheduled'
      ).slice(0, 5));
    } catch (error) {
      console.error('Error fetching patient data:', error);
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

  // Mock patient health data (would come from backend)
  const healthMetrics = {
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    weight: 70,
    height: 170,
    bmi: 24.2,
    lastCheckup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const statCards = [
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      color: 'bg-blue-500',
      icon: '📅',
      description: 'Scheduled visits'
    },
    {
      label: 'Prescriptions',
      value: 3,
      color: 'bg-green-500',
      icon: '💊',
      description: 'Active medications'
    },
    {
      label: 'Lab Reports',
      value: 5,
      color: 'bg-purple-500',
      icon: '🧪',
      description: 'Available reports'
    },
    {
      label: 'Unpaid Bills',
      value: 1,
      color: 'bg-yellow-500',
      icon: '💰',
      description: 'Pending payment'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Patient Portal</h1>
        <p className="text-teal-100 mt-2">
          Your personal health dashboard
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Welcome, {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Patient ID: {user?.patientId || 'N/A'}</span>
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
        {/* Upcoming Appointments - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <button
              onClick={() => router.push('/appointments/book')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium"
            >
              + Book Appointment
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-500 text-lg">No upcoming appointments</p>
                <p className="text-gray-400 text-sm mt-2">Book an appointment to see a doctor</p>
                <button
                  onClick={() => router.push('/appointments/book')}
                  className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  Book Now
                </button>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:border-teal-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-semibold text-sm">
                          {appointment.doctor?.firstName?.[0] || 'D'}{appointment.doctor?.lastName?.[0] || 'R'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {appointment.doctor?.firstName || 'TBA'} {appointment.doctor?.lastName || ''}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.department || 'General Medicine'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.reasonForVisit || 'General Consultation'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {appointment.appointmentTime}
                      </p>
                      <span className="inline-block text-xs px-3 py-1 rounded-full mt-2 bg-yellow-100 text-yellow-800">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => router.push(`/appointments/${appointment._id}/reschedule`)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => router.push(`/appointments/${appointment._id}/cancel`)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Health Metrics - Takes 1 column */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Metrics</h3>
            <span className="text-xs text-gray-500">
              Last updated: {new Date(healthMetrics.lastCheckup).toLocaleDateString()}
            </span>
          </div>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blood Pressure</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.bloodPressure}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">mmHg</p>
            </div>

            <div className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Heart Rate</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.heartRate}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">bpm</p>
            </div>

            <div className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.temperature}°F</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Fahrenheit</p>
            </div>

            <div className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weight</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.weight} kg</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Kilograms</p>
            </div>

            <div className="border-b pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Height</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.height} cm</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Centimeters</p>
            </div>

            <div className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">BMI</span>
                <span className="text-lg font-semibold text-gray-900">{healthMetrics.bmi}</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Normal range</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Records */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Records</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/patient/prescriptions')}
              className="w-full flex items-center justify-between p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">💊</div>
                <div className="text-left">
                  <p className="font-medium text-green-600">My Prescriptions</p>
                  <p className="text-xs text-gray-500">View active medications</p>
                </div>
              </div>
              <span className="text-green-600">→</span>
            </button>

            <button
              onClick={() => router.push('/patient/lab-reports')}
              className="w-full flex items-center justify-between p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🧪</div>
                <div className="text-left">
                  <p className="font-medium text-purple-600">Lab Reports</p>
                  <p className="text-xs text-gray-500">View test results</p>
                </div>
              </div>
              <span className="text-purple-600">→</span>
            </button>

            <button
              onClick={() => router.push('/patient/imaging')}
              className="w-full flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🔬</div>
                <div className="text-left">
                  <p className="font-medium text-blue-600">Imaging Reports</p>
                  <p className="text-xs text-gray-500">X-rays, MRI, CT scans</p>
                </div>
              </div>
              <span className="text-blue-600">→</span>
            </button>

            <button
              onClick={() => router.push('/patient/medical-history')}
              className="w-full flex items-center justify-between p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📋</div>
                <div className="text-left">
                  <p className="font-medium text-indigo-600">Medical History</p>
                  <p className="text-xs text-gray-500">Complete health records</p>
                </div>
              </div>
              <span className="text-indigo-600">→</span>
            </button>
          </div>
        </div>

        {/* Billing & Payments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payments</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">$450.00</p>
                  <p className="text-xs text-gray-500 mt-1">1 unpaid bill</p>
                </div>
                <button
                  onClick={() => router.push('/patient/billing/pay')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                >
                  Pay Now
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push('/patient/billing/history')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">💳</div>
                <div className="text-left">
                  <p className="font-medium text-gray-700">Payment History</p>
                  <p className="text-xs text-gray-500">View all transactions</p>
                </div>
              </div>
              <span className="text-gray-600">→</span>
            </button>

            <button
              onClick={() => router.push('/patient/billing/invoices')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📄</div>
                <div className="text-left">
                  <p className="font-medium text-gray-700">Invoices</p>
                  <p className="text-xs text-gray-500">Download receipts</p>
                </div>
              </div>
              <span className="text-gray-600">→</span>
            </button>

            <button
              onClick={() => router.push('/patient/insurance')}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🏥</div>
                <div className="text-left">
                  <p className="font-medium text-gray-700">Insurance Info</p>
                  <p className="text-xs text-gray-500">Manage insurance details</p>
                </div>
              </div>
              <span className="text-gray-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/appointments/book')}
            className="p-4 border-2 border-teal-200 rounded-lg hover:bg-teal-50 transition text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-teal-600">Book Appointment</p>
          </button>
          <button
            onClick={() => router.push('/patient/messages')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm font-medium text-blue-600">Messages</p>
          </button>
          <button
            onClick={() => router.push('/patient/profile')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="text-sm font-medium text-purple-600">My Profile</p>
          </button>
          <button
            onClick={() => router.push('/patient/support')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">❓</div>
            <p className="text-sm font-medium text-yellow-600">Help & Support</p>
          </button>
          <button
            onClick={() => router.push('/patient/emergency')}
            className="p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition text-center"
          >
            <div className="text-2xl mb-2">🚨</div>
            <p className="text-sm font-medium text-red-600">Emergency</p>
          </button>
        </div>
      </div>
    </div>
  );
}
