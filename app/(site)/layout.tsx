import type { Metadata, Viewport } from "next";
import { Cormorant, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PreloaderProvider } from "@/components/providers/PreloaderProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import Preloader from "@/components/shared/Preloader";
import "../globals.css";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/loading.css";
import "../styles/header.css";
import "../styles/navigation.css";
import "../styles/subpage.css";
import "../styles/hero.css";
import "../styles/services.css";
import "../styles/guarantees.css";
import "../styles/contact.css";
import "../styles/footer.css";
import "../styles/animations.css";
import "../styles/utilities.css";
import "../styles/listings.css";
import "../styles/listing-detail.css";
import "../styles/booking.css";
import "../styles/floral.css";

const heading = Cormorant({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-heading", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = {
  // 与首屏遮罩/幕布品牌色一致，避免浏览器 UI 在加载期间显示突兀的颜色
  themeColor: "#F2ECE9",
};

export const metadata: Metadata = {
  title: { default: "The Floral Collection", template: "%s | The Floral Collection" },
  description: "The Floral Collection — premium floral rentals and wedding event setup in South Florida. Delivery, setup, and removal included in every package.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${heading.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* 首屏遮罩：避免白屏/闪烁，等 Preloader 就绪后由 JS 移除 */}
        <div
          id="first-paint-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "#F2ECE9",
            zIndex: 99999,
            pointerEvents: "none",
          }}
          aria-hidden
        />
        <ThemeProvider>
          <PreloaderProvider>
            <LenisProvider>
              <Preloader />
              <Header />
              <main>{children}</main>
              <FooterWrapper />
            </LenisProvider>
          </PreloaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
