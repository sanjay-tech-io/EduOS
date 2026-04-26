import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getCirculars, createCircular } from '../../services/api';

const Circulars = () => {
  const { user } = useContext(AuthContext);
  const [circulars, setCirculars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', target_role: 'student' });

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const res = await getCirculars();
        setCirculars(res.data);
      } catch (error) {
        console.error('Error fetching circulars:', error);
      }
    };
    fetchCirculars();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCircular(formData);
      setShowModal(false);
      setFormData({ title: '', description: '', target_role: 'student' });
      const res = await getCirculars();
      setCirculars(res.data);
    } catch (error) {
      console.error('Error creating circular:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Circulars</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Post Circular
          </button>
        )}
      </div>

      <div className="space-y-4">
        {circulars.length > 0 ? (
          circulars.map(circular => (
            <div key={circular.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-indigo-600">{circular.title}</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm capitalize">
                  {circular.target_role}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{circular.description}</p>
              <p className="text-sm text-gray-400">Posted: {new Date(circular.created_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No circulars available</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Post New Circular</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Target Audience</label>
                <select
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulars;
