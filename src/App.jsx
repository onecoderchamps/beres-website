// src/App.js
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomeScreen from "./screen/home/HomeScreen";
import LoginScreen from "./screen/auth/LoginScreen";
import OtpVerificationScreen from "./screen/auth/OtpScreen";
import HomeSelector from "./screen/HomeSelector";
import SaldoScreen from "./screen/saldo/SaldoScreen";
import KoperasiScreen from "./screen/koperasi/KoperasiScreen";
import RegisterScreen from "./screen/auth/RegisterScreen";
import PatunganScreen from "./screen/patungan/PatunganSceen";
import ArisanScreen from "./screen/arisan/ArisanSceen";
import SedekahScreen from "./screen/sedekah/SedekahScreen";
import ArisanDetail from "./screen/arisan/ArisanDetailScreen";
import PatunganDetail from "./screen/patungan/PatunganDetailScreen";
import AktifitasPage from "./screen/home/MyAssetScreen";
import AkunPage from "./screen/home/MyProfileScreen";
import EdukasiScreen from "./screen/home/EdukasiScreen";
import PPOBScreen from "./screen/ppob/PpobScreen";
import MaintenancePage from "./screen/Maintenance";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSelector />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/AktifitasPage" element={<AktifitasPage />} />
        <Route path="/AkunPage" element={<AkunPage />} />
        <Route path="/EdukasiScreen" element={<EdukasiScreen />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/RegisterScreen" element={<RegisterScreen />} />
        <Route path="/OtpScreen" element={<OtpVerificationScreen />} />
        <Route path="/SaldoScreen" element={<SaldoScreen />} />
        <Route path="/KoperasiScreen" element={<KoperasiScreen />} />
        <Route path="/PatunganScreen" element={<PatunganScreen />} />
        <Route path="/PatunganDetail/:id" element={<PatunganDetail />} />
        <Route path="/ArisanScreen" element={<ArisanScreen />} />
        <Route path="/ArisanDetail/:id" element={<ArisanDetail />} />
        <Route path="/SedekahScreen" element={<SedekahScreen />} />
        <Route path="/PPOBScreen" element={<PPOBScreen />} />
        {/* --- Rute Catch-All untuk Mengalihkan Jika Tidak Ada Yang Cocok --- */}
        {/* Ini harus menjadi Route terakhir di dalam <Routes> */}
        {/* <Route path="*" element={<MaintenancePage />} /> */}
        {/* Jika Anda ingin halaman 404 yang spesifik, gunakan: */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
