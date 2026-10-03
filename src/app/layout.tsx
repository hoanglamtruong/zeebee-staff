import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeebee Portal - Cổng đăng nhập nội bộ",
  description: "Cổng đăng nhập nội bộ dành cho nhân viên hệ sinh thái Zeebee.",
  icons: {
    icon: "/favicon.ico",
    apple: "/zeebee_icon_192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A2D47",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
