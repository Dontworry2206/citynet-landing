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
  icons: { icon: "/img/logo-color.png" },
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
