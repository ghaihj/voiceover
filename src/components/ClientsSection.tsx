// components/ClientsSection.tsx
"use client";

import { useState, useRef } from "react";

interface Client {
  id: number;
  name: string;
  logo: string;
  alt: string;
}

const clients: Client[] = [
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
    alt: "ADNOC",
  },
  {
    id: 3,
    name: "TOYOTA",
    logo: "/logos/Toyota.svg",
    alt: "Toyota",
  },
  {
    id: 4,
    name: "CITI BANK",
    logo: "/logos/3840px-Citi.svg.png",
    alt: "Citi Bank",
  },
  {
    id: 5,
    name: "TDRA",
    logo: "/logos/Telecommunications-Regulatory-Authority-(TRA)-and-the-Digital-Government.svg",
    alt: "TDRA",
  },
  {
    id: 6,
    name: "ASTER DM HEALTHCARE",
    logo: "/logos/3840px-Aster_DM_Healthcare_Logo.svg.png",
    alt: "Aster DM Healthcare",
  },
  {
    id: 7,
    name: "CHAM WINGS",
    logo: "/logos/idMJY2hFu5_1775496763731.svg",
    alt: "Cham Wings",
  },
  {
    id: 8,
    name: "Sharjah Broadcasting Authority",
    logo: "/logos/Sharjah-Broadcasting-Authority.svg",
    alt: "Sharjah Broadcasting Authority",
  },
  {
    id: 9,
    name: "Smart Dubai",
    logo: "/logos/Smart-Dubai.svg",
    alt: "Smart Dubai",
  },
  {
    id: 10,
    name: "Government-of-Abu-Dhabi",
    logo: "/logos/Government-of-Abu-Dhabi.svg",
    alt: "Government of Abu Dhabi",
  },
  {
    id: 11,
    name: "Abu-Dhabi-Islamic-Bank-(ADIB)",
    logo: "/logos/Abu-Dhabi-Islamic-Bank-(ADIB).svg",
    alt: "Abu Dhabi Islamic Bank",
  },
];

export const ClientsSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleImageError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // وظيفة التمرير
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

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

        {/* صف واحد مع تمرير أفقي */}
        <div className="relative group">
          {/* أزرار التمرير */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-yellow-500 text-white hover:text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-yellow-500 text-white hover:text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* حاوية التمرير */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {clients.map((client) => (
                <div key={client.id} className="w-48">
                  <ClientCard
                    client={client}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    hasError={imgErrors[client.id]}
                    onImageError={() => handleImageError(client.id)}
                  />
                </div>
              ))}
            </div>
          </div>
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

// مكون بطاقة العميل - جميع البطاقات بيضاء
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
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setHoveredId(client.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className={`
          aspect-[3/2] rounded-xl
          bg-white
          border-2 border-gray-200
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
              className={`
                max-w-full max-h-full object-contain transition-all duration-300
                ${hoveredId === client.id ? "scale-110" : "scale-100"}
              `}
              onError={onImageError}
            />
          </div>
        ) : (
          // إذا فشل تحميل الصورة، عرض اسم الشركة
          <span className="relative z-10 font-bold text-lg text-gray-800 text-center">
            {client.name}
          </span>
        )}
      </div>

      {/* اسم العميل يظهر عند التحويم */}
      <div
        className={`
          absolute -bottom-10 left-1/2 transform -translate-x-1/2
          bg-yellow-500 text-black
          text-sm px-3 py-1.5 rounded-full
          whitespace-nowrap border border-yellow-400
          transition-all duration-300
          shadow-lg
          z-20
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
