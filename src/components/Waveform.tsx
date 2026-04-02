// components/Waveform.js (بدون أخطاء)
"use client";

export const Waveform = () => {
  // ارتفاعات ثابتة
  const heights = [
    15, 25, 35, 45, 50, 45, 35, 25, 15, 25, 35, 45, 40, 30, 20, 15, 25, 35, 45,
    35, 25, 15, 20, 30, 40, 45, 35, 25, 15, 20,
  ];

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full animate-wave"
          style={{
            height: `${height}px`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};
