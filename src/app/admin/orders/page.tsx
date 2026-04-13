// app/admin/orders/page.tsx
"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  full_name: string;
  phone: string;
  text: string;
  category: string;
  type: string;
  user_id: number;
  notes: string;
  status?: string;
  created_at?: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const router = useRouter();
  const { user, role, token } = useAuth();

  useEffect(() => {
    if (!user && role !== "admin") {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        await fetch(`${BASE_URL}/orders/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(orders.filter((order) => order.id !== id));
      } catch (err) {
        setError("حدث خطأ في حذف الطلب");
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setUpdatingStatus(id);

      const response = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, _method: "PATCH" }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status } : order,
          ),
        );

        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      setError("حدث خطأ في تحديث الحالة");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // دالة الرد عبر واتساب
  const handleWhatsAppReply = (phone: string, name: string) => {
    // تنظيف رقم الهاتف
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    // إذا كان الرقم يبدأ بـ 0، أزل الصفر وأضف 963
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "963" + cleanPhone.substring(1);
    }
    // إذا كان الرقم لا يحتوي على رمز الدولة
    if (!cleanPhone.startsWith("963") && !cleanPhone.startsWith("00963")) {
      cleanPhone = "963" + cleanPhone;
    }

    const message = encodeURIComponent(
      `مرحباً ${name}،\n\nنشكرك على تواصلك مع صوتي! تم استلام طلبك وسنقوم بالرد عليك في أقرب وقت.\n\nتفاصيل طلبك:\n• الفئة: ${selectedOrder?.category || "غير محدد"}\n• النوع: ${selectedOrder?.type || "عام"}\n\nللاستفسار السريع، يمكنك التواصل معنا على هذا الرقم.\n\nتحياتنا،\nفريق صوتي`,
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name?.includes(searchTerm) ||
      order.phone?.includes(searchTerm) ||
      order.category?.includes(searchTerm) ||
      order.status?.includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "processing":
        return "bg-blue-500/20 text-blue-500";
      case "received":
        return "bg-purple-500/20 text-purple-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "processing":
        return "قيد التنفيذ";
      case "received":
        return "تم استلام الطلب";
      case "pending":
        return "قيد الانتظار";
      default:
        return "جديد";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">جاري تحميل الطلبات...</div>
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
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-white">إدارة </span>
            <span className="text-yellow-500">الطلبات</span>
          </h1>
          <p className="text-gray-400">إدارة جميع طلبات التعليق الصوتي</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="بحث بالاسم، رقم الهاتف، الفئة أو الحالة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="received">تم استلام الطلب</option>
              <option value="processing">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">📋</div>
            <div className="text-2xl font-bold text-white">{orders.length}</div>
            <div className="text-sm text-gray-400">إجمالي الطلبات</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "pending").length}
            </div>
            <div className="text-sm text-gray-400">قيد الانتظار</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-purple-500 text-2xl mb-2">📬</div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "received").length}
            </div>
            <div className="text-sm text-gray-400">تم استلام الطلب</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-blue-500 text-2xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "processing").length}
            </div>
            <div className="text-sm text-gray-400">قيد التنفيذ</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-green-500 text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "completed").length}
            </div>
            <div className="text-sm text-gray-400">مكتمل</div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">لا توجد طلبات</p>
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
                      رقم الهاتف
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الفئة
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      النوع
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الحالة
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 text-gray-400">#{index + 1}</td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {order.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {order.user_id}
                        </div>
                      </td>
                      <td className="p-4 text-white dir-ltr text-left">
                        {order.phone}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm">
                          {order.category || "غير محدد"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {order.type || "عام"}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-none focus:outline-none ${getStatusColor(order.status)} bg-black/50 cursor-pointer`}
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="received">تم استلام الطلب</option>
                          <option value="processing">قيد التنفيذ</option>
                          <option value="completed">مكتمل</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "completed")
                            }
                            disabled={updatingStatus === order.id}
                            className="px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
                          >
                            تم
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                          >
                            حذف
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

        {/* Modal for Order Details */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white">
                  تفاصيل الطلب #{selectedOrder.id}
                </h3>
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
                    <label className="text-sm text-gray-500">
                      الاسم الكامل
                    </label>
                    <p className="text-white font-medium mt-1">
                      {selectedOrder.full_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">رقم الهاتف</label>
                    <p className="text-white font-medium mt-1 dir-ltr">
                      {selectedOrder.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">الفئة</label>
                    <p className="text-white font-medium mt-1">
                      {selectedOrder.category || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">النوع</label>
                    <p className="text-white font-medium mt-1">
                      {selectedOrder.type || "عام"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      رقم المستخدم
                    </label>
                    <p className="text-white font-medium mt-1">
                      {selectedOrder.user_id || "غير مسجل"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">الحالة</label>
                    <select
                      value={selectedOrder.status || "pending"}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        handleStatusUpdate(selectedOrder.id, newStatus);
                        setSelectedOrder({
                          ...selectedOrder,
                          status: newStatus,
                        });
                      }}
                      className={`mt-1 px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${getStatusColor(selectedOrder.status)} bg-black/50 cursor-pointer`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="received">تم استلام الطلب</option>
                      <option value="processing">قيد التنفيذ</option>
                      <option value="completed">مكتمل</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">نص الطلب</label>
                  <p className="text-white mt-1 p-3 bg-black rounded-lg border border-gray-800">
                    {selectedOrder.text || "لا يوجد نص"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">ملاحظات</label>
                  <p className="text-white mt-1 p-3 bg-black rounded-lg border border-gray-800">
                    {selectedOrder.notes || "لا توجد ملاحظات"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-800">
                <button
                  onClick={() =>
                    handleWhatsAppReply(
                      selectedOrder.phone,
                      selectedOrder.full_name,
                    )
                  }
                  className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  الرد عبر واتساب
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedOrder.id, "completed")
                  }
                  disabled={updatingStatus === selectedOrder.id}
                  className="flex-1 py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  تم الإنجاز
                </button>
                <button
                  onClick={() => handleDelete(selectedOrder.id)}
                  className="flex-1 py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                >
                  حذف الطلب
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
      </div>
    </div>
  );
}
