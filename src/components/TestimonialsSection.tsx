// components/TestimonialsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Waveform } from "./Waveform";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "أحمد محمد",
    position: "مدير تسويق",
    company: "MBC",
    content:
      "تعاملنا مع صوتي! لأكثر من 3 سنوات في إعلاناتنا التلفزيونية. صوت احترافي وجودة عالية وسرعة في التسليم. أنصح بالتعامل معهم.",
    rating: 5,
  },
  {
    id: 2,
    name: "سارة عبدالله",
    position: "منتجة أفلام وثائقية",
    company: "الجزيرة الوثائقية",
    content:
      "صوت دافئ واحترافي يناسب أفلامنا الوثائقية. فريق متعاون يفهم احتياجاتنا بدقة. أنتجنا معاً أكثر من 15 فيلماً وثائقياً.",
    rating: 5,
  },
  {
    id: 3,
    name: "خالد العتيبي",
    position: "صاحب قناة يوتيوب",
    company: "تيك توب",
    content:
      "أفضل من تعاملت معهم في التعليق الصوتي. سرعة في التنفيذ ودقة في المواعيد. متابعيني أشادوا بجودة الصوت.",
    rating: 5,
  },
  {
    id: 4,
    name: "نورة الشمري",
    position: "مديرة إنتاج",
    company: "روتانا",
    content:
      "احترافية عالية وصوت مميز. تعاملنا معهم في أكثر من 20 إعلان إذاعي وتلفزيوني. تسليم سريع وتعديلات مجانية.",
    rating: 5,
  },
  {
    id: 5,
    name: "عمر حسن",
    position: "مخرج أفلام",
    company: "شركة إنتاج",
    content:
      "صوت استثنائي وجودة استوديو عالية. التعليق الصوتي كان عنصراً مهماً في نجاح فيلمنا الوثائقي الأخير.",
    rating: 5,
  },
  {
    id: 6,
    name: "لمى القحطاني",
    position: "مسؤولة تسويق",
    company: "STC",
    content:
      "تعاملنا معهم في حملتنا الإعلانية الأخيرة. أداء احترافي وسعر مناسب. أنصح بالتعامل معهم.",
    rating: 4,
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // التشغيل التلقائي
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* خلفية ذهبية ناعمة */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">ماذا قال </span>
            <span className="text-yellow-500">عملاؤنا</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            آراء حقيقية من عملاء تعاملوا معنا في مشاريع متنوعة
          </p>
        </div>

        {/* الموجة الصوتية */}
        <div className="mb-12 opacity-50">
          <Waveform />
        </div>

        {/* بطاقات الشهادات - عرض شبكي للموبايل والتابلت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* عرض السلايدر للشاشات الكبيرة */}
        <div className="hidden lg:block">
          {/* السلايدر */}
          <div className="relative max-w-4xl mx-auto">
            {/* البطاقة الرئيسية */}
            <div className="bg-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <TestimonialCard testimonial={testimonials[currentIndex]} />
            </div>

            {/* أزرار التحكم */}
            <button
              onClick={prevSlide}
              className="absolute right-0 top-1/2 transform translate-x-12 -translate-y-1/2
                w-12 h-12 rounded-full bg-black border border-gray-800
                hover:border-yellow-500 hover:text-yellow-500
                transition-all text-white text-2xl"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2
                w-12 h-12 rounded-full bg-black border border-gray-800
                hover:border-yellow-500 hover:text-yellow-500
                transition-all text-white text-2xl"
            >
              →
            </button>

            {/* نقاط التصفح */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${
                      index === currentIndex
                        ? "w-8 bg-yellow-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }
                  `}
                />
              ))}
            </div>

            {/* زر إيقاف التشغيل التلقائي */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="absolute left-1/2 transform -translate-x-1/2 -bottom-12
                text-sm text-gray-500 hover:text-yellow-500 transition-colors"
            >
              {isAutoPlaying ? "⏸️ إيقاف التلقائي" : "▶️ تشغيل تلقائي"}
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">+1286</div>
            <div className="text-sm text-gray-400">عميل سعيد</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">+7000</div>
            <div className="text-sm text-gray-400">مشروع منجز</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">98%</div>
            <div className="text-sm text-gray-400">رضا العملاء</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">4.9</div>
            <div className="text-sm text-gray-400">تقييم عام</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// بطاقة الشهادة الواحدة
interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* التقييم بالنجوم */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < testimonial.rating ? "text-yellow-500" : "text-gray-700"
            }
          >
            ★
          </span>
        ))}
      </div>

      {/* المحتوى */}
      <p className="text-gray-300 leading-relaxed mb-6 flex-grow">
        "{testimonial.content}"
      </p>

      {/* معلومات العميل */}
      <div className="flex items-center gap-4">
        {/* الصورة الرمزية (placeholder) */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-gray-800 flex items-center justify-center">
          <span className="text-2xl text-yellow-500">
            {testimonial.name.charAt(0)}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-white">{testimonial.name}</h4>
          <p className="text-sm text-gray-400">
            {testimonial.position} - {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};
