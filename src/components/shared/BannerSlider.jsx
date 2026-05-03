import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const BannerSlider = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative group w-full">
      <Swiper
        effect={'fade'}
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: '.custom-pagination',
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="overflow-hidden shadow-sm aspect-video md:aspect-21/9"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-full group overflow-hidden">
              {/* মেইন ইমেজ */}
              <img
                src={banner.image.url}
                alt={banner.title || "Promotion Banner"}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* টেক্সট এবং বাটন ওভারলে */}
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent flex items-center">
                <div className="container mx-auto flex justify-center items-center">
                  <div className="max-w-xl space-y-3 md:space-y-6 text-center">
                    {banner.title && (
                      <h3 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                        {banner.title}
                      </h3>
                    )}
                    
                    {banner.link && (
                      <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                        <Link 
                          to={banner.link} 
                          className="inline-flex items-center justify-center bg-white text-black px-6 py-1 md:px-8 md:py-2 rounded-full font-bold text-sm md:text-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                          Shop Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* নেভিগেশন বাটন */}
        <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-lg text-white rounded-full opacity-50 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl">
          <ChevronLeft size={28} />
        </button>
        <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-lg text-white rounded-full opacity-50 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl">
          <ChevronRight size={28} />
        </button>

        {/* কাস্টম ডটস */}
        <div className="custom-pagination bottom-6! z-20 flex justify-center gap-2"></div>
      </Swiper>

      <style>{`
        .custom-pagination .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.8) !important;
          width: 10px;
          height: 10px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: white !important;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;