// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "صوتي - خدمات التعليق الصوتي الاحترافية | Voice Over Services",
    template: "%s | صوتي - Voice Over Services",
  },
  description:
    "خدمات تعليق صوتي احترافية للإعلانات، الأفلام الوثائقية، الموشن جرافيك، اليوتيوب، والدوبلاج. أكثر من 7000 مشروع منجز وأكثر من 5 سنوات خبرة.",
  keywords: [
    "تعليق صوتي",
    "voice over",
    "خدمات صوتية",
    "إعلانات تلفزيونية",
    "وثائقيات",
    "موشن جرافيك",
    "دوبلاج",
    "تسجيل صوتي",
    "استوديو تسجيل",
    "تعليق إذاعي",
    "Voice Over Services",
    "Professional Voice Over",
    "Arabic Voice Over",
  ],
  publisher: "صوتي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-xxxxxxxxxxxxx" />
      </head>
      <body className="bg-black text-white">
        <AuthProvider>
          <main>{children}</main>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
