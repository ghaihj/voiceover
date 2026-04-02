// app/admin/page.tsx - الرئيسية مع بيانات حقيقية
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  full_name: string;
  // ... other fields
}

interface Demo {
  id: number;
  title: string;
  // ... other fields
}

export default function AdminDashboard() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    orders: 0,
    demos: 0,
    projects: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout, role } = useAuth();
  const token = localStorage.getItem("token");

  // التحقق من الصلاحيات
  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [router, role, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب عدد الطلبات
      const ordersResponse = await fetch(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ordersData = await ordersResponse.json();
      const ordersCount = ordersData.data?.length || ordersData.count || 0;

      // جلب عدد الديموهات
      const demosResponse = await fetch(`${BASE_URL}/demos`, {});
      const demosData = await demosResponse.json();
      const demosCount = demosData.data?.length || demosData.count || 0;

      // جلب عدد المشاريع (إذا كان لديك API للمشاريع)
      let projectsCount = 0;
      try {
        const projectsResponse = await fetch(`${BASE_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const projectsData = await projectsResponse.json();
        projectsCount = projectsData.data?.length || projectsData.count || 0;
      } catch (err) {
        console.error("Error fetching projects:", err);
      }

      // جلب عدد العملاء (إذا كان لديك API للعملاء)
      let clientsCount = 0;
      try {
        const clientsResponse = await fetch(`${BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const clientsData = await clientsResponse.json();
        clientsCount = clientsData.data?.length || clientsData.count || 0;
      } catch (err) {
        console.error("Error fetching clients:", err);
      }

      setStats({
        orders: ordersCount,
        demos: demosCount,
        projects: projectsCount,
        clients: clientsCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const statItems = [
    {
      name: "إجمالي الطلبات",
      value: stats.orders,
      icon: "💬",
      link: "/admin/orders",
    },
    { name: "الديموهات", value: stats.demos, icon: "🎵", link: "/admin/demos" },
    {
      name: "المشاريع",
      value: stats.projects,
      icon: "🎬",
      link: "/admin/projects",
    },
    {
      name: "العملاء",
      value: stats.clients,
      icon: "👥",
      link: "/admin/clients",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={fetchStats}
          className="mr-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Logout Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          مرحباً بك في لوحة التحكم
        </h2>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-yellow-500 transition-colors cursor-pointer group"
            onClick={() => router.push(stat.link)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                عرض التفاصيل →
              </span>
            </div>
            <p className="text-gray-400 text-sm">{stat.name}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/admin/demos/new")}
          className="bg-yellow-500 text-black p-4 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
        >
          + رفع ديمو جديد
        </button>
        <button
          onClick={() => router.push("/admin/projects/new")}
          className="bg-gray-900 text-white p-4 rounded-xl font-semibold border border-gray-800 hover:bg-gray-800 transition-colors"
        >
          + إضافة مشروع
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-white mb-2">
                تسجيل الخروج
              </h3>
              <p className="text-gray-400 mb-6">
                هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
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
    </div>
  );
}
