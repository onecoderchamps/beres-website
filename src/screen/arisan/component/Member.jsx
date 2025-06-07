import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../api/service';
import { Check, X } from 'lucide-react';

const Member = ({ data, getArisanDatabase }) => {
  const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
  const [userData, setUserData] = useState(null);

  const getDatabase = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const handleBayar = async (items) => {
    const formData = {
      idTransaksi: data.id,
      idUser: items?.idUser,
    };
    try {
      const response = await postData('Arisan/PayCompleteArisan', formData);
      alert(response.message);
      getArisanDatabase();
    } catch (error) {
      console.log(error);
      alert(error?.data?.errorMessage?.Error || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  return (
    <div className="overflow-x-auto px-4 pt-6">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b">No</th>
            <th className="p-2 border-b text-left">Nama</th>
            <th className="p-2 border-b">Slot</th>
            <th className="p-2 border-b text-center">Iuran {bulanSekarang}</th>
            <th className="p-2 border-b text-center">Terima</th>
          </tr>
        </thead>
        <tbody>
          {data.memberArisan.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 text-center">{index + 1}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-center">{item.jumlahLot}</td>
              <td className="p-2 text-center">
                {item.isMonthPayed ? (
                  <Check size={16} className="text-green-600 inline" />
                ) : (
                  <X size={16} className="text-red-600 inline" />
                )}
              </td>
              <td className="p-2 text-center">
                {item.isPayed ? (
                  <Check size={16} className="text-green-600 inline" />
                ) : userData?.role === '2' ? (
                  <button
                    onClick={() => handleBayar(item)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                ) : (
                  <X size={16} className="text-red-600 inline" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Member;
