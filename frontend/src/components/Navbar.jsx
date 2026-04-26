import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Landing page navigation (when user is not logged in)
  if (!user) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B3D91] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-[#0B3D91]">EduOS</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                Home
              </Link>
              <a href="/#features" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                Features
              </a>
              <a href="/#how-it-works" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                How It Works
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2.5 text-[#0B3D91] font-medium hover:bg-blue-50 rounded-lg transition text-sm"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-[#0B3D91] text-white font-medium rounded-lg hover:bg-[#0a3568] transition shadow-md hover:shadow-lg text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Dashboard navigation (when user is logged in)
  return (
    <nav className="sticky top-0 z-50 bg-[#0B3D91] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-white text-xl font-bold">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0B3D91] font-bold text-sm">E</span>
              </div>
              EduOS
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-1">
              {user.role === 'student' && (
                <>
                  <Link to="/dashboard" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/attendance" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Attendance
                  </Link>
                  <Link to="/marks" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Marks
                  </Link>
                  <Link to="/circulars" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Circulars
                  </Link>
                  <Link to="/ai-assistant" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    AI Assistant
                  </Link>
                </>
              )}
              {user.role === 'faculty' && (
                <>
                  <Link to="/dashboard" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/my-classrooms" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    My Classrooms
                  </Link>
                  <Link to="/circulars" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Circulars
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/dashboard" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/analytics" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Analytics
                  </Link>
                  <Link to="/circulars" className="text-white/80 hover:bg-white/10 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                    Circulars
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium hidden md:block">
                    {user.name} 
                    <span className="ml-1 text-white/60 text-xs capitalize">({user.role})</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#D72638] hover:bg-[#b8202f] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-[#0B3D91] hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;