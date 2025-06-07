import React from 'react';

const iconMap = {
  rumah: {
    name: 'home-outline', // (you might use heroicons or any icon lib in web)
    color: 'text-green-500',
  },
  retail: {
    name: 'storefront-outline',
    color: 'text-blue-500',
  },
  ruko: {
    name: 'office-building-marker',
    color: 'text-yellow-500',
  },
  aset: {
    name: 'warehouse',
    color: 'text-purple-600',
  },
};

const ArisanComponent = ({ data }) => {
  const iconInfo = iconMap[data.type] || iconMap['aset'];

  return (
    <div className="bg-white rounded-xl shadow-md border border-black/20 overflow-hidden">
      <div className="relative">
        <img
          src={data.banner[0]}
          alt={data.title}
          className="w-full object-cover"
          style={{ height: '160px' }}
        />

        {/* Ribbon "Sisa Slot" */}
        {data.sisaSlot > 0 && (
          <div
            className="absolute top-2 right-[-40px] bg-yellow-400 px-10 py-1 rounded shadow-md text-black font-bold text-xs text-center"
            style={{ transform: 'rotate(45deg)' }}
          >
            Sisa {data.sisaSlot}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-black font-bold text-lg truncate">{data.title}</h3>
        <p className="text-gray-500 mb-4 truncate">{data.keterangan}</p>

        <div className="flex justify-between">
          <div className="flex-1 text-center">
            <p className="text-gray-600 text-sm">Bidang</p>
            <p className="text-black font-bold text-md mt-1">
              {data.keterangan}
            </p>
          </div>

          <div className="flex-1 text-center">
            <p className="text-gray-600 text-sm">Iuran</p>
            <p className="text-black font-bold text-md mt-1">
              Rp {data.totalPrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArisanComponent;
