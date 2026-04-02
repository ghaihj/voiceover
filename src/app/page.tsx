// app/page.tsx - الصفحة الرئيسية مع البيانات من API
"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { VoiceDemoCard } from "@/components/VoiceDemoCard";
import { Waveform } from "../components/Waveform";
import { ClientsSection } from "@/components/ClientsSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { VoiceCostCalculator } from "@/components/VoiceCostCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FinalCTA } from "@/components/FinalCTA";
import { ASSETS_URL, BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface Demo {
  id: number;
  title: string;
  category: string;
  duration: string;
  audio: string;
}

export default function Home() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role } = useAuth();

  // جلب الديموهات من API
  useEffect(() => {
    if (role === "admin") {
      router.push("/admin");
    }
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/demos`);
      const data = await response.json();
      setDemos(data.data);
    } catch (error) {
      console.error("Error fetching demos:", error);
    } finally {
      setLoading(false);
    }
  };

  // عرض أول 6 ديموهات فقط في الصفحة الرئيسية
  const featuredDemos = demos.slice(0, 6);

  return (
    <div className="bg-black text-white font-sans" dir="rtl">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Video */}
        <video
          autoPlay
          loop
          controls
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/video_2026-03-09_17-22-18.mp4" type="video/mp4" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 to-black"></div>
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-white">صوت احترافي للإعلانات</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              والوثائقيات والموشن جرافيك
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            تعليق صوتي بجودة استوديو احترافي مع خبرة تتجاوز 5 سنوات وأكثر من
            7000 مشروع.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={"#demos"}
              className="group bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>▶</span>
              استمع إلى الديمو
            </Link>
            <Link
              href={"#calc"}
              className="bg-transparent border-2 border-yellow-500 hover:border-yellow-400 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-105"
            >
              <span>📊</span>
              احسب تكلفة التعليق
            </Link>
            <Link
              href={"/orders"}
              className="bg-white text-black hover:bg-gray-200 font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all transform hover:scale-105"
            >
              <span>📞</span>
              اطلب تسجيل صوتي
            </Link>
          </div>

          {/* Waveform */}
          <div className="mt-16 max-w-2xl mx-auto opacity-70">
            <Waveform />
          </div>
        </div>
      </section>

      {/* SECTION 2 - TRUST NUMBERS */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-white">أرقام </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              تثق بها
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            أكثر من 5 سنوات من التميز في مجال التعليق الصوتي
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900 bg-opacity-50 rounded-2xl p-8 text-center border border-gray-800 hover:border-yellow-500 transition-all transform hover:scale-105">
              <div className="text-5xl mb-4 text-yellow-500">🎙️</div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                7000+
              </div>
              <div className="text-xl font-semibold mb-2">مشروع</div>
              <div className="text-gray-400 text-sm">تم إنجازها بنجاح</div>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-2xl p-8 text-center border border-gray-800 hover:border-yellow-500 transition-all transform hover:scale-105">
              <div className="text-5xl mb-4 text-yellow-500">⏱️</div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                5+
              </div>
              <div className="text-xl font-semibold mb-2">سنوات خبرة</div>
              <div className="text-gray-400 text-sm">في المجال الصوتي</div>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-2xl p-8 text-center border border-gray-800 hover:border-yellow-500 transition-all transform hover:scale-105">
              <div className="text-5xl mb-4 text-yellow-500">👥</div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                1286+
              </div>
              <div className="text-xl font-semibold mb-2">عميل</div>
              <div className="text-gray-400 text-sm">موزعين حول العالم</div>
            </div>

            <div className="bg-gray-900 bg-opacity-50 rounded-2xl p-8 text-center border border-gray-800 hover:border-yellow-500 transition-all transform hover:scale-105">
              <div className="text-5xl mb-4 text-yellow-500">⚡</div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                24
              </div>
              <div className="text-xl font-semibold mb-2">ساعة</div>
              <div className="text-gray-400 text-sm">متوسط وقت التسليم</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - VOICE DEMOS - من API */}
      <section id="voice-demos" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-white">استمع إلى </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              أحدث ديموهاتنا
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            نماذج صوتية متنوعة لجميع أنواع التعليقات (30-60 ثانية)
          </p>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-yellow-500 text-lg">
                جاري تحميل الديموهات...
              </div>
            </div>
          ) : featuredDemos.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-400 text-lg">
                لا توجد ديموهات متاحة حالياً
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              id="demos"
            >
              {featuredDemos.map((demo) => (
                <VoiceDemoCard
                  key={demo.id}
                  title={demo.title}
                  category={demo.category}
                  duration={demo.duration}
                  audio={demo.audio}
                />
              ))}
            </div>
          )}

          {/* رابط عرض جميع الديموهات */}
          {demos.length > 6 && (
            <div className="text-center mt-12">
              <a
                href="/demos"
                className="inline-block px-8 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition-all transform hover:scale-105"
              >
                عرض جميع الديموهات ({demos.length})
              </a>
            </div>
          )}
        </div>
      </section>

      <ClientsSection />
      <PortfolioSection />
      <VoiceCostCalculator />
      <TestimonialsSection />
      <FinalCTA />
      <WhatsAppButton />
    </div>
  );
}
