import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";
import ThemeRegistry from "../components/ThemeRegistry";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Peleti | Artesanías en Resina",
    template: "%s | Peleti",
  },
  description:
    "Piezas decorativas y regalos en resina hechos a mano, con acabados artesanales y diseño personalizado para espacios memorables.",
  keywords: [
    "resina artesanal",
    "decoración en resina",
    "artesanías personalizadas",
    "regalos hechos a mano",
    "peleti",
  ],
  openGraph: {
    title: "Peleti | Artesanías en Resina",
    description:
      "Colecciones en resina con carácter artesanal, acabados premium y piezas hechas para transformar espacios.",
    type: "website",
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peleti | Artesanías en Resina",
    description:
      "Arte en resina con identidad artesanal, composiciones decorativas y piezas personalizadas.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf8f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable}`}
        suppressHydrationWarning
      >
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
