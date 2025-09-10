import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import { Circles } from 'react-loader-spinner';

const SessionDataView = () => {
    const [sessionData, setSessionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterTerm, setFilterTerm] = useState('');

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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Session/Course Data</h1>
                        <p className="text-gray-600 mt-2">View all session and course information</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={filterTerm}
                                onChange={(e) => setFilterTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
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

                {/* Loading State */}
                {loading && (
                    <div className="w-full flex flex-col justify-center items-center py-12">
                        <Circles height="60" width="60" color="rgb(0, 63, 146)" ariaLabel="circles-loading" visible={true} />
                        <p className="mt-4 text-gray-600">Loading session data...</p>
                    </div>
                )}

                {/* Session Data Table */}
                {!loading && filteredData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Session Information</h2>
                                <p className="text-gray-600 mt-1">{filteredData.length} sessions found</p>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SESSION</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COL</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPT</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRN</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBJ CRS#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEC</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PMT</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS2</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEATS REMAIN</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WAIT SEATS</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAP</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENRL</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DAYS</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BLDG</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROOM</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INSTRUCTOR</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAMPUS</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY METHOD</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FEES</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.session || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.col || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.dpt || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.crn || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.subj} {item.crsNum}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.sec || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.type || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.title || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.cr || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.pmt || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'open' ? 'bg-green-100 text-green-800' : 
                                                    item.status === 'closed' ? 'bg-red-100 text-red-800' : 
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.status || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.status2 || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.seatsRemain || '0'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.waitSeats || '0'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.cap || '0'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.enrl || '0'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.days || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.time || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.bldg || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.room || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.name || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.campus || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{item.deliveryMethod || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">${item.fees || '0.00'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredData.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No session data found</h3>
                        <p className="mt-2 text-gray-500">No session information is available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionDataView;