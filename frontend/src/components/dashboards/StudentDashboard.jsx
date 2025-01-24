import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import HallTabs from '../halls/HallTabs';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <HallTabs userRole="student" />
    </DashboardLayout>
  );
};

export default StudentDashboard; 