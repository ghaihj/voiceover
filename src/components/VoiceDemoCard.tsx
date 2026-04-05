// components/VoiceDemoCard.tsx
"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";

// تعريف نوع Props المبسط
interface VoiceDemoCardProps {
  title: string;
  category: string;
  // icon: string;
  // gradient: string;
  duration: string;
  audio: string;
}

export const VoiceDemoCard = ({
  title,
  category,
  duration,
  audio,
}: VoiceDemoCardProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // دالة للحصول على أيقونة حسب الفئة
  const getIconByCategory = (category: string): string => {
    const icons: { [key: string]: string } = {
      إعلان: "📺",
      وثائقي: "🎬",
      "موشن جرافيك": "🎯",
      يوتيوب: "▶️",
      دوبلاج: "🎭",
      IVR: "📞",
      إعلانات: "📺",
      وثائقيات: "🎬",
      شركات: "📞",
      بودكاست: "🎙️",
    };
    return icons[category] || "🎵";
  };

  // دالة للحصول على تدرج لوني حسب الفئة
  const getGradientByCategory = (category: string): string => {
    const gradients: { [key: string]: string } = {
      إعلان: "from-yellow-500 to-yellow-700",
      وثائقي: "from-yellow-600 to-yellow-800",
      "موشن جرافيك": "from-yellow-500 to-yellow-700",
      يوتيوب: "from-yellow-600 to-yellow-800",
      دوبلاج: "from-yellow-500 to-yellow-700",
      IVR: "from-yellow-600 to-yellow-800",
      إعلانات: "from-yellow-500 to-yellow-700",
      وثائقيات: "from-yellow-600 to-yellow-800",
      شركات: "from-yellow-600 to-yellow-800",
      بودكاست: "from-yellow-500 to-yellow-700",
    };
    return gradients[category] || "from-yellow-500 to-yellow-700";
  };

  const icon = getIconByCategory(category);
  const gradient = getGradientByCategory(category);

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // تحميل الملف الصوتي
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      const canPlayHandler = () => setIsLoaded(true);
      const errorHandler = () => setError(true);

      audioRef.current.addEventListener("canplay", canPlayHandler);
      audioRef.current.addEventListener("error", errorHandler);

      return () => {
        audioRef.current?.removeEventListener("canplay", canPlayHandler);
        audioRef.current?.removeEventListener("error", errorHandler);
      };
    }
  }, [audio]);

  const togglePlay = (): void => {
    if (audioRef.current && !error && isLoaded) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (): void => {
    if (
      audioRef.current &&
      audioRef.current.duration &&
      !isNaN(audioRef.current.duration)
    ) {
      const newProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(newProgress);

      const mins = Math.floor(audioRef.current.currentTime / 60);
      const secs = Math.floor(audioRef.current.currentTime % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, "0")}`);
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>): void => {
    if (
      audioRef.current &&
      progressBarRef.current &&
      isLoaded &&
      audioRef.current.duration
    ) {
      const rect = progressBarRef.current.getBoundingClientRect();
      // حساب موقع النقرة من اليسار (بالنسبة للشريط)
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      // حساب النسبة المئوية (من 0 إلى 100)
      let percentage = (clickX / width) * 100;

      // التأكد من أن النسبة بين 0 و 100
      percentage = Math.min(100, Math.max(0, percentage));

      // حساب الوقت الجديد
      const newTime = (percentage / 100) * audioRef.current.duration;

      // تعيين الوقت الجديد
      audioRef.current.currentTime = newTime;
      setProgress(percentage);

      // تحديث الوقت المعروض فوراً
      const mins = Math.floor(newTime / 60);
      const secs = Math.floor(newTime % 60);
      setCurrentTime(`${mins}:${secs.toString().padStart(2, "0")}`);
    }
  };

  const handleAudioEnded = (): void => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
  };

  const formatDuration = (duration: string): string => {
    if (duration.includes(":")) return duration;
    return duration;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 group">
      {/* رأس البطاقة */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400">
            {category} • {formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* مشغل الصوت */}
      <div className="space-y-3">
        {/* شريط التقدم - بار التشغيل */}
        <div
          ref={progressBarRef}
          className="h-2 bg-gray-800 rounded-full cursor-pointer relative group/progress overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className={`h-full bg-gradient-to-r ${gradient} rounded-full relative transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* عناصر التحكم */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* زر التشغيل/الإيقاف */}
            <button
              onClick={togglePlay}
              disabled={!isLoaded || error}
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              <span className="text-white text-lg">
                {error ? "⚠️" : isPlaying ? "⏸️" : "▶️"}
              </span>
            </button>

            {/* الوقت الحالي */}
            <span className="text-sm text-gray-400 font-mono">
              {error ? "خطأ" : `${currentTime} / ${formatDuration(duration)}`}
            </span>
          </div>

          {/* موجات صوتية متحركة أثناء التشغيل */}
          <div className="flex items-center gap-0.5">
            {isPlaying && !error && isLoaded
              ? [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full animate-sound-wave"
                    style={{
                      height: "20px",
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.5s",
                    }}
                  />
                ))
              : [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-gray-600 rounded-full transition-all"
                    style={{ height: "12px" }}
                  />
                ))}
          </div>
        </div>

        {/* رسالة خطأ إذا فشل التحميل */}
        {error && (
          <p className="text-xs text-red-500 text-center mt-2">
            تعذر تحميل الملف الصوتي
          </p>
        )}

        {/* مؤشر التحميل */}
        {!isLoaded && !error && (
          <div className="flex justify-center mt-2">
            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* عنصر audio مخفي */}
      <audio
        ref={audioRef}
        src={audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="metadata"
      />
    </div>
  );
};
