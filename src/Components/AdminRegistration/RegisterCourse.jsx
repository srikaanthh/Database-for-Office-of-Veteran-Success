import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch, FiBook, FiGrid, FiList, FiChevronRight, FiClock, FiCalendar } from 'react-icons/fi';

const RegisterCourse = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseCode: ''
    });
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'recent', 'popular'

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const filtered = courses.filter(course => 
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);

        try {
            const snapshot = await fs.collection('courses').get();
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesData);
            setFilteredCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (editingCourseId) {
                await fs.collection('courses').doc(editingCourseId).update({
                    name: formData.courseName,
                    code: formData.courseCode,
                    updatedAt: new Date()
                });
                setSuccess('Course updated successfully!');
            } else {
                await fs.collection('courses').add({
                    name: formData.courseName,
                    code: formData.courseCode,
                    createdAt: new Date()
                });
                setSuccess('Course created successfully!');
            }

            setFormData({
                courseName: '',
                courseCode: ''
            });
            fetchCourses();

        } catch (error) {
            console.error('Error saving course:', error);
            setError('Failed to save course.');
        } finally {
            setLoading(false);
            setEditingCourseId(null); 
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourseId(course.id);
        setFormData({
            courseName: course.name,
            courseCode: course.code
        });
    };

    const handleDeleteCourse = async (id, name) => {
        try {
            await fs.collection('courses').doc(id).delete();
            setSuccess(`Course "${name}" deleted successfully!`);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            setError('Failed to delete course.');
        } finally {
            setDeleteConfirm(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null);
        setFormData({
            courseName: '',
            courseCode: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-50/30 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-green-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-lg">
                                    <FiBook className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-900 bg-clip-text text-transparent">
                                        Course Management
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-lg flex items-center">
                                        <span>Create and manage academic courses</span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center text-gray-600">
                                            {courses.length} courses registered
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 lg:mt-0">
                                <button 
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <i className="fas fa-calendar-day mr-2"></i>
                                    <span id="todayDate">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg border border-gray-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600/70 text-sm font-medium">Total Courses</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                            </div>
                            <div className="p-3 bg-gray-100/50 rounded-xl">
                                <FiBook className="text-gray-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-lg border border-green-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600/70 text-sm font-medium">Active Courses</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                            </div>
                            <div className="p-3 bg-green-100/50 rounded-xl">
                                <FiGrid className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-lg border border-green-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600/70 text-sm font-medium">Last Updated</p>
                                <p className="text-lg font-bold text-gray-900 mt-2">
                                    {courses.length > 0 ? (
                                        new Date(Math.max(...courses.map(course => 
                                            course.updatedAt?.seconds ? course.updatedAt.seconds * 1000 : 
                                            course.createdAt?.seconds ? course.createdAt.seconds * 1000 : 
                                            new Date(course.updatedAt || course.createdAt).getTime()
                                        ))).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })
                                    ) : (
                                        'No courses'
                                    )}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100/50 rounded-xl">
                                <FiCalendar className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="xl:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                                    {editingCourseId ? 'Edit Course' : 'Create New Course'}
                                </h2>
                                {editingCourseId && (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <FiX size={20} />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleCreateCourse} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="courseName" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <span className="bg-gray-100 text-green-600 p-1 rounded-lg mr-2">
                                                <FiBook size={14} />
                                            </span>
                                            Course Name
                                        </label>
                                        <input
                                            type="text"
                                            id="courseName"
                                            name="courseName"
                                            value={formData.courseName}
                                            onChange={handleInputChange}
                                            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                                            required
                                            placeholder="e.g., Introduction to Computer Science"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="courseCode" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                            <span className="bg-green-100 text-green-600 p-1 rounded-lg mr-2">
                                                <FiGrid size={14} />
                                            </span>
                                            Course Code
                                        </label>
                                        <input
                                            type="text"
                                            id="courseCode"
                                            name="courseCode"
                                            value={formData.courseCode}
                                            onChange={handleInputChange}
                                            className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                                            required
                                            placeholder="e.g., CS101"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    {editingCourseId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-gray-600 to-green-700 hover:from-gray-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Circles height="20" width="20" color="#FFFFFF" ariaLabel="circles-loading" visible={true} />
                                                <span className="ml-2">{editingCourseId ? 'Updating...' : 'Creating...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiPlus className="mr-2" />
                                                {editingCourseId ? 'Update Course' : 'Create Course'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Courses List */}
                    <div className="xl:col-span-2">
                        {/* Enhanced Search and Controls */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6 border border-white/20">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-900 bg-clip-text text-transparent">
                                        Course Catalog
                                    </h2>
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-600' : 'text-gray-600'}`}
                                        >
                                            <FiGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-600' : 'text-gray-600'}`}
                                        >
                                            <FiList size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="relative flex-1 lg:max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search courses by name or code..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-green-500 transition-all duration-200 w-full bg-gray-50/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mt-4 w-fit">
                                {['all', 'recent', 'popular'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                                            activeTab === tab 
                                                ? 'bg-white shadow-sm text-gray-600 font-medium' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700 font-medium">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="w-full flex flex-col justify-center items-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl">
                                <Circles height="60" width="60" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
                                <p className="mt-4 text-gray-600 font-medium">Loading courses...</p>
                            </div>
                        )}

                        {/* Courses Grid View */}
                        {!loading && viewMode === 'grid' && filteredCourses.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">All Courses ({filteredCourses.length})</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FiClock className="mr-1" />
                                        Sorted by recently added
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredCourses.map(course => (
                                        <div key={course.id} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:-translate-y-1">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-gray-100 rounded-xl">
                                                        <FiBook className="text-green-600 text-lg" />
                                                    </div>
                                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => handleEditCourse(course)}
                                                            className="p-2 text-gray-600 hover:text-green-900 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm({ id: course.id, name: course.name })}
                                                            className="p-2 text-red-600 hover:text-red-900 transition-colors duration-200 rounded-lg hover:bg-red-50"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-block bg-gray-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                                        {course.code}
                                                    </span>
                                                    <div className="text-gray-500 text-sm flex items-center">
                                                        <FiCalendar className="mr-1" />
                                                        {course.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Courses List View */}
                        {!loading && viewMode === 'list' && filteredCourses.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden mb-8 border border-white/20">
                                <div className="p-6 border-b border-gray-200/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">Registered Courses</h3>
                                            <p className="text-gray-600 mt-1">{filteredCourses.length} courses available</p>
                                        </div>
                                        <FiChevronRight className="text-gray-400" />
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Course Details</th>
                                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200/50">
                                            {filteredCourses.map(course => (
                                                <tr key={course.id} className="hover:bg-gray-50/30 transition-colors duration-150 group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                <FiBook className="text-green-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-lg font-semibold text-gray-900">{course.name}</div>
                                                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                                                    <FiClock className="mr-1" size={12} />
                                                                    Created {course.createdAt?.toDate?.().toLocaleDateString() || 'recently'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                                                            {course.code}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex space-x-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                                                            <button
                                                                onClick={() => handleEditCourse(course)}
                                                                className="text-gray-600 hover:text-green-900 transition-colors duration-200 flex items-center p-2 rounded-lg hover:bg-blue-50"
                                                            >
                                                                <FiEdit2 className="mr-2" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm({ id: course.id, name: course.name })}
                                                                className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center p-2 rounded-lg hover:bg-red-50"
                                                            >
                                                                <FiTrash2 className="mr-2" />
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

                        {/* Empty States */}
                        {!loading && filteredCourses.length === 0 && courses.length === 0 && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center mb-8 border border-white/20">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiBook className="text-gray-600 text-3xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by creating your first course to build your academic catalog.</p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-gray-600 to-green-700 hover:from-gray-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl mx-auto transform hover:-translate-y-0.5"
                                >
                                    <FiPlus className="mr-2" />
                                    Create Your First Course
                                </button>
                            </div>
                        )}

                        {!loading && filteredCourses.length === 0 && courses.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center mb-8 border border-white/20">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiSearch className="text-gray-600 text-3xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching courses</h3>
                                <p className="text-gray-600 mb-4">We couldn't find any courses matching your search criteria.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-gray-600 hover:text-green-700 font-medium"
                                >
                                    Clear search and show all courses
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 transform animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiTrash2 className="text-red-600 text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteConfirm.name}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteCourse(deleteConfirm.id, deleteConfirm.name)}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium flex items-center shadow-lg hover:shadow-xl"
                            >
                                <FiTrash2 className="mr-2" />
                                Delete Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterCourse;