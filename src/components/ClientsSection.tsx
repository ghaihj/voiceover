// components/ClientsSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Client {
  id: number;
  name: string;
  logo: string;
}

const clients: Client[] = [
  // الصف الأول - إعلام وقنوات
  { id: 1, name: "MBC", logo: "/clients/mbc.svg" },
  { id: 2, name: "Al Jazeera", logo: "/clients/aljazeera.svg" },
  { id: 3, name: "Rotana", logo: "/clients/rotana.svg" },
  { id: 4, name: "Dubai TV", logo: "/clients/dubaitv.svg" },
  { id: 5, name: "Saudi TV", logo: "/clients/sauditv.svg" },
  { id: 6, name: "Qatar TV", logo: "/clients/qatartv.svg" },
];

export const ClientsSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // تقسيم العملاء إلى صفوف
  const rows = [];
  for (let i = 0; i < clients.length; i += 6) {
    rows.push(clients.slice(i, i + 6));
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* عنوان القسم - أبيض */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            عملاؤنا حول العالم
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نفتخر بثقة كبرى الشركات والإعلاميين في 25 دولة
          </p>
        </div>

        {/* إحصائيات سريعة - بيضاء مع ذهبي */}
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

        {/* شبكة العملاء - بطاقات بالألوان المطلوبة */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

// مكون بطاقة العميل - بالألوان المطلوبة مع أنيميشن
interface ClientCardProps {
  client: Client;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
}

const ClientCard = ({ client, hoveredId, setHoveredId }: ClientCardProps) => {
  // ألوان مختلفة للبطاقات
  const getCardStyle = (id: number) => {
    const styles = [
      "from-yellow-400 to-yellow-600 text-black", // ذهبي
      "from-gray-100 to-white text-black", // أبيض
      "from-gray-900 to-black text-white", // أسود
    ];
    return styles[id % 3];
  };

  const cardStyle = getCardStyle(client.id);
  const isDarkCard = client.id % 3 === 2; // البطاقة السوداء

  // تحديد نوع الأنيميشن بناءً على لون البطاقة
  const getAnimation = (id: number) => {
    const animations = [
      "animate-gold-pulse", // للذهبي
      "animate-white-shine", // للأبيض
      "animate-black-wave", // للأسود
    ];
    return animations[id % 3];
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
        {/* أنيميشن مخصص لكل بطاقة */}
        <div className={`absolute inset-0 ${getAnimation(client.id)}`}></div>

        {/* اسم الشركة */}
        <span
          className={`
          relative z-10 font-bold text-lg
          ${isDarkCard ? "text-white" : "text-black"}
          ${hoveredId === client.id ? "opacity-100" : "opacity-90"}
          transition-opacity
        `}
        >
          {client.name}
        </span>
      </div>

      {/* اسم العميل يظهر عند التحويم */}
      <div
        className={`
          absolute -bottom-8 left-1/2 transform -translate-x-1/2
          bg-gray-900 text-white text-sm px-3 py-1 rounded-full
          whitespace-nowrap border border-gray-700
          transition-all duration-300
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
