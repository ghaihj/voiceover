// app/contact/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import Header from "@/components/Header";
import { Waveform } from "@/components/Waveform";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.message || "حدث خطأ في إرسال الرسالة");
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
              <span className="text-white">تواصل </span>
              <span className="text-yellow-500">معنا</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              يسعدنا تواصلك معنا. سيقوم فريقنا بالرد عليك في أقرب وقت ممكن
            </p>
          </div>

          {/* Waveform */}
          <div className="mb-12 opacity-50">
            <Waveform />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* معلومات الاتصال */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">
                  معلومات الاتصال
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-500 text-xl">📍</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">العنوان</p>
                      <p className="text-white">دمشق، سوريا</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-500 text-xl">📞</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">الهاتف</p>
                      <p className="text-white">+963 935 923 731</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-500 text-xl">✉️</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                      <p className="text-white">info@sawti.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-500 text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">ساعات العمل</p>
                      <p className="text-white">السبت - الخميس: 9ص - 6م</p>
                      <p className="text-gray-500 text-sm">الجمعة: مغلق</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* نموذج الاتصال */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  أرسل لنا رسالة
                </h2>

                {success && (
                  <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4">
                    <p className="text-green-500">
                      ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
                    <p className="text-red-500">❌ {error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        placeholder="أدخل اسمك الكامل"
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                      />
                    </div>

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
                        placeholder="example@domain.com"
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="05xxxxxxxx... مع كتابة رمز الدولة"
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        الموضوع
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
                      >
                        <option value="">اختر الموضوع</option>
                        <option value="استفسار عام">استفسار عام</option>
                        <option value="طلب تعليق صوتي">طلب تعليق صوتي</option>
                        <option value="استفسار عن الأسعار">
                          استفسار عن الأسعار
                        </option>
                        <option value="شكوى أو اقتراح">شكوى أو اقتراح</option>
                        <option value="تعاون">طلب تعاون</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      الرسالة <span className="text-yellow-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
