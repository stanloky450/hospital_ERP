'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Hospital ERP</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/patients" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Patients
              </Link>
              <Link href="/doctors" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Doctors
              </Link>
              <Link href="/pharmacy" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Pharmacy
              </Link>
              <Link href="/laboratory" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Laboratory
              </Link>
              <Link href="/billing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Billing
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500 text-xs">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
