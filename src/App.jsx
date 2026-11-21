import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';

// Pages
import HomePage from './pages/customer/HomePage';
import JoinQueuePage from './pages/customer/JoinQueuePage';
import StatusTrackerPage from './pages/customer/StatusTrackerPage';
import ReceptionPage from './pages/staff/ReceptionPage';
import BarberWorkstationPage from './pages/barber/BarberWorkstationPage';
import TvDisplayPage from './pages/display/TvDisplayPage';
import AdminPage from './pages/admin/AdminPage';

function AppLayout() {
  const location = useLocation();
  const isDisplay = location.pathname === '/display';
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-[#0F0F0F]">
      <Header />
      <main className={`flex-1 ${!isHome && !isDisplay ? 'pt-24 pb-12' : ''}`}>
        <Routes>
          {/* 1. Customer Home (Mèche Luxury Editorial Style with Ambient Video) */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Remote Join Queue */}
          <Route path="/join" element={<JoinQueuePage />} />

          {/* 3. Live Token Status Tracker */}
          <Route path="/status/:id" element={<StatusTrackerPage />} />

          {/* 4. Receptionist Tablet Dashboard */}
          <Route path="/reception" element={<ReceptionPage />} />

          {/* 5. Barber Workstation View */}
          <Route path="/barber/:name" element={<BarberWorkstationPage />} />

          {/* 6. Waiting Area Wall TV Display */}
          <Route path="/display" element={<TvDisplayPage />} />

          {/* 7. Owner Settings & Analytics */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
