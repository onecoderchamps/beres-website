import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../api/service';
import BackButton from '../../component/BackButton';
import { FaSpinner, FaUsers, FaHandHoldingUsd } from 'react-icons/fa'; // Import relevant icons

const AktifitasPage = () => {
    const [loading, setLoading] = useState(true);
    const [arisanData, setArisanData] = useState([]); // Renamed for clarity
    const [patunganData, setPatunganData] = useState([]); // Renamed for clarity
    const navigate = useNavigate();

    // Fetches joined Arisan data
    const getArisanDatabase = async () => {
        try {
            const response = await getData('Arisan/ByUser');
            setArisanData(response.data);
        } catch (error) {
            console.error("Error fetching Arisan data:", error); // Log error for debugging
            // alert(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data Arisan.'); // Optional: show alert
        }
    };

    // Fetches joined Patungan data
    const getPatunganDatabase = async () => {
        try {
            const response = await getData('Patungan/ByUser');
            setPatunganData(response.data);
        } catch (error) {
            console.error("Error fetching Patungan data:", error); // Log error for debugging
            // alert(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data Patungan.'); // Optional: show alert
        }
    };

    // Fetches all data concurrently on component mount
    useEffect(() => {
        const fetchData = async () => {
            // Use Promise.allSettled to ensure all promises resolve or reject
            // without stopping the whole process if one fails.
            await Promise.allSettled([getArisanDatabase(), getPatunganDatabase()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Combine data and add a 'type' property for easier handling
    const combinedData = [
        ...arisanData.map(item => ({ ...item, type: 'Arisan' })),
        ...patunganData.map(item => ({ ...item, type: 'Patungan' }))
    ];

    // Handles navigation based on item type
    const handleCardClick = (item) => {
        if (item.type === 'Arisan') {
            navigate('/ArisanDetail/' + item.id, { state: { data: item } }); // Pass data for consistency
        } else if (item.type === 'Patungan') {
            navigate('/PatunganDetail/' + item.id, { state: { data: item } }); // Pass data for consistency
        }
    };

    return (
        <div className="min-h-screen bg-white-50 p-2"> {/* Soft background, padding-bottom */}
            <BackButton title={"Aktivitas Saya"} /> {/* Updated title to "Aktivitas Saya" for better clarity */}

            <div className="max-w-4xl mx-auto p-4 pt-6"> {/* Max width, centered, and padded */}
                {loading ? (
                    <div className="flex justify-center items-center h-[calc(100vh-64px)]"> {/* Centered loading spinner */}
                        <FaSpinner className="animate-spin text-purple-600 text-6xl" /> {/* Enhanced spinner */}
                    </div>
                ) : (
                    <>
                        {/* Header for the section */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Partisipasi Anda</h2>
                            <p className="text-gray-600 mt-2">Lihat semua aktifitas yang Anda ikuti.</p>
                        </div>

                        {combinedData.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-600 text-lg">Anda belum bergabung dengan Arisan atau Patungan apapun.</p>
                                <p className="text-gray-500 mt-2">Mulai eksplorasi untuk menemukan peluang menarik!</p>
                                <button
                                    onClick={() => navigate('/home')} // Example: navigate to home or an explore page
                                    className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
                                >
                                    Cari Aktivitas
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5"> {/* Increased space between cards */}
                                {combinedData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center bg-white p-5 rounded-2xl shadow-md border border-gray-100 
                                                   transform hover:scale-[1.01] hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
                                        onClick={() => handleCardClick(item)}
                                    >
                                        {/* Icon based on type */}
                                        <div className={`
                                            w-14 h-14 rounded-full flex items-center justify-center mr-4 
                                            ${item.type === 'Arisan' ? 'bg-indigo-100' : 'bg-green-100'}
                                        `}>
                                            {item.type === 'Arisan' ? (
                                                <FaUsers className="text-indigo-600 text-2xl" />
                                            ) : (
                                                <FaHandHoldingUsd className="text-green-600 text-2xl" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0"> {/* Use min-w-0 to prevent overflow */}
                                            <div className="text-gray-800 font-bold text-lg truncate" title={item.title}>
                                                {item.title}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={item.description || item.keterangan || item.desc}>
                                                {item.description || item.keterangan || item.desc || 'Tidak ada keterangan.'}
                                            </p>
                                        </div>

                                        {/* Type label at the end */}
                                        <div className={`
                                            ml-4 px-3 py-1 rounded-full text-xs font-semibold
                                            ${item.type === 'Arisan' ? 'bg-indigo-500 text-white' : 'bg-green-500 text-white'}
                                        `}>
                                            {item.type.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AktifitasPage;