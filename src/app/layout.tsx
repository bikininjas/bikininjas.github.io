import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
