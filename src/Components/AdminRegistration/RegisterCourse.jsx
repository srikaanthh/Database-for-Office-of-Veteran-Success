import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const RegisterCourse = () => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseCode: ''
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

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
                // Update existing course
                await fs.collection('courses').doc(editingCourseId).update({
                    name: formData.courseName,
                    code: formData.courseCode,
                    updatedAt: new Date()
                });
                setSuccess('Course updated successfully!');
            } else {
                // Create new course
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                        <p className="text-gray-600 mt-2">Create and manage courses</p>
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
                                Are you sure you want to delete course <span className="font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteCourse(deleteConfirm.id, deleteConfirm.name)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                >
                                    <FiTrash2 className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="w-full flex flex-col justify-center items-center py-12">
                        <Circles height="60" width="60" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
                        <p className="mt-4 text-gray-600">Loading courses...</p>
                    </div>
                )}

                {/* Courses Table */}
                {!loading && courses.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Registered Courses</h2>
                            <p className="text-gray-600 mt-1">{courses.length} courses available</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {courses.map(course => (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{course.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{course.code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEditCourse(course)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center"
                                                    >
                                                        <FiEdit2 className="mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm({ id: course.id, name: course.name })}
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
                {!loading && courses.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center mb-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
                        <p className="mt-2 text-gray-500">Get started by creating a new course.</p>
                    </div>
                )}

                {/* Course Form */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {editingCourseId ? 'Edit Course' : 'Create New Course'}
                        </h2>
                        {editingCourseId && (
                            <button
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="courseName" className="text-sm font-medium text-gray-700 mb-1">
                                Course Name
                            </label>
                            <input
                                type="text"
                                id="courseName"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                required
                                placeholder="Enter course name"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="courseCode" className="text-sm font-medium text-gray-700 mb-1">
                                Course Code
                            </label>
                            <input
                                type="text"
                                id="courseCode"
                                name="courseCode"
                                value={formData.courseCode}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                required
                                placeholder="Enter course code"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            {editingCourseId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center"
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
        </div>
    );
};

export default RegisterCourse;