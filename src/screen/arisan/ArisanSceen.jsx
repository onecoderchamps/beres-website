import React, { useEffect, useState } from 'react';
import ArisanComponent from './ArisanComponent';
import { getData, postData } from '../../api/service';
import BackButton from '../../component/BackButton';
import { useNavigate } from 'react-router-dom';

const ArisanScreen = ({  }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [targetLot, setTargetLot] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [penagihanDateText, setPenagihanDateText] = useState('');

  const [bannerFiles, setBannerFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [arisanData, setArisanData] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getDatabase();
    getDatabaseArisan();
  }, []);

  const getDatabase = async () => {
    try {
      const res = await getData('auth/verifySessions');
      setUserData(res.data);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat verifikasi');
    }
  };

  const getDatabaseArisan = async () => {
    try {
      const res = await getData('Arisan');
      setArisanData(res.data);
      setLoading(false);
    } catch (err) {
      alert(err.message || 'Gagal mengambil data');
    }
  };

  const formatNumber = (val) => {
    return val?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSubmit = async () => {
    if (!title || !description || !targetLot || !targetAmount || !penagihanDateText) {
      alert('Harap isi semua kolom.');
      return;
    }

    const [dd, mm, yyyy] = penagihanDateText.split(' ');
    const parsedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    if (isNaN(parsedDate.getTime())) {
      alert('Format tanggal tidak valid. Gunakan format DD MM YYYY');
      return;
    }

    const body = {
      title,
      description,
      keterangan,
      banner: bannerFiles,
      document: documentFiles,
      location: 'Default Location',
      targetLot: parseFloat(targetLot),
      targetAmount: parseFloat(targetAmount),
      penagihanDate: parsedDate.toISOString(),
      isAvailable: true,
    };

    try {
      await postData('Arisan', body);
      alert('Sukses menambahkan arisan');
      setModalVisible(false);
      resetForm();
      getDatabaseArisan();
    } catch (err) {
      alert(err.message || 'Gagal submit');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setKeterangan('');
    setTargetLot('');
    setTargetAmount('');
    setPenagihanDateText('');
    setBannerFiles([]);
    setDocumentFiles([]);
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <BackButton title={"Arisan"} />
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-between">
          {arisanData.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate('/ArisanDetail/'+item.id, { data: item })}
              className="cursor-pointer w-[calc(50%-0.5rem)]"
            >
              <ArisanComponent data={item} />
            </div>
          ))}
        </div>
      )}

      {userData?.role === '2' && (
        <button
          onClick={() => setModalVisible(true)}
          className="fixed bottom-8 right-8 bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-lg text-xl font-bold"
          aria-label="Tambah Patungan"
        >
          +
        </button>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Tambah Arisan</h2>

            <input placeholder="Judul" className="input mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Deskripsi" className="input mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input placeholder="Keterangan" className="input mb-2" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
            <input placeholder="Target Slot" className="input mb-2" type="number" value={targetLot} onChange={(e) => setTargetLot(e.target.value)} />
            <input placeholder="Target Bulanan" className="input mb-2" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            <input placeholder="Tanggal Penagihan (DD MM YYYY)" className="input mb-2" value={penagihanDateText} onChange={(e) => setPenagihanDateText(e.target.value)} />

            {targetAmount * targetLot > 0 && (
              <p className="text-center text-sm font-semibold mt-2">
                Total: Rp {(targetAmount * targetLot).toLocaleString('id-ID')}
              </p>
            )}

            {/* Simpan + Batal */}
            <div className="flex justify-between mt-4">
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
                Simpan
              </button>
              <button onClick={() => setModalVisible(false)} className="bg-gray-300 px-4 py-2 rounded">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArisanScreen;
