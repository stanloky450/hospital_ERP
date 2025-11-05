'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import wardService from '@/services/wardService';
import patientService from '@/services/patientService';
import appointmentService from '@/services/appointmentService';

export default function NurseDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<any[]>([]);
  const [myWard, setMyWard] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'Nurse') {
      router.push('/dashboard');
      return;
    }
    fetchNurseData();
  }, [user, router]);

  const fetchNurseData = async () => {
    try {
      setLoading(true);

      // Fetch wards and appointments
      const [wardsRes, appointmentsRes, patientsRes] = await Promise.all([
        wardService.getWards(),
        appointmentService.getTodayAppointments(),
        patientService.getPatients({ limit: 10 }),
      ]);

      const allWards = wardsRes.data || [];
      setWards(allWards);

      // Find nurse's assigned ward
      const assignedWard = allWards.find(
        (ward: any) => ward.nurseInCharge?._id === user?._id
      );
      setMyWard(assignedWard);

      setTodayAppointments(appointmentsRes.data || []);
      setPatients(patientsRes.data || []);
    } catch (error) {
      console.error('Error fetching nurse data:', error);
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
      label: 'My Ward',
      value: myWard?.name || 'Not Assigned',
      color: 'bg-blue-500',
      icon: '🏥',
      description: myWard ? `Floor ${myWard.floor}` : 'No ward assigned'
    },
    {
      label: 'Occupied Beds',
      value: myWard ? `${myWard.totalBeds - myWard.availableBeds}/${myWard.totalBeds}` : '0/0',
      color: 'bg-purple-500',
      icon: '🛏️',
      description: 'Current occupancy'
    },
    {
      label: 'Today\'s Appointments',
      value: todayAppointments.length,
      color: 'bg-green-500',
      icon: '📅',
      description: 'Hospital-wide'
    },
    {
      label: 'Total Patients',
      value: patients.length,
      color: 'bg-yellow-500',
      icon: '👥',
      description: 'Under care'
    },
  ];

  const occupiedBeds = myWard?.beds?.filter((bed: any) => bed.isOccupied) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
        <p className="text-blue-100 mt-2">
          Patient care and ward management
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">Nurse {user?.firstName} {user?.lastName}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-sm">{user?.department || 'General Ward'}</span>
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
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
        {/* My Ward Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {myWard ? `${myWard.name} Patients` : 'Ward Patients'}
            </h3>
            <button
              onClick={() => router.push('/wards')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All Wards →
            </button>
          </div>
          <div className="space-y-3">
            {!myWard ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏥</div>
                <p className="text-gray-500 text-lg">No ward assigned</p>
                <p className="text-gray-400 text-sm mt-2">Contact admin for ward assignment</p>
              </div>
            ) : occupiedBeds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛏️</div>
                <p className="text-gray-500 text-lg">No patients in {myWard.name}</p>
                <p className="text-gray-400 text-sm mt-2">All beds are currently vacant</p>
              </div>
            ) : (
              occupiedBeds.map((bed: any) => (
                <div
                  key={bed.bedNumber}
                  className="border rounded-lg p-4 hover:border-blue-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {bed.patient?.firstName?.[0] || 'P'}{bed.patient?.lastName?.[0] || 'T'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {bed.patient?.firstName || 'Patient'} {bed.patient?.lastName || ''}
                        </p>
                        <p className="text-sm text-gray-600">Bed: {bed.bedNumber}</p>
                        <p className="text-xs text-gray-500">
                          Admitted: {bed.admissionDate ? new Date(bed.admissionDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/patients/${bed.patient?._id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Morning Vitals Check</p>
                  <p className="text-sm text-gray-600">Check all patients' vitals</p>
                  <p className="text-xs text-gray-500 mt-1">8:00 AM - 10:00 AM</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Medication Administration</p>
                  <p className="text-sm text-gray-600">Distribute scheduled medications</p>
                  <p className="text-xs text-gray-500 mt-1">10:00 AM - 12:00 PM</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Wound Dressing</p>
                  <p className="text-sm text-gray-600">Post-surgical care rounds</p>
                  <p className="text-xs text-gray-500 mt-1">2:00 PM - 4:00 PM</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Evening Vitals Check</p>
                  <p className="text-sm text-gray-600">Record evening measurements</p>
                  <p className="text-xs text-gray-500 mt-1">6:00 PM - 8:00 PM</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Hospital Wards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Hospital Wards</h3>
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
                className={`border-2 rounded-lg p-4 transition ${
                  ward._id === myWard?._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                  {ward._id === myWard?._id && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">My Ward</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{ward.type} - Floor {ward.floor}</p>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Beds:</span>
                  <span className="font-semibold text-gray-900">
                    {ward.availableBeds}/{ward.totalBeds} available
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => router.push('/patients')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-blue-600">View Patients</p>
          </button>
          <button
            onClick={() => router.push('/wards')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
          >
            <div className="text-2xl mb-2">🏥</div>
            <p className="text-sm font-medium text-purple-600">Ward Management</p>
          </button>
          <button
            onClick={() => router.push('/pharmacy')}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
          >
            <div className="text-2xl mb-2">💊</div>
            <p className="text-sm font-medium text-green-600">Medications</p>
          </button>
          <button
            onClick={() => router.push('/laboratory')}
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition text-center"
          >
            <div className="text-2xl mb-2">🧪</div>
            <p className="text-sm font-medium text-yellow-600">Lab Results</p>
          </button>
          <button
            onClick={() => router.push('/appointments')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm font-medium text-indigo-600">Appointments</p>
          </button>
        </div>
      </div>
    </div>
  );
}
