import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <div className="mb-6">
          {/* Anda bisa menambahkan ikon di sini, contohnya dari React Icons */}
          {/* Misalnya, jika Anda memiliki FaTools dari 'react-icons/fa' */}
          {/* <FaTools className="mx-auto text-yellow-500 text-6xl mb-4" /> */}
          <svg
            className="mx-auto text-yellow-500 text-6xl mb-4 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            width="80"
            height="80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.525.322 1.018.59 1.518.775C10.742 5.096 10.51 4.752 10.325 4.317z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Sistem Sedang Dalam Pemeliharaan
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan peningkatan sistem
          untuk memberikan Anda pengalaman yang lebih baik.
        </p>
        <p className="text-md text-gray-500">
          Silakan coba lagi beberapa saat.
        </p>
        {/* Opsional: Tombol refresh atau link ke halaman status */}
        {/* <button
          onClick={() => window.location.reload()}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
        >
          Coba Lagi
        </button> */}
      </div>
    </div>
  );
};

export default MaintenancePage;