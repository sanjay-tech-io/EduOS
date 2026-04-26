import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PublicLayout from './components/PublicLayout';
import PrivateLayout from './components/PrivateLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Private Pages
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Circulars from './pages/common/Circulars';
import AIAssistant from './pages/student/AIAssistant';
import Attendance from './pages/student/Attendance';
import Marks from './pages/student/Marks';
import Classroom from './pages/faculty/Classroom';
import StudentsList from './pages/faculty/Students';

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

// Loading screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading EduOS...</p>
    </div>
  </div>
);

// App content with routing
const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* =====================
          PUBLIC ROUTES
          Accessible without login
          ===================== */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" /> : (
          <PublicLayout>
            <Home />
          </PublicLayout>
        )
      } />
      
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" /> : (
          <PublicLayout>
            <Login />
          </PublicLayout>
        )
      } />
      
      <Route path="/register" element={
        user ? <Navigate to="/dashboard" /> : (
          <PublicLayout>
            <Register />
          </PublicLayout>
        )
      } />

      {/* =====================
          PRIVATE ROUTES
          Require authentication
          ===================== */}
      
      {/* Dashboard - Role-based redirect */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <PrivateLayout>
            <DashboardRouter />
          </PrivateLayout>
        </ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/attendance" element={
        <ProtectedRoute roles={['student']}>
          <PrivateLayout>
            <Attendance />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/marks" element={
        <ProtectedRoute roles={['student']}>
          <PrivateLayout>
            <Marks />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/circulars" element={
        <ProtectedRoute roles={['student', 'faculty', 'admin']}>
          <PrivateLayout>
            <Circulars />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/ai-assistant" element={
        <ProtectedRoute roles={['student']}>
          <PrivateLayout>
            <AIAssistant />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      {/* Faculty Routes */}
      <Route path="/my-classrooms" element={
        <ProtectedRoute roles={['faculty', 'admin']}>
          <PrivateLayout>
            <FacultyDashboard />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-students" element={
        <ProtectedRoute roles={['faculty', 'admin']}>
          <PrivateLayout>
            <StudentsList />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/classroom/:id" element={
        <ProtectedRoute roles={['faculty', 'admin']}>
          <PrivateLayout>
            <Classroom />
          </PrivateLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/analytics" element={
        <ProtectedRoute roles={['admin']}>
          <PrivateLayout>
            <AdminDashboard />
          </PrivateLayout>
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;