// app/admin/demos/new/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function NewDemoPage() {
  const router = useRouter();
  const { user, role, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
  });

  const categories = [
    { value: "إعلان", label: "إعلان", icon: "📺" },
    { value: "وثائقي", label: "وثائقي", icon: "🎬" },
    { value: "موشن جرافيك", label: "موشن جرافيك", icon: "🎯" },
    { value: "يوتيوب", label: "يوتيوب", icon: "▶️" },
    { value: "دوبلاج", label: "دوبلاج", icon: "🎭" },
    { value: "IVR", label: "رد آلي (IVR)", icon: "📞" },
  ];

  useEffect(() => {
    if (!user && role === "user") {
      router.push("/");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));

      // حساب المدة تلقائياً
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const calculatedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        setFormData((prev) => ({ ...prev, duration: calculatedDuration }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setError("الرجاء اختيار ملف صوتي");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. رفع الملف
      const uploadFormData = new FormData();
      uploadFormData.append("audio", audioFile);

      const uploadRes = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "فشل رفع الملف");
      }

      // 2. حفظ بيانات الديمو
      const demoRes = await fetch(`${BASE_URL}/demos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          duration: formData.duration,
          audio: uploadData.url,
        }),
      });

      if (demoRes.ok) {
        router.push("/admin/demos");
      } else {
        const demoData = await demoRes.json();
        setError(demoData.message || "حدث خطأ في إضافة الديمو");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-yellow-500 transition-colors mb-4"
          >
            ← العودة
          </button>
          <h1 className="text-3xl font-bold">
            <span className="text-white">إضافة </span>
            <span className="text-yellow-500">ديمو جديد</span>
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                العنوان *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الفئة *
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

            {/* رفع الملف */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الملف الصوتي *
              </label>

              {!audioFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="text-5xl mb-3">🎵</div>
                  <p className="text-gray-400">انقر لاختيار ملف صوتي</p>
                  <p className="text-xs text-gray-600 mt-2">
                    MP3, WAV, M4A (حد أقصى 50MB)
                  </p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <p className="text-white font-medium">
                          {audioFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile(null);
                        setAudioPreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      إزالة
                    </button>
                  </div>
                  {audioPreview && (
                    <audio
                      controls
                      className="w-full mt-2"
                      src={audioPreview}
                    />
                  )}
                </div>
              )}
            </div>
            {/* المدة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                المدة *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="0:45"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !audioFile}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? "جاري الإضافة..." : "إضافة الديمو"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
