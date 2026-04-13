// app/order/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import Header from "@/components/Header";
import { Waveform } from "@/components/Waveform";
import { useAuth } from "@/context/AuthContext";

export default function OrderPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    category: "",
    text: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  const categories = [
    { value: "إعلان", label: "إعلان تجاري", icon: "📺", price: "900-1500 AED" },
    {
      value: "وثائقي",
      label: "فيلم وثائقي",
      icon: "🎬",
      price: "900-1500 AED/دقيقة",
    },
    {
      value: "موشن جرافيك",
      label: "موشن جرافيك",
      icon: "🎯",
      price: "600-1000 AED/دقيقة",
    },
    {
      value: "يوتيوب",
      label: "فيديو يوتيوب",
      icon: "▶️",
      price: "500-900 AED/دقيقة",
    },
    { value: "دوبلاج", label: "دوبلاج", icon: "🎭", price: "900-1500 AED" },
    { value: "IVR", label: "رد آلي (IVR)", icon: "📞", price: "400-800 AED" },
    {
      value: "إعلان إذاعي",
      label: "إعلان إذاعي",
      icon: "🎙️",
      price: "1200-2000 AED",
    },
    {
      value: "إعلان تلفزيوني",
      label: "إعلان تلفزيوني",
      icon: "📺",
      price: "2500-5000 AED",
    },
    {
      value: "فيديو شركات",
      label: "فيديو شركات",
      icon: "🏢",
      price: "700-1200 AED/دقيقة",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من البيانات
    if (!formData.full_name) {
      setError("الرجاء إدخال الاسم الكامل");
      return;
    }
    if (!formData.phone) {
      setError("الرجاء إدخال رقم الهاتف");
      return;
    }

    if (!formData.phone.startsWith("+")) {
      setError("الرجاء ادخال رمز الدولة");
      return;
    }

    if (!formData.category) {
      setError("الرجاء اختيار الفئة");
      return;
    }
    if (!formData.text) {
      setError("الرجاء كتابة النص المطلوب");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          full_name: "",
          phone: "",
          category: "",
          text: "",
          notes: "",
        });
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "حدث خطأ في إرسال الطلب");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">طلب </span>
              <span className="text-yellow-500">تعليق صوتي</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              املأ النموذج أدناه وسنقوم بالتواصل معك خلال 24 ساعة
            </p>
          </div>

          {/* Waveform */}
          <div className="mb-12 opacity-50">
            <Waveform />
          </div>

          {/* Success Message */}
          {success && (
            <div className="max-w-2xl mx-auto mb-8 bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-500">
                ✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
              </p>
            </div>
          )}

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم الكامل */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الاسم الكامل <span className="text-yellow-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  />
                </div>

                {/* رقم الهاتف */}
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
                    placeholder="+9xxxxxxxx... مع كتابة رمز الدولة"
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  />
                </div>

                {/* الفئة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نوع الخدمة <span className="text-yellow-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                  >
                    <option value="">اختر نوع الخدمة</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label} - {cat.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* النص المطلوب */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    النص المطلوب <span className="text-yellow-500">*</span>
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="اكتب النص الذي تريد تسجيله..."
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    عدد الكلمات:{" "}
                    {
                      formData.text.split(/\s+/).filter((w) => w.length > 0)
                        .length
                    }{" "}
                    كلمة
                  </p>
                </div>

                {/* ملاحظات إضافية */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="أي تفاصيل إضافية تود إضافتها..."
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white resize-none"
                  />
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                {/* أزرار الإجراء */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">⚡</div>
                <h3 className="text-white font-bold mb-1">تسليم سريع</h3>
                <p className="text-xs text-gray-400">خلال 24 ساعة</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">🎙️</div>
                <h3 className="text-white font-bold mb-1">جودة احترافية</h3>
                <p className="text-xs text-gray-400">استوديو معتمد</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">🔄</div>
                <h3 className="text-white font-bold mb-1">تعديلات </h3>
                <p className="text-xs text-gray-400">حتى ترضى تماماً</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
