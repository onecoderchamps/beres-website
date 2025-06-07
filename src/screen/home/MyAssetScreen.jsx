import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../api/service';
import BackButton from '../../component/BackButton';

const AktifitasPage = () => {
    const [loading, setLoading] = useState(true);
    const [detailData, setDetailData] = useState([]);
    const [detailData2, setDetailData2] = useState([]);
    const navigate = useNavigate();

    const getArisanDatabase = async () => {
        try {
            const response = await getData('Arisan/ByUser');
            setDetailData(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
        }
    };

    const getPatunganDatabase = async () => {
        try {
            const response = await getData('Patungan/ByUser');
            setDetailData2(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getArisanDatabase(), getPatunganDatabase()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const combinedData = [...detailData, ...detailData2];

    const handleCardClick = (item) => {
        if (item.type === 'Arisan') {
            navigate('/ArisanDetail/'+item.id);
        } else if (item.type === 'Patungan') {
            navigate('/PatunganDetail/'+item.id);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <BackButton title={"My Asset"} />
            <div className="max-w-3xl mx-auto">
                {loading ? (
                    <div className="flex justify-center mt-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-800"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {combinedData.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                                onClick={() => handleCardClick(item)}
                            >
                                <div className="text-3xl mr-4">{item.icon}</div>
                                <div className="flex-1">
                                    <div className="text-green-900 font-semibold text-base">{item.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">{item.keterangan}</div>
                                    <div className="text-sm text-gray-600">{item.desc}</div>
                                </div>
                                <div className="text-yellow-500 font-bold text-sm ml-4 mt-1">
                                    {item.type === 'Arisan' ? 'ARISAN' : 'PATUNGAN'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AktifitasPage;
