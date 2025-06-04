import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postData } from '../../api/service';
import BackButton from '../../component/BackButton';

const OtpVerificationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phonenumber = location.state?.phonenumber || localStorage.getItem('phonenumber'); // fallback

  const [form, setForm] = useState({ otp: '' });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleInputChange = (e) => {
    setForm({ ...form, otp: e.target.value });
  };

  const verifyOtp = async () => {
    if (!form.otp.trim()) {
      alert("OTP tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        phonenumber,
        code: form.otp
      };
      const response = await postData('otp/validateWA', formData);
      localStorage.setItem('accessTokens', response.message.accessToken);
      setLoading(false);
      navigate('/HomeScreen'); // atau halaman berikutnya
    } catch (error) {
      alert(error?.response?.data?.message || "Terjadi kesalahan saat memverifikasi OTP.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await postData('otp/sendWA', { phonenumber });
      setTimer(60);
    } catch (error) {
      alert(error.message || "Gagal mengirim ulang OTP.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={styles.container}>
      <BackButton title={"Verifikasi OTP"} />
      <h2>Masukkan OTP yang kami kirim melalui WhatsApp kamu</h2>
      <input
        type="text"
        placeholder="Masukkan OTP"
        value={form.otp}
        onChange={handleInputChange}
        style={styles.input}
        disabled={loading}
      />
      <div style={styles.row}>
        <strong>{timer === 0 ? '' : formatTime(timer)}</strong>
        <button onClick={handleResend} disabled={timer > 0} style={{ opacity: timer > 0 ? 0.5 : 1 }}>
          Kirim Ulang
        </button>
      </div>
      <button onClick={verifyOtp} disabled={loading} style={{ ...styles.button, ...(loading && styles.buttonLoading) }}>
        {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    padding: 20,
    backgroundColor: '#fff'
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc',
    marginBottom: 20,
    fontSize: 16
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F3C623',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer'
  },
  buttonLoading: {
    backgroundColor: '#777',
    cursor: 'not-allowed'
  }
};

export default OtpVerificationScreen;
