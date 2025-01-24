import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import StudentDashboard from './components/dashboards/StudentDashboard.jsx';
import LecturerDashboard from './components/dashboards/LecturerDashboard.jsx';
import AdminDashboard from './components/dashboards/AdminDashboard.jsx';
import { getUser } from './utils/auth';
import SignUp from './components/auth/SignUp';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();
  
  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/signin" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;