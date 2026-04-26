import { Link } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
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
              <a href="/#features" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                Features
              </a>
              <a href="/#how-it-works" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                How It Works
              </a>
              <a href="/#stats" className="text-gray-600 hover:text-[#0B3D91] transition font-medium text-sm">
                Stats
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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B3D91] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#0B3D91] font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-white">EduOS</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                AI-powered college management system combining the best of classroom management, ERP, and intelligent assistance.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-white/70 hover:text-white transition text-sm">Features</a></li>
                <li><a href="/#how-it-works" className="text-white/70 hover:text-white transition text-sm">How It Works</a></li>
                <li><a href="/#stats" className="text-white/70 hover:text-white transition text-sm">Stats</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition text-sm">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-white/70 text-sm">support@eduos.com</li>
                <li className="text-white/70 text-sm">Chennai, Tamil Nadu</li>
                <li className="text-white/70 text-sm">India</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              © 2026 EduOS. All rights reserved. Built for modern education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;