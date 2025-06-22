import React from 'react';
// Assuming you are using an icon library like 'react-icons'
// For example, if using react-icons/md for Material Design icons
import { MdHome, MdStorefront, MdBusiness, MdWarehouse } from 'react-icons/md'; 
// Or if using react-icons/fa for Font Awesome:
// import { FaHome, FaStore, FaBuilding, FaWarehouse } from 'react-icons/fa';

// Map your data 'type' to the actual icon component and desired color
const iconMap = {
  rumah: {
    icon: MdHome, // or FaHome
    color: 'text-green-600', // A slightly darker green
  },
  retail: {
    icon: MdStorefront, // or FaStore
    color: 'text-blue-600', // A slightly darker blue
  },
  ruko: {
    icon: MdBusiness, // or FaBuilding
    color: 'text-yellow-600', // A slightly darker yellow
  },
  aset: {
    icon: MdWarehouse, // or FaWarehouse
    color: 'text-purple-700', // A slightly darker purple
  },
};

const PatunganComponent = ({ data }) => {
  // Get icon info based on data.type, default to 'aset' if not found
  const { icon: IconComponent, color: iconColor } = iconMap[data.type] || iconMap['aset'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden 
                    transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="relative">
        <img
          src={data.banner[0]}
          alt={data.title}
          className="w-full object-cover object-center" // object-center to ensure main part of image is visible
          style={{ height: '180px' }} // Slightly increased height for better visual impact
        />

        {/* Ribbon "Sisa Slot" */}
        {data.sisaSlot > 0 && (
          <div
            className="absolute top-5 right-[-50px] bg-red-500 text-white px-10 py-1 
                       rounded-bl-lg shadow-md font-bold text-sm text-center transform rotate-45"
            // Adjusted right position and increased width for better visibility of "Sisa XX"
            // Changed color to red for urgency, rounded bottom-left for a nicer shape
          >
            Sisa {data.sisaSlot} Slot!
          </div>
        )}
      </div>

      <div className="p-5"> {/* Increased padding for more breathing room */}
        <div className="flex items-center mb-2"> {/* Icon and Title */}
          <h3 className="text-gray-800 font-extrabold text-xl truncate" title={data.title}>
            {data.title}
          </h3>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2" title={data.keterangan}>
          {data.keterangan}
        </p>

        <div className="flex justify-between items-end border-t border-gray-100 pt-4"> {/* Added top border for separation */}
          <div className="flex-1 text-left pr-2"> {/* Align text left for better readability */}
            <p className="text-gray-500 text-xs uppercase font-medium">Harga Per Slot</p>
            <p className="text-green-700 font-bold text-lg mt-1">
              Rp {data.targetPay.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex-1 text-right pl-2"> {/* Align text right for balance */}
            <p className="text-gray-500 text-xs uppercase font-medium">Total Aset</p>
            <p className="text-purple-700 font-bold text-lg mt-1">
              Rp {data.totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatunganComponent;