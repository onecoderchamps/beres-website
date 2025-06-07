import React, { useState } from 'react';
import BackButton from '../../component/BackButton';
import { X } from 'lucide-react';

const badgeColor = {
    video: 'bg-red-500',
    pdf: 'bg-blue-500',
    text: 'bg-green-500',
};

const edukasiData = [
    {
        id: '1',
        title: 'STRATEGI PERCEPATAN BISNIS',
        type: 'text',
        thumbnail: 'https://beres-backend-609517395039.asia-southeast2.run.app/api/v1/file/review/68444f1920182a2f163e0c1e',
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
        thumbnail: 'https://img.youtube.com/vi/75LvJLlCJnY/0.jpg',
        sourceBy: 'By Kasisolusi',
        source: 'https://www.youtube.com/watch?v=75LvJLlCJnY&t=57s',
    },
    {
        id: '3',
        title: 'Yuk Mengenal BERES',
        type: 'text',
        thumbnail: 'https://beres-backend-609517395039.asia-southeast2.run.app/api/v1/file/review/684024254b09c325fbb56513',
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
        thumbnail: 'https://beres-backend-609517395039.asia-southeast2.run.app/api/v1/file/review/684028f14b09c325fbb56519',
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

    function getYouTubeEmbedUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                const t = urlObj.searchParams.get('t'); // misal: "57s"
                let start = 0;
                if (t) {
                    // konversi t "57s" jadi angka 57
                    start = parseInt(t.replace('s', '')) || 0;
                }
                return `https://www.youtube.com/embed/${videoId}?start=${start}`;
            } else if (urlObj.hostname === 'youtu.be') {
                // short url youtube
                const videoId = urlObj.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return url; // fallback
        } catch {
            return url; // fallback
        }
    }


    return (
        <div className="min-h-screen bg-white p-4">
            <BackButton title={'Materi Edukasi'} />

            {/* Grid */}
            <div className="grid md:grid-cols-1 gap-6">
                {edukasiData.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition text-left"
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                        <div
                            className={`absolute top-2 left-2 px-3 py-1 text-sm text-white rounded-full font-semibold capitalize shadow-md ${badgeColor[item.type]}`}
                        >
                            {item.type}
                        </div>
                        <div className="p-4 bg-white">
                            <h2 className="font-semibold text-green-900">{item.title}</h2>
                            <h1 className="text-sm text-gray-900">{item.sourceBy}</h1>

                        </div>
                    </button>
                ))}
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-green-900">
                                {selectedItem.title}
                            </h3>
                            <button onClick={closeModal}>
                                <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {selectedItem.type === 'video' && (
                                <div className="aspect-video">
                                    <iframe
                                        className="w-full h-full rounded-md"
                                        src={getYouTubeEmbedUrl(selectedItem.source)}
                                        title={selectedItem.title}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {selectedItem.type === 'pdf' && (
                                <iframe
                                    src={selectedItem.source}
                                    className="w-full h-[70vh] border rounded-md"
                                    title={selectedItem.title}
                                ></iframe>
                            )}

                            {selectedItem.type === 'text' && (
                                <div className="prose max-w-none text-gray-700">
                                    <pre className="whitespace-pre-wrap">{selectedItem.source}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EdukasiScreen;
