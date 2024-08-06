import type { Metadata } from "next";
import { Mooli } from "next/font/google";
import "./globals.css";

const inter = Mooli({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aebi Sauna",
  description: "Miete die mobile Sauna jetzt!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
