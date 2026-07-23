import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Siti-Chan — AI Chat Companion 3D | Teman Bicara Virtual Interaktif",
  description:
    "Siti-Chan adalah aplikasi AI chat companion 3D dengan avatar VRM interaktif, voice chat, AR mode, dan dukungan 31 bahasa. Download gratis di Google Play Store!",
  keywords: [
    "AI chat",
    "3D avatar",
    "virtual companion",
    "VRM",
    "AR mode",
    "voice chat",
    "Android app",
    "Siti-Chan",
  ],
  openGraph: {
    title: "Siti-Chan — AI Chat Companion 3D",
    description:
      "Teman bicara virtual 3D yang interaktif dengan 5 karakter unik, voice chat, dan AR mode. Tersedia gratis di Google Play!",
    images: "/assets/siti-chan/icon.png",
    type: "website",
  },
};

export default function SitiChanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
