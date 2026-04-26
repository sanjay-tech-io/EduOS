import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getStudentsByDepartment, getStudents, getClassrooms, markAttendance, enterMarks, getAttendance, getMarks } from '../../services/api';

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

const EXAM_TYPES = [
  { value: 'CAT1', label: 'CAT 1' },
  { value: 'CAT2', label: 'CAT 2' },
  { value: 'CCAT1', label: 'CCAT 1' },
  { value: 'CCAT2', label: 'CCAT 2' },
  { value: 'MODEL_LAB', label: 'Model Lab' },
  { value: 'EXTERNAL_LAB', label: 'External Lab' },
  { value: 'END_SEM', label: 'End Semester' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'APTITUDE', label: 'Placement Training/Aptitude' },
  { value: 'OTHER', label: 'Others' }
];

const StudentsList = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(user?.department || '');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [marksData, setMarksData] = useState({ exam_type: 'CAT1', marks: 0, subject_code: '', subject_title: '', classroom_id: '' });
  const [attendanceData, setAttendanceData] = useState({ date: new Date().toISOString().split('T')[0], status: 'present', classroom_id: '' });

  useEffect(() => {
    fetchData();
  }, [selectedDepartment]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let studentsRes;
      if (selectedDepartment) {
        studentsRes = await getStudentsByDepartment(selectedDepartment);
      } else {
        studentsRes = await getStudents();
      }
      setStudents(studentsRes.data || []);
      
      const classRes = await getClassrooms();
      setClassrooms(classRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!attendanceData.classroom_id || !selectedStudent) return;
    try {
      await markAttendance(selectedStudent.id, attendanceData.classroom_id, {
        date: attendanceData.date,
        status: attendanceData.status
      });
      setShowAttendanceModal(false);
      setAttendanceData({ date: new Date().toISOString().split('T')[0], status: 'present', classroom_id: '' });
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const handleEnterMarks = async () => {
    if (!marksData.classroom_id || !selectedStudent) return;
    try {
      await enterMarks(selectedStudent.id, marksData.classroom_id, {
        exam_type: marksData.exam_type,
        marks: Number(marksData.marks),
        subject_code: marksData.subject_code,
        subject_title: marksData.subject_title
      });
      setShowMarksModal(false);
      setMarksData({ exam_type: 'CAT1', marks: 0, subject_code: '', subject_title: '', classroom_id: '' });
      alert('Marks entered successfully!');
    } catch (error) {
      console.error('Error entering marks:', error);
      alert('Failed to enter marks');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Students</h1>
        <p className="text-sm text-gray-500">Manage marks and attendance for your students</p>
      </div>

      {/* Filters - Single Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white min-w-[180px]"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
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
                className="px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <UserIcon />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                      {student.department}
                    </span>
                    {student.year && (
                      <span className="text-xs text-gray-500">Year {student.year}</span>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowAttendanceModal(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowMarksModal(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                      >
                        Add Marks
                      </button>
                    </div>
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

      {/* Attendance Modal */}
      {showAttendanceModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAttendanceModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Mark Attendance</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedStudent.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Classroom</label>
                <select
                  value={attendanceData.classroom_id}
                  onChange={(e) => setAttendanceData({ ...attendanceData, classroom_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.subject_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={attendanceData.date}
                  onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={attendanceData.status}
                  onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAttendance}
                disabled={!attendanceData.classroom_id}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marks Modal */}
      {showMarksModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMarksModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Add Marks</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedStudent.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Classroom</label>
                <select
                  value={marksData.classroom_id}
                  onChange={(e) => setMarksData({ ...marksData, classroom_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.subject_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Type</label>
                <select
                  value={marksData.exam_type}
                  onChange={(e) => setMarksData({ ...marksData, exam_type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
                >
                  {EXAM_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Code</label>
                  <input
                    type="text"
                    value={marksData.subject_code}
                    onChange={(e) => setMarksData({ ...marksData, subject_code: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                    placeholder="CS201"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Marks</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marksData.marks}
                    onChange={(e) => setMarksData({ ...marksData, marks: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowMarksModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEnterMarks}
                disabled={!marksData.classroom_id || marksData.marks === ''}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;