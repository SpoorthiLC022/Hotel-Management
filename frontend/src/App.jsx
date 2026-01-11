import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Layout from './components/Layout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RoomManagement from './pages/Admin/RoomManagement';
import UserManagement from './pages/Admin/UserManagement';
import AdminReports from './pages/Admin/AdminReports';
import RoomList from './pages/Guest/RoomList';
import GuestDashboard from './pages/Guest/GuestDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';
import Housekeeping from './pages/Staff/Housekeeping';
import Payment from './pages/Guest/Payment';
import ServiceHub from './pages/Guest/ServiceHub';
import Feedback from './pages/Guest/Feedback';
import MyBookings from './pages/Guest/MyBookings';
import Settings from './pages/Common/Settings';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  const withLayout = (Component) => (
    <Layout>
      <Component />
    </Layout>
  );

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={withLayout(AdminDashboard)} />
        <Route path="/admin/rooms" element={withLayout(RoomManagement)} />
        <Route path="/admin/users" element={withLayout(UserManagement)} />
        <Route path="/admin/reports" element={withLayout(AdminReports)} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route path="/staff/dashboard" element={withLayout(StaffDashboard)} />
        <Route path="/staff/housekeeping" element={withLayout(Housekeeping)} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['guest', 'admin', 'staff']} />}>
        <Route path="/guest/dashboard" element={withLayout(GuestDashboard)} />
        <Route path="/rooms" element={withLayout(RoomList)} />
        <Route path="/bookings" element={withLayout(MyBookings)} />
        <Route path="/services" element={withLayout(ServiceHub)} />
        <Route path="/payments" element={withLayout(Payment)} />
        <Route path="/feedback" element={withLayout(Feedback)} />
        <Route path="/settings" element={withLayout(Settings)} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
