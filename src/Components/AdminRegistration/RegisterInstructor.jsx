import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';
import { FiEdit2, FiPlus, FiX, FiUserPlus, FiTrash2 } from 'react-icons/fi';

const RegisterInstructor = () => {
  const [instructor, setInstructor] = useState({
    name: '',
    email: '',
    session: '',
    col: '',
    dpt: '',
    crn: '',
    subj: '',
    crsNum: '',
    sec: '',
    type: '',
    cr: '',
    pmt: '',
    section: 0,
    status: 'open',
    status2: '',
    seatsRemain: 0,
    waitSeats: 0,
    cap: 0,
    enrl: 0,
    days: '',
    time: '',
    bldg: '',
    room: '',
    campus: 'Off-campus - Tampa',
    deliveryMethod: '',
    fees: 0.0
  });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch instructors from Firestore
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const snapshot = await fs.collection('instructors').get();
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstructors(list);
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleEdit = (inst) => {
    setInstructor(inst);
    setEditingId(inst.id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    try {
      setLoading(true);
      await fs.collection('instructors').doc(id).delete();
      setSuccess(`Instructor "${name}" deleted successfully!`);
      fetchInstructors();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await fs.collection('instructors').doc(editingId).update({
          ...instructor,
          updatedAt: new Date()
        });
        setSuccess('Instructor updated successfully!');
      } else {
        await fs.collection('instructors').add({
          ...instructor,
          createdAt: new Date()
        });
        setSuccess('Instructor registered successfully!');
      }
      resetForm();
      fetchInstructors();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInstructor({
      name: '',
      email: '',
      session: '',
      col: '',
      dpt: '',
      crn: '',
      subj: '',
      crsNum: '',
      sec: '',
      type: '',
      cr: '',
      pmt: '',
      section: 0,
      status: 'open',
      status2: '',
      seatsRemain: 0,
      waitSeats: 0,
      cap: 0,
      enrl: 0,
      days: '',
      time: '',
      bldg: '',
      room: '',
      campus: 'Off-campus - Tampa',
      deliveryMethod: '',
      fees: 0.0
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
            <p className="text-gray-600 mt-2">Manage instructors and course sections</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <FiUserPlus className="mr-2" />
                Add Instructor
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete instructor <span className="font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Section - Only shown when needed */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Instructor' : 'Register New Instructor'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {id: 'name', label: 'Full Name', type: 'text'},
                {id: 'email', label: 'Email', type: 'email'},
                {id: 'session', label: 'Session', type: 'text'},
                {id: 'col', label: 'College', type: 'text'},
                {id: 'dpt', label: 'Department', type: 'text'},
                {id: 'crn', label: 'CRN', type: 'text'},
                {id: 'subj', label: 'Subject', type: 'text'},
                {id: 'crsNum', label: 'Course Number', type: 'text'},
                {id: 'sec', label: 'Section', type: 'text'},
                {id: 'type', label: 'Type', type: 'text'},
                {id: 'cr', label: 'Credits', type: 'text'},
                {id: 'pmt', label: 'Payment', type: 'text'},
                {id: 'status2', label: 'Status 2', type: 'text'},
                {id: 'seatsRemain', label: 'Seats Remaining', type: 'number'},
                {id: 'waitSeats', label: 'Waitlist Seats', type: 'number'},
                {id: 'cap', label: 'Capacity', type: 'number'},
                {id: 'enrl', label: 'Enrolled', type: 'number'},
                {id: 'days', label: 'Days', type: 'text'},
                {id: 'time', label: 'Time', type: 'text'},
                {id: 'bldg', label: 'Building', type: 'text'},
                {id: 'room', label: 'Room', type: 'text'},
                {id: 'deliveryMethod', label: 'Delivery Method', type: 'text'},
                {id: 'fees', label: 'Fees', type: 'number', step: '0.01'},
              ].map(field => (
                <div key={field.id} className="flex flex-col">
                  <label htmlFor={field.id} className="text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    step={field.step}
                    value={instructor[field.id]}
                    onChange={(e) => setInstructor(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              ))}

              {/* Status Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={instructor.status}
                  onChange={(e) => setInstructor(prev => ({ ...prev, status: e.target.value }))}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Campus Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="campus" className="text-sm font-medium text-gray-700 mb-1">
                  Campus
                </label>
                <select
                  id="campus"
                  value={instructor.campus}
                  onChange={(e) => setInstructor(prev => ({ ...prev, campus: e.target.value }))}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="Off-campus - Tampa">Off-campus - Tampa</option>
                  <option value="Off-campus - Sarasota-Manatee">Off-campus - Sarasota-Manatee</option>
                  <option value="Off-campus - St. Petersburg">Off-campus - St. Petersburg</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center"
                >
                  {editingId ? (
                    <>
                      <FiEdit2 className="mr-2" />
                      Update Instructor
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      Register Instructor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="w-full flex flex-col justify-center items-center py-12">
            <Circles height="60" width="60" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
            <p className="mt-4 text-gray-600">Loading instructors...</p>
          </div>
        )}

        {/* Instructors Table */}
        {!loading && instructors.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Registered Instructors</h2>
                <p className="text-gray-600 mt-1">{instructors.length} instructors registered</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.map(inst => (
                    <tr key={inst.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inst.name}</div>
                        <a 
                          href={`mailto:${inst.email}`} 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {inst.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inst.subj} {inst.crsNum}-{inst.sec}</div>
                        <div className="text-sm text-gray-500">CRN: {inst.crn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inst.enrl} / {inst.cap}</div>
                        <div className="text-sm text-gray-500">{inst.seatsRemain} seats available</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inst.days} {inst.time}</div>
                        <div className="text-sm text-gray-500">{inst.bldg} {inst.room}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${inst.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(inst)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center"
                          >
                            <FiEdit2 className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: inst.id, name: inst.name })}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && instructors.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No instructors found</h3>
            <p className="mt-2 text-gray-500">Get started by adding a new instructor.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiUserPlus className="mr-2" />
                Add Instructor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInstructor;