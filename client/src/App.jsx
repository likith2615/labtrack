import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetail from './pages/EquipmentDetail';
import LabOverview from './pages/LabOverview';
import MaintenanceLogs from './pages/MaintenanceLogs';
import DesignPreview from './pages/DesignPreview';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected App Layout Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/labs" element={<LabOverview />} />
              <Route path="/maintenance" element={<MaintenanceLogs />} />
              <Route path="/design-preview" element={<DesignPreview />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
