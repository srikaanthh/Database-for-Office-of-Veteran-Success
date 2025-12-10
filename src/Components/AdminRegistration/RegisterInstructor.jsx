import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';
import { FiEdit2, FiPlus, FiX, FiUserPlus, FiTrash2, FiSearch, FiChevronDown, FiFilter, FiGrid, FiList, FiCalendar, FiBook, FiUsers, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi';

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
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  // Fetch instructors from Firestore
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const snapshot = await fs.collection('instructors').get();
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstructors(list);
      setFilteredInstructors(list);
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

  // Filter and sort instructors
  useEffect(() => {
    let filtered = instructors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(inst => 
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.crn.includes(searchQuery) ||
        inst.subj.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inst => inst.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'enrollment') {
        return sortOrder === 'asc' ? a.enrl - b.enrl : b.enrl - a.enrl;
      } else if (sortBy === 'status') {
        return sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      }
      return 0;
    });

    setFilteredInstructors(filtered);
  }, [searchQuery, instructors, statusFilter, sortBy, sortOrder]);

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

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === 'open' 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {status.toUpperCase()}
    </span>
  );

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6">
      <div className="max-w-8xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <FiUsers className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                    Instructor Management
                  </h1>
                  <p className="text-gray-600 mt-1">Comprehensive management system for instructors and course sections</p>
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-xl border border-green-200/50">
                  <div className="text-2xl font-bold text-green-900">{instructors.length}</div>
                  <div className="text-sm text-black-700 font-medium">Total Instructors</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200/50">
                  <div className="text-2xl font-bold text-green-900">
                    {instructors.filter(i => i.status === 'open').length}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Active Courses</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-4 rounded-xl border border-orange-200/50">
                  <div className="text-2xl font-bold text-orange-900">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                  <div className="text-sm text-orange-700 font-medium">Last Updated</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 mt-6 lg:mt-0 lg:ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search instructors, courses, CRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 w-full lg:w-80"
                />
              </div>
              
              <div className="flex space-x-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                
                <div className="flex bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' ? 'bg-gray-500 text-white' : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' ? 'bg-gray-500 text-white' : 'text-gray-600 hover:text-gray-600'
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
                
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FiUserPlus className="mr-2" />
                    Add Instructor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-lg border-l-4 border-red-500 p-6 mb-8 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50/80 backdrop-blur-lg border-l-4 border-green-500 p-6 mb-8 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">Confirm Deletion</h3>
                <p className="text-gray-600 mt-2">
                  Are you sure you want to delete instructor <span className="font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center transition-all duration-200 font-medium shadow-lg"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Form Section */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                  {editingId ? 'Edit Instructor' : 'Register New Instructor'}
                </h2>
                <p className="text-gray-600 mt-1">Complete all required information for the course section</p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {id: 'name', label: 'Full Name', type: 'text', icon: FiUsers},
                {id: 'email', label: 'Email', type: 'email', icon: FiUsers},
                {id: 'session', label: 'Session', type: 'text', icon: FiCalendar},
                {id: 'col', label: 'College', type: 'text', icon: FiBook},
                {id: 'dpt', label: 'Department', type: 'text', icon: FiBook},
                {id: 'crn', label: 'CRN', type: 'text', icon: FiBook},
                {id: 'subj', label: 'Subject', type: 'text', icon: FiBook},
                {id: 'crsNum', label: 'Course Number', type: 'text', icon: FiBook},
                {id: 'sec', label: 'Section', type: 'text', icon: FiBook},
                {id: 'type', label: 'Type', type: 'text', icon: FiBook},
                {id: 'cr', label: 'Credits', type: 'text', icon: FiBook},
                {id: 'pmt', label: 'CAP', type: 'text', icon: FiBook},
                {id: 'status2', label: 'Status 2', type: 'text', icon: FiUsers},
                {id: 'seatsRemain', label: 'Seats Remaining', type: 'number', icon: FiUsers},
                {id: 'waitSeats', label: 'Waitlist Seats', type: 'number', icon: FiUsers},
                {id: 'cap', label: 'Capacity', type: 'number', icon: FiUsers},
                {id: 'enrl', label: 'Enrolled', type: 'number', icon: FiUsers},
                {id: 'days', label: 'Days', type: 'text', icon: FiCalendar},
                {id: 'time', label: 'Time', type: 'text', icon: FiClock},
                {id: 'bldg', label: 'Building', type: 'text', icon: FiMapPin},
                {id: 'room', label: 'Room', type: 'text', icon: FiMapPin},
                {id: 'deliveryMethod', label: 'Delivery Method', type: 'text', icon: FiUsers},
                {id: 'fees', label: 'Fees', type: 'number', step: '0.01', icon: FiDollarSign},
              ].map(field => (
                <div key={field.id} className="flex flex-col">
                  <label htmlFor={field.id} className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <field.icon className="h-4 w-4 mr-2 text-green-600" />
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    step={field.step}
                    value={instructor[field.id]}
                    onChange={(e) => setInstructor(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-gray-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              ))}

              {/* Status Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiUsers className="h-4 w-4 mr-2 text-gray-600" />
                  Status
                </label>
                <select
                  id="status"
                  value={instructor.status}
                  onChange={(e) => setInstructor(prev => ({ ...prev, status: e.target.value }))}
                  className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-gray-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Campus Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="campus" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMapPin className="h-4 w-4 mr-2 text-green-600" />
                  Campus
                </label>
                <select
                  id="campus"
                  value={instructor.campus}
                  onChange={(e) => setInstructor(prev => ({ ...prev, campus: e.target.value }))}
                  className="p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-gray-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="Off-campus - Tampa">Off-campus - Tampa</option>
                  <option value="Off-campus - Sarasota-Manatee">Off-campus - Sarasota-Manatee</option>
                  <option value="Off-campus - St. Petersburg">Off-campus - St. Petersburg</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gray-600 to-green-700 hover:from-gray-700 hover:to-green-800 text-white px-8 py-3 rounded-xl transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl"
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
          <div className="w-full flex flex-col justify-center items-center py-20">
            <div className="relative">
              <Circles height="80" width="80" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
            </div>
            <p className="mt-6 text-gray-500 text-lg font-medium">Loading instructors...</p>
          </div>
        )}

        {/* Enhanced Instructors Display */}
        {!loading && filteredInstructors.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="p-8 border-b border-gray-200/50 flex flex-col lg:flex-row lg:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-900 to-gray-800 bg-clip-text text-transparent">
                  Registered Instructors
                </h2>
                <p className="text-gray-600 mt-2">
                  Showing {filteredInstructors.length} of {instructors.length} instructors
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <div className="flex bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
                    <button
                      onClick={() => toggleSort('name')}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        sortBy === 'name' ? 'bg-gray-500 text-white' : 'text-gray-700 hover:text-green-600'
                      }`}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => toggleSort('enrollment')}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        sortBy === 'enrollment' ? 'bg-gray-500 text-white' : 'text-gray-700 hover:text-green-600'
                      }`}
                    >
                      Enrollment {sortBy === 'enrollment' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-8 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                {filteredInstructors.map(inst => (
                  <div key={inst.id} className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{inst.name}</h3>
                          <a 
                            href={`mailto:${inst.email}`} 
                            className="text-green-600 hover:text-green-800 transition-colors duration-200 text-sm"
                          >
                            {inst.email}
                          </a>
                        </div>
                        <StatusBadge status={inst.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <InfoCard icon={FiBook} label="Course" value={`${inst.subj} ${inst.crsNum}-${inst.sec}`} />
                        <InfoCard icon={FiBook} label="CRN" value={inst.crn} />
                        <InfoCard icon={FiUsers} label="Enrollment" value={`${inst.enrl}/${inst.cap}`} />
                        <InfoCard icon={FiUsers} label="Available" value={inst.seatsRemain} />
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="h-4 w-4 text-gray-600" />
                          <span>{inst.days} {inst.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="h-4 w-4 text-gray-600" />
                          <span>{inst.bldg} {inst.room} • {inst.campus}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(inst)}
                        className="text-black-600 hover:text-gray-800 transition-colors duration-200 flex items-center font-medium"
                      >
                        <FiEdit2 className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: inst.id, name: inst.name })}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center font-medium"
                      >
                        <FiTrash2 className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* List View */}
            {viewMode === 'list' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Instructor</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Course Details</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrollment</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Schedule</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredInstructors.map(inst => (
                      <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{inst.name}</div>
                          <a 
                            href={`mailto:${inst.email}`} 
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
                          >
                            {inst.email}
                          </a>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{inst.subj} {inst.crsNum}-{inst.sec}</div>
                          <div className="text-gray-500 text-sm">CRN: {inst.crn}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{inst.enrl} / {inst.cap}</div>
                          <div className="text-gray-500 text-sm">{inst.seatsRemain} seats available</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{inst.days} {inst.time}</div>
                          <div className="text-gray-500 text-sm">{inst.bldg} {inst.room}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <StatusBadge status={inst.status} />
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleEdit(inst)}
                              className="text-black-600 hover:text-green-800 transition-colors duration-200 flex items-center font-medium"
                            >
                              <FiEdit2 className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: inst.id, name: inst.name })}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center font-medium"
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
            )}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && filteredInstructors.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-16 text-center border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="mx-auto h-24 w-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6">
                <FiUsers className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No instructors found</h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find what you are looking for.'
                  : 'Get started by adding your first instructor to the system.'
                }
              </p>
              <div className="space-x-4">
                {(searchQuery || statusFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-gray-600 to-green-700 hover:from-gray-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <FiUserPlus className="inline mr-2" />
                  Add Instructor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInstructor;