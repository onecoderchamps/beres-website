import React, { useState, useEffect } from 'react';
import { getData, postData } from '../../api/service';
import BackButton from '../../component/BackButton';

const KoperasiScreen = () => {
    const [loading, setLoading] = useState(true);
    const [saldo, setSaldo] = useState(300000);
    const [modalVisible, setModalVisible] = useState(false);
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [history, setHistory] = useState([]);
    const [rekening, setRekening] = useState(0);

    const getDatabase = async () => {
        try {
            const rekeningRes = await getData('rekening/SettingIuranBulanan');
            const transaksi = await getData('transaksi');
            
            setHistory(transaksi.data.filter(item => item.type.includes('KoperasiBulanan')));
            setRekening(rekeningRes.data);
            setLoading(false);
        } catch (error) {
            alert(error?.response?.data?.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    useEffect(() => {
        getDatabase();
    }, []);

    const handleTransfer = () => {
        const amount = parseInt(nominal);
        if (!amount || amount <= 0 || !keterangan) {
            alert('Nominal dan keterangan harus diisi');
            return;
        }
        if (amount > saldo) {
            if (window.confirm('Saldo tidak cukup. Ingin topup sekarang?')) {
                window.location.href = '/saldo';
            }
            return;
        }

        setSaldo(prev => prev - amount);
        setHistory(prev => [
            {
                id: Date.now().toString(),
                nominal: amount,
                ket: keterangan,
                createdAt: new Date().toISOString(),
                status: 'Expense'
            },
            ...prev
        ]);
        setModalVisible(false);
        setNominal('');
        setKeterangan('');
    };

    const handleNominalChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setNominal(raw);
    };

    const formatCurrency = (numberString) => {
        if (!numberString) return '';
        return parseInt(numberString).toLocaleString('id-ID');
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year} ${hours}:${minutes}`;
    };

    const bayar = async () => {
        try {
            await postData('Transaksi/PayBulananKoperasi');
            getDatabase();
            alert('Pembayaran berhasil.');
        } catch (err) {
            alert(err || "Transaksi Bulanan Selesai");
            setLoading(false);
        }
    };

    const hasPaidThisMonth = () => {
        const now = new Date();
        return history.some(item => {
            const paidDate = new Date(item.createdAt);
            return (
                paidDate.getMonth() === now.getMonth() &&
                paidDate.getFullYear() === now.getFullYear()
            );
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <BackButton title={"Koperasi"} />
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-gray-700">Loading...</div>
                </div>
            ) : (
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mt-2">Iuran Wajib Bulanan</p>
                        <p className="text-2xl font-bold text-[#3f2e3e]">Rp {rekening.toLocaleString('id-ID')}</p>
                    </div>

                    {!hasPaidThisMonth() && (
                        <button
                            onClick={bayar}
                            className="w-full bg-[#3f2e3e] text-white py-3 rounded-lg font-semibold mb-4"
                        >
                            Bayar Iuran Bulan Ini
                        </button>
                    )}

                    <h2 className="text-xl font-bold text-[#3f2e3e] mb-4">Riwayat Iuran</h2>
                    <div className="space-y-4">
                        {history.length > 0 ? (
                            history.map((item) => (
                                <div key={item.id} className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-semibold">{item.ket}</p>
                                        <p className="text-sm text-gray-500">{formatDateTime(item.createdAt)}</p>
                                    </div>
                                    <p className={`font-bold ${item.status === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.status === 'Income' ? '+ ' : '- '}Rp {item.nominal.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 py-10 text-lg">Belum ada riwayat transaksi koperasi.</p>
                        )}
                    </div>

                    {modalVisible && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-bold text-[#3f2e3e] mb-4">Bayar Iuran</h3>
                                <p className="mb-2 text-sm text-[#3f2e3e]">Saldo Anda: Rp {saldo.toLocaleString('id-ID')}</p>

                                <input
                                    type="text"
                                    placeholder="Nominal"
                                    value={formatCurrency(nominal)}
                                    onChange={handleNominalChange}
                                    className="w-full p-2 border border-gray-300 rounded mb-3"
                                />
                                <input
                                    type="text"
                                    placeholder="Keterangan (contoh: Iuran Bulan Mei 2025)"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                />

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setModalVisible(false)}
                                        className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
                                    >Batal</button>
                                    <button
                                        onClick={handleTransfer}
                                        className="bg-[#3f2e3e] text-white px-4 py-2 rounded"
                                    >Transfer</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KoperasiScreen;
