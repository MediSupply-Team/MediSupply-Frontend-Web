export type Locale = 'es-CO' | 'es-MX' | 'es-AR' | 'es-PE' | 'es-CL' | 'en-US' | 'en-GB';

export const locales: Locale[] = ['es-CO', 'es-MX', 'es-AR', 'es-PE', 'es-CL', 'en-US', 'en-GB'];
export const defaultLocale: Locale = 'es-CO';

export const localeNames: Record<Locale, string> = {
  'es-CO': 'Español (Colombia)',
  'es-MX': 'Español (México)',
  'es-AR': 'Español (Argentina)',
  'es-PE': 'Español (Perú)',
  'es-CL': 'Español (Chile)',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
};

export const currencies: Record<Locale, string> = {
  'es-CO': 'COP',
  'es-MX': 'MXN',
  'es-AR': 'ARS',
  'es-PE': 'PEN',
  'es-CL': 'CLP',
  'en-US': 'USD',
  'en-GB': 'GBP',
};

export const timezones: Record<Locale, string> = {
  'es-CO': 'America/Bogota',
  'es-MX': 'America/Mexico_City',
  'es-AR': 'America/Argentina/Buenos_Aires',
  'es-PE': 'America/Lima',
  'es-CL': 'America/Santiago',
  'en-US': 'America/New_York',
  'en-GB': 'Europe/London',
};
