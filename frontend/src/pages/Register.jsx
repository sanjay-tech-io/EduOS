import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/api';

const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'CSE', label: 'Computer Science and Engineering (CSE)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'ECE', label: 'Electronics and Communication Engineering (ECE)' },
  { value: 'VLSI', label: 'Very Large Scale Integration (VLSI)' },
  { value: 'ICE', label: 'Instrumentation and Communication Engineering (ICE)' },
  { value: 'EEE', label: 'Electrical and Electronics Engineering (EEE)' },
  { value: 'MECH', label: 'Mechanical Engineering (MECH)' },
  { value: 'CIVIL', label: 'Civil Engineering (CIVIL)' },
  { value: 'AI & DS', label: 'Artificial Intelligence and Data Science (AI & DS)' },
  { value: 'BME', label: 'Biomedical Engineering (BME)' },
  { value: 'CHEMICAL', label: 'Chemical Engineering' },
  { value: 'ROBOTICS', label: 'Robotics and Automation' }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if department field should be shown (student or faculty)
  const showDepartment = formData.role !== 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Prepare data - remove department for admin
    const submitData = {
      ...formData,
      department: formData.role === 'admin' ? null : formData.department
    };
    
    try {
      const res = await register(submitData);
      authLogin(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0B3D91] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Create Account</h2>
            <p className="text-gray-600 mt-2">Join EduOS and transform your education</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value, department: '' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition bg-white"
                required
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty / Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Department Dropdown - Only for Student and Faculty */}
            {showDepartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition bg-white"
                  required={showDepartment}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Year - Only for Students */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition bg-white"
                  required={formData.role === 'student'}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#0B3D91] text-white py-3 rounded-lg font-semibold hover:bg-[#0a3568] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0B3D91] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;