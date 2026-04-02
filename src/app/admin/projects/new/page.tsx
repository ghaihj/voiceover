// app/admin/projects/new/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function NewProjectPage() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, role } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    videoUrl: "",
    thumbnail: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const categories = [
    { value: "إعلان", label: "إعلان", icon: "📺" },
    { value: "وثائقي", label: "وثائقي", icon: "🎬" },
    { value: "موشن جرافيك", label: "موشن جرافيك", icon: "🎯" },
    { value: "يوتيوب", label: "يوتيوب", icon: "▶️" },
    { value: "دوبلاج", label: "دوبلاج", icon: "🎭" },
    { value: "تلفزيون", label: "تلفزيون", icon: "📺" },
    { value: "إذاعي", label: "إذاعي", icon: "🎙️" },
    { value: "تدريب", label: "تدريب", icon: "📚" },
  ];

  useEffect(() => {
    if (!user && role === "user") {
      router.push("/");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // تحديث رابط embed عند تغيير رابط الفيديو
    if (name === "videoUrl") {
      const embed = getYoutubeEmbedUrl(value);
      setEmbedUrl(embed);
    }
  };

  // معاينة رابط الصورة المصغرة
  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, thumbnail: url }));
    setThumbnailPreview(url);
  };

  // استخراج رابط embed من رابط يوتيوب
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // معالجة رابط يوتيوب العادي
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // معالجة رابط يوتيوب المختصر
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // معالجة رابط فيميو
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // إذا كان الرابط بالفعل embed
    if (url.includes("youtube.com/embed") || url.includes("player.vimeo.com")) {
      return url;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("الرجاء إدخال عنوان المشروع");
      return;
    }

    if (!formData.category) {
      setError("الرجاء اختيار الفئة");
      return;
    }

    if (!formData.videoUrl) {
      setError("الرجاء إدخال رابط الفيديو");
      return;
    }

    if (!formData.thumbnail) {
      setError("الرجاء إدخال رابط الصورة المصغرة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // تنسيق رابط الفيديو
      let finalVideoUrl = getYoutubeEmbedUrl(formData.videoUrl);

      if (!finalVideoUrl) {
        setError("الرجاء إدخال رابط يوتيوب أو فيميو صحيح");
        setLoading(false);
        return;
      }

      // إرسال بيانات المشروع
      const response = await fetch(`${BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          videoUrl: finalVideoUrl,
          thumbnail: formData.thumbnail,
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        setError(data.message || "حدث خطأ في إضافة المشروع");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة رابط الفيديو للعرض
  const isValidVideoUrl =
    embedUrl &&
    (embedUrl.includes("youtube.com/embed") ||
      embedUrl.includes("player.vimeo.com"));

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              ← العودة
            </button>
            <h1 className="text-3xl font-bold">
              <span className="text-white">إضافة </span>
              <span className="text-yellow-500">مشروع جديد</span>
            </h1>
          </div>
          <p className="text-gray-400">أضف مشروع جديد إلى محفظة الأعمال</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                العنوان <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="مثال: إعلان تجاري - اتصالات"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الفئة <span className="text-yellow-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* رابط الفيديو */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رابط الفيديو <span className="text-yellow-500">*</span>
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                required
                placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                يدعم: يوتيوب، فيميو (سيتم تحويل الرابط تلقائياً)
              </p>
            </div>

            {/* معاينة الفيديو */}
            {formData.videoUrl && isValidVideoUrl && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  معاينة الفيديو
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={embedUrl || ""}
                    title="معاينة الفيديو"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {formData.videoUrl && !isValidVideoUrl && (
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
                <p className="text-yellow-500 text-sm">
                  ⚠️ رابط غير صالح. يرجى إدخال رابط يوتيوب أو فيميو صحيح.
                </p>
              </div>
            )}

            {/* رابط الصورة المصغرة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رابط الصورة المصغرة <span className="text-yellow-500">*</span>
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleThumbnailUrlChange}
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                رابط صورة مصغرة للمشروع (JPG, PNG)
              </p>
            </div>

            {/* معاينة الصورة المصغرة */}
            {thumbnailPreview && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  معاينة الصورة
                </h3>
                <img
                  src={thumbnailPreview}
                  alt="معاينة الصورة المصغرة"
                  className="w-full max-h-48 object-cover rounded-lg"
                  onError={() => setThumbnailPreview(null)}
                />
              </div>
            )}

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
                {loading ? "جاري الإضافة..." : "إضافة المشروع"}
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

          {/* معلومات إضافية */}
          <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-sm font-medium text-yellow-500 mb-2">
              💡 نصائح:
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                • الفيديو: أدخل رابط يوتيوب (مثال:
                https://www.youtube.com/watch?v=XXXXX)
              </li>
              <li>• أو رابط يوتيوب مختصر (مثال: https://youtu.be/XXXXX)</li>
              <li>• أو رابط فيميو (مثال: https://vimeo.com/XXXXX)</li>
              <li>• الصورة المصغرة: أدخل رابط مباشر للصورة (JPG, PNG)</li>
              <li>• يفضل استخدام صور بحجم 16:9 للحصول على أفضل عرض</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
