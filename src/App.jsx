// src/App.js
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomeScreen from "./screen/home/HomeScreen";
import LoginScreen from "./screen/auth/LoginScreen";
import OtpVerificationScreen from "./screen/auth/OtpScreen";
import HomeSelector from "./screen/HomeSelector";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSelector />} />
        <Route path="/HomeScreen" element={<HomeScreen />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/OtpScreen" element={<OtpVerificationScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
