// components/Header.tsx

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  // إغلاق القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    console.log("Logout clicked");
    setShowLogoutModal(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800"
        dir="rtl"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">صوت</span>
              <span className="text-yellow-500">ي</span>
              <span className="text-yellow-600">!</span>
            </Link>

            {/* Desktop Navigation - الصفحات المطلوبة */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {[
                { name: "الرئيسية", href: "/" },
                { name: "الديمو", href: "#voice-demos" },
                { name: "الخدمات", href: "#services" },
                { name: "أعمالنا", href: "#portfolio" },
                { name: "الأسعار", href: "#calculator" },
                { name: "عننا", href: "#about" },
                { name: "اتصل بنا", href: "/contact" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-500 transition-colors text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Buttons */}
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-yellow-500 transition-colors text-sm font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-yellow-500 text-black font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                >
                  ابدأ الآن
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus:outline-none relative z-[60]"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 transform transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[55] md:hidden" style={{ top: "80px" }}>
          {/* طبقة سوداء معتمة تغطي كل الصفحة */}
          <div
            className="absolute inset-0 bg-black"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* القائمة */}
          <nav className="absolute inset-0 overflow-y-auto">
            <div className="container mx-auto px-4 py-8 min-h-full">
              <div className="flex flex-col gap-6">
                {/* الروابط الرئيسية */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                  <div className="flex flex-col gap-1">
                    {[
                      { name: "الرئيسية", href: "/" },
                      { name: "الديمو", href: "#voice-demos" },
                      { name: "الخدمات", href: "#services" },
                      { name: "أعمالنا", href: "#portfolio" },
                      { name: "الأسعار", href: "#calculator" },
                      { name: "عننا", href: "#about" },
                      { name: "اتصل بنا", href: "/contact" },
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="text-gray-300 hover:text-yellow-500 hover:bg-gray-800 transition-colors py-4 px-4 rounded-xl text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* أزرار الدخول والتسجيل / تسجيل الخروج */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                  <div className="flex flex-col gap-3">
                    {!user ? (
                      <>
                        <Link
                          href="/login"
                          className="text-gray-300 hover:text-yellow-500 hover:bg-gray-800 transition-colors py-4 px-4 rounded-xl text-base font-medium text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          تسجيل الدخول
                        </Link>
                        <Link
                          href="/register"
                          className="bg-yellow-500 text-black font-semibold py-4 px-4 rounded-xl text-base hover:bg-yellow-400 transition-colors text-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          ابدأ الآن
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowLogoutModal(true);
                            setIsMenuOpen(false);
                          }}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors py-4 px-4 rounded-xl text-base font-medium text-center"
                        >
                          تسجيل الخروج
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* معلومات التواصل السريع */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">📞</span>
                      <span className="text-sm text-gray-400">واتساب</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      +971 50 123 4567
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-white mb-2">
                تسجيل الخروج
              </h3>
              <p className="text-gray-400 mb-6">
                هل أنت متأكد من رغبتك في تسجيل الخروج؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition-colors"
                >
                  نعم، تسجيل الخروج
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مساحة فارغة أسفل الهيدر الثابت */}
      <div className="h-20" />
    </>
  );
}
