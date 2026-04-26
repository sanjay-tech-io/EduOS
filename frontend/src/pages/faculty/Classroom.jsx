import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassroom } from '../../services/api';

// Icons
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Classroom = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');

  useEffect(() => {
    fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      setLoading(true);
      const res = await getClassroom(id);
      setClassroom(res.data);
    } catch (error) {
      console.error('Error fetching classroom:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'stream', label: 'Stream' },
    { id: 'classwork', label: 'Classwork' },
    { id: 'people', label: 'People' }
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Stream Tab - Announcements & Materials */}
      {activeTab === 'stream' && (
        <div className="space-y-4">
          {/* Create Post Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <span className="text-sm font-medium">F</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Announce something to your class..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">
                Post
              </button>
            </div>
          </div>

          {/* Announcements List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-medium text-gray-800 mb-4">Recent Announcements</h3>
            <div className="text-center py-8 text-gray-500">
              <BookIcon />
              <p className="mt-2">No announcements yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Classwork Tab - Assignments */}
      {activeTab === 'classwork' && (
        <div className="space-y-4">
          {/* Create Assignment Button */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <button className="flex items-center gap-2 text-slate-800 hover:text-slate-600 transition">
              <PlusIcon />
              <span className="text-sm font-medium">Create Assignment</span>
            </button>
          </div>

          {/* Assignments List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-medium text-gray-800 mb-4">Assignments</h3>
            <div className="text-center py-8 text-gray-500">
              <BookIcon />
              <p className="mt-2">No assignments yet</p>
              <p className="text-sm">Create an assignment to get started</p>
            </div>
          </div>
        </div>
      )}

      {/* People Tab - Students */}
      {activeTab === 'people' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-800">Enrolled Students</h2>
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
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded">{student.department}</span>
                    {student.year && <span className="text-xs text-gray-500">Year {student.year}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <UsersIcon />
                <p className="mt-2 text-gray-500">No students enrolled yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;