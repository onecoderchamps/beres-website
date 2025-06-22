import React from 'react';
// Import icons from React Icons for consistent visual styling.
import { MdHome, MdStorefront, MdApartment, MdWarehouse } from 'react-icons/md';

// Define your icon mapping.
// Key: The string name you use in your data.
// Value: An object containing the actual React Icon component and its color.
const iconMap = {
  rumah: {
    Icon: MdHome,
    color: '#34D399', // A fresh green
  },
  retail: {
    Icon: MdStorefront,
    color: '#60A5FA', // A clear blue
  },
  ruko: {
    Icon: MdApartment,
    color: '#FBBF24', // A warm amber
  },
  aset: { // Default/fallback for general assets
    Icon: MdWarehouse,
    color: '#A78BFA', // A soft violet
  },
};

const ArisanComponent = ({ data }) => {
  // Select the icon and color based on `data.type`, with 'aset' as a fallback.
  const { Icon: SelectedIcon, color: iconColor } = iconMap[data.type] || iconMap['aset'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-transform duration-200 hover:scale-[1.005] active:scale-[0.995] group cursor-pointer w-full mx-auto">
      <div className="flex flex-col">
        {/* Image Section - Enhanced with subtle overlay for icon */}
        <div className="relative h-36 w-full overflow-hidden flex-shrink-0">
          <img
            src={data.banner && data.banner[0] ? data.banner[0] : 'https://via.placeholder.com/300x150?text=No+Image'}
            alt={data.title || 'Arisan Property'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* "Sisa Slot" Badge - Cleaned up and made more prominent */}
          {data.sisaSlot > 0 && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-1 text-xs font-extrabold rounded-bl-lg shadow-md z-10 animate-fade-in-down">
              Sisa {data.sisaSlot} Slot!
            </div>
          )}
        </div>

        {/* Content Section - Improved Padding and Typography */}
        <div className="p-4 flex-1 flex flex-col justify-between"> {/* Increased padding for more breathing room */}
          <div>
            {/* Title - Bold and Clear */}
            <h3 className="text-lg font-extrabold text-gray-900 mb-1 truncate leading-tight">
              {data.title}
            </h3>
            {/* Description - Concise and Readable */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
              {data.keterangan}
            </p>
          </div>

          {/* Details Section - Structured and Visually Separated */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 mt-2"> {/* More spacing, clearer separator */}
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">Bidang Properti</p> {/* More descriptive label */}
              <p className="text-gray-900 font-bold text-base truncate">{data.keterangan}</p> {/* Slightly larger font */}
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs font-medium mb-1">Iuran / Bulan</p>
              <p className="text-gray-900 font-bold text-base truncate">Rp {data.targetPay ? data.targetPay.toLocaleString('id-ID') : '0'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArisanComponent;