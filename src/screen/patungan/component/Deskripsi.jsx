import React, { useState } from 'react';
import { X as CloseIcon, FileText, MapPin, DollarSign, Image } from 'lucide-react'; // Import icons

const Deskripsi = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to open the fullscreen image modal
  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  // Function to close the fullscreen image modal
  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl shadow-lg p-6"> {/* Main card container */}
      {/* Asset Details Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-6 border-b pb-4 border-gray-100">Detail Asset</h2>

      <div className="space-y-4 mb-8"> {/* Increased spacing */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <span className="flex items-center text-gray-600 font-medium text-base">
            <FileText className="w-5 h-5 mr-2 text-purple-600" /> Nama Asset
          </span>
          <span className="text-right text-gray-800 font-semibold text-base">{data.title}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <span className="flex items-center text-gray-600 font-medium text-base">
            <MapPin className="w-5 h-5 mr-2 text-purple-600" /> Alamat
          </span>
          <span className="text-right text-gray-800 font-semibold text-base break-words max-w-[60%]">{data.keterangan}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <span className="flex items-center text-gray-600 font-medium text-base">
            <DollarSign className="w-5 h-5 mr-2 text-purple-600" /> Harga Total
          </span>
          <span className="text-right text-green-600 font-bold text-lg">Rp {data.totalPrice.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <span className="flex items-center text-gray-600 font-medium text-base">
            <DollarSign className="w-5 h-5 mr-2 text-purple-600" /> Harga / Lembar
          </span>
          <span className="text-right text-green-600 font-bold text-lg">Rp {data.targetPay.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Description Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-4 border-b pb-2 border-gray-100">Deskripsi Detail</h2>
      <p className="text-gray-700 leading-relaxed text-base mb-8 whitespace-pre-line">
        {data.desc || 'Tidak ada deskripsi tersedia untuk asset ini.'}
      </p>

      {/* Documents Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-4 border-b pb-2 border-gray-100">Dokumen Pendukung</h2>
      {data.doc && data.doc.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"> {/* Responsive grid for documents */}
          {data.doc.map((docUri, idx) => (
            <div 
              key={idx}
              className="relative group w-full pt-[100%] rounded-lg overflow-hidden shadow-md border border-gray-200 cursor-pointer 
                         transform hover:scale-105 transition-transform duration-200 ease-in-out"
              onClick={() => openImage(docUri)}
            >
              <img
                src={docUri}
                alt={`Dokumen ${idx + 1}`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <Image className="w-8 h-8 text-white" /> {/* Icon on hover */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic text-center py-4">Tidak ada dokumen yang dilampirkan.</p>
      )}


      {/* Modal Gambar Fullscreen */}
      {modalVisible && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={closeImage}
        >
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white text-4xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition z-50"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen Document"
            className="max-w-full max-h-full object-contain cursor-zoom-out" // Added cursor hint
          />
        </div>
      )}
    </div>
  );
};

export default Deskripsi;