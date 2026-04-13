// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Waveform } from "@/components/Waveform";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const { login, user } = useAuth();

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
    setForm((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند تغيير الحقول
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من البريد الإلكتروني
    if (!form.email) {
      setError("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("البريد الإلكتروني غير صحيح");
      return;
    }

    // التحقق من كلمة المرور
    if (!form.password) {
      setError("الرجاء إدخال كلمة المرور");
      return;
    }

    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(form);
    } catch (err: any) {
      // معالجة أخطاء تسجيل الدخول
      if (
        err.message?.includes("email") ||
        err.message?.includes("not found")
      ) {
        setError("البريد الإلكتروني غير مسجل. يرجى إنشاء حساب أولاً");
      } else if (
        err.message?.includes("password") ||
        err.message?.includes("incorrect")
      ) {
        setError("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى");
      } else if (err.message?.includes("credentials")) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError(err.message || "حدث خطأ في تسجيل الدخول");
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

        {/* محتوى صفحة تسجيل الدخول */}
        <main className="relative z-10 container mx-auto px-4 py-30">
          <div className="max-w-md mx-auto">
            {/* عنوان الصفحة */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-white">تسجيل </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white">
                  الدخول
                </span>
              </h1>
              <p className="text-gray-400">
                مرحباً بعودتك! سجل دخولك للوصول إلى حسابك
              </p>
            </div>

            {/* الموجة الصوتية */}
            <div className="mb-8 opacity-50">
              <Waveform />
            </div>

            {/* بطاقة تسجيل الدخول */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
              {/* نموذج تسجيل الدخول */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white pr-12"
                      placeholder="example@domain.com"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      📧
                    </span>
                  </div>
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white pr-12"
                      placeholder="********"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      🔒
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    كلمة المرور يجب أن تكون 6 أحرف على الأقل
                  </p>
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

                {/* زر تسجيل الدخول */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg
                  bg-gradient-to-r from-yellow-500 to-white text-black
                  hover:from-yellow-400 hover:to-gray-100
                  transition-all transform hover:scale-105
                  shadow-lg shadow-yellow-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>

                {/* خط فاصل */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-500">
                      أو
                    </span>
                  </div>
                </div>
              </form>

              {/* رابط التسجيل */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  ليس لديك حساب؟{" "}
                  <Link
                    href="/register"
                    className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                  >
                    سجل الآن
                  </Link>
                </p>
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-800">
                <span className="text-yellow-500">🔒</span>
                <span className="text-sm text-gray-400">
                  معلوماتك آمنة ومشفرة
                </span>
              </div>
            </div>

            {/* مميزات العضوية */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-yellow-500 text-2xl mb-2">🎙️</div>
                <div className="text-xs text-gray-500">ديموهات حصرية</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-500 text-2xl mb-2">💾</div>
                <div className="text-xs text-gray-500">حفظ المشاريع</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-500 text-2xl mb-2">⚡</div>
                <div className="text-xs text-gray-500">طلبات سريعة</div>
              </div>
            </div>

            {/* زر تجريبي (اختياري) */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setForm({ email: "demo@example.com", password: "123456" });
                }}
                className="text-sm text-gray-500 hover:text-yellow-500 transition-colors"
              >
                تجربة حساب تجريبي
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
