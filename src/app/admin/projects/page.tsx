// app/admin/projects/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

interface Project {
  id: number;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  created_at?: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const token = localStorage.getItem("token");
  // التحقق من الصلاحيات
  useEffect(() => {
    if (!user && role !== "admin") {
      router.push("/login");
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProjects(data.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل المشاريع");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== id));
        setShowDeleteConfirm(false);
        setDeletingId(null);
      } else {
        setError("حدث خطأ في حذف المشروع");
      }
    } catch (err) {
      setError("حدث خطأ في حذف المشروع");
    }
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/projects/edit/${id}`);
  };

  // الحصول على قائمة الفئات الفريدة
  const categories = [
    "all",
    ...new Set(projects.map((project) => project.category)),
  ];

  // فلترة المشاريع
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.includes(searchTerm) ||
      project.category?.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
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
      تدريب: "📚",
      تلفزيون: "📺",
      إذاعي: "🎙️",
    };
    return icons[category] || "🎬";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">جاري تحميل المشاريع...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">إدارة </span>
              <span className="text-yellow-500">المشاريع</span>
            </h1>
            <p className="text-gray-400">إدارة جميع المشاريع المنجزة</p>
          </div>
          <button
            onClick={() => router.push("/admin/projects/new")}
            className="px-5 py-2.5 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
          >
            + إضافة مشروع جديد
          </button>
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
        <div className="mb-6">
          <p className="text-gray-400">
            عدد المشاريع:{" "}
            <span className="text-yellow-500 font-bold">
              {filteredProjects.length}
            </span>
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">لا توجد مشاريع</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="relative group">
                {/* بطاقة المشروع */}
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
                  {/* الصورة المصغرة */}
                  <div className="relative aspect-video">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xl">▶️</span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                      {project.duration}
                    </div>
                  </div>

                  {/* معلومات المشروع */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {getIconByCategory(project.category)}
                      </span>
                      <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="absolute top-4 left-4 flex gap-2 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(project)}
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    عرض
                  </button>
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="px-3 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(project.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal لعرض التفاصيل */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">تفاصيل المشروع</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* الفيديو */}
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={selectedProject.videoUrl}
                  title={selectedProject.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* المعلومات */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">العنوان</label>
                  <p className="text-white font-medium mt-1">
                    {selectedProject.title}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">الفئة</label>
                  <p className="text-white font-medium mt-1">
                    {selectedProject.category}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">المدة</label>
                  <p className="text-white font-medium mt-1">
                    {selectedProject.duration}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">المعرف</label>
                  <p className="text-white font-medium mt-1">
                    #{selectedProject.id}
                  </p>
                </div>
              </div>

              {/* رابط الفيديو */}
              <div>
                <label className="text-sm text-gray-500">رابط الفيديو</label>
                <p className="text-yellow-500 text-sm mt-1 break-all">
                  {selectedProject.videoUrl}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => handleEdit(selectedProject.id)}
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
                هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
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
