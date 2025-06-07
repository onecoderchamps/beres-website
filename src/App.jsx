// src/App.js
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomeScreen from "./screen/home/HomeScreen";
import LoginScreen from "./screen/auth/LoginScreen";
import OtpVerificationScreen from "./screen/auth/OtpScreen";
import HomeSelector from "./screen/HomeSelector";
import SaldoScreen from "./screen/saldo/SaldoScreen";
import KoperasiScreen from "./screen/koperasi/KoperasiScreen";
import RegisterScreen from "./screen/auth/RegisterScreen";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSelector />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/RegisterScreen" element={<RegisterScreen />} />

        <Route path="/OtpScreen" element={<OtpVerificationScreen />} />
        <Route path="/SaldoScreen" element={<SaldoScreen />} />
        <Route path="/KoperasiScreen" element={<KoperasiScreen />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
