import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public pages
import Home from './pages/Home';
import Voyages from './pages/Voyages';
import VoyageDetail from './pages/VoyageDetail';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVoyages from './pages/admin/Voyages';
import AdminAgencyInfo from './pages/admin/AgencyInfo';

// Auth context
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/voyages" element={<Voyages />} />
              <Route path="/voyages/:slug" element={<VoyageDetail />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/voyages"
                element={
                  <PrivateRoute>
                    <AdminVoyages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/agency-info"
                element={
                  <PrivateRoute>
                    <AdminAgencyInfo />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 