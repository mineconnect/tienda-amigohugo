import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <>
      {/* Global Luxury Watermark */}
      <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none select-none overflow-hidden bg-white/50">
        <img
          src="/logo.jpeg"
          alt=""
          className="w-[80vh] h-[80vh] object-contain opacity-[0.03] grayscale contrast-125 mix-blend-multiply"
        />
      </div>

      <Router>
        <Routes>
          {/* Ruta Pública: Tienda */}
          <Route path="/" element={<Home />} />

          {/* Ruta Pública: Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta Protegida: Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;