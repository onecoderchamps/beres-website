import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import Deskripsi from './component/Deskripsi';
import Member from './component/Member';
import Syarat from './component/Syarat';
import { useParams } from 'react-router-dom';
import BackButton from '../../component/BackButton';

export default function PatunganDetail({ }) {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('Deskripsi');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPayment, setModalPayment] = useState(false);
    const [jumlahLot, setJumlahLot] = useState(1);
    const [nominal, setNominal] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [detailData, setDetailData] = useState(null);
    const [datas, setDatas] = useState(null);
    const [loading, setLoading] = useState(true);

    const iuranWajibPerLot = detailData?.targetPay || 0;

    const getUserData = async () => {
        try {
            const res = await getData('auth/verifySessions');
            setDatas(res.data);
        } catch (err) {
            alert(err?.response?.data?.message || 'Error getting user data');
        }
    };

    const getPatunganData = async () => {
        try {
            const res = await getData('Patungan/' + id);
            setDetailData(res.data);
            setLoading(false);
        } catch (err) {
            alert(err?.response?.data?.message || 'Error loading Patungan');
        }
    };

    useEffect(() => {
        getPatunganData();
    }, []);

    useEffect(() => {
        setNominal(jumlahLot * iuranWajibPerLot);
    }, [jumlahLot, iuranWajibPerLot]);

    const handleJoin = async () => {
        try {
            await postData('Patungan/AddNewPatunganMember', {
                idUser: datas?.phone,
                idPatungan: id,
                phoneNumber: datas?.phone,
                jumlahLot,
                isActive: true,
                isPayed: false,
            });
            getPatunganData();
            setModalVisible(false);
        } catch (err) {
            alert(err || 'Error joining');
        }
    };

    const handlePay = async () => {
        try {
            await postData('Patungan/PayPatungan', { idTransaksi: data.id });
            getPatunganData();
            setModalPayment(false);
        } catch (err) {
            alert(err || 'Error paying');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="bg-white min-h-screen">
            <div className='p-4'>
                <BackButton title={"Patungan"} />
            </div>
            {/* Banner */}
            {activeTab !== 'Chat' && (
                <div className="relative overflow-x-scroll whitespace-nowrap">
                    {detailData.banner.map((banner, idx) => (
                        <img
                            key={idx}
                            src={banner}
                            alt={`Banner ${idx}`}
                            className="inline-block w-full h-60 object-cover"
                        />
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-around bg-green-900 text-white py-3">
                {['Deskripsi', 'Syarat', 'Member', 'Chat'].map((tab) => {
                    if (!detailData?.statusMember?.isMembership && (tab === 'Member' || tab === 'Chat')) return null;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1 rounded-full ${activeTab === tab ? 'bg-green-300 text-green-900' : ''
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="p-5">
                {activeTab === 'Deskripsi' && <Deskripsi data={detailData} />}
                {activeTab === 'Syarat' && <Syarat data={detailData} />}
                {activeTab === 'Member' && <Member data={detailData} getPatunganDatabase={getPatunganData} />}
                {/* {activeTab === 'Chat' && <Chat data={detailData} />} */}
            </div>

            {/* Floating Button */}
            {detailData?.statusMember?.isMembership === false && (
                <button
                    onClick={() => {
                        setModalVisible(true);
                        getUserData();
                    }}
                    className="fixed bottom-5 right-5 bg-green-900 text-white px-6 py-3 rounded-full shadow-lg"
                >
                    Beli Asset
                </button>
            )}

            {/* Gabung Member Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-999999 p-10">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Beli Asset</h2>
                        <p><strong>Total Saldo:</strong> <br />Rp {datas?.balance}</p>
                        <br />
                        <p><strong>Harga / Lembar:</strong> <br />Rp {detailData?.targetPay}</p>
                        <br />
                        <p><strong>Jumlah Asset</strong></p>
                        <div className="mt-4 flex items-center space-x-2">
                            <button onClick={() => setJumlahLot((prev) => Math.max(1, prev - 1))}>-</button>
                            <input
                                type="number"
                                value={jumlahLot}
                                onChange={(e) => setJumlahLot(Math.max(1, parseInt(e.target.value) || 1))}
                                className="border p-2 w-16 text-center"
                            />
                            <button onClick={() => setJumlahLot((prev) => prev + 1)}>+</button>
                        </div>
                        <br />
                        <p className="mt-4"><strong>Total Saham:</strong> Rp {nominal}</p>

                        <div className="flex justify-between mt-6">
                            <button onClick={handleJoin} className="bg-green-900 text-white px-4 py-2 rounded">
                                Bayar Sekarang
                            </button>
                            <button onClick={() => setModalVisible(false)} className="text-red-600">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bayar Iuran Modal */}
            {modalPayment && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-999999">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Bayar Iuran</h2>
                        <p><strong>Saldo:</strong> Rp {datas?.balance}</p>
                        <p><strong>Iuran:</strong> Rp {detailData?.targetPay}</p>

                        <div className="flex justify-between mt-6">
                            <button onClick={handlePay} className="bg-green-900 text-white px-4 py-2 rounded">
                                Bayar Sekarang
                            </button>
                            <button onClick={() => setModalPayment(false)} className="text-red-600">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
