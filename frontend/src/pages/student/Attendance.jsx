import { useState, useEffect } from 'react';
import { getMyAttendance } from '../../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await getMyAttendance();
        setAttendance(res.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, []);

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const percentage = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [presentCount, absentCount],
      backgroundColor: ['#10B981', '#EF4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Days</h3>
          <p className="text-3xl font-bold text-indigo-600">{attendance.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Present</h3>
          <p className="text-3xl font-bold text-green-600">{presentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Absent</h3>
          <p className="text-3xl font-bold text-red-600">{absentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Attendance Chart</h2>
          {attendance.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={chartData} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Attendance by Subject</h2>
          <div className="space-y-3">
            {Object.entries(
              attendance.reduce((acc, curr) => {
                if (!acc[curr.subject_name]) {
                  acc[curr.subject_name] = { present: 0, absent: 0 };
                }
                if (curr.status === 'present') acc[curr.subject_name].present++;
                else acc[curr.subject_name].absent++;
                return acc;
              }, {})
            ).map(([subject, data]) => {
              const total = data.present + data.absent;
              const pct = Math.round((data.present / total) * 100);
              return (
                <div key={subject} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{subject}</span>
                    <span className={pct >= 75 ? 'text-green-600' : 'text-red-600'}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${pct >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {attendance.length === 0 && (
              <p className="text-gray-500 text-center py-4">No attendance records yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Attendance History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice().reverse().map((att) => (
                <tr key={att.id} className="border-t">
                  <td className="px-4 py-3">{att.subject_name}</td>
                  <td className="px-4 py-3">{new Date(att.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      att.status === 'present' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">No attendance records yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
