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
    phone: "",
    password: "",
  });

  const { register, user } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند تغيير الحقول
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من وجود رمز الدولة
    if (!formData.phone.startsWith("+")) {
      setError("الرجاء ادخال رمز الدولة (مثال: +963xxxxxxxx)");
      return;
    }

    // التحقق من طول رقم الهاتف
    if (formData.phone.length < 10) {
      setError("رقم الهاتف غير صحيح");
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    // التحقق من قوة كلمة المرور
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register(formData);
    } catch (err: any) {
      // معالجة الخطأ من الـ API
      if (err.message?.includes("email") || err.message?.includes("already")) {
        setError(
          "البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر",
        );
      } else if (err.message?.includes("phone")) {
        setError("رقم الهاتف مستخدم بالفعل");
      } else {
        setError(err.message || "حدث خطأ في إنشاء الحساب");
      }
    } finally {
      setLoading(false);
    }
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
                {/* الاسم ورقم الهاتف */}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رقم الهاتف <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white"
                      placeholder="+963xxxxxxxx (مع رمز الدولة)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      مثال: +963912345678 (رمز الدولة + الرقم)
                    </p>
                  </div>
                </div>

                {/* البريد الإلكتروني وكلمة المرور */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      كلمة المرور <span className="text-yellow-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white pr-12"
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      كلمة المرور يجب أن تكون 6 أحرف على الأقل
                    </p>
                  </div>
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-lg">⚠️</span>
                      <p className="text-red-500 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg
                  transition-all transform hover:scale-105
                  bg-gradient-to-r from-yellow-500 to-white text-black hover:from-yellow-400 hover:to-gray-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري إنشاء الحساب..." : "انشاء حساب"}
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
                <h3 className="text-white font-bold mb-2">تعديلات</h3>
                <p className="text-gray-400 text-sm">حتى ترضى تماماً</p>
              </div>
            </div>

            {/* رابط تسجيل الدخول */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
