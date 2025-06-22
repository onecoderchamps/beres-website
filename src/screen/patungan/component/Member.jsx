import React, { useEffect, useState } from 'react';
import { getData, postData } from '../../../api/service';
import { CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react'; // Import icons for better visuals
import { FaSpinner } from 'react-icons/fa';

const Member = ({ data, getPatunganDatabase }) => {
  const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user data (for role check)
  const getDatabase = async () => {
    setLoadingUser(true);
    try {
      const response = await getData('auth/verifySessions');
      setUserData(response.data);
    } catch (error) {
      console.error("Error verifying user session:", error); // Log error for debugging
      // alert(error.response?.data?.message || "Terjadi kesalahan saat memverifikasi sesi."); // Optional alert
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  // Handle 'Approve' payment (for Admin/Role 2)
  const handleBayar = async (itemToApprove) => {
    // Confirmation dialog for admin action
    if (!window.confirm(`Yakin ingin menyetujui pembayaran ${itemToApprove.name} untuk patungan ini?`)) {
      return;
    }

    const formData = {
      idTransaksi: data.id, // 'data.id' here refers to Patungan ID, which seems consistent with API
      idUser: itemToApprove?.idUser, // User ID of the member whose payment is being approved
    };
    try {
      const response = await postData('Patungan/PayCompletePatungan', formData);
      alert(response.message || "Pembayaran berhasil disetujui!");
      getPatunganDatabase(); // Refresh parent component data to update list
    } catch (error) {
      console.error("Error approving payment:", error); // Log detailed error
      alert(error?.response?.data?.errorMessage?.Error || "Terjadi kesalahan saat menyetujui pembayaran.");
    }
  };

  // Dummy data for stock development overview (replace with actual data if available)
  const dummyStockData = {
    currentValuePerLot: data.targetPay * 1.05, // Example: 5% increase from targetPay
    initialValuePerLot: data.targetPay,
    growthPercentage: 5, // Example growth
    lastUpdate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  // Ensure data.memberPatungan is an array before mapping
  const members = Array.isArray(data.memberPatungan) ? data.memberPatungan : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6"> {/* Main card container */}
      {/* Stock Development Overview Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <TrendingUp className="w-6 h-6 mr-3 text-purple-600" /> Perkembangan Saham Umum
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between">
          <p className="text-sm text-blue-700 font-medium">Nilai Saat Ini per Lembar</p>
          <p className="text-xl font-bold text-blue-800 mt-1">
            Rp {dummyStockData.currentValuePerLot.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex flex-col justify-between">
          <p className="text-sm text-green-700 font-medium">Kenaikan</p>
          <p className="text-xl font-bold text-green-800 mt-1">
            +{dummyStockData.growthPercentage}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
          <p className="text-sm text-gray-600 font-medium">Nilai Awal per Lembar: Rp {dummyStockData.initialValuePerLot.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-600 mt-1">Update Terakhir: {dummyStockData.lastUpdate}</p>
          <p className="text-sm text-gray-500 mt-2 italic">
            *Data ini adalah estimasi perkembangan umum, nilai aktual dapat bervariasi.
          </p>
        </div>
      </div>

      {/* Member List Section */}
      <h2 className="font-bold text-2xl text-gray-800 mb-5 border-b pb-3 border-gray-100 flex items-center">
        <Users className="w-6 h-6 mr-3 text-purple-600" /> Daftar Anggota
      </h2>
      {loadingUser ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-10 text-gray-600 italic">
          Belum ada anggota yang bergabung dalam Patungan ini.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Anggota</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Lembar Saham</th>
                {/* Re-introducing optional columns with better styling */}
                {/* <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Iuran Bulan Ini</th> */}
                {/* <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status Pembayaran</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {members.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors"> {/* Use item.id if available for better keying */}
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{item.jumlahLot}</td>
                  {/* Optional Column 1: Iuran Bulan Ini */}
                  {/*
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isMonthPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Lunas
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-red-600">
                        <XCircle className="w-5 h-5 mr-1" /> Belum Lunas
                      </div>
                    )}
                  </td>
                  */}
                  {/* Optional Column 2: Status Pembayaran / Approval */}
                  {/*
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    {item.isPayed ? (
                      <div className="flex items-center justify-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" /> Disetujui
                      </div>
                    ) : userData?.role === '2' ? ( // Check if current user is admin (role '2')
                      <button
                        onClick={() => handleBayar(item)}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold 
                                   hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Setujui
                      </button>
                    ) : ( // For non-admin, if not approved
                      <div className="flex items-center justify-center text-yellow-600">
                        <XCircle className="w-5 h-5 mr-1" /> Menunggu
                      </div>
                    )}
                  </td>
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Member;