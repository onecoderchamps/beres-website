import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../api/service';
import PatunganComponent from './PatunganComponent';
import BackButton from '../../component/BackButton';

const PatunganScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [targetLot, setTargetLot] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [penagihanDateText, setPenagihanDateText] = useState('');

  const [bannerFiles, setBannerFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [patunganData, setPatunganData] = useState([]);
  const [datas, setDatas] = useState(null);

  useEffect(() => {
    getDatabase();
    getDatabasePatungan();
  }, []);

  const getDatabase = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setDatas(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  const getDatabasePatungan = async () => {
    try {
      const res = await getData('Patungan');
      setPatunganData(res.data);
      setLoading(false);
    } catch (error) {
      alert(error || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  // Replace react-native-image-picker with native file input for web
  const pickFiles = (setFiles) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,application/pdf';
    input.onchange = () => {
      if (input.files.length > 0) {
        const newFiles = Array.from(input.files).map(file => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        }));
        setFiles(prev => [...prev, ...newFiles]);
      }
    };
    input.click();
  };

  const removeFile = (index, setFiles) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files) => {
    const urls = [];
    for (const fileObj of files) {
      const formData = new FormData();
      formData.append('file', fileObj.file || fileObj);
      const upload = await postData('file/upload', formData);
      if (upload?.path) {
        urls.push(upload.path);
      }
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!title || !description || !targetLot || !targetAmount || !penagihanDateText) {
      alert("Harap lengkapi semua field wajib.");
      return;
    }

    const [dd, mm, yyyy] = penagihanDateText.split(' ');
    const parsedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    if (isNaN(parsedDate.getTime())) {
      alert("Format tanggal tidak valid. Gunakan format DD MM YYYY");
      return;
    }

    try {
      const [uploadedBanner, uploadedDocs] = await Promise.all([
        uploadFiles(bannerFiles),
        uploadFiles(documentFiles),
      ]);

      const body = {
        title,
        description,
        keterangan,
        banner: uploadedBanner,
        document: uploadedDocs,
        location: "Default Location",
        targetLot: parseFloat(targetLot),
        targetAmount: parseFloat(targetAmount),
        penagihanDate: parsedDate.toISOString(),
        isAvailable: true,
      };

      await postData('Patungan', body);
      alert("Patungan berhasil ditambahkan!");
      setModalVisible(false);
      resetForm();
      getDatabasePatungan();
    } catch (error) {
      alert(error || "Terjadi kesalahan saat memverifikasi.");
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

  const formatNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-white p-4">
        <BackButton title={"Patungan"} />
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {patunganData.map((item) => (
            <div key={item.id} className="cursor-pointer" onClick={() => navigation.navigate("PatunganDetail", { data: item })}>
              <PatunganComponent data={item} />
            </div>
          ))}
        </div>
      )}

      {datas?.role === '2' && (
        <button
          onClick={() => setModalVisible(true)}
          className="fixed bottom-8 right-8 bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-lg text-xl font-bold"
          aria-label="Tambah Patungan"
        >
          +
        </button>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tambah Patungan</h2>

            <input
              type="text"
              placeholder="Title"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Deskripsi"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <input
              type="text"
              placeholder="Keterangan"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />

            <input
              type="text"
              placeholder="Target Slot"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={formatNumber(targetLot)}
              onChange={(e) => setTargetLot(e.target.value.replace(/\./g, ''))}
            />

            <input
              type="text"
              placeholder="Target Bulanan"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={formatNumber(targetAmount)}
              onChange={(e) => setTargetAmount(e.target.value.replace(/\./g, ''))}
            />

            {targetAmount && targetLot && Number(targetAmount) * Number(targetLot) > 0 && (
              <p className="text-center my-4 font-semibold">
                Total Rp {(Number(targetAmount) * Number(targetLot)).toLocaleString('id-ID')}
              </p>
            )}

            <input
              type="text"
              placeholder="Tanggal Penagihan (DD MM YYYY)"
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={penagihanDateText}
              onChange={(e) => setPenagihanDateText(e.target.value)}
            />

            <div>
              <button
                onClick={() => pickFiles(setBannerFiles)}
                className="w-full bg-gray-200 p-2 rounded mb-3 hover:bg-gray-300"
              >
                Upload Banner
              </button>
              <div className="flex space-x-2 overflow-x-auto mb-3">
                {bannerFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => removeFile(index, setBannerFiles)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => pickFiles(setDocumentFiles)}
                className="w-full bg-gray-200 p-2 rounded mb-3 hover:bg-gray-300"
              >
                Upload Dokumen
              </button>
              <div className="flex space-x-2 overflow-x-auto mb-3">
                {documentFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => removeFile(index, setDocumentFiles)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 mb-3"
            >
              Simpan
            </button>
            <button
              onClick={() => setModalVisible(false)}
              className="w-full bg-gray-300 py-3 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatunganScreen;
