'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import patientService from '@/services/patientService';

export default function LabDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Lab Technician') {
      router.push('/dashboard');
      return;
    }
    fetchLabData();
  }, [user, router]);

  const fetchLabData = async () => {
    try {
      setLoading(true);

      // Fetch recent patients for reference
      const patientsRes = await patientService.getPatients({ limit: 10 });
      setPatients(patientsRes.data || []);
    } catch (error) {
      console.error('Error fetching lab data:', error);
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

  // Mock data for lab tests (would come from backend)
  const pendingTests = [
    {
      id: '1',
      testName: 'Complete Blood Count (CBC)',
      patientName: 'John Doe',
      patientId: 'P001',
      requestedBy: 'Dr. Smith',
      requestDate: new Date().toISOString(),
      priority: 'Urgent',
      status: 'Pending'
    },
    {
      id: '2',
      testName: 'Lipid Profile',
      patientName: 'Jane Smith',
      patientId: 'P002',
      requestedBy: 'Dr. Johnson',
      requestDate: new Date().toISOString(),
      priority: 'Normal',
      status: 'In Progress'
    },
    {
      id: '3',
      testName: 'Thyroid Function Test',
      patientName: 'Bob Wilson',
      patientId: 'P003',
      requestedBy: 'Dr. Davis',
      requestDate: new Date().toISOString(),
      priority: 'Normal',
      status: 'Pending'
    },
  ];

  const statCards = [
    {
      label: 'Pending Tests',
      value: pendingTests.filter(t => t.status === 'Pending').length,
      color: 'bg-yellow-500',
      icon: '⏳',
      description: 'Awaiting processing'
    },
    {
      label: 'In Progress',
      value: pendingTests.filter(t => t.status === 'In Progress').length,
      color: 'bg-blue-500',
      icon: '🔬',
      description: 'Currently testing'
    },
    {
      label: 'Completed Today',
      value: 12,
      color: 'bg-green-500',
      icon: '✅',
      description: 'Results uploaded'
    },
    {
      label: 'Urgent',
      value: pendingTests.filter(t => t.priority === 'Urgent').length,
      color: 'bg-red-500',
      icon: '🚨',
      description: 'High priority'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Laboratory Dashboard</h1>
        <p className="text-cyan-100 mt-2">
          Test management and results processing
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Lab Tech {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{user?.department || 'Laboratory'}</span>
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
        {/* Test Queue - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Queue</h3>
            <button
              onClick={() => router.push('/laboratory/tests')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {pendingTests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧪</div>
                <p className="text-gray-500 text-lg">No pending tests</p>
                <p className="text-gray-400 text-sm mt-2">All tests have been processed</p>
              </div>
            ) : (
              pendingTests.map((test) => (
                <div
                  key={test.id}
                  className={`border-l-4 p-4 rounded-r-lg transition ${
                    test.priority === 'Urgent' ? 'border-red-500 bg-red-50' :
                    test.status === 'In Progress' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                        {test.priority === 'Urgent' && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Patient</p>
                          <p className="text-sm font-medium text-gray-900">
                            {test.patientName} ({test.patientId})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested By</p>
                          <p className="text-sm font-medium text-gray-900">{test.requestedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Request Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(test.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                            test.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            test.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => router.push(`/laboratory/tests/${test.id}`)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium whitespace-nowrap"
                      >
                        {test.status === 'Pending' ? 'Start Test' : 'Continue'}
                      </button>
                      <button
                        onClick={() => router.push(`/patients/${test.patientId}`)}
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
              onClick={() => router.push('/laboratory/equipment')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage →
            </button>
          </div>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Hematology Analyzer</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Last Calibration: 2 days ago</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Chemistry Analyzer</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Last Calibration: 1 day ago</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Microscope #1</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Last Maintenance: 5 days ago</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Centrifuge #2</span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Needs Calibration</p>
              <p className="text-xs text-gray-500">Last Calibration: 7 days ago</p>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">PCR Machine</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-500">Status: Operational</p>
              <p className="text-xs text-gray-500">Last Calibration: 3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => router.push('/laboratory/tests?category=hematology')}
            className="p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition text-center"
          >
            <div className="text-2xl mb-2">🩸</div>
            <p className="text-sm font-medium text-red-600">Hematology</p>
            <p className="text-xs text-gray-500 mt-1">Blood Tests</p>
          </button>

          <button
            onClick={() => router.push('/laboratory/tests?category=biochemistry')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧪</div>
            <p className="text-sm font-medium text-blue-600">Biochemistry</p>
            <p className="text-xs text-gray-500 mt-1">Chemistry Tests</p>
          </button>

          <button
            onClick={() => router.push('/laboratory/tests?category=microbiology')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">🦠</div>
            <p className="text-sm font-medium text-green-600">Microbiology</p>
            <p className="text-xs text-gray-500 mt-1">Culture Tests</p>
          </button>

          <button
            onClick={() => router.push('/laboratory/tests?category=immunology')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">💉</div>
            <p className="text-sm font-medium text-purple-600">Immunology</p>
            <p className="text-xs text-gray-500 mt-1">Antibody Tests</p>
          </button>

          <button
            onClick={() => router.push('/laboratory/tests?category=pathology')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">🔬</div>
            <p className="text-sm font-medium text-yellow-600">Pathology</p>
            <p className="text-xs text-gray-500 mt-1">Tissue Analysis</p>
          </button>

          <button
            onClick={() => router.push('/laboratory/tests?category=molecular')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧬</div>
            <p className="text-sm font-medium text-indigo-600">Molecular</p>
            <p className="text-xs text-gray-500 mt-1">DNA/RNA Tests</p>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/laboratory/tests/new')}
            className="p-4 border-2 border-cyan-200 rounded-lg hover:bg-cyan-50 transition text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="text-sm font-medium text-cyan-600">New Test</p>
          </button>
          <button
            onClick={() => router.push('/laboratory/tests')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm font-medium text-blue-600">All Tests</p>
          </button>
          <button
            onClick={() => router.push('/laboratory/results')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-green-600">Results</p>
          </button>
          <button
            onClick={() => router.push('/laboratory/equipment')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-sm font-medium text-purple-600">Equipment</p>
          </button>
          <button
            onClick={() => router.push('/laboratory/reports')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm font-medium text-yellow-600">Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
