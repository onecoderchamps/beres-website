// src/component/EventsSection.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getData, postData } from '../api/service'; // Pastikan path benar

const EventsSection = ({events}) => {
  // const [events, setEvents] = useState([]);
  console.log("EventsSection events:", events);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Untuk menampilkan detail event
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false); // Untuk konfirmasi gabung
  const [processingJoin, setProcessingJoin] = useState(false); // Untuk loading state saat gabung

  const scrollContainerRef = useRef(null); // Ref untuk container scroll

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getData('event'); // Endpoint event
      if (res && res.data && Array.isArray(res.data)) {
        // Filter events that are not in the past
        const futureEvents = res.data.filter(event => new Date(event.dueDate) >= new Date());
        // Sort by dueDate to show upcoming events first
        futureEvents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        // setEvents(futureEvents);
      } else {
        // setEvents([]);
        setError('Data event tidak ditemukan atau format tidak sesuai.');
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError('Gagal memuat data event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- Countdown Logic ---
  const calculateTimeLeft = useCallback((dueDate) => {
    const difference = +new Date(dueDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, []);

  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const timers = events.map(event => {
      const interval = setInterval(() => {
        setTimeRemaining(prev => ({
          ...prev,
          [event.id]: calculateTimeLeft(event.dueDate)
        }));
      }, 1000);
      return interval;
    });

    // Initial calculation
    events.forEach(event => {
      setTimeRemaining(prev => ({
        ...prev,
        [event.id]: calculateTimeLeft(event.dueDate)
      }));
    });

    return () => timers.forEach(interval => clearInterval(interval));
  }, [events, calculateTimeLeft]);

  // --- Helper Functions for Formatting ---
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- Handlers ---
  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  const handleJoinClick = () => {
    setShowJoinConfirmation(true);
  };

  const handleCancelJoin = () => {
    setShowJoinConfirmation(false);
  };

  const handleConfirmJoin = async () => {
    if (!selectedEvent) return;

    setProcessingJoin(true);
    try {
      const formData = {
        idEvent: selectedEvent.id,
      };
      const res = await postData('Transaksi/Event', formData); // Asumsi postData mengembalikan respons yang bisa di-check
      if (res && res.code === 200) { // Asumsi sukses jika code 200
        alert(`Berhasil gabung event "${selectedEvent.name}"!`);
      } else {
        // Handle specific error messages from API if available
        alert(`Gagal gabung event: ${res || 'Terjadi kesalahan tidak dikenal.'}`);
      }
      setShowJoinConfirmation(false);
      setSelectedEvent(null);
      fetchEvents(); // Refresh event list in case the event state changed (e.g., full)
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Gagal gabung event: " + (error.response?.data?.message || error || "Terjadi kesalahan koneksi."));
    } finally {
      setProcessingJoin(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-500">Memuat event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 my-2" role="alert">
        <p className="font-bold">Error!</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-500">Belum ada event tersedia saat ini.</p>
      </div>
    );
  }

  // --- JSX for Event List ---
  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
      >
        {events.map((event) => {
          const timeLeft = timeRemaining[event.id] || {};
          const isEventOver = !(timeLeft.days || timeLeft.hours || timeLeft.minutes || timeLeft.seconds);

          if (isEventOver) return null; // Don't render event if time is up

          return (
            <div
              key={event.id}
              // Tambahkan `w-full flex-shrink-0` untuk setiap item carousel
              // `snap-center` untuk snapping
              className="w-full flex-shrink-0 snap-center px-4 md:px-0 md:w-1/2 lg:w-1/3 xl:w-1/4
                         cursor-pointer transform transition-transform duration-200 hover:scale-[1.01] active:scale-98"
              onClick={() => handleCardClick(event)}
            >
              {/* EventCard JSX (inline) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden w-full mx-auto hover:shadow-lg transition-shadow duration-200">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-40 object-cover" // Ubah tinggi gambar agar lebih proporsional
                />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-base truncate mb-1">
                    {event.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">📅</span> {formatDate(event.dueDate)}
                  </p>
                  <p className="text-sm font-bold text-purple-600 mb-2">
                    {formatPrice(event.price)}
                  </p>
                  {/* Countdown Timer */}
                  <div className="text-sm font-semibold text-center text-red-600 bg-red-50 p-2 rounded-md">
                    {Object.keys(timeLeft).length > 0 ? (
                      `Waktu Tersisa: ${timeLeft.days || '0'} Hari ${timeLeft.hours || '0'} Jam ${timeLeft.minutes || '0'} Menit ${timeLeft.seconds || '0'} Detik`
                    ) : (
                      'Event Telah Berakhir!'
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Event Detail Modal JSX (Conditional Render) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl transform scale-95 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="w-full h-48 md:h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-colors"
                aria-label="Tutup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{selectedEvent.name}</h3>
              <p className="text-base text-purple-700 font-semibold mb-4">Biaya Daftar {formatPrice(selectedEvent.price)}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Tanggal:</span> {formatDate(selectedEvent.dueDate)}
                </div>
                <div className="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Lokasi:</span> {selectedEvent.location || 'Online / Akan diumumkan'}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-2">Deskripsi Event:</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEvent.desc}</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseDetail}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={handleJoinClick}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 font-semibold"
                >
                  Gabung Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Join Event Confirmation Modal JSX (Conditional Render) --- */}
      {selectedEvent && showJoinConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center transform scale-95 animate-scale-in">
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Gabung Event</h3>
              <p className="mb-6 text-gray-700 leading-relaxed">
                Anda akan transfer saldo sebesar <br />
                <strong className="text-xl text-purple-600 block my-2">{formatPrice(selectedEvent.price)}</strong> <br />
                untuk gabung event <strong className="text-purple-700">"{selectedEvent.name}"</strong>.
                <br />Setuju atau tidak?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCancelJoin}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
                  disabled={processingJoin}
                >
                  Tidak Setuju
                </button>
                <button
                  onClick={handleConfirmJoin}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processingJoin}
                >
                  {processingJoin ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Setuju'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Animations - consider moving to a global CSS file */}
      <style jsx>{`
          @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
              animation: fadeIn 0.2s ease-out forwards;
          }
          .animate-scale-in {
              animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
      `}</style>
    </>
  );
};

export default EventsSection;