import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const dm_sans = DM_Sans({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // добавь нужные веса
});

export const metadata: Metadata = {
  title: "Jinsiy Hayot",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${dm_sans.variable} antialiased`}>
        <Toaster theme="dark" position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
