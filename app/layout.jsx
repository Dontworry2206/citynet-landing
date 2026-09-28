import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Домашний интернет CITYNET — тарифы и подключение",
  description:
    "Интернет вашего дома от CITYNET. Тарифы от 145 000 сум/мес. Оставьте адрес — проверим возможность подключения.",
  icons: {
    icon: [{ url: "/img/favicon.png", sizes: "512x512", type: "image/png" }],
    shortcut: [{ url: "/img/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/img/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#161A46",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" data-theme="light">
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
