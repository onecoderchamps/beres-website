import React, { useState } from 'react';

const Deskripsi = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Title</span>
          <span className="text-right text-gray-800 ml-4">{data.title}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Keterangan</span>
          <span className="text-right text-gray-800 ml-4">{data.keterangan}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Target</span>
          <span className="text-right text-gray-800 ml-4">Rp {data.totalPrice.toLocaleString('id')}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Iuran Bulanan</span>
          <span className="text-right text-gray-800 ml-4">Rp {data.targetPay.toLocaleString('id')}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Durasi</span>
          <span className="text-right text-gray-800 ml-4">{data.totalSlot.toLocaleString('id')} Bulan</span>
        </div>

        <hr className="border-t border-gray-300 my-4" />

        <h2 className="font-bold text-lg text-gray-800">Deskripsi</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.desc}</p>

        <hr className="border-t border-gray-300 my-4" />

        <h2 className="font-bold text-lg text-gray-800">Dokumen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.doc.map((tab, idx) => (
            <img
              key={idx}
              src={tab}
              alt={`dokumen-${idx}`}
              className="w-full h-64 object-cover rounded-lg cursor-pointer border"
              onClick={() => openImage(tab)}
            />
          ))}
        </div>
      </div>

      {/* Modal Gambar Fullscreen */}
      {modalVisible && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center cursor-pointer"
          onClick={closeImage}
        >
          <img
            src={selectedImage}
            alt="fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Deskripsi;
