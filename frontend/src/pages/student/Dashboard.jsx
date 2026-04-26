import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getMyAttendance, getMyMarks, getCirculars } from '../../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [circulars, setCirculars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, marksRes, circRes] = await Promise.all([
          getMyAttendance(),
          getMyMarks(),
          getCirculars()
        ]);
        setAttendance(attRes.data);
        setMarks(marksRes.data);
        setCirculars(circRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const attendancePercentage = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const avgMarks = marks.length > 0
    ? Math.round(marks.reduce((acc, m) => acc + (m.internal_marks + m.test_marks) / 2, 0) / marks.length)
    : 0;

  const attendanceData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [
        attendance.filter(a => a.status === 'present').length,
        attendance.filter(a => a.status === 'absent').length
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 0
    }]
  };

  const marksData = {
    labels: marks.map(m => m.subject_name),
    datasets: [{
      label: 'Average Marks',
      data: marks.map(m => Math.round((m.internal_marks + m.test_marks) / 2)),
      backgroundColor: '#6366F1'
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Attendance</h3>
          <p className="text-3xl font-bold text-indigo-600">{attendancePercentage}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Average Marks</h3>
          <p className="text-3xl font-bold text-indigo-600">{avgMarks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Subjects</h3>
          <p className="text-3xl font-bold text-indigo-600">{marks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Circulars</h3>
          <p className="text-3xl font-bold text-indigo-600">{circulars.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>
          {attendance.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={attendanceData} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No attendance data yet</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Performance by Subject</h2>
          {marks.length > 0 ? (
            <Bar data={marksData} />
          ) : (
            <p className="text-gray-500">No marks data yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Subjects</h2>
            <Link to="/marks" className="text-indigo-600 hover:underline">View All</Link>
          </div>
          <ul className="space-y-2">
            {marks.slice(0, 5).map(m => (
              <li key={m.id} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{m.subject_name}</span>
                <span className="font-semibold">{Math.round((m.internal_marks + m.test_marks) / 2)}</span>
              </li>
            ))}
            {marks.length === 0 && <p className="text-gray-500">No subjects enrolled</p>}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Circulars</h2>
            <Link to="/circulars" className="text-indigo-600 hover:underline">View All</Link>
          </div>
          <ul className="space-y-3">
            {circulars.map(c => (
              <li key={c.id} className="p-3 bg-gray-50 rounded">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600">{c.description.substring(0, 100)}...</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
              </li>
            ))}
            {circulars.length === 0 && <p className="text-gray-500">No circulars</p>}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
        <h2 className="text-xl font-bold mb-2">Need Academic Help?</h2>
        <p className="mb-4">Ask our AI Assistant for personalized academic guidance, career advice, and more!</p>
        <Link to="/ai-assistant" className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100">
          Open AI Assistant
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
