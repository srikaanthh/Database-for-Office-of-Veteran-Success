import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';
// Removed unused Footer import

const SessionDataView = () => {
    const [sessionData, setSessionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterTerm, setFilterTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Fixed: Added setItemsPerPage

    // Function to fetch session data from instructors collection
    const fetchSessionData = async () => {
        try {
            setLoading(true);
            const snapshot = await fs.collection('instructors').get();
            const dataList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSessionData(dataList);
        } catch (error) {
            console.error('Error fetching session data: ', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch session data on component mount
    useEffect(() => {
        fetchSessionData();
    }, []);

    // Filter session data based on search term
    const filteredData = sessionData.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(filterTerm.toLowerCase())
        )
    );

    // Sorting function
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;
        
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Column configuration for better management
    const columns = [
        { key: 'session', label: 'SESSION', width: 'w-24' },
        { key: 'col', label: 'COL', width: 'w-20' },
        { key: 'dpt', label: 'DPT', width: 'w-20' },
        { key: 'crn', label: 'CRN', width: 'w-20' },
        { key: 'subj', label: 'SUBJ CRS#', width: 'w-32' },
        { key: 'sec', label: 'SEC', width: 'w-16' },
        { key: 'type', label: 'TYPE', width: 'w-20' },
        { key: 'title', label: 'TITLE', width: 'w-64' },
        { key: 'cr', label: 'CR', width: 'w-16' },
        { key: 'pmt', label: 'PMT', width: 'w-20' },
        { key: 'status', label: 'STATUS', width: 'w-24' },
        { key: 'status2', label: 'STATUS2', width: 'w-24' },
        { key: 'seatsRemain', label: 'SEATS REMAIN', width: 'w-32' },
        { key: 'waitSeats', label: 'WAIT SEATS', width: 'w-28' },
        { key: 'cap', label: 'CAP', width: 'w-20' },
        { key: 'enrl', label: 'ENRL', width: 'w-20' },
        { key: 'days', label: 'DAYS', width: 'w-24' },
        { key: 'time', label: 'TIME', width: 'w-32' },
        { key: 'bldg', label: 'BLDG', width: 'w-24' },
        { key: 'room', label: 'ROOM', width: 'w-24' },
        { key: 'name', label: 'INSTRUCTOR', width: 'w-48' },
        { key: 'campus', label: 'CAMPUS', width: 'w-32' },
        { key: 'deliveryMethod', label: 'DELIVERY METHOD', width: 'w-40' },
        { key: 'fees', label: 'FEES', width: 'w-24' }
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-gradient-to-r from-green-500 to-green-600';
            case 'closed': return 'bg-gradient-to-r from-red-500 to-red-600';
            default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-white-500 to-white-400 rounded-2xl p-8 mb-8 text-black shadow-2xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="mb-6 lg:mb-0">
                            <h1 className="text-4xl font-bold mb-2">Session/Course Data</h1>
                            <p className="text-black-100 text-lg">Comprehensive overview of all session and course information</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search across all fields..."
                                    value={filterTerm}
                                    onChange={(e) => setFilterTerm(e.target.value)}
                                    className="pl-12 pr-4 py-3 bg-black/10 backdrop-blur-lg border border-black/20 rounded-xl focus:ring-2 focus:ring-black/50 focus:border-white/50 w-full lg:w-80 text-black placeholder-black-200"
                                />
                                <svg className="w-6 h-6 text-black-200 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button 
                                onClick={fetchSessionData}
                                className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                <p className="text-3xl font-bold text-gray-900">{sessionData.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Open Sessions</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {sessionData.filter(item => item.status === 'open').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Closed Sessions</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {sessionData.filter(item => item.status === 'closed').length}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-black-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                                <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <svg className="w-6 h-6 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 mb-8 rounded-2xl shadow-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="w-full flex flex-col justify-center items-center py-20 bg-white rounded-2xl shadow-lg">
                        <div className="relative">
                            <Circles height="80" width="80" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
                        </div>
                        <p className="mt-6 text-gray-600 text-lg font-medium">Loading session data...</p>
                        <p className="text-gray-500 mt-2">Please wait while we fetch the latest information</p>
                    </div>
                )}

                {/* Session Data Table */}
                {!loading && filteredData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Session Information</h2>
                                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {filteredData.length} sessions found
                                        </span>
                                        {filterTerm && (
                                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                                Filtered by: "{filterTerm}"
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                                    <select 
                                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                    >
                                        <option value={10}>10 per page</option>
                                        <option value={25}>25 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                                    <tr>
                                        {columns.map((column) => (
                                            <th 
                                                key={column.key}
                                                className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-300 transition-colors duration-200 ${column.width}`}
                                                onClick={() => handleSort(column.key)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {column.label}
                                                    {sortConfig.key === column.key && (
                                                        <svg className={`w-4 h-4 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <tr 
                                                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer ${
                                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.session || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.col || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.dpt || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-blue-600">{item.crn || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {item.subj} {item.crsNum}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.sec || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.type || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.title || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.cr || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.pmt || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(item.status)}`}>
                                                        {item.status || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.status2 || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.seatsRemain || '0'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.waitSeats || '0'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.cap || '0'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.enrl || '0'}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.days || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.time || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.bldg || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.room || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.campus || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.deliveryMethod || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-green-600">${item.fees || '0.00'}</td>
                                            </tr>
                                            {expandedRow === item.id && (
                                                <tr className="bg-blue-50">
                                                    <td colSpan={columns.length} className="px-6 py-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                            <div><strong>Session:</strong> {item.session || '-'}</div>
                                                            <div><strong>CRN:</strong> {item.crn || '-'}</div>
                                                            <div><strong>Instructor:</strong> {item.name || '-'}</div>
                                                            <div><strong>Status:</strong> {item.status || '-'}</div>
                                                            <div><strong>Capacity:</strong> {item.cap || '0'}</div>
                                                            <div><strong>Enrolled:</strong> {item.enrl || '0'}</div>
                                                            <div><strong>Seats Remaining:</strong> {item.seatsRemain || '0'}</div>
                                                            <div><strong>Delivery Method:</strong> {item.deliveryMethod || '-'}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination */}
                        <div className="px-8 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-bold">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
                                    <span className="font-bold">{filteredData.length}</span> results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                                                currentPage === index + 1
                                                    ? 'bg-gray-600 text-white border-gray-600'
                                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredData.length === 0 && (
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-16 text-center border border-gray-200">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-100 to-black-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No session data found</h3>
                            <p className="text-gray-600 mb-6">
                                {sessionData.length === 0 
                                    ? "No session information is available yet. Please check back later."
                                    : "No sessions match your search criteria. Try adjusting your filters."
                                }
                            </p>
                            {sessionData.length > 0 && (
                                <button
                                    onClick={() => setFilterTerm('')}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionDataView;