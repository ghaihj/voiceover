// app/admin/demos/edit/[id]/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function EditDemoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const token = localStorage.getItem("token");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    audio: "",
  });

  const categories = [
    { value: "إعلان", label: "إعلان", icon: "📺" },
    { value: "وثائقي", label: "وثائقي", icon: "🎬" },
    { value: "موشن جرافيك", label: "موشن جرافيك", icon: "🎯" },
    { value: "يوتيوب", label: "يوتيوب", icon: "▶️" },
    { value: "دوبلاج", label: "دوبلاج", icon: "🎭" },
    { value: "IVR", label: "رد آلي (IVR)", icon: "📞" },
    { value: "بودكاست", label: "بودكاست", icon: "🎙️" },
    { value: "تعليمي", label: "تعليمي", icon: "📚" },
  ];

  useEffect(() => {
    if (!user && role === "user") {
      router.push("/");
    }
  }, []);

  // جلب بيانات الديمو
  useEffect(() => {
    fetchDemo();
  }, [id]);

  const fetchDemo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/demos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const demo = data.data;
        setFormData({
          title: demo.title,
          category: demo.category,
          duration: demo.duration,
          audio: demo.audio,
        });
        setAudioPreview(demo.audio);
      } else {
        setError("حدث خطأ في تحميل بيانات الديمو");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.includes("audio")) {
        setError("الرجاء اختيار ملف صوتي فقط (MP3, WAV, etc.)");
        return;
      }

      // التحقق من حجم الملف (الحد الأقصى 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("حجم الملف كبير جداً. الحد الأقصى 50MB");
        return;
      }

      setAudioFile(file);
      setError(null);

      // إنشاء رابط معاينة
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);

      // حساب المدة التقريبية
      const audio = new Audio();
      audio.src = previewUrl;
      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const calculatedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        if (!formData.duration) {
          setFormData((prev) => ({ ...prev, duration: calculatedDuration }));
        }
      });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("audio", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url || response.file_path);
        } else {
          reject(new Error("فشل رفع الملف"));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("حدث خطأ في رفع الملف"));
      });

      xhr.open("POST", `${BASE_URL}/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      let audioUrl = formData.audio;

      // إذا تم رفع ملف جديد
      if (audioFile) {
        try {
          audioUrl = await uploadFile(audioFile);
        } catch (uploadError) {
          setError("فشل رفع الملف الصوتي. يرجى المحاولة مرة أخرى.");
          setSubmitting(false);
          return;
        }
      }

      // تحديث بيانات الديمو
      const response = await fetch(`${BASE_URL}/demos/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _method: "PATCH",
          title: formData.title,
          category: formData.category,
          duration: formData.duration,
          audio: audioUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/demos");
      } else {
        const data = await response.json();
        setError(data.message || "حدث خطأ في تحديث الديمو");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
    if (audioPreview && audioPreview !== formData.audio) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(formData.audio);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">
          جاري تحميل بيانات الديمو...
        </div>
      </div>
    );
  }

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
              <span className="text-white">تعديل </span>
              <span className="text-yellow-500">الديمو</span>
            </h1>
          </div>
          <p className="text-gray-400">تعديل بيانات الديمو الصوتي</p>
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

            {/* المدة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                المدة <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="مثال: 0:45"
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                الصيغة: دقائق:ثواني (مثال: 1:30)
              </p>
            </div>

            {/* الملف الصوتي الحالي */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الملف الصوتي الحالي
              </label>
              {audioPreview && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mb-4">
                  <p className="text-sm text-gray-400 mb-2">الملف الحالي:</p>
                  <audio controls className="w-full" src={audioPreview}>
                    متصفحك لا يدعم تشغيل الصوت
                  </audio>
                </div>
              )}
            </div>

            {/* رفع ملف جديد */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                استبدال الملف الصوتي (اختياري)
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
                  <p className="text-gray-400 mb-2">
                    انقر لاختيار ملف صوتي جديد
                  </p>
                  <p className="text-xs text-gray-600">
                    MP3, WAV, M4A (الحد الأقصى 50MB)
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
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      إزالة
                    </button>
                  </div>

                  {/* معاينة الصوت الجديد */}
                  {audioPreview && audioPreview !== formData.audio && (
                    <audio controls className="w-full mt-2" src={audioPreview}>
                      متصفحك لا يدعم تشغيل الصوت
                    </audio>
                  )}

                  {/* شريط التحميل */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>جاري رفع الملف...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                disabled={submitting}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "جاري التحديث..." : "تحديث الديمو"}
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
              💡 ملاحظات:
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                • يمكنك استبدال الملف الصوتي بملف جديد أو الاحتفاظ بالملف الحالي
              </li>
              <li>• إذا لم تختر ملفاً جديداً، سيتم الاحتفاظ بالملف الحالي</li>
              <li>• المدة المثالية للديمو بين 30-60 ثانية</li>
              <li>• يفضل استخدام جودة صوت 128kbps أو أعلى</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
