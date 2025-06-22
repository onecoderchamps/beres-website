import React, { useEffect, useState } from 'react';
import ArisanComponent from './ArisanComponent'; // Assuming ArisanComponent will also be styled separately
import { getData, postData } from '../../api/service';
import BackButton from '../../component/BackButton';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner, FaUsers, FaCalendarAlt } from 'react-icons/fa'; // Added icons

const ArisanScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Form states for adding new arisan
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keterangan, setKeterangan] = useState(''); // Additional description/notes
  const [targetLot, setTargetLot] = useState(''); // Number of slots/members
  const [targetAmount, setTargetAmount] = useState(''); // Amount per installment
  const [penagihanDateText, setPenagihanDateText] = useState(''); // Date format DD MM YYYY

  // File states (assuming these are handled by file input or similar, currently just arrays)
  const [bannerFiles, setBannerFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  // Data states for displaying arisan list and user info
  const [arisanData, setArisanData] = useState([]);
  const [userData, setUserData] = useState(null); // User session data

  useEffect(() => {
    getDatabase(); // Fetches user session data
    getDatabaseArisan(); // Fetches arisan initiatives
  }, []);

  // Fetches user session data
  const getDatabase = async () => {
    try {
      const res = await getData('auth/verifySessions');
      setUserData(res.data);
    } catch (err) {
      console.error("Error verifying session:", err);
      // alert(err.message || 'Terjadi kesalahan saat verifikasi sesi.'); // Keep alert for production if desired
    }
  };

  // Fetches arisan list data
  const getDatabaseArisan = async () => {
    setLoading(true); // Ensure loading state is active
    try {
      const res = await getData('Arisan');
      setArisanData(res.data);
    } catch (err) {
      console.error("Error fetching Arisan data:", err);
      alert(err.message || 'Gagal mengambil data arisan.');
      setArisanData([]); // Clear data on error
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  // Utility function for number formatting (already exists)
  const formatNumber = (val) => {
    if (!val) return '';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handles form submission for adding new arisan
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !targetLot || !targetAmount || !penagihanDateText.trim()) {
      alert('Harap isi semua kolom wajib: Judul, Deskripsi, Target Slot, Target Bulanan, dan Tanggal Penagihan.');
      return;
    }

    // Parse date: DD MM YYYY format
    const dateParts = penagihanDateText.trim().split(' ');
    if (dateParts.length !== 3) {
      alert('Format tanggal tidak valid. Gunakan format DD MM YYYY (contoh: 25 06 2025)');
      return;
    }
    const [dd, mm, yyyy] = dateParts;
    // Construct Date object in YYYY-MM-DD format for robustness
    const parsedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`); // Use T00:00:00Z for UTC start of day

    if (isNaN(parsedDate.getTime())) {
      alert('Tanggal yang dimasukkan tidak valid. Pastikan format DD MM YYYY benar (contoh: 25 06 2025).');
      return;
    }
    
    // Convert targetLot and targetAmount to numbers
    const numTargetLot = parseFloat(targetLot);
    const numTargetAmount = parseFloat(targetAmount);

    if (isNaN(numTargetLot) || numTargetLot <= 0) {
        alert('Target Slot harus berupa angka positif.');
        return;
    }
    if (isNaN(numTargetAmount) || numTargetAmount <= 0) {
        alert('Target Bulanan harus berupa angka positif.');
        return;
    }

    const body = {
      title: title.trim(),
      description: description.trim(),
      keterangan: keterangan.trim(),
      banner: bannerFiles, // Assuming this will contain URLs/paths after file upload
      document: documentFiles, // Assuming this will contain URLs/paths after file upload
      location: 'Default Location', // Consider making this dynamic if needed
      targetLot: numTargetLot,
      targetAmount: numTargetAmount,
      penagihanDate: parsedDate.toISOString(),
      isAvailable: true,
    };

    try {
      await postData('Arisan', body);
      alert('Sukses menambahkan arisan!');
      setModalVisible(false);
      resetForm();
      getDatabaseArisan(); // Refresh list after successful submission
    } catch (err) {
      console.error("Failed to add arisan:", err);
      alert(err.response?.data?.message || err.message || 'Gagal menambahkan arisan. Silakan coba lagi.');
    }
  };

  // Resets all form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setKeterangan('');
    setTargetLot('');
    setTargetAmount('');
    setPenagihanDateText('');
    setBannerFiles([]);
    setDocumentFiles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <BackButton title={"Arisan"} />

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <FaSpinner className="animate-spin text-purple-600 text-6xl" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 pt-6">

          {/* Arisan Grid */}
          {arisanData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {arisanData.map((item, index) =>
                item.sisaSlot > 0 && ( // Only show arisan with available slots
                  <div
                    key={item.id || index} // Use item.id if available, fallback to index
                    onClick={() => navigate('/ArisanDetail/' + item.id, { state: { data: item } })}
                    className="cursor-pointer transform hover:scale-[1.03] transition-transform duration-200 ease-in-out"
                  >
                    <ArisanComponent data={item} />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Belum ada arisan yang tersedia saat ini.</p>
              <p className="text-gray-500 mt-2">Ayo, buat arisan pertama Anda!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArisanScreen;