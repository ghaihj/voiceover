// app/admin/contact/page.tsx
"use client";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ContactMessagesPage() {
  const router = useRouter();
  const { role, token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // التحقق من الصلاحيات
  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data.data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(messages.filter((message) => message.id !== id));
        setShowDeleteConfirm(false);
        setDeletingId(null);
        if (selectedMessage?.id === id) {
          setShowModal(false);
          setSelectedMessage(null);
        }
      } else {
        setError("حدث خطأ في حذف الرسالة");
      }
    } catch (err) {
      setError("حدث خطأ في حذف الرسالة");
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setUpdatingStatus(id);

      // محاولة PATCH أولاً
      let response = await fetch(`${BASE_URL}/contacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      // إذا فشل PATCH، جرب POST مع _method
      if (!response.ok) {
        response = await fetch(`${BASE_URL}/contacts/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
            _method: "PATCH",
          }),
        });
      }

      console.log("Update response status:", response.status);

      if (response.ok) {
        // تحديث القائمة محلياً
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === id ? { ...message, status } : message,
          ),
        );

        // تحديث الرسالة المحددة إذا كانت مفتوحة
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }

        console.log(`تم تحديث حالة الرسالة ${id} إلى ${status}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        setError(errorData.message || "حدث خطأ في تحديث الحالة");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("حدث خطأ في تحديث الحالة");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleView = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

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
      `مرحباً ${name}،\n\nنشكرك على تواصلك مع صوتي! سنقوم بالرد على استفسارك في أقرب وقت.\n\nتحياتنا،\nفريق صوتي`,
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name?.includes(searchTerm) ||
      message.email?.includes(searchTerm) ||
      message.subject?.includes(searchTerm) ||
      message.message?.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" || message.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "read":
        return "bg-green-500/20 text-green-500";
      case "unread":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "read":
        return "مقروءة";
      case "unread":
        return "غير مقروءة";
      default:
        return "غير مقروءة";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-yellow-500 text-lg">جاري تحميل الرسائل...</div>
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
              <span className="text-white">رسائل </span>
              <span className="text-yellow-500">الاتصال</span>
            </h1>
            <p className="text-gray-400">إدارة جميع رسائل الاتصال من العملاء</p>
          </div>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            تحديث
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">📧</div>
            <div className="text-2xl font-bold text-white">
              {messages.length}
            </div>
            <div className="text-sm text-gray-400">إجمالي الرسائل</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">🆕</div>
            <div className="text-2xl font-bold text-white">
              {messages.filter((m) => m.status === "unread").length}
            </div>
            <div className="text-sm text-gray-400">غير مقروءة</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-yellow-500 text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-white">
              {messages.filter((m) => m.status === "read").length}
            </div>
            <div className="text-sm text-gray-400">مقروءة</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="بحث بالاسم، البريد، أو الموضوع..."
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
              <option value="all">جميع الرسائل</option>
              <option value="unread">غير مقروءة</option>
              <option value="read">مقروءة</option>
            </select>
          </div>
        </div>

        {/* Messages Table */}
        {filteredMessages.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">لا توجد رسائل</p>
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
                      الموضوع
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الحالة
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      التاريخ
                    </th>
                    <th className="text-right p-4 text-gray-400 font-medium">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message, index) => (
                    <tr
                      key={message.id}
                      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                        message.status === "unread" ? "bg-yellow-500/5" : ""
                      }`}
                    >
                      <td className="p-4 text-gray-400">#{index + 1}</td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {message.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.phone}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{message.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm">
                          {message.subject || "عام"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={message.status}
                            onChange={(e) =>
                              handleStatusUpdate(message.id, e.target.value)
                            }
                            disabled={updatingStatus === message.id}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-none focus:outline-none ${getStatusColor(message.status)} bg-black/50 cursor-pointer`}
                          >
                            <option value="unread">غير مقروءة</option>
                            <option value="read">مقروءة</option>
                          </select>
                          {updatingStatus === message.id && (
                            <span className="text-xs text-yellow-500">
                              جاري...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(message)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(message.id);
                              setShowDeleteConfirm(true);
                            }}
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
      </div>

      {/* Modal لعرض تفاصيل الرسالة */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">تفاصيل الرسالة</h3>
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
                  <label className="text-sm text-gray-500">الاسم</label>
                  <p className="text-white font-medium mt-1">
                    {selectedMessage.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    البريد الإلكتروني
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedMessage.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">رقم الهاتف</label>
                  <p className="text-white font-medium mt-1 dir-ltr text-left">
                    {selectedMessage.phone || "غير موجود"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">الموضوع</label>
                  <p className="text-white font-medium mt-1">
                    {selectedMessage.subject || "عام"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">الحالة</label>
                  <div className="mt-1">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) =>
                        handleStatusUpdate(selectedMessage.id, e.target.value)
                      }
                      disabled={updatingStatus === selectedMessage.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${getStatusColor(selectedMessage.status)} bg-black/50 cursor-pointer`}
                    >
                      <option value="unread">غير مقروءة</option>
                      <option value="read">مقروءة</option>
                    </select>
                    {updatingStatus === selectedMessage.id && (
                      <span className="text-xs text-yellow-500 mr-2">
                        جاري...
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">تاريخ الإرسال</label>
                  <p className="text-white font-medium mt-1">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">الرسالة</label>
                <div className="mt-2 p-4 bg-black rounded-lg border border-gray-800">
                  <p className="text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() =>
                  handleWhatsAppReply(
                    selectedMessage.phone,
                    selectedMessage.name,
                  )
                }
                className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
              >
                <span>💬</span>
                الرد عبر واتساب
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setDeletingId(selectedMessage.id);
                  setShowDeleteConfirm(true);
                }}
                className="flex-1 py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
              >
                حذف الرسالة
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
                هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
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
