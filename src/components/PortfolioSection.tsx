// components/PortfolioSection.tsx
"use client";

import { useState, useEffect } from "react";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { BASE_URL } from "@/config";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  created_at?: string;
}

export const PortfolioSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem | null>(
    null,
  );
  const [filter, setFilter] = useState<string>("الكل");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات من API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/projects`);
      const data = await response.json();
      setPortfolioItems(data.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل المشاريع");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // الحصول على قائمة الفئات الفريدة
  const categories = [
    "الكل",
    ...new Set(portfolioItems.map((item) => item.category)),
  ];

  // فلترة العناصر
  const filteredItems =
    filter === "الكل"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  // دالة للحصول على أيقونة حسب الفئة
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      إعلان: "📺",
      وثائقي: "🎬",
      "موشن جرافيك": "🎯",
      يوتيوب: "▶️",
      دوبلاج: "🎭",
      تلفزيون: "📺",
      إذاعي: "🎙️",
      تدريب: "📚",
      بودكاست: "🎙️",
    };
    return icons[category] || "🎬";
  };

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-yellow-500 text-lg">
              جاري تحميل المشاريع...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* خلفية بنمط شبكي */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">أحدث </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              أعمالنا
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نماذج حقيقية من مشاريعنا في التعليق الصوتي
          </p>
        </div>

        {/* أزرار التصفية */}
        {portfolioItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    filter === cat
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
                  }
                `}
              >
                {cat === "الكل" ? cat : `${getCategoryIcon(cat)} ${cat}`}
              </button>
            ))}
          </div>
        )}

        {/* شبكة المشاريع */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400">لا توجد مشاريع في هذه الفئة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onPlay={() => setSelectedVideo(item)}
              />
            ))}
          </div>
        )}

        {/* زر عرض المزيد */}
        {portfolioItems.length > 6 && (
          <div className="text-center mt-12">
            <button className="bg-transparent border-2 border-yellow-500 hover:bg-yellow-500 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              عرض المزيد من الأعمال
            </button>
          </div>
        )}
      </div>

      {/* نافذة الفيديو المنبثقة */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
};

// بطاقة المشروع
interface PortfolioCardProps {
  item: PortfolioItem;
  onPlay: () => void;
}

const PortfolioCard = ({ item, onPlay }: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // دالة للحصول على أيقونة حسب الفئة
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      إعلان: "📺",
      وثائقي: "🎬",
      "موشن جرافيك": "🎯",
      يوتيوب: "▶️",
      دوبلاج: "🎭",
      تلفزيون: "📺",
      إذاعي: "🎙️",
      تدريب: "📚",
      بودكاست: "🎙️",
    };
    return icons[category] || "🎬";
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
        {/* الصورة المصغرة */}
        {!imgError ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-6xl">{getCategoryIcon(item.category)}</span>
          </div>
        )}

        {/* طبقة داكنة */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent
          transition-opacity duration-300
          ${isHovered ? "opacity-80" : "opacity-60"}
        `}
        />

        {/* زر التشغيل */}
        <div
          className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300
          ${isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
        >
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
            <PlayIcon className="w-8 h-8 text-black ml-1" />
          </div>
        </div>

        {/* معلومات المشروع */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium bg-yellow-500 text-black px-2 py-1 rounded">
              {getCategoryIcon(item.category)} {item.category}
            </span>
          </div>
          <h3 className="font-bold text-lg line-clamp-2">{item.title}</h3>
        </div>
      </div>
    </div>
  );
};

// نافذة الفيديو المنبثقة
interface VideoModalProps {
  video: PortfolioItem;
  onClose: () => void;
}

const VideoModal = ({ video, onClose }: VideoModalProps) => {
  // دالة للحصول على أيقونة حسب الفئة
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      إعلان: "📺",
      وثائقي: "🎬",
      "موشن جرافيك": "🎯",
      يوتيوب: "▶️",
      دوبلاج: "🎭",
      تلفزيون: "📺",
      إذاعي: "🎙️",
      تدريب: "📚",
      بودكاست: "🎙️",
    };
    return icons[category] || "🎬";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h3 className="text-white font-bold">{video.title}</h3>
            <p className="text-sm text-gray-400">
              {getCategoryIcon(video.category)} {video.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* الفيديو */}
        <div className="aspect-video w-full">
          <iframe
            src={
              video.videoUrl.includes("youtube.com/embed")
                ? video.videoUrl + "?autoplay=1"
                : video.videoUrl
            }
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
