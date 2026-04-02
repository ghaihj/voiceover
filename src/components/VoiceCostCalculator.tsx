"use client";

import { useState } from "react";
import { Waveform } from "./Waveform";

interface ProjectType {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  unit: "per_project" | "per_minute";
  description: string;
}

const projectTypes: ProjectType[] = [
  {
    id: "social",
    name: "إعلان وسائل التواصل",
    minPrice: 900,
    maxPrice: 1500,
    unit: "per_project",
    description: "30 ثانية",
  },
  {
    id: "radio",
    name: "إعلان إذاعي",
    minPrice: 1200,
    maxPrice: 2000,
    unit: "per_project",
    description: "مدة قياسية",
  },
  {
    id: "tv",
    name: "إعلان تلفزيوني",
    minPrice: 2500,
    maxPrice: 5000,
    unit: "per_project",
    description: "جودة عالية",
  },
  {
    id: "corporate",
    name: "فيديو شركات",
    minPrice: 700,
    maxPrice: 1200,
    unit: "per_minute",
    description: "للدقيقة",
  },
  {
    id: "motion",
    name: "موشن جرافيك",
    minPrice: 600,
    maxPrice: 1000,
    unit: "per_minute",
    description: "للدقيقة",
  },
  {
    id: "documentary",
    name: "فيلم وثائقي",
    minPrice: 900,
    maxPrice: 1500,
    unit: "per_minute",
    description: "للدقيقة",
  },
  {
    id: "youtube",
    name: "فيديو يوتيوب",
    minPrice: 500,
    maxPrice: 900,
    unit: "per_minute",
    description: "للدقيقة",
  },
  {
    id: "ivr",
    name: "رد آلي IVR",
    minPrice: 400,
    maxPrice: 800,
    unit: "per_project",
    description: "تسجيل احترافي",
  },
];

const usagePlaces = [
  { id: "local", name: "محلي", multiplier: 1 },
  { id: "regional", name: "إقليمي", multiplier: 1.3 },
  { id: "international", name: "عالمي", multiplier: 1.7 },
];

export const VoiceCostCalculator = () => {
  const [selectedProject, setSelectedProject] = useState<string>("social");
  const [words, setWords] = useState<number>(150);
  const [usage, setUsage] = useState<string>("local");
  const [showResult, setShowResult] = useState<boolean>(false);

  // حسابات النتيجة
  const calculateResult = () => {
    const project = projectTypes.find((p) => p.id === selectedProject)!;
    const usageMultiplier = usagePlaces.find((u) => u.id === usage)!.multiplier;

    // حساب المدة بالدقائق (150 كلمة ≈ دقيقة)
    const durationMinutes = words / 150;
    const durationSeconds = Math.round(durationMinutes * 60);
    const formattedDuration =
      durationMinutes < 1
        ? `${durationSeconds} ثانية`
        : `${durationMinutes.toFixed(1)} دقيقة (${durationSeconds} ثانية)`;

    // حساب السعر
    let minPrice, maxPrice;
    if (project.unit) {
      minPrice = project.minPrice * durationMinutes * usageMultiplier;
      maxPrice = project.maxPrice * durationMinutes * usageMultiplier;
    } else {
      minPrice = project.minPrice * usageMultiplier;
      maxPrice = project.maxPrice * usageMultiplier;
    }

    return {
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      duration: formattedDuration,
      projectName: project.name,
      words: words,
      usage: usagePlaces.find((u) => u.id === usage)!.name,
    };
  };

  const result = calculateResult();

  return (
    <section className="py-20 bg-black relative overflow-hidden" id="calc">
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
            <span className="text-white">احسب </span>
            <span className="text-yellow-500">تكلفة مشروعك</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            أدخل تفاصيل مشروعك لتحصل على سعر تقديري فوري
          </p>
        </div>

        {/* الموجة الصوتية - ذهبية */}
        <div className="mb-12 opacity-50">
          <Waveform />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* بطاقة الحاسبة */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* الجانب الأيمن - المدخلات */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">📊</span>
                  تفاصيل المشروع
                </h3>

                {/* نوع المشروع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نوع المشروع
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white"
                  >
                    {projectTypes.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* عدد الكلمات */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    عدد الكلمات
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      value={words}
                      onChange={(e) => setWords(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors text-white"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      كلمة
                    </span>
                  </div>

                  {/* شريط التمرير السريع */}
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    value={words}
                    onChange={(e) => setWords(Number(e.target.value))}
                    className="w-full mt-2 accent-yellow-500 bg-gray-800 rounded-lg appearance-none h-2"
                  />

                  {/* مؤشر الوقت التقديري */}
                  <p className="text-xs text-gray-500 mt-2">
                    ⏱️ {Math.round((words / 150) * 60)} ثانية تقريباً (150 كلمة
                    ≈ دقيقة)
                  </p>
                </div>

                {/* مكان الاستخدام */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    مكان الاستخدام
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {usagePlaces.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => setUsage(place.id)}
                        className={`
                          py-2 px-3 rounded-lg text-sm font-medium transition-all
                          ${
                            usage === place.id
                              ? "bg-yellow-500 text-black"
                              : "bg-black border border-gray-800 text-gray-400 hover:border-yellow-500"
                          }
                        `}
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* زر الحساب */}
                <button
                  onClick={() => setShowResult(true)}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg
                    bg-yellow-500 text-black
                    hover:bg-yellow-400
                    transition-all transform hover:scale-105
                    shadow-lg shadow-yellow-500/20
                    flex items-center justify-center gap-2"
                >
                  <span>💰</span>
                  احسب التكلفة
                </button>
              </div>

              {/* الجانب الأيسر - النتيجة */}
              <div
                className={`
                bg-black border border-gray-800
                rounded-xl p-6
                transition-all duration-500
                ${showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-yellow-500">🎯</span>
                  النتيجة التقديرية
                </h3>

                {showResult && (
                  <div className="space-y-6">
                    {/* السعر */}
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">
                        السعر التقديري
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-yellow-500">
                        {result.minPrice} - {result.maxPrice}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        درهم إماراتي
                      </div>
                    </div>

                    {/* المدة */}
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">مدة التسجيل:</span>
                        <span className="text-white font-bold">
                          {result.duration}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">عدد الكلمات:</span>
                        <span className="text-white font-bold">
                          {result.words} كلمة
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">نطاق الاستخدام:</span>
                        <span className="text-white font-bold">
                          {result.usage}
                        </span>
                      </div>
                    </div>

                    {/* تفاصيل المشروع */}
                    <div className="text-sm text-gray-400">
                      <p className="mb-2">📌 {result.projectName}</p>
                      <p className="text-yellow-500">
                        * الأسعار تقريبية وقد تختلف حسب التفاصيل الدقيقة
                      </p>
                    </div>

                    {/* زر طلب الخدمة */}
                    <button
                      className="w-full py-3 px-6 rounded-lg font-semibold
                      bg-transparent border-2 border-yellow-500 text-yellow-500
                      hover:bg-yellow-500 hover:text-black
                      transition-all transform hover:scale-105
                      flex items-center justify-center gap-2"
                    >
                      <span>📞</span>
                      اطلب الخدمة الآن
                    </button>
                  </div>
                )}

                {!showResult && (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-700">
                      <div className="text-6xl mb-4 text-yellow-500/30">💰</div>
                      <p>املأ التفاصيل واضغط "احسب التكلفة"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* جدول الأسعار المرجعي */}
          <div className="mt-12 bg-black border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📋</span>
              الأسعار التقديرية المرجعية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectTypes.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-800"
                >
                  <div className="text-sm font-bold text-white">
                    {project.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {project.description}
                  </div>
                  <div className="text-yellow-500 font-bold">
                    {project.minPrice} - {project.maxPrice}
                    <span className="text-xs text-gray-500 mr-1">
                      {project.unit === "per_minute" ? "/دقيقة" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ملاحظة */}
          <p className="text-center text-gray-600 text-sm mt-8">
            * الأسعار تقديرية وقد تتغير حسب تعقيد المشروع والمتطلبات الخاصة
          </p>
        </div>
      </div>
    </section>
  );
};
