import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google"; // Import Anton
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "VigorAI Pro",
  description: "Elite Performance Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} font-sans bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}