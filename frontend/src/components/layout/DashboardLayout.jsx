import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../utils/auth';
import { Toaster } from 'sonner';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position='top-right'/>
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-800">
                Hall Management System
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">{user?.fullName}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;