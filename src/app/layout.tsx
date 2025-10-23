import type { Metadata } from "next";
import { Manrope } from 'next/font/google';
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "MediSupply - Gestión de Medicamentos",
  description: "Sistema de gestión para el sector farmacéutico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <div className="flex h-screen bg-[var(--background-color)]">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                {children}
              </div> 
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
