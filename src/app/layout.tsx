import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/authContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SenseiProvider } from "@/lib/sensei/SenseiContext";
import SplashScreen from "@/components/common/SplashScreen";
import FloatingSensei from "@/components/sensei/FloatingSensei";

export const viewport: Viewport = {
  themeColor: "#C83C50",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NihongoSetu — 日本語節 | Your Bridge to Japanese",
  description: "Cross-device Japanese language learning platform bridging linguistic and cultural paths.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NihongoSetu",
    startupImage: [
      {
        url: "/splash/apple-splash-1290-2796.png",
        media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1179-2556.png",
        media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1170-2532.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-750-1334.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased selection:bg-[#C83C50] selection:text-[#FFFFFF]">
        <SplashScreen />
        <AuthProvider>
          <LanguageProvider>
            <SenseiProvider>
              {children}
              <FloatingSensei />
            </SenseiProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
