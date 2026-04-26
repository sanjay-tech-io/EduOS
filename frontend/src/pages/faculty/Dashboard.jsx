import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getClassrooms, getStudents } from '../../services/api';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClassroomIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const classRes = await getClassrooms();
      setClassrooms(classRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const { createClassroom } = await import('../../services/api');
      await createClassroom(formData);
      setFormData({ subject_name: '', subject_code: '', description: '' });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.department} Department</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition text-sm font-medium"
        >
          <PlusIcon />
          Create Classroom
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Classrooms</p>
          <p className="text-2xl font-semibold text-slate-800">{classrooms.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Department</p>
          <p className="text-2xl font-semibold text-slate-800">{user?.department || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Your Role</p>
          <p className="text-2xl font-semibold text-slate-800 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Classrooms Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-800">My Classrooms</h2>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : classrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map(classroom => (
                <Link
                  key={classroom.id}
                  to={`/classroom/${classroom.id}`}
                  className="group p-4 rounded-lg border border-gray-200 hover:border-slate-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      <ClassroomIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{classroom.subject_name}</h3>
                      {classroom.subject_code && (
                        <p className="text-sm text-gray-500">{classroom.subject_code}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created {new Date(classroom.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClassroomIcon />
              </div>
              <h3 className="text-gray-800 font-medium mb-1">No classrooms yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create your first classroom to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-slate-800 hover:underline text-sm font-medium"
              >
                + Create Classroom
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Create Classroom</h2>
            </div>
            <form onSubmit={handleCreateClassroom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Name</label>
                <input
                  type="text"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm"
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Code</label>
                <input
                  type="text"
                  value={formData.subject_code}
                  onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm"
                  placeholder="e.g., CS201"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="Brief description of the subject..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition text-sm font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;