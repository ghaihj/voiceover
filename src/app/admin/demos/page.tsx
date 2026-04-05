// app/demos/page.tsx
"use client";
import { useState, useEffect } from "react";
import { VoiceDemoCard } from "@/components/VoiceDemoCard";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Demo {
  id: number;
  title: string;
  category: string;
  duration: string;
  audio: string;
  icon?: string;
  gradient?: string;
  created_at?: string;
}

export default function DemosPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // التحقق من صلاحيات المشرف
  const [isAdmin, setIsAdmin] = useState(true);

  const { user, role, token } = useAuth();
  useEffect(() => {
    if (!user && role !== "admin") {
      router.push("/login");
    }
  }, []);

  // جلب الديموهات من API
  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/demos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      console.log(data);
      setDemos(data.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل الديموهات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/demos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        setDemos(demos.filter((demo) => demo.id !== id));
        setShowDeleteConfirm(false);
        setDeletingId(null);
      } else {
        setError("حدث خطأ في حذف الديمو");
      }
    } catch (err) {
      setError("حدث خطأ في حذف الديمو");
    }
  };

  const handleView = (demo: Demo) => {
    setSelectedDemo(demo);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/demos/edit/${id}`);
  };

  // الحصول على قائمة الفئات الفريدة
  const categories = ["all", ...new Set(demos.map((demo) => demo.category))];

  // فلترة الديموهات
  const filteredDemos = demos.filter((demo) => {
    const matchesSearch =
      demo.title?.includes(searchTerm) || demo.category?.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || demo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // دالة للحصول على أيقونة حسب الفئة
  const getIconByCategory = (category: string): string => {
    const icons: { [key: string]: string } = {
      إعلان: "📺",
      وثائقي: "🎬",
      "موشن جرافيك": "🎯",
      يوتيوب: "▶️",
      دوبلاج: "🎭",
      IVR: "📞",
      إعلانات: "📺",
      وثائقيات: "🎬",
      شركات: "📞",
    };
    return icons[category] || "🎵";
  };

  // دالة للحصول على تدرج لوني حسب الفئة
  const getGradientByCategory = (category: string): string => {
    const gradients: { [key: string]: string } = {
      إعلان: "from-yellow-500 to-yellow-700",
      وثائقي: "from-yellow-600 to-yellow-800",
      "موشن جرافيك": "from-yellow-500 to-yellow-700",
      يوتيوب: "from-yellow-600 to-yellow-800",
      دوبلاج: "from-yellow-500 to-yellow-700",
      IVR: "from-yellow-600 to-yellow-800",
      إعلانات: "from-yellow-500 to-yellow-700",
      وثائقيات: "from-yellow-600 to-yellow-800",
      شركات: "from-yellow-600 to-yellow-800",
    };
    return gradients[category] || "from-yellow-500 to-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-yellow-500 text-lg">
              جاري تحميل الديموهات...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">استمع إلى </span>
            <span className="text-yellow-500">ديموهاتنا</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            مجموعة متنوعة من الديموهات الصوتية لجميع أنواع التعليقات
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="بحث بالاسم أو الفئة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "جميع الفئات" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-400">
            عدد الديموهات:{" "}
            <span className="text-yellow-500 font-bold">
              {filteredDemos.length}
            </span>
          </p>
          {isAdmin && (
            <button
              onClick={() => router.push("/admin/demos/new")}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              + إضافة ديمو جديد
            </button>
          )}
        </div>

        {/* Demos Grid */}
        {filteredDemos.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-gray-400 text-lg">لا توجد ديموهات متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo) => (
              <div key={demo.id} className="relative group">
                <VoiceDemoCard
                  title={demo.title}
                  category={demo.category}
                  duration={demo.duration}
                  // icon={getIconByCategory(demo.category)}
                  // gradient={getGradientByCategory(demo.category)}
                  audio={demo.audio}
                />

                {/* أزرار التحكم للمشرف */}
                {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2  group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(demo)}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      عرض
                    </button>
                    <button
                      onClick={() => handleEdit(demo.id)}
                      className="px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(demo.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal لعرض التفاصيل */}
      {showModal && selectedDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">تفاصيل الديمو</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">العنوان</label>
                  <p className="text-white font-medium mt-1">
                    {selectedDemo.title}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">الفئة</label>
                  <p className="text-white font-medium mt-1">
                    {selectedDemo.category}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">المدة</label>
                  <p className="text-white font-medium mt-1">
                    {selectedDemo.duration}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">المعرف</label>
                  <p className="text-white font-medium mt-1">
                    #{selectedDemo.id}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">الملف الصوتي</label>
                <div className="mt-2">
                  <audio controls className="w-full" src={selectedDemo.audio}>
                    متصفحك لا يدعم تشغيل الصوت
                  </audio>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => handleEdit(selectedDemo.id)}
                className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                تعديل
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تأكيد الحذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-gray-400 mb-6">
                هل أنت متأكد من حذف هذا الديمو؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deletingId && handleDelete(deletingId)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition-colors"
                >
                  نعم، حذف
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingId(null);
                  }}
                  className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
