import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassroom, getStudents, enrollStudent, markAttendance, enterMarks, getAttendance, getMarks } from '../../services/api';

// Icons
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

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

const Classroom = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('people');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({ date: new Date().toISOString().split('T')[0], status: 'present' });
  const [marksData, setMarksData] = useState({ exam_type: 'CAT1', marks: 0, subject: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, studentsRes, attRes, marksRes] = await Promise.all([
        getClassroom(id),
        getStudents(),
        getAttendance(id),
        getMarks(id)
      ]);
      setClassroom(classRes.data);
      setStudents(studentsRes.data || []);
      setAttendance(attRes.data || []);
      setMarks(marksRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (studentId) => {
    try {
      await enrollStudent(id, studentId);
      setShowEnrollModal(false);
      fetchData();
    } catch (error) {
      console.error('Error enrolling student:', error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await markAttendance(id, { student_id: selectedStudent.id, ...attendanceData });
      setShowAttendanceModal(false);
      setSelectedStudent(null);
      setAttendanceData({ date: new Date().toISOString().split('T')[0], status: 'present' });
      fetchData();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleEnterMarks = async () => {
    try {
      await enterMarks(id, { student_id: selectedStudent.id, ...marksData });
      setShowMarksModal(false);
      setSelectedStudent(null);
      setMarksData({ exam_type: 'CAT1', marks: 0, subject: classroom?.subject_name || '' });
      fetchData();
    } catch (error) {
      console.error('Error entering marks:', error);
    }
  };

  const enrolledStudentIds = classroom?.students?.map(s => s.id) || [];

  const tabs = [
    { id: 'people', label: 'People', icon: UsersIcon },
    { id: 'attendance', label: 'Attendance', icon: ClipboardIcon },
    { id: 'marks', label: 'Marks', icon: ChartIcon }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading classroom...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Classroom Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{classroom?.subject_name}</h1>
            {classroom?.subject_code && (
              <p className="text-sm text-gray-500 mt-1">{classroom.subject_code}</p>
            )}
            {classroom?.description && (
              <p className="text-sm text-gray-600 mt-2">{classroom.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Enrolled Students</p>
            <p className="text-2xl font-semibold text-slate-800">{classroom?.students?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'people' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-800">Enrolled Students</h2>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium"
            >
              <PlusIcon />
              Enroll Student
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {classroom?.students?.length > 0 ? (
              classroom.students.map(student => (
                <div key={student.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <span className="text-sm font-medium">{student.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{student.department}</span>
                    {student.year && <span className="text-xs text-gray-500">Year {student.year}</span>}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => { setSelectedStudent(student); setShowAttendanceModal(true); }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => {
                          const existing = marks.find(m => m.student_id === student.id);
                          setMarksData({
                            exam_type: 'CAT1',
                            marks: existing?.marks || 0,
                            subject: classroom?.subject_name || ''
                          });
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
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-gray-500">No students enrolled yet</p>
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="mt-2 text-slate-800 hover:underline text-sm font-medium"
                >
                  + Enroll students
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-800">Attendance Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.length > 0 ? (
                  attendance.map(att => (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{att.student_name}</td>
                      <td className="px-5 py-3 text-gray-600">{new Date(att.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          att.status === 'present' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-gray-500">No attendance records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-800">Marks Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marks.length > 0 ? (
                  marks.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{m.student_name}</td>
                      <td className="px-5 py-3 text-gray-600">{m.exam_type || 'N/A'}</td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-slate-800">{m.marks || m.internal_marks || 0}</span>
                        <span className="text-gray-400">/100</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-gray-500">No marks records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Enroll Student</h2>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {students.filter(s => !enrolledStudentIds.includes(s.id)).length > 0 ? (
                <div className="space-y-2">
                  {students.filter(s => !enrolledStudentIds.includes(s.id)).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <button
                        onClick={() => handleEnroll(student.id)}
                        className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
                      >
                        Enroll
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">All students are already enrolled</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Mark Attendance</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedStudent.name}</p>
            </div>
            <div className="p-6 space-y-4">
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
                onClick={() => { setShowAttendanceModal(false); setSelectedStudent(null); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAttendance}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marks Modal */}
      {showMarksModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Add Marks</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedStudent.name}</p>
            </div>
            <div className="p-6 space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marks (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marksData.marks}
                  onChange={(e) => setMarksData({ ...marksData, marks: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => { setShowMarksModal(false); setSelectedStudent(null); }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEnterMarks}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
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

export default Classroom;