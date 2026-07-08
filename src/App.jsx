import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import BikeCheckout from './components/BikeCheckout';
import CustomerDashboard from './components/CustomerDashboard';
import StaffReturnFlow from './components/StaffReturnFlow';
import StaffDashboard from './components/StaffDashboard';
import VerifyHandover from './components/VerifyHandover';
import SuperAdminPanel from './components/SuperAdminPanel';
import CustomerAuth from './components/CustomerAuth';
import MobileBottomNav from './components/MobileBottomNav';
import StaffAdminLogin from './components/StaffAdminLogin';
import WalkInBooking from './components/WalkInBooking';
import UserProfile from './components/UserProfile';
import FleetPage from './components/FleetPage';
import { RentalProvider } from './context/RentalContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route for Customers
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppShell() {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isInternalLoginRoute = location.pathname === '/internal-login';
  
  const showNavAndFooter = !isStaffRoute && !isAdminRoute && !isInternalLoginRoute;
  const showBottomNav = !isAdminRoute && !isInternalLoginRoute && !isStaffRoute;
  const mobileRole = 'customer'; // Internal staff use their own UI, bottom nav is only for customers now

  const [internalAuth, setInternalAuth] = useState(null); // 'staff' | 'admin' | null

  // Protected Route Wrappers
  const ProtectedStaffRoute = ({ children }) => {
    if (internalAuth !== 'staff' && internalAuth !== 'admin') {
      return <Navigate to="/internal-login" replace />;
    }
    return children;
  };

  const ProtectedAdminRoute = ({ children }) => {
    if (internalAuth !== 'admin') {
      return <Navigate to="/internal-login" replace />;
    }
    return children;
  };

  return (
    <div className={`min-h-screen flex flex-col ${showNavAndFooter ? 'bg-[#FFFDF8]' : 'bg-[#1C1917]'}`}>
      {showNavAndFooter && <Navbar />}
      <main className={`flex-1 ${showBottomNav ? 'pb-[72px] md:pb-0' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/login" element={<CustomerAuth />} />
          
          {/* Protected Customer Routes */}
          <Route path="/book/:bikeId" element={<ProtectedRoute><BikeCheckout /></ProtectedRoute>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          {/* Internal Login Route */}
          <Route path="/internal-login" element={<StaffAdminLogin onLogin={setInternalAuth} />} />

          {/* Protected Staff Routes */}
          <Route path="/staff" element={<ProtectedStaffRoute><StaffDashboard /></ProtectedStaffRoute>} />
          <Route path="/staff/dashboard" element={<ProtectedStaffRoute><StaffDashboard /></ProtectedStaffRoute>} />
          <Route path="/staff/walk-in" element={<ProtectedStaffRoute><WalkInBooking /></ProtectedStaffRoute>} />
          <Route path="/staff/pickup" element={<ProtectedStaffRoute><VerifyHandover /></ProtectedStaffRoute>} />
          <Route path="/staff/return" element={<ProtectedStaffRoute><StaffReturnFlow /></ProtectedStaffRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><SuperAdminPanel /></ProtectedAdminRoute>} />
        </Routes>
      </main>
      {showNavAndFooter && <Footer />}
      {showBottomNav && <MobileBottomNav userRole={mobileRole} />}
    </div>
  );
}

// ScrollToTop component to reset window scroll on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <RentalProvider>
        <Router>
          <ScrollToTop />
          <AppShell />
        </Router>
      </RentalProvider>
    </AuthProvider>
  );
}

export default App;

