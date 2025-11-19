import React from 'react';

// Syarat & Ketentuan Page for Beres
// Tailwind CSS is used for styling (assumes Tailwind is set up in the project).

const terms = {
    title: 'Syarat & Ketentuan',
    content: [
        'Dengan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan yang berlaku.',
        'Aplikasi ini digunakan untuk: (a) Transaksi pembelian dan penjualan properti; (b) Partisipasi dalam crowdfunding investasi properti; (c) Akses informasi seputar koperasi dan kegiatan usaha yang relevan.',
        'Pengguna wajib mendaftarkan akun dengan data yang benar, lengkap, dan dapat dipertanggungjawabkan. Koperasi berhak menolak atau menonaktifkan akun jika ditemukan pelanggaran terhadap ketentuan.',
        'Data pribadi Anda dilindungi sesuai standar keamanan yang berlaku. Koperasi tidak akan menjual atau menyebarkan data pribadi tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum.',
        'Setiap investasi mengandung risiko kerugian sebagian atau seluruh modal. Pengguna diwajibkan membaca prospektus/informasi proyek sebelum berinvestasi. Hasil atau imbal balik investasi tidak dijamin dan bergantung pada kinerja proyek.',
        'Semua transaksi wajib dilakukan melalui saluran resmi aplikasi. Koperasi tidak bertanggung jawab atas kerugian akibat transaksi di luar sistem aplikasi.',
        'Pengguna dilarang menggunakan aplikasi untuk tujuan ilegal, penipuan, atau pencucian uang, serta wajib menjaga kerahasiaan akun masing-masing.',
        'Koperasi tidak bertanggung jawab atas kerugian finansial akibat keputusan investasi pengguna dan tidak menjamin kenaikan nilai properti atau keuntungan investasi.',
        'Seluruh konten aplikasi (logo, desain, informasi) adalah milik koperasi dan dilindungi hukum. Dilarang menyalin, mendistribusikan, atau menggunakan konten tanpa izin resmi.',
        'Koperasi berhak mengubah S&K sewaktu-waktu untuk menyesuaikan dengan regulasi atau kebijakan baru. Perubahan akan diberitahukan melalui aplikasi.',
        'Sengketa yang timbul dari penggunaan aplikasi akan diselesaikan terlebih dahulu melalui musyawarah. Jika tidak tercapai kesepakatan, penyelesaian dilakukan sesuai hukum yang berlaku di Indonesia.',
        "Dengan menekan tombol 'Saya Mengerti', Anda menyatakan setuju dengan seluruh ketentuan di atas dan bersedia mematuhinya."
    ]
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl h-full bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b">
                    <h1 className="text-2xl font-semibold">{terms.title}</h1>
                </div>


                <div className="flex-1 p-6 overflow-auto">
                    <ol className="space-y-4 list-decimal list-inside">
                        {terms.content.map((item, idx) => (
                            <li key={idx} className="text-gray-800 leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}
