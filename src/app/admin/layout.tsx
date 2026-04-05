// app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("أحمد المدير");
  const [adminEmail, setAdminEmail] = useState("admin@sawti.com");
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();

  // جلب بيانات المدير من الـ API
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!user && role === "user") {
          router.push("/");
        }

        const response = await fetch(`${BASE_URL}/admin/profile`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminName(data.data.name || "أحمد المدير");
          setAdminEmail(data.data.email || "admin@sawti.com");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [router]);

  const menuItems = [
    {
      name: "الطلبات",
      icon: "💬",
      href: "/admin/orders",
    },
    {
      name: "الديموهات",
      icon: "🎵",
      href: "/admin/demos",
      submenu: [
        { name: "جميع الديموهات", href: "/admin/demos" },
        { name: "إضافة ديمو", href: "/admin/demos/new" },
      ],
    },
    {
      name: "المشاريع",
      icon: "🎬",
      href: "/admin/projects",
      submenu: [
        { name: "جميع المشاريع", href: "/admin/projects" },
        { name: "إضافة مشروع", href: "/admin/projects/new" },
      ],
    },
    {
      name: "العملاء",
      icon: "👥",
      href: "/admin/clients",
    },
    {
      name: "رسائل التواصل",
      icon: "💬",
      href: "/admin/contacts",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 z-40 h-screen transition-all duration-300
          bg-gray-900 border-l border-gray-800
          ${isSidebarOpen ? "w-64" : "w-20"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-800">
          {isSidebarOpen ? (
            <Link href="/admin" className="text-2xl font-bold">
              <span className="text-white">صوت</span>
              <span className="text-yellow-500">ي</span>
              <span className="text-yellow-600">!</span>
              <span className="text-sm text-gray-500 mr-2">Admin</span>
            </Link>
          ) : (
            <span className="text-2xl font-bold text-yellow-500 mx-auto">
              ص
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                {item.submenu ? (
                  <MenuItemWithSubmenu
                    item={item}
                    isSidebarOpen={isSidebarOpen}
                    pathname={pathname}
                  />
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors
                      ${
                        pathname === item.href
                          ? "bg-yellow-500 text-black"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${isSidebarOpen ? "mr-64" : "mr-20"}
        `}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800 h-20">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">
                {menuItems.find(
                  (item) =>
                    pathname.includes(item.href) ||
                    item.submenu?.some((sub) => pathname.includes(sub.href)),
                )?.name || "لوحة التحكم"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <span className="text-gray-400">🔔</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-black font-bold">
                    {adminName.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{adminName}</p>
                  <p className="text-xs text-gray-500">{adminEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// Menu Item with Submenu Component
function MenuItemWithSubmenu({ item, isSidebarOpen, pathname }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg
          transition-colors text-gray-400 hover:bg-gray-800 hover:text-white
        `}
      >
        <span className="text-xl">{item.icon}</span>
        {isSidebarOpen && (
          <>
            <span className="flex-1 text-right">{item.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>
      {isOpen && isSidebarOpen && (
        <ul className="mr-8 mt-2 space-y-1">
          {item.submenu.map((subItem: any) => (
            <li key={subItem.href}>
              <Link
                href={subItem.href}
                className={`
                  block px-4 py-2 text-sm rounded-lg transition-colors
                  ${
                    pathname === subItem.href
                      ? "bg-yellow-500 text-black"
                      : "text-gray-500 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
