import React from 'react';

const iconMap = {
  rumah: {
    name: 'mdi:home-outline',
    color: '#4CAF50',
  },
  retail: {
    name: 'mdi:storefront-outline',
    color: '#2196F3',
  },
  ruko: {
    name: 'mdi:office-building-marker',
    color: '#FF9800',
  },
  aset: {
    name: 'mdi:warehouse',
    color: '#9C27B0',
  },
};

const ArisanComponent = ({ data }) => {
  const iconInfo = iconMap[data.type] || iconMap['aset'];

  return (
    <div className="rounded-xl bg-white shadow-md border border-black/10 overflow-hidden w-full">
      <div className="relative">
        <img
          src={data.banner[0]}
          alt="banner"
          className="w-full h-40 object-cover"
        />
        {data.sisaSlot > 0 && (
          <div className="absolute top-2 -right-8 transform rotate-45 bg-yellow-400 px-10 py-1 rounded shadow-md">
            <p className="text-xs font-bold text-black text-center">Sisa {data.sisaSlot}</p>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-base font-bold text-gray-900 truncate">{data.title}</h3>

        <div className="flex justify-between mt-2 text-sm">
          <div className="flex-1 text-center">
            <p className="text-gray-500">Bidang</p>
            <p className="text-black font-semibold truncate">{data.keterangan}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-gray-500">Iuran / Bulan</p>
            <p className="text-black font-semibold truncate">Rp {data.targetPay.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArisanComponent;
