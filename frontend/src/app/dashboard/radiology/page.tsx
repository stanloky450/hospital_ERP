'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import patientService from '@/services/patientService';

export default function RadiologistDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Radiologist') {
      router.push('/dashboard');
      return;
    }
    fetchRadiologyData();
  }, [user, router]);

  const fetchRadiologyData = async () => {
    try {
      setLoading(true);

      // Fetch recent patients for reference
      const patientsRes = await patientService.getPatients({ limit: 10 });
      setPatients(patientsRes.data || []);
    } catch (error) {
      console.error('Error fetching radiology data:', error);
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

  // Mock data for imaging requests (would come from backend)
  const imagingQueue = [
    {
      id: '1',
      examType: 'Chest X-Ray',
      patientName: 'John Doe',
      patientId: 'P001',
      requestedBy: 'Dr. Smith',
      requestDate: new Date().toISOString(),
      priority: 'Urgent',
      status: 'Pending',
      bodyPart: 'Chest',
      reason: 'Suspected pneumonia'
    },
    {
      id: '2',
      examType: 'Brain MRI',
      patientName: 'Jane Smith',
      patientId: 'P002',
      requestedBy: 'Dr. Johnson',
      requestDate: new Date().toISOString(),
      priority: 'Normal',
      status: 'In Progress',
      bodyPart: 'Head',
      reason: 'Chronic headaches'
    },
    {
      id: '3',
      examType: 'Abdominal CT Scan',
      patientName: 'Bob Wilson',
      patientId: 'P003',
      requestedBy: 'Dr. Davis',
      requestDate: new Date().toISOString(),
      priority: 'Normal',
      status: 'Pending',
      bodyPart: 'Abdomen',
      reason: 'Abdominal pain'
    },
  ];

  const statCards = [
    {
      label: 'Pending Scans',
      value: imagingQueue.filter(i => i.status === 'Pending').length,
      color: 'bg-yellow-500',
      icon: '⏳',
      description: 'Awaiting scan'
    },
    {
      label: 'In Progress',
      value: imagingQueue.filter(i => i.status === 'In Progress').length,
      color: 'bg-blue-500',
      icon: '🔬',
      description: 'Currently scanning'
    },
    {
      label: 'Completed Today',
      value: 8,
      color: 'bg-green-500',
      icon: '✅',
      description: 'Reports uploaded'
    },
    {
      label: 'Urgent',
      value: imagingQueue.filter(i => i.priority === 'Urgent').length,
      color: 'bg-red-500',
      icon: '🚨',
      description: 'High priority'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Radiology Dashboard</h1>
        <p className="text-indigo-100 mt-2">
          Medical imaging and diagnostic reports
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Dr. {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{user?.department || 'Radiology'}</span>
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
        {/* Imaging Queue - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Imaging Queue</h3>
            <button
              onClick={() => router.push('/radiology/scans')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {imagingQueue.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔬</div>
                <p className="text-gray-500 text-lg">No pending scans</p>
                <p className="text-gray-400 text-sm mt-2">All imaging requests have been processed</p>
              </div>
            ) : (
              imagingQueue.map((scan) => (
                <div
                  key={scan.id}
                  className={`border-l-4 p-4 rounded-r-lg transition ${
                    scan.priority === 'Urgent' ? 'border-red-500 bg-red-50' :
                    scan.status === 'In Progress' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{scan.examType}</h4>
                        {scan.priority === 'Urgent' && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Patient</p>
                          <p className="text-sm font-medium text-gray-900">
                            {scan.patientName} ({scan.patientId})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested By</p>
                          <p className="text-sm font-medium text-gray-900">{scan.requestedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Body Part</p>
                          <p className="text-sm font-medium text-gray-900">{scan.bodyPart}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                            scan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            scan.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {scan.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="text-sm text-gray-900">{scan.reason}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => router.push(`/radiology/scans/${scan.id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium whitespace-nowrap"
                      >
                        {scan.status === 'Pending' ? 'Start Scan' : 'Continue'}
                      </button>
                      <button
                        onClick={() => router.push(`/patients/${scan.patientId}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap"
                      >
                        Patient Info
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Equipment Status - Takes 1 column */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
            <button
              onClick={() => router.push('/radiology/equipment')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage →
            </button>
          </div>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">MRI Scanner #1</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Next Maintenance: 15 days</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">CT Scanner #1</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Next Maintenance: 8 days</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">X-Ray Machine #1</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Next Maintenance: 5 days</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">X-Ray Machine #2</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Next Maintenance: 12 days</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Ultrasound #1</span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Needs Calibration</p>
              <p className="text-xs text-gray-500">Maintenance Due: Tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Imaging Modalities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Imaging Modalities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => router.push('/radiology/scans?type=xray')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm font-medium text-blue-600">X-Ray</p>
            <p className="text-xs text-gray-500 mt-1">Radiography</p>
          </button>

          <button
            onClick={() => router.push('/radiology/scans?type=ct')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">🔬</div>
            <p className="text-sm font-medium text-indigo-600">CT Scan</p>
            <p className="text-xs text-gray-500 mt-1">Computed Tomography</p>
          </button>

          <button
            onClick={() => router.push('/radiology/scans?type=mri')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧲</div>
            <p className="text-sm font-medium text-purple-600">MRI</p>
            <p className="text-xs text-gray-500 mt-1">Magnetic Resonance</p>
          </button>

          <button
            onClick={() => router.push('/radiology/scans?type=ultrasound')}
            className="p-4 border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 transition text-center"
          >
            <div className="text-2xl mb-2">📡</div>
            <p className="text-sm font-medium text-cyan-600">Ultrasound</p>
            <p className="text-xs text-gray-500 mt-1">Sonography</p>
          </button>

          <button
            onClick={() => router.push('/radiology/scans?type=mammography')}
            className="p-4 border-2 border-pink-200 rounded-lg hover:bg-pink-50 transition text-center"
          >
            <div className="text-2xl mb-2">🎗️</div>
            <p className="text-sm font-medium text-pink-600">Mammography</p>
            <p className="text-xs text-gray-500 mt-1">Breast Imaging</p>
          </button>

          <button
            onClick={() => router.push('/radiology/scans?type=fluoroscopy')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">💫</div>
            <p className="text-sm font-medium text-green-600">Fluoroscopy</p>
            <p className="text-xs text-gray-500 mt-1">Real-time X-ray</p>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/radiology/scans/new')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="text-sm font-medium text-indigo-600">New Scan</p>
          </button>
          <button
            onClick={() => router.push('/radiology/scans')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-medium text-blue-600">All Scans</p>
          </button>
          <button
            onClick={() => router.push('/radiology/reports')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-green-600">Reports</p>
          </button>
          <button
            onClick={() => router.push('/radiology/equipment')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-sm font-medium text-purple-600">Equipment</p>
          </button>
          <button
            onClick={() => router.push('/radiology/analytics')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm font-medium text-yellow-600">Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
}
