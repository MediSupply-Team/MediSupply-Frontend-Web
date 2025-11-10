import type { Metadata } from "next";
import { Manrope } from 'next/font/google';
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import QueryProvider from "@/components/providers/QueryProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import { cookies } from 'next/headers';
import { defaultLocale, type Locale } from '@/i18n/config';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "MediSupply - Gestión de Medicamentos",
  description: "Sistema de gestión para el sector farmacéutico",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || defaultLocale) as Locale;
  
  // Cargar mensajes dinámicamente
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>{/* Tema gestionado por ThemeToggle */}
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <I18nProvider locale={locale} messages={messages}>
          <QueryProvider>
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
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
