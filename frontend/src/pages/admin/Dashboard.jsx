import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAnalytics } from '../../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const attendanceData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [analytics.attendance.present, analytics.attendance.absent],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 0
    }]
  };

  const marksData = {
    labels: ['Internal Marks', 'Test Marks'],
    datasets: [{
      label: 'Average',
      data: [analytics.marks.avgInternal, analytics.marks.avgTest],
      backgroundColor: ['#6366F1', '#8B5CF6']
    }]
  };

  const deptData = {
    labels: analytics.departmentStats.map(d => d.department || 'Unknown'),
    datasets: [{
      label: 'Students',
      data: analytics.departmentStats.map(d => d.count),
      backgroundColor: '#10B981'
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Faculty</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalFaculty}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Classrooms</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalClassrooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Enrollments</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalEnrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Circulars</h3>
          <p className="text-3xl font-bold text-indigo-600">{analytics.totalCirculars}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut data={attendanceData} />
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-indigo-600">{analytics.attendance.percentage}%</p>
            <p className="text-gray-500">Overall Attendance</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Marks Overview</h2>
          <Bar data={marksData} />
          <div className="mt-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-indigo-600">{analytics.marks.avgInternal}</p>
                <p className="text-gray-500">Avg Internal</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{analytics.marks.avgTest}</p>
                <p className="text-gray-500">Avg Test</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Students by Department</h2>
          {analytics.departmentStats.length > 0 ? (
            <Bar data={deptData} />
          ) : (
            <p className="text-gray-500">No department data available</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {analytics.recentUsers.map(u => (
              <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm capitalize">
                  {u.role}
                </span>
              </div>
            ))}
            {analytics.recentUsers.length === 0 && (
              <p className="text-gray-500">No users yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
