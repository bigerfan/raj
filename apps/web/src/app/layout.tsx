import type { Metadata } from "next";
import { ThemeRegistry } from "@/theme/theme-registry";
import { estedad } from "./fonts";

// const vazir = localFont({
//   src: "./fonts/Vazirmatn-Variable.woff2",
//   variable: "--font-vazir",
//   weight: "100 900",
//   display: "swap",
// });

export const metadata: Metadata = { title: "راژ" }; // placeholder, change to your shop name

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={estedad.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
