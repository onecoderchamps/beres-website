import React from 'react';
import { MdHome, MdStorefront, MdApartment, MdWarehouse } from 'react-icons/md';

const iconMap = {
  rumah: {
    icon: <MdHome size={20} className="text-green-600 mr-2" />,
  },
  retail: {
    icon: <MdStorefront size={20} className="text-blue-500 mr-2" />,
  },
  ruko: {
    icon: <MdApartment size={20} className="text-orange-500 mr-2" />,
  },
  aset: {
    icon: <MdWarehouse size={20} className="text-purple-600 mr-2" />,
  },
};

const PatunganCard = ({ data }) => {
  const iconInfo = iconMap[data.type] || iconMap["aset"];
  const percent =
    data.terkumpul && data.totalPrice
      ? Math.min(100, (data.terkumpul / data.totalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-black/10 overflow-hidden w-full">
      <div className="relative">
        <img src={data.banner[0]} alt="Banner" className="w-full h-40 object-cover" />
        {data.sisaSlot > 0 && (
          <div className="absolute top-2 -right-8 rotate-45 bg-yellow-400 px-10 py-1 rounded shadow">
            <span className="text-xs font-bold text-black">Sisa {data.sisaSlot}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-base font-bold text-black truncate">{data.title}</h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="truncate">{data.keterangan}</span>
        </div>

        {percent > 0 && (
          <>
            <div className="text-xs text-right text-gray-500">{Math.round(percent)}%</div>
            <div className="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }} />
            </div>
          </>
        )}

        <div className="flex justify-between text-xs text-center">
          <div className="flex-1">
            <div className="text-gray-500">Harga / Lembar</div>
            <div className="font-bold text-black">
              Rp {data.targetPay.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-gray-500">Total Asset</div>
            <div className="font-bold text-black">
              Rp {data.totalPrice.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatunganCard;
