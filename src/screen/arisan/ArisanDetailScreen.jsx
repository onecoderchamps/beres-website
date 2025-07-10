import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import Deskripsi from './component/Deskripsi'; // Assuming Deskripsi, Member, Syarat are styled correctly
import Member from './component/Member';
import Syarat from './component/Syarat';
import { useParams } from 'react-router-dom';
import BackButton from '../../component/BackButton';
import { FaSpinner, FaUsers, FaCreditCard, FaTimes } from 'react-icons/fa'; // Import icons

export default function ArisanDetail() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Deskripsi');
    const [modalVisible, setModalVisible] = useState(false); // Modal for 'Gabung Member'
    const [modalPayment, setModalPayment] = useState(false); // Modal for 'Bayar Iuran'
    const [jumlahLot, setJumlahLot] = useState(1); // Although fixed to 1 in handleJoin, kept for consistency
    const [nominal, setNominal] = useState(0); // Total iuran calculation
    const [detailData, setDetailData] = useState(null); // Arisan specific data
    const [userData, setUserData] = useState(null); // User session data (renamed from 'datas' for clarity)
    const [loading, setLoading] = useState(true);

    // Derived state for easier access to target pay
    const iuranWajibPerLot = detailData?.targetPay || 0;

    // Fetches current user's data (balance, phone, etc.)
    const getUserData = async () => {
        try {
            const res = await getData('auth/verifySessions');
            setUserData(res.data);
        } catch (err) {
            console.error("Error getting user data:", err); // Log for debugging
            alert(err?.response?.data?.message || 'Terjadi kesalahan saat mengambil data pengguna.');
        }
    };

    // Fetches detailed Arisan data
    const getArisanData = async () => {
        setLoading(true);
        try {
            const res = await getData('Arisan/' + id);
            setDetailData(res.data);
        } catch (err) {
            console.error("Error loading Arisan data:", err); // Log for debugging
            alert(err?.response?.data?.message || 'Gagal memuat detail Arisan.');
            setDetailData(null); // Clear data on error
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        getArisanData();
    }, []);

    // Recalculate nominal whenever jumlahLot or iuranWajibPerLot changes
    // Note: In handleJoin, jumlahLot is fixed to 1, so this calculation might be simplified
    // to just nominal = iuranWajibPerLot if jumlahLot is always 1 for joining.
    useEffect(() => {
        setNominal(jumlahLot * iuranWajibPerLot);
    }, [jumlahLot, iuranWajibPerLot]);

    // Handles joining the Arisan
    const handleJoin = async () => {
        if(!userData.isPayMonthly)
        {
            alert('Anda belum membayar iuran bulanan koperasi.');
            return;
        }
        if (!userData || !userData.phone) {
            alert('Data pengguna tidak lengkap. Harap coba lagi.');
            return;
        }
        // Assuming 'nominal' is the total cost for joining (currently 1 lot)
        if (nominal > userData.balance) {
            alert('Saldo Anda tidak mencukupi untuk bergabung.');
            return;
        }

        try {
            await postData('Arisan/AddNewArisanMemberbyAdmin', {
                idUser: userData?.phone, // Assuming idUser is phone
                idArisan: id,
                phoneNumber: userData?.phone,
                jumlahLot: 1, // Fixed to 1 as per original code
                isActive: true,
                isPayed: false, // This implies a separate payment step might follow for the first month
            });
            alert('Berhasil bergabung dengan Arisan!');
            getArisanData(); // Refresh data to reflect new membership
            setModalVisible(false);
            setJumlahLot(1); // Reset lot count
        } catch (err) {
            console.error("Error joining Arisan:", err); // Log for debugging
            alert(err?.response?.data?.message || 'Gagal bergabung dengan Arisan.');
        }
    };

    // Handles monthly payment for Arisan
    const handlePay = async () => {
        if (!userData || !detailData) {
            alert('Data tidak lengkap untuk pembayaran. Harap muat ulang halaman.');
            return;
        }
        // Assuming 'targetPay' is the monthly iuran amount
        if (detailData.targetPay > userData.balance) {
            alert('Saldo Anda tidak mencukupi untuk pembayaran iuran ini.');
            return;
        }

        try {
            await postData('Arisan/PayArisan', { idTransaksi: id }); // 'idTransaksi' should likely be a specific transaction ID, not Arisan ID. Review this API call.
            alert('Pembayaran iuran berhasil!');
            getArisanData(); // Refresh data to update payment status
            setModalPayment(false);
        } catch (err) {
            console.error("Error paying Arisan iuran:", err); // Log for debugging
            alert(err?.response?.data?.message || 'Gagal melakukan pembayaran iuran.');
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-purple-600 text-6xl" />
            </div>
        );
    }

    // --- Main Component Render ---
    return (
        <div className="bg-white-50 min-h-screen p-2"> {/* Soft background, padding-bottom */}
                            <BackButton title={"Detail Arisan"} />


            {/* Banner Section */}
            {activeTab !== 'Chat' && detailData.banner && detailData.banner.length > 0 && (
                <div className="relative w-full overflow-hidden mb-6">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        {detailData.banner.map((banner, idx) => (
                            <img
                                key={idx}
                                src={banner}
                                alt={`Banner ${idx + 1}`}
                                className="flex-shrink-0 w-full h-64 object-cover rounded-xl shadow-md"
                                style={{ scrollSnapAlign: 'start' }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs Section */}
            <div className="bg-white rounded-xl shadow-md mx-4 mb-6 p-1 flex justify-around">
                {['Deskripsi', 'Syarat', 'Member'].map((tab) => {
                    // Conditional rendering for 'Member' tab based on membership status
                    if (!detailData?.statusMember?.isMembership && tab === 'Member') return null;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-4 text-center text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out
                                        ${activeTab === tab
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content Section (rendered component based on activeTab) */}
            <div className="p-4 mx-auto max-w-4xl">
                {activeTab === 'Deskripsi' && detailData && <Deskripsi data={detailData} />}
                {activeTab === 'Syarat' && detailData && <Syarat data={detailData} />}
                {activeTab === 'Member' && detailData && <Member data={detailData} getArisanDatabase={getArisanData} />}
                {/* {activeTab === 'Chat' && detailData && <Chat data={detailData} />} */}
            </div>

            {/* Floating Action Button (FAB) - Gabung Member */}
            {/* Display only if user is NOT already a member */}
            {detailData?.statusMember?.isMembership === false && (
                <button
                    onClick={() => {
                        setModalVisible(true);
                        getUserData(); // Fetch user data when modal is about to open
                    }}
                    className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white
                               p-4 rounded-full shadow-lg text-lg z-40
                               flex items-center justify-center transition-all duration-300 ease-in-out
                               transform hover:scale-105 active:scale-95"
                    aria-label="Gabung Member"
                >
                    <FaUsers className="mr-2 text-xl" />
                    <span>Gabung Member</span>
                </button>
            )}

            {/* Floating Action Button (FAB) - Bayar Iuran */}
            {/* Display if user IS a member AND needs to pay for the current month */}
            {detailData?.statusMember?.isMembership && !detailData?.statusMember?.isPayMonth && (
                <button
                    onClick={() => {
                        setModalPayment(true);
                        getUserData(); // Fetch user data when modal is about to open
                    }}
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white
                               p-4 rounded-full shadow-lg text-lg z-40
                               flex items-center justify-center transition-all duration-300 ease-in-out
                               transform hover:scale-105 active:scale-95"
                    aria-label="Bayar Iuran"
                >
                    <FaCreditCard className="mr-2 text-xl" />
                    <span>Bayar Iuran</span>
                </button>
            )}

            {/* Modal: Gabung Member */}
            {modalVisible && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] transform scale-95 animate-scale-in">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold text-purple-700">Gabung Member</h2>
                            <button onClick={() => setModalVisible(false)} className="text-gray-500 hover:text-gray-700 transition">
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {userData ? (
                            <>
                                <div className="space-y-3 mb-6">
                                    <p className="text-gray-700 text-base">
                                        <strong>Total Saldo Anda:</strong> <br />
                                        <span className="text-purple-600 font-bold text-xl">
                                            Rp {userData?.balance?.toLocaleString('id-ID') || '0'}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 text-base">
                                        <strong>Harga per Iuran:</strong> <br />
                                        <span className="text-green-600 font-bold text-xl">
                                            Rp {detailData?.targetPay?.toLocaleString('id-ID') || '0'}
                                        </span>
                                    </p>
                                </div>

                                {/* Jumlah Lot input commented out as per your original code's handleJoin fixing it to 1 */}
                                {/*
                                <div className="mb-6">
                                    <p className="text-gray-700 text-base font-semibold mb-2">Jumlah Lot</p>
                                    <div className="flex items-center justify-center space-x-3">
                                        <button
                                            onClick={() => setJumlahLot((prev) => Math.max(1, prev - 1))}
                                            className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={jumlahLot}
                                            onChange={(e) => setJumlahLot(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="border border-gray-300 rounded-lg p-2 w-24 text-center text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        />
                                        <button
                                            onClick={() => setJumlahLot((prev) => prev + 1)}
                                            className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-purple-700 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                */}

                                <div className="text-center mb-6">
                                    <p className="text-lg font-semibold text-gray-800">
                                        Total Iuran: <br />
                                        <span className="text-purple-600 font-bold text-2xl">
                                            Rp {nominal.toLocaleString('id-ID')}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleJoin}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Gabung Sekarang
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600">Memuat data pengguna...</div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal: Bayar Iuran */}
            {modalPayment && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] transform scale-95 animate-scale-in">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold text-purple-700">Bayar Iuran</h2>
                            <button onClick={() => setModalPayment(false)} className="text-gray-500 hover:text-gray-700 transition">
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>

                        {userData ? (
                            <>
                                <div className="space-y-3 mb-6">
                                    <p className="text-gray-700 text-base">
                                        <strong>Saldo Anda:</strong> <br />
                                        <span className="text-purple-600 font-bold text-xl">
                                            Rp {userData?.balance?.toLocaleString('id-ID') || '0'}
                                        </span>
                                    </p>
                                    <p className="text-gray-700 text-base">
                                        <strong>Nominal Iuran Bulan Ini:</strong> <br />
                                        <span className="text-green-600 font-bold text-xl">
                                            Rp {detailData?.targetPay?.toLocaleString('id-ID') || '0'}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setModalPayment(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handlePay}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Bayar Sekarang
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600">Memuat data pengguna...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}