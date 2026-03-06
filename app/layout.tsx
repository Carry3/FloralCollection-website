import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PreloaderProvider } from "@/components/providers/PreloaderProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/shared/Preloader";
import "./globals.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/loading.css";
import "./styles/header.css";
import "./styles/navigation.css";
import "./styles/subpage.css";
import "./styles/hero.css";
import "./styles/services.css";
import "./styles/guarantees.css";
import "./styles/contact.css";
import "./styles/footer.css";
import "./styles/animations.css";
import "./styles/utilities.css";
import "./styles/listings.css";
import "./styles/listing-detail.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "The Floral Collection", template: "%s | The Floral Collection" },
  description: "The Floral Collection — Essential, Plus, Luxe, and Elite packages. About us, technology, and the markets we serve.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        {/* 首屏遮罩：避免白屏/闪烁，等 Preloader 就绪后由 JS 移除 */}
        <div
          id="first-paint-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "#1A1A2E",
            zIndex: 99999,
            pointerEvents: "none",
          }}
          aria-hidden
        />
        <ThemeProvider>
          <PreloaderProvider>
            <Preloader />
            <Header />
            <main>{children}</main>
            <Footer />
          </PreloaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
