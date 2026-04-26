import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [features] = useState([
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ), 
      title: 'Smart Classroom', 
      desc: 'Create virtual classrooms, manage enrollments, track attendance & marks efficiently.' 
    },
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      title: 'Advanced Analytics', 
      desc: 'Visual charts and insights for attendance, marks & performance tracking.' 
    },
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), 
      title: 'AI Assistant', 
      desc: 'Get personalized academic guidance and support powered by AI technology.' 
    },
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ), 
      title: 'Circulars & Notices', 
      desc: 'Stay updated with instant college announcements and notifications.' 
    },
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ), 
      title: 'Secure Authentication', 
      desc: 'Enterprise-grade JWT security with role-based access control.' 
    },
    { 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ), 
      title: 'Fully Responsive', 
      desc: 'Access from any device - desktop, tablet, or mobile anywhere.' 
    }
  ]);

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0F4FF]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0B3D91]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D72638]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B3D91]/5 border border-[#0B3D91]/10 rounded-full text-[#0B3D91] text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-[#D72638] rounded-full"></span>
              AI-Powered Education Platform
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] mb-6 leading-tight">
              The Complete
              <span className="block text-[#0B3D91]">College Management System</span>
            </h1>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              EduOS combines the best of Google Classroom, College ERP, and AI Assistant 
              into one powerful platform. Streamline academics, track performance, and 
              deliver better education.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="px-8 py-4 bg-[#0B3D91] text-white rounded-lg font-semibold text-base hover:bg-[#0a3568] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Free Trial
              </Link>
              <Link to="/login" className="px-8 py-4 border-2 border-[#0B3D91] text-[#0B3D91] rounded-lg font-semibold text-base hover:bg-[#0B3D91] hover:text-white transition">
                View Demo
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-20">
            {[
              { number: '10K+', label: 'Active Students', icon: '👨‍🎓' },
              { number: '500+', label: 'Colleges', icon: '🏛️' },
              { number: '50K+', label: 'Classes Conducted', icon: '📚' },
              { number: '99.9%', label: 'Uptime', icon: '⚡' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#0B3D91] mb-1">{stat.number}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful features designed to transform how educational institutions operate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#0B3D91]/5 rounded-xl flex items-center justify-center text-[#0B3D91] mb-5 group-hover:bg-[#0B3D91] group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get started with EduOS in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Create Account', 
                desc: 'Register with your institutional email and select your role - student, faculty, or admin.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )
              },
              { 
                step: '02', 
                title: 'Setup Profile', 
                desc: 'Complete your profile, join your institution, and configure your dashboard preferences.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              { 
                step: '03', 
                title: 'Start Using', 
                desc: 'Access your personalized dashboard and manage all academic activities seamlessly.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition">
                <div className="absolute -top-4 left-8 w-12 h-12 bg-[#0B3D91] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-[#0B3D91]/5 rounded-xl flex items-center justify-center text-[#0B3D91] mb-6 mt-2">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#0B3D91] p-10 md:p-14 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Education?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of institutions already using EduOS to streamline their academic operations.
              </p>
              <Link 
                to="/register" 
                className="inline-block px-10 py-4 bg-[#D72638] text-white rounded-lg font-semibold text-lg hover:bg-[#b8202f] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;