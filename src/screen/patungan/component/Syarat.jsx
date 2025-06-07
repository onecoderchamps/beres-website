import React, { useEffect, useState } from 'react';
import { getData } from '../../../api/service';

const Syarat = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [datas, setDatas] = useState('');

  const getDatabase = async () => {
    try {
      const response = await getData('rekening/SettingArisan');
      setDatas(response.data);
    } catch (error) {
      alert(error?.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <div className="w-full h-full overflow-auto p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Syarat dan Ketentuan</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{datas}</p>

      {/* Modal Gambar Fullscreen */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeImage}
        >
          <img
            src={selectedImage}
            alt="Dokumen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Syarat;
