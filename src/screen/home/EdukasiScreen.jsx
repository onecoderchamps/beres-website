import React, { useState } from 'react';
import BackButton from '../../component/BackButton'; // Pastikan path ini benar
import { X } from 'lucide-react'; // Icon untuk tombol close modal

// Objek untuk menentukan warna badge berdasarkan tipe materi
const badgeColor = {
    video: 'bg-red-600', // Lebih gelap, lebih solid
    pdf: 'bg-blue-600',  // Lebih gelap, lebih solid
    text: 'bg-green-600', // Lebih gelap, lebih solid
};

// Data edukasi Anda
const edukasiData = [
    {
        id: '1',
        title: 'STRATEGI PERCEPATAN BISNIS',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852eda6692de1f78365b8de',
        sourceBy: 'By Dudi Suparhadi',
        source: `
1️⃣
1.BERES-INVESTOR-KOMUNITAS 
2.BERES-INVESTOR-BANK
3.BERES-INVESTOR-DEBITUR
2️⃣
STRATEGI BRANDING :
1.ATM CO-BRANDING 
2.BACK TO BACK DEPOSITO,EMAS,CC
3.PLATFORM
3️⃣
STRATEGI BISNIS :
1.SEMINAR BERES DI KAMPUS
2.SEMINAR BERES DI KOMUNITAS 
3.SEMINAR BERES DI INSTANSI,DLL
4️⃣
STRATEGI CLOSING 
1.SEMINAR NPL REVOLUTION 
2.WORKSHOP NPL REVOLUTION 
3.MEMBERSHIP BERES
5️⃣
STRATEGI KOMISI
1.KOMISI SEMINAR 10%
2.KOMISI WORKSHOP 10%
3.KOMISI PENJUALAN ASET BERES 5%
6️⃣
TEAM INTI BERES :
1.TEAM MODAL
2.TEAM BISNIS
3.TEAM ASSET
7️⃣
TEAM MARKETING 
1.DUDI
2.INVESTOR
3.KOMUNITAS
8️⃣
STRATEGI UMADHATU 
1.KAMPUNG INGGRIS 
2.VILLA GRATIS MOTOR PCX/VARIO
3.RENTAL VILLA DAN BUYBACK VILLA*
9️⃣
STRATEGI MUSTIKA ESTATE 
1.DISKON PROPERTI 
2.HADIAH EMAS LM
3.HADIAH MOTOR ATAU MOBIL/RUMAH
🔟
1.KOPDAR
2.TRAVELING
3.MAKAN-MAKAN`,
    },
    {
        id: '2',
        title: 'Investasi Rumah Tanpa Modal',
        type: 'video',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', // Contoh thumbnail YouTube
        sourceBy: 'By Kasisolusi',
        source: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=57s', // Contoh URL YouTube
    },
    {
        id: '3',
        title: 'Yuk Mengenal BERES',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852ed9e692de1f78365b8dc',
        sourceBy: 'By Dudi Suparhadi',
        source: `
Bukan hanya sekedar kata,tapi juga Jargon,Semangat dan Doa,yg akan membuat sesuatu dari yg tidak beres menjadi BERES

Beres terdiri dari 5 huruf :
Beli
Emas
Rumah/Ruko/Resort 
Edukasi 
Sedekah/Sharing

Semoga BERES menjadi Motivasi dan Bahan bakar untuk percepatan menjadi sukses dan kaya dengan strategi dan cara :
BELI ( bukan utang,andaikan terpaksa utang,biarkan orang lain yg utang ke bank,bank nya bayar ke kita cash.
Andaikan terpaksa utang,amankan dengan management ⅓).

EMAS
(Semua bisa memulai langkah kecil dg strategi Arisan dan Patungan emas untuk membeli aset properti/rumah/ruko,aset produktif)

RUMAH
Rumah/Ruko/Resort/aset kita beli secara cash dengan sistem Arisan atau Patungan 

EDUKASI
Sebagai strategi dan cara untuk menjalankan sistem bisnis beres secara nasional bahkan internasional 

SEDEKAH/SHARING
Sedekah/Sharing sebagai semangat,bahwa kita punya kewajiban berbagi ilmu,berbagi pengalaman,berbagi uang,berbagi bantuan yg bermanfaat,agar saudara2 kita yg belum sukses dan kaya,bisa berubah kehidupannya menjadi lebih baik lagi.

Ciputat,Indonesia 17-8-2024
#Original Dudi patunganproperti 
#BERESin Indonesia,Indonesia BERES.`,
    },
    {
        id: '4',
        title: '3 GRAND DESIGN BERES',
        type: 'text',
        thumbnail: 'https://apiberes.coderchamps.co.id/api/v1/file/review/6852eda6692de1f78365b8de',
        sourceBy: 'By Dudi Suparhadi',
        source: `3 GRAND DESIGN BERES
1️⃣ MODAL :
-INVESTOR 
-KOPERASI
-BANK
-SPONSOR 
-LAIN-LAIN

2️⃣ BISNIS :
-SEMINAR
-E-BOOK
-JASA
-EDUKASI
-DEVELOPER 

3️⃣ ASSET (for printing the money) :
-NPL
-RUMAH
-RUKO
-HOTEL
-VILLA

Apapun itu,kuncinya kuasai 3 ini :
1.Modal
Darimana modalnya ?
Modal yg aman dan terukur,bisa sistem apapun,yg penting saling untung menguntungkan agar berkah.

2.Bisnis
Bisnis apa yg modalnya relatif kecil bahkan tanpa modal.
Bisnis yg benar-benar kita jiwai,nikmati,dan sesuai passion kita.

Asset
Asset apa yg bisa di bangun bisnis di atas aset tsb.
(Istilahnya asset produktif dan punya cashflow)

Kalau kita sdh punya 3 sumber ini,sy yakin kita semua bisa sukses dan kaya,insya Allaah.

Inilah sinergi segitiga emas Beres.

#Original Dudi patunganproperti
#Semua akan BERES pada waktunya 
#Beres,memudahkan dan menguntungkan
Bukit indah,1 juni 2025
Masjid Jabal Nur.`,
    },
];

const EdukasiScreen = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const closeModal = () => setSelectedItem(null);

    // Fungsi untuk mendapatkan URL embed YouTube yang benar
    function getYouTubeEmbedUrl(url) {
        try {
            const urlObj = new URL(url);
            let videoId = '';
            let startTime = '';

            // Handle standard YouTube watch URLs
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('www.youtube.com')) {
                videoId = urlObj.searchParams.get('v');
                const t = urlObj.searchParams.get('t');
                if (t) {
                    startTime = `?start=${parseInt(t.replace('s', '')) || 0}`;
                }
            }
            // Handle youtu.be short URLs
            else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}${startTime}`;
            }
            return url; // Fallback jika tidak dikenali
        } catch (error) {
            console.error("Error parsing YouTube URL:", error);
            return url; // Fallback jika terjadi error parsing
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2"> {/* Latar belakang abu-abu muda */}
            <BackButton title={'Materi Edukasi'} />

            {/* Grid Materi Edukasi */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {edukasiData.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {/* Thumbnail */}
                        <div className="w-full h-48 overflow-hidden">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Badge Tipe Materi */}
                        <div
                            className={`absolute top-3 left-3 px-3 py-1 text-xs text-white rounded-full font-bold capitalize shadow-md ${badgeColor[item.type]} flex items-center space-x-1`}
                        >
                            {/* Tambahkan icon kecil di samping teks badge (opsional) */}
                            {item.type === 'video' && <span className="text-white">▶️</span>}
                            {item.type === 'pdf' && <span className="text-white">📄</span>}
                            {item.type === 'text' && <span className="text-white">📝</span>}
                            <span>{item.type}</span>
                        </div>

                        {/* Konten Kartu */}
                        <div className="p-4 bg-white flex flex-col justify-between h-auto">
                            <h2 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 leading-snug">
                                {item.title}
                            </h2>
                            <p className="text-sm text-gray-600 font-medium">{item.sourceBy}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Modal Detail Materi */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full relative max-h-[95vh] overflow-hidden flex flex-col animate-scale-in">
                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4">
                                {selectedItem.title}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                                aria-label="Tutup"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Konten Modal */}
                        <div className="p-4 flex-1 overflow-y-auto"> {/* Konten bisa discroll */}
                            {selectedItem.type === 'video' && (
                                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-4">
                                    <iframe
                                        className="w-full h-full"
                                        src={getYouTubeEmbedUrl(selectedItem.source)}
                                        title={selectedItem.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {selectedItem.type === 'pdf' && (
                                <iframe
                                    src={selectedItem.source}
                                    className="w-full h-[70vh] border border-gray-300 rounded-lg shadow-md"
                                    title={selectedItem.title}
                                ></iframe>
                            )}

                            {selectedItem.type === 'text' && (
                                <div className="prose max-w-none text-gray-800 leading-relaxed text-base">
                                    <pre className="whitespace-pre-wrap font-sans text-sm md:text-base bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                                        {selectedItem.source}
                                    </pre>
                                </div>
                            )}
                            {/* Detail Sumber */}
                            <p className="text-sm text-gray-500 mt-4 text-right">
                                Sumber: <span className="font-semibold text-gray-700">{selectedItem.sourceBy}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EdukasiScreen;