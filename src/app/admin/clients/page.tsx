// app/admin/clients/page.tsx
"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  text: string;
  category: string;
  type: string;
  status: string;
  created_at: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const { role, token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  // التحقق من الصلاحيات
  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    fetchData();
  }, [role, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // جلب العملاء والطلبات معاً
      const [usersRes, ordersRes] = await Promise.all([
        fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();

      setClients(usersData.data);
      setAllOrders(ordersData.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // حساب عدد الطلبات لكل عميل ديناميكياً
  const getClientOrdersCount = (userId: number) => {
    return allOrders.filter((order) => order.user_id === userId).length;
  };

  // جلب طلبات عميل معين
  const fetchClientOrders = async (userId: number) => {
    setLoadingOrders(true);
    // تصفية الطلبات من البيانات المخزنة محلياً
    const orders = allOrders.filter((order) => order.user_id === userId);
    setClientOrders(orders);
    setLoadingOrders(false);
  };

  const handleViewOrders = async (client: Client) => {
    setSelectedClient(client);
    await fetchClientOrders(client.id);
    setShowOrdersModal(true);
  };

  const handleViewPhone = (phone: string, name: string) => {
    setSelectedPhone(phone);
    setSelectedName(name);
    setShowPhoneModal(true);
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "غير موجود";
    if (phone.startsWith("09") && phone.length === 10) return phone;
    if (phone.startsWith("9") && phone.length === 9) return `0${phone}`;
    return phone;
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.includes(searchTerm) ||
      client.email?.includes(searchTerm) ||
      client.phone?.includes(searchTerm);
    return matchesSearch;
  });

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-500";
      case "user":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getRoleText = (role?: string) => {
    switch (role) {
      case "admin":
        return "مدير";
      case "user":
        return "مستخدم";
      default:
        return "مستخدم";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "processing":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد التنفيذ";
      default:
        return "جديد";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">جاري تحميل العملاء...</div>
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
              <span className="text-yellow-500">العملاء</span>
            </h1>
            <p className="text-gray-400">إدارة جميع العملاء المسجلين</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            تحديث
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">
              {clients.length}
            </div>
            <div className="text-sm text-gray-400">إجمالي العملاء</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white">
              {allOrders.length}
            </div>
            <div className="text-sm text-gray-400">إجمالي الطلبات</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">👑</div>
            <div className="text-2xl font-bold text-white">
              {clients.filter((c) => c.role === "admin").length}
            </div>
            <div className="text-sm text-gray-400">المدراء</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">🆕</div>
            <div className="text-2xl font-bold text-white">
              {
                clients.filter(
                  (c) =>
                    new Date(c.created_at) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                ).length
              }
            </div>
            <div className="text-sm text-gray-400">عملاء جدد (شهر)</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="بحث بالاسم، البريد، أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        {filteredClients.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400 text-lg">لا توجد عملاء</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/50">
                    <th className="text-right p-4 text-gray-400 font-medium">
                      #
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الاسم
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      البريد الإلكتروني
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      رقم الهاتف
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الدور
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      تاريخ التسجيل
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      عدد الطلبات
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr
                      key={client.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 text-gray-400">#{index + 1}</td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {client.name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{client.email}</td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleViewPhone(client.phone, client.name)
                          }
                          className="text-white dir-ltr text-left hover:text-yellow-500 transition-colors"
                        >
                          {formatPhoneNumber(client.phone)}
                        </button>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(client.role)}`}
                        >
                          {getRoleText(client.role)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm">
                          {getClientOrdersCount(client.id)} طلب
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewOrders(client)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            عرض الطلبات
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal لعرض طلبات العميل مع معلومات العميل */}
      {showOrdersModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                طلبات العميل: {selectedClient.name}
              </h3>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* معلومات العميل */}
            <div className="p-6 border-b border-gray-800 bg-black/30">
              <h4 className="text-lg font-semibold text-yellow-500 mb-4">
                معلومات العميل
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-500">الاسم الكامل</label>
                  <p className="text-white font-medium mt-1">
                    {selectedClient.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    البريد الإلكتروني
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedClient.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">رقم الهاتف</label>
                  <p className="text-white font-medium mt-1 dir-ltr text-left">
                    {formatPhoneNumber(selectedClient.phone)}
                  </p>
                  {selectedClient.phone && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          window.location.href = `tel:${selectedClient.phone}`;
                        }}
                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                      >
                        اتصال
                      </button>
                      <button
                        onClick={() => {
                          let cleanPhone = selectedClient.phone.replace(
                            /[^0-9]/g,
                            "",
                          );
                          if (cleanPhone.startsWith("0")) {
                            cleanPhone = "963" + cleanPhone.substring(1);
                          }
                          if (!cleanPhone.startsWith("963")) {
                            cleanPhone = "963" + cleanPhone;
                          }
                          window.open(`https://wa.me/${cleanPhone}`, "_blank");
                        }}
                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                      >
                        واتساب
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* الطلبات */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-yellow-500 mb-4">
                الطلبات
              </h4>
              {loadingOrders ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-yellow-500 text-lg">
                    جاري تحميل الطلبات...
                  </div>
                </div>
              ) : clientOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400">لا توجد طلبات لهذا العميل</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-black rounded-xl p-4 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-500 text-xl">📋</span>
                          <span className="text-white font-medium">
                            طلب #{order.id}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">الفئة:</span>
                          <span className="text-white mr-2">
                            {order.category || "غير محدد"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">النوع:</span>
                          <span className="text-white mr-2">
                            {order.type || "عام"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">النص:</span>
                          <p className="text-white mt-1 text-sm">
                            {order.text?.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setShowOrdersModal(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal لعرض رقم الهاتف بشكل كامل */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                رقم هاتف: {selectedName}
              </h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">📞</div>
              <p className="text-gray-400 mb-2">رقم الهاتف:</p>
              <p className="text-2xl font-bold text-yellow-500 dir-ltr">
                {selectedPhone || "غير موجود"}
              </p>
              {selectedPhone && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      window.location.href = `tel:${selectedPhone}`;
                    }}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📞</span>
                    اتصال
                  </button>
                  <button
                    onClick={() => {
                      let cleanPhone = selectedPhone.replace(/[^0-9]/g, "");
                      if (cleanPhone.startsWith("0")) {
                        cleanPhone = "963" + cleanPhone.substring(1);
                      }
                      if (!cleanPhone.startsWith("963")) {
                        cleanPhone = "963" + cleanPhone;
                      }
                      window.open(`https://wa.me/${cleanPhone}`, "_blank");
                    }}
                    className="flex-1 py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    واتساب
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
