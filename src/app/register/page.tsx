// app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Waveform } from "@/components/Waveform";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { register, user } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا منطق إرسال النموذج
    register(formData);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
        {/* خلفية بنمط الموجات الصوتية */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.2) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: 0,
                right: 0,
                transform: `rotate(${i * 2}deg)`,
                animation: `waveSlide ${12 + i * 2}s linear infinite`,
              }}
            />
          ))}
        </div>

        {/* محتوى صفحة التسجيل */}
        <main className="relative z-10 container mx-auto px-4 py-30">
          <div className="max-w-4xl mx-auto">
            {/* عنوان الصفحة */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">سجل </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white">
                  معنا الآن
                </span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                مرحباً بك, أنشئ حسابك معنا في صوتي!
              </p>
            </div>

            {/* الموجة الصوتية */}
            <div className="mb-12 opacity-50">
              <Waveform />
            </div>

            {/* نموذج التسجيل */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      الاسم الكامل <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* البريد الإلكتروني */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      البريد الإلكتروني{" "}
                      <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white"
                      placeholder="example@domain.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      كلمة المرور <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white pr-12"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-120 top-50 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg
                  transition-all transform hover:scale-105
                    agreeTerms
                       bg-gradient-to-r from-yellow-500 to-white text-black hover:from-yellow-400 hover:to-gray-100"
                >
                  انشاء حساب
                </button>
              </form>
            </div>

            {/* بطاقات معلومات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-800">
                <div className="text-yellow-500 text-3xl mb-3">⚡</div>
                <h3 className="text-white font-bold mb-2">تسليم سريع</h3>
                <p className="text-gray-400 text-sm">
                  خلال 24 ساعة من الموافقة
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-800">
                <div className="text-yellow-500 text-3xl mb-3">🎙️</div>
                <h3 className="text-white font-bold mb-2">جودة احترافية</h3>
                <p className="text-gray-400 text-sm">تسجيل في استوديو معتمد</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-800">
                <div className="text-yellow-500 text-3xl mb-3">🔄</div>
                <h3 className="text-white font-bold mb-2">تعديلات مجانية</h3>
                <p className="text-gray-400 text-sm">حتى ترضى تماماً</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
