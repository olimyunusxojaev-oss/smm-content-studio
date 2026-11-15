import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Social Content Studio | Mobile-First",
  description: "Премиальный генератор постов для Telegram, Instagram и YouTube на базе Gemini API",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SMM Studio",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#141211" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-bronze/30 selection:text-ink-primary">
        <div className="analog-grain" aria-hidden="true" />
        <main className="mobile-shell">
          {children}
        </main>
      </body>
    </html>
  );
}
