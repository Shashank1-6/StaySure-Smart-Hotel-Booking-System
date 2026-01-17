import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageBooking } from './pages/ManageBooking';
import { LayoutDashboard, Home as HomeIcon, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-transparent pt-6' : 'bg-white border-b border-slate-100 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className={`text-2xl font-serif font-bold tracking-tight ${isHome ? 'text-white drop-shadow-md' : 'text-emerald-900'}`}>
          StaySure.
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden md:inline">Browse</span>
          </Link>
          <Link 
            to="/manage-booking" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden md:inline">My Bookings</span>
          </Link>
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-emerald-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">Admin</span>
          </Link>
          <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            isHome 
              ? 'bg-white text-emerald-900 hover:bg-emerald-50' 
              : 'bg-emerald-900 text-white hover:bg-emerald-800 shadow-md'
          }`}>
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-booking" element={<ManageBooking />} />
      </Routes>
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif text-white mb-4">StaySure.</h3>
            <p className="max-w-sm">
              Redefining luxury travel with data-driven confidence scoring and curated experiences.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </Router>
  );
};

export default App;