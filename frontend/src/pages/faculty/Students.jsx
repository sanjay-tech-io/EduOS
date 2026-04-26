import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getStudentsByDepartment, getStudents } from '../../services/api';

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DEPARTMENTS = [
  'CSE', 'IT', 'ECE', 'VLSI', 'ICE', 'EEE', 'MECH', 'CIVIL', 'AI & DS', 'BME', 'CHEMICAL', 'ROBOTICS'
];

const StudentsList = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(user?.department || '');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [selectedDepartment]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedDepartment) {
        response = await getStudentsByDepartment(selectedDepartment);
      } else {
        response = await getStudents();
      }
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Students</h1>
        <p className="text-sm text-gray-500">View students from your department</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-800">
              {selectedDepartment ? `${selectedDepartment} Students` : 'All Students'}
            </h2>
            <span className="text-sm text-gray-500">{filteredStudents.length} students</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading students...</div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <UserIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                      {student.department}
                    </span>
                    {student.year && (
                      <p className="text-xs text-gray-400 mt-1">Year {student.year}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon />
              </div>
              <h3 className="text-gray-800 font-medium mb-1">No students found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Student Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-800">{selectedStudent.department || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Year</span>
                  <span className="font-medium text-gray-800">{selectedStudent.year ? `Year ${selectedStudent.year}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-800 capitalize">{selectedStudent.role}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedStudent.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;