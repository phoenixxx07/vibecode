import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: {
    default: "VibeCatalog.id — Katalog Vibe Coder Indonesia",
    template: "%s | VibeCatalog.id",
  },
  description:
    "Katalog murni tools dan proyek hasil vibe coder Indonesia. Live, prototype, dan repository GitHub.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  icons: {
    icon: [{ url: "/images/vibecodelogo.svg", type: "image/svg+xml" }],
    shortcut: ["/images/vibecodelogo.svg"],
    apple: [{ url: "/images/logoutama.webp", type: "image/webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${spaceMono.variable} min-h-screen antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <footer className="border-t border-muted bg-surface px-4 py-6 text-center text-xs text-muted">
          <p>
            {process.env.NEXT_PUBLIC_SITE_NAME ?? "VibeCatalog.id"} — Katalog vibe coder Indonesia.
          </p>
          <p className="mt-1">
            Pemesanan dan transaksi dilakukan langsung dengan developer. Bukan marketplace.
          </p>
        </footer>
      </body>
    </html>
  );
}
