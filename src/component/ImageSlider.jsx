import React, { useRef, useState, useEffect } from 'react';
import { getData } from '../api/service';

const ImageSlider = ({  }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [data, setdata] = useState([]);

  const getDatabase = async () => {
        try {
            const response = await getData('Banner');
            setdata(response.data);
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan.");
        }
    };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    getDatabase();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (slider) {
        slider.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-screen-sm mx-auto">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        style={{ height: '200px' }}
      >
        {data.map((src, index) => (
          <img
            key={index}
            src={src.image}
            alt={`slide-${index}`}
            className="flex-shrink-0 w-full h-full object-cover snap-start"
          />
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {data.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-yellow-400' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
