import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Text Translations",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-orange-50`}
      >
        <nav className="p-4 bg-orange-100 sticky top-0 z-50">
          <Link href={"/"} className="hover:underline">Home</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
