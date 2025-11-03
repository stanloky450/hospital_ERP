'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Patients', value: '1,234', change: '+12%', color: 'bg-blue-500' },
    { label: 'Appointments Today', value: '56', change: '+8%', color: 'bg-green-500' },
    { label: 'Active Staff', value: '89', change: '+3%', color: 'bg-purple-500' },
    { label: 'Revenue (Month)', value: '$45,678', change: '+15%', color: 'bg-yellow-500' },
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Appointments
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">Patient Name {item}</p>
                  <p className="text-sm text-gray-600">Dr. Smith - Cardiology</p>
                </div>
                <span className="text-sm text-gray-500">10:00 AM</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition">
              <p className="font-medium text-blue-600">New Patient</p>
            </button>
            <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition">
              <p className="font-medium text-green-600">New Appointment</p>
            </button>
            <button className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition">
              <p className="font-medium text-purple-600">Lab Test</p>
            </button>
            <button className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition">
              <p className="font-medium text-yellow-600">Billing</p>
            </button>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map((dept) => (
            <div
              key={dept}
              className="p-4 border rounded-lg hover:border-blue-500 transition cursor-pointer"
            >
              <p className="font-medium text-gray-900">{dept}</p>
              <p className="text-sm text-gray-600 mt-1">12 Doctors</p>
              <p className="text-sm text-gray-600">45 Patients</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
