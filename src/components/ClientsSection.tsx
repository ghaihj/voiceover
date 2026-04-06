// components/ClientsSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Client {
  id: number;
  name: string;
  logo: string;
  alt: string;
}

const clients: Client[] = [
  // الصف الأول - إعلام وقنوات
  {
    id: 1,
    name: "UAEU",
    logo: "/logos/United-Arab-Emirates-University-(UAEU).svg",
    alt: "United Arab Emirates University",
  },
  {
    id: 2,
    name: "ADNOC",
    logo: "/logos/ADNOC-.svg",
    alt: "Al Jazeera Network",
  },
  {
    id: 3,
    name: "TOYOTA",
    logo: "/logos/Toyota.svg",
    alt: "Rotana Media Group",
  },
  {
    id: 4,
    name: "CITI BANK",
    logo: "/logos/3840px-Citi.svg.png",
    alt: "Dubai Television",
  },
  {
    id: 5,
    name: "TDRA",
    logo: "/logos/Telecommunications-Regulatory-Authority-(TRA)-and-the-Digital-Government.svg",
    alt: "Saudi Television",
  },
  {
    id: 6,
    name: "ASTER DM HEALTHCARE",
    logo: "/logos/3840px-Aster_DM_Healthcare_Logo.svg.png",
    alt: "Qatar Television",
  },
  {
    id: 7,
    name: "CHAM WINGS",
    logo: "/logos/idMJY2hFu5_1775496763731.svg",
    alt: "Saudi Television",
  },
  {
    id: 8,
    name: "Sharjah Broadcasting Authority",
    logo: "/logos/Sharjah-Broadcasting-Authority.svg",
    alt: "Saudi Television",
  },
  {
    id: 9,
    name: "Smart Dubai",
    logo: "/logos/Smart-Dubai.svg",
    alt: "Saudi Television",
  },
  {
    id: 10,
    name: "Government-of-Abu-Dhabi",
    logo: "/logos/Government-of-Abu-Dhabi.svg",
    alt: "Saudi Television",
  },
  {
    id: 11,
    name: "Abu-Dhabi-Islamic-Bank-(ADIB)",
    logo: "/logos/Abu-Dhabi-Islamic-Bank-(ADIB).svg",
    alt: "Saudi Television",
  },
];

export const ClientsSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});

  const handleImageError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // تقسيم العملاء إلى صفوف
  const rows = [];
  for (let i = 0; i < clients.length; i += 6) {
    rows.push(clients.slice(i, i + 6));
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* خلفية بنمط شبكي ذهبي خفيف */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,215,0,0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* عنوان القسم */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">عملاؤنا </span>
            <span className="text-yellow-500">حول العالم</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نفتخر بثقة كبرى الشركات والإعلاميين في 25 دولة
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="flex justify-center gap-16 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">+300</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              شركة
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">+25</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              دولة
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">+150</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              قناة
            </div>
          </div>
        </div>

        {/* شبكة العملاء */}
        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {row.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  hasError={imgErrors[client.id]}
                  onImageError={() => handleImageError(client.id)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* دعوة للانضمام */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-900 px-8 py-4 rounded-full border border-gray-800">
            <span className="text-yellow-500">✨</span>
            <span className="text-gray-300">
              انضم إلى أكثر من 300 شركة تثق في خدماتنا
            </span>
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors mr-2">
              ← عرض جميع العملاء
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// مكون بطاقة العميل
interface ClientCardProps {
  client: Client;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  hasError: boolean;
  onImageError: () => void;
}

const ClientCard = ({
  client,
  hoveredId,
  setHoveredId,
  hasError,
  onImageError,
}: ClientCardProps) => {
  // ألوان مختلفة للبطاقات
  const getCardStyle = (id: number) => {
    const styles = [
      "from-yellow-400 to-yellow-600", // ذهبي
      "from-gray-100 to-white", // أبيض
      "from-gray-900 to-black", // أسود
    ];
    return styles[id % 3];
  };

  const cardStyle = getCardStyle(client.id);
  const isDarkCard = client.id % 3 === 2; // البطاقة السوداء
  const isGoldCard = client.id % 3 === 0; // البطاقة الذهبية
  const isWhiteCard = client.id % 3 === 1; // البطاقة البيضاء

  // تحديد لون النص حسب لون البطاقة
  const getTextColor = () => {
    if (isDarkCard) return "text-white";
    if (isGoldCard) return "text-black";
    if (isWhiteCard) return "text-black";
    return "text-white";
  };

  // تحديد لون الخلفية للنص المساعد
  const getTooltipColor = () => {
    if (isGoldCard) return "bg-yellow-500 text-black border-yellow-400";
    if (isWhiteCard) return "bg-white text-black border-gray-300";
    return "bg-gray-900 text-white border-gray-700";
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setHoveredId(client.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className={`
          aspect-[3/2] rounded-xl
          bg-gradient-to-br ${cardStyle}
          border-2 border-transparent
          hover:border-yellow-500
          flex items-center justify-center
          p-4
          transform transition-all duration-300
          ${hoveredId === client.id ? "scale-105 shadow-xl" : "scale-100"}
          relative overflow-hidden
        `}
      >
        {/* الشعار */}
        {!hasError ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={client.logo}
              alt={client.alt}
              className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                hoveredId === client.id ? "scale-110" : "scale-100"
              }`}
              onError={onImageError}
            />
          </div>
        ) : (
          // إذا فشل تحميل الصورة، عرض اسم الشركة
          <span className={`relative z-10 font-bold text-lg ${getTextColor()}`}>
            {client.name}
          </span>
        )}
      </div>

      {/* اسم العميل يظهر عند التحويم */}
      <div
        className={`
          absolute -bottom-10 left-1/2 transform -translate-x-1/2
          ${getTooltipColor()}
          text-sm px-3 py-1.5 rounded-full
          whitespace-nowrap border
          transition-all duration-300
          shadow-lg
          ${
            hoveredId === client.id
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }
        `}
      >
        {client.name}
      </div>
    </div>
  );
};
