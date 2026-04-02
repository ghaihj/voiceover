// components/FinalCTA.tsx
"use client";

import { Waveform } from "./Waveform";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* خلفية ذهبية ناعمة */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,215,0,0.05) 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, rgba(255,215,0,0.05) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* موجات صوتية متحركة */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
              left: 0,
              right: 0,
              transform: `rotate(${i * 1}deg)`,
              animation: `waveSlide ${10 + i * 2}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* أيقونة الميكروفون */}
          <div className="mb-8">
            <div className="inline-block p-6 bg-black border border-gray-800 rounded-full">
              <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                🎙️
              </span>
            </div>
          </div>

          {/* العنوان الرئيسي */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">جاهز </span>
            <span className="text-yellow-500">لبدء مشروعك</span>
            <span className="text-white"> الصوتي؟</span>
          </h2>

          {/* وصف قصير */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            احصل على تعليق صوتي احترافي خلال 24 ساعة. جودة استوديو، تسليم سريع،
            وتعديلات حتى ترضى.
          </p>

          {/* الموجة الصوتية */}
          <div className="mb-12 opacity-30 max-w-md mx-auto">
            <Waveform />
          </div>

          {/* الزر الكبير */}
          <Link href="/orders" className="group relative inline-block">
            {/* glow effect */}
            <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

            {/* الزر الرئيسي */}
            <button
              className="relative bg-yellow-500 text-black text-2xl md:text-3xl font-bold 
                py-6 px-16 rounded-full
                hover:bg-yellow-400 
                transition-all transform hover:scale-105
                shadow-2xl shadow-yellow-500/30
                border-2 border-transparent hover:border-white/20
                flex items-center justify-center gap-4"
            >
              <span className="text-3xl">🎤</span>
              <span>اطلب تعليق صوتي الآن</span>
              <span className="text-3xl group-hover:translate-x-2 transition-transform">
                →
              </span>
            </button>
          </Link>

          {/* معلومات سريعة */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500">⚡</span>
              </div>
              <span className="text-gray-300">تسليم خلال 24 ساعة</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500">🎚️</span>
              </div>
              <span className="text-gray-300">جودة استوديو احترافية</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500">🔄</span>
              </div>
              <span className="text-gray-300">تعديلات غير محدودة</span>
            </div>
          </div>

          {/* أرقام التواصل السريع */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center">
                  <span className="text-yellow-500">📞</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">واتساب</div>
                  <div className="text-white font-bold">+971 50 123 4567</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center">
                  <span className="text-yellow-500">📧</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                  <div className="text-white font-bold">info@sawti.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* شعارات الثقة */}
          <div className="mt-12 flex justify-center gap-8 opacity-50">
            <span className="text-gray-600">دعم فني 24/7</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">ضمان الجودة</span>
          </div>
        </div>
      </div>
    </section>
  );
};
