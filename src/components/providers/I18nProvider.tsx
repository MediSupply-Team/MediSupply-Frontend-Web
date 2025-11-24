'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';

interface I18nProviderProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

const timezones: Record<string, string> = {
  'es-CO': 'America/Bogota',
  'es-MX': 'America/Mexico_City',
  'es-AR': 'America/Argentina/Buenos_Aires',
  'es-PE': 'America/Lima',
  'es-CL': 'America/Santiago',
  'en-US': 'America/New_York',
  'en-GB': 'Europe/London',
};

export default function I18nProvider({ children, locale, messages }: I18nProviderProps) {
  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages}
      timeZone={timezones[locale] || 'America/Bogota'}
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  );
}
