import { useState, useEffect } from 'react';
import { getMyMarks } from '../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Marks = () => {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await getMyMarks();
        setMarks(res.data);
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };
    fetchMarks();
  }, []);

  const avgInternal = marks.length > 0 
    ? Math.round(marks.reduce((acc, m) => acc + m.internal_marks, 0) / marks.length) 
    : 0;
  
  const avgTest = marks.length > 0 
    ? Math.round(marks.reduce((acc, m) => acc + m.test_marks, 0) / marks.length) 
    : 0;
  
  const avgTotal = marks.length > 0 
    ? Math.round(marks.reduce((acc, m) => acc + (m.internal_marks + m.test_marks) / 2, 0) / marks.length) 
    : 0;

  const chartData = {
    labels: marks.map(m => m.subject_name),
    datasets: [
      {
        label: 'Internal Marks',
        data: marks.map(m => m.internal_marks),
        backgroundColor: '#6366F1'
      },
      {
        label: 'Test Marks',
        data: marks.map(m => m.test_marks),
        backgroundColor: '#8B5CF6'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Marks</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Avg Internal</h3>
          <p className="text-3xl font-bold text-indigo-600">{avgInternal}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Avg Test</h3>
          <p className="text-3xl font-bold text-purple-600">{avgTest}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Overall Average</h3>
          <p className="text-3xl font-bold text-green-600">{avgTotal}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Marks by Subject</h2>
        {marks.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-500 text-center py-8">No marks available yet</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Subject-wise Marks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Internal Marks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Test Marks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Average</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => {
                const avg = Math.round((m.internal_marks + m.test_marks) / 2);
                let grade = 'F';
                if (avg >= 90) grade = 'A+';
                else if (avg >= 80) grade = 'A';
                else if (avg >= 70) grade = 'B+';
                else if (avg >= 60) grade = 'B';
                else if (avg >= 50) grade = 'C';
                else if (avg >= 40) grade = 'D';
                
                return (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-3 font-semibold">{m.subject_name}</td>
                    <td className="px-4 py-3">{m.internal_marks}</td>
                    <td className="px-4 py-3">{m.test_marks}</td>
                    <td className="px-4 py-3 font-semibold">{avg}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                        grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                        grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {marks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No marks available yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marks;
