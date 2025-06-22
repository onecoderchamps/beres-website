import React from 'react';
import { MdHome, MdStorefront, MdApartment, MdWarehouse } from 'react-icons/md';

const iconMap = {
  rumah: {
    icon: <MdHome size={18} className="text-blue-600 mr-1" />, // Smaller icon for list view
  },
  retail: {
    icon: <MdStorefront size={18} className="text-emerald-500 mr-1" />,
  },
  ruko: {
    icon: <MdApartment size={18} className="text-orange-500 mr-1" />,
  },
  aset: {
    icon: <MdWarehouse size={18} className="text-purple-600 mr-1" />,
  },
};

const PatunganCard = ({ data }) => {
  const iconInfo = iconMap[data.type] || iconMap["aset"];

  const percent =
    data.terkumpul && data.totalPrice && data.totalPrice !== 0
      ? Math.min(100, (data.terkumpul / data.totalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-transform duration-200 hover:scale-[1.005] active:scale-[0.995] group cursor-pointer w-full mx-auto">
      {/* Reduced shadow, slightly less hover scale for list */}
      <div className="flex flex-col md:flex-row"> {/* Allow horizontal layout on larger screens if needed */}
        {/* Image Section - Adjust height for mobile list */}
        <div className="relative h-36 md:h-full w-full md:w-2/5 overflow-hidden flex-shrink-0">
          <img
            src={data.banner && data.banner[0] ? data.banner[0] : 'https://via.placeholder.com/300x150?text=No+Image'}
            alt={data.title || 'Patungan Property'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Sisa Slot Badge - Simplified placement */}
          {data.sisaSlot > 0 && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-0.5 text-xs font-bold rounded-bl-lg shadow-sm z-10">
              Sisa {data.sisaSlot} Slot
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 flex-1 flex flex-col justify-between"> {/* Smaller padding, flex-1 to take remaining width */}
          <div>
            {/* Title */}
            <h3 className="text-base font-bold text-gray-900 mb-1 truncate leading-tight">
              {data.title}
            </h3>
            {/* Description - Smaller font, tighter line-clamp */}
            <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-snug">
              {data.keterangan}
            </p>
          </div>

          {/* Price Details - Reduced size and margin */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3"> {/* Smaller gap, padding */}
            <div className="text-center">
              <div className="text-gray-500 text-xs mb-0.5">Harga / Lembar</div>
              <div className="font-bold text-sm text-gray-900"> {/* Smaller font */}
                Rp {data.targetPay ? data.targetPay.toLocaleString('id-ID') : '0'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-xs mb-0.5">Total Aset</div>
              <div className="font-bold text-sm text-gray-900"> {/* Smaller font */}
                Rp {data.totalPrice ? data.totalPrice.toLocaleString('id-ID') : '0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatunganCard;