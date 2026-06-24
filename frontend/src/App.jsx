import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import JobMatch from './pages/JobMatch';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-transparent border-[#FF763D]" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <ProtectedRoute>
                  <Candidates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates/:id" 
              element={
                <ProtectedRoute>
                  <CandidateDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-match" 
              element={
                <ProtectedRoute>
                  <JobMatch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
