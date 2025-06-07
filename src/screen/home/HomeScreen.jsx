import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../../component/ImageSlider';
import MembershipCard from '../../component/Membership';
import CategorySelector from '../../component/Category';
import { getData } from '../../api/service';
import PatunganCard from '../../component/PatunganView';
import ArisanComponent from '../../component/ArisanView';

function HomeScreen() {
  const navigate = useNavigate();
  const [patunganData, setPatunganData] = useState([]);
  const [arisanData, setArisanData] = useState([]);


  useEffect(() => {
    const getDatabasePatungan = async () => {
      try {
        const res2 = await getData('Patungan');
        setPatunganData(res2.data);
      } catch (error) {
        console.error("Gagal fetch Patungan:", error);
      }
    };

    const getDatabaseArisan = async () => {
      try {
        const res2 = await getData('Arisan');
        setArisanData(res2.data);
      } catch (error) {
        console.error("Gagal fetch Patungan:", error);
      }
    };

    const checkAuth = async () => {
      const user = await localStorage.getItem('accessTokens');
      if (!user) {
        navigate('/LoginScreen');
      }
    };

    checkAuth();
    getDatabasePatungan();
    getDatabaseArisan();
  }, [navigate]);

  return (
    <div className="bg-white">
      <ImageSlider />
      <MembershipCard />

      <h2 className="text-xl font-bold text-gray-900 mt-6 ml-3 pl-1">Telusuri Kategori</h2>
      <CategorySelector />

      <h2 className="text-xl font-bold text-gray-900 mt-6 ml-3 mb-2 pl-1">Promo Patungan</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 pl-1 ml-3">
        {patunganData.map((item, idx) => (
          <div
            key={idx}
            className="flex-none w-72 cursor-pointer"
            onClick={() => navigate(`/PatunganDetail/${item.id}`)}
          >
            <PatunganCard data={item} />
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mt-6 ml-3 mb-2 pl-1">Promo Arisan</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 pl-1 ml-3">
        {arisanData
          .map((item, idx) =>
            <div
              key={idx}
              className="flex-none w-50"
              onClick={() => navigate(`/ArisanDetail/${item.id}`)}
            >
              <ArisanComponent data={item} />
            </div>
          )}
      </div>
      <h2 className="text-sm text-center text-gray-900 mt-6 ml-3 mb-2 pl-1">PT PATUNGAN PROPERTI INTERNASIONAL</h2>
    </div>
  );
}

export default HomeScreen;
