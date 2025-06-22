import React from 'react';
// Import icons from react-icons. You might need to install it: npm install react-icons
import { MdHome, MdStorefront, MdBusiness, MdWarehouse, MdAccountBalanceWallet } from 'react-icons/md';

// Map your data 'type' to the actual icon component and desired color
const iconMap = {
  rumah: {
    icon: MdHome,
    color: 'text-green-600',
  },
  retail: {
    icon: MdStorefront,
    color: 'text-blue-600',
  },
  ruko: {
    icon: MdBusiness,
    color: 'text-yellow-600',
  },
  aset: { // Default fallback
    icon: MdWarehouse,
    color: 'text-purple-700',
  },
  // Add more types if needed for Arisan
  arisan: { // A generic icon for Arisan type, if it's different from asset types
    icon: MdAccountBalanceWallet, 
    color: 'text-indigo-600',
  }
};

const ArisanComponent = ({ data }) => {
  // Get icon info based on data.type, default to 'arisan' or 'aset' if not found
  const { icon: IconComponent, color: iconColor } = iconMap[data.type] || iconMap['arisan'] || iconMap['aset'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden 
                    transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="relative">
        <img
          src={data.banner && data.banner[0] ? data.banner[0] : 'https://via.placeholder.com/400x200?text=No+Image'} // Fallback image
          alt={data.title}
          className="w-full object-cover object-center"
          style={{ height: '180px' }} // Slightly increased height for better visual impact
        />

        {/* Ribbon "Sisa Slot" */}
        {data.sisaSlot > 0 && (
          <div
            className="absolute top-4 right-[-30px] bg-red-500 text-white px-10 py-1 
                       rounded-bl-lg shadow-md font-bold text-sm text-center transform rotate-45"
            // Adjusted right position and increased width for better visibility of "Sisa XX"
            // Changed color to red for urgency, rounded bottom-left for a nicer shape
          >
            Sisa {data.sisaSlot}
          </div>
        )}
      </div>

      <div className="p-5"> {/* Increased padding for more breathing room */}
        <div className="flex items-center"> {/* Icon and Title */}
          <h3 className="text-gray-800 font-extrabold text-xl truncate" title={data.title}>
            {data.title}
          </h3>
        </div>

        <div className="flex justify-between items-end border-t border-gray-100 pt-4">
          <div className="flex-1 text-left pr-2">
            <p className="text-gray-500 text-xs uppercase font-medium">Bidang</p>
            <p className="text-gray-700 font-bold text-base mt-1">
              {data.keterangan || 'N/A'} {/* Uses data.keterangan for "Bidang" */}
            </p>
          </div>

          <div className="flex-1 text-right pl-2">
            <p className="text-gray-500 text-xs uppercase font-medium">Iuran Bulanan</p>
            <p className="text-indigo-600 font-bold text-lg mt-1">
              Rp {data.targetPay?.toLocaleString('id-ID') || '0'} {/* Changed to targetAmount for Iuran */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArisanComponent;