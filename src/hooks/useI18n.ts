'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Locale, currencies, timezones, localeNames } from '@/i18n/config';

export function useI18n(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale() as Locale;

  const formatCurrency = (amount: number) => {
    const currency = currencies[locale];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezones[locale],
      ...options,
    }).format(dateObj);
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(number);
  };

  const formatRelativeTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (days > 0) return rtf.format(-days, 'day');
    if (hours > 0) return rtf.format(-hours, 'hour');
    if (minutes > 0) return rtf.format(-minutes, 'minute');
    return rtf.format(-seconds, 'second');
  };

  return {
    t,
    locale,
    localeName: localeNames[locale],
    currency: currencies[locale],
    timezone: timezones[locale],
    formatCurrency,
    formatDate,
    formatNumber,
    formatRelativeTime,
  };
}
