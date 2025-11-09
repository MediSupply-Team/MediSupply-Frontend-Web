import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export type Locale = 'es-CO' | 'es-MX' | 'es-AR' | 'es-PE' | 'es-CL' | 'en-US' | 'en-GB';

export const locales: Locale[] = ['es-CO', 'es-MX', 'es-AR', 'es-PE', 'es-CL', 'en-US', 'en-GB'];
export const defaultLocale: Locale = 'es-CO';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || defaultLocale) as Locale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
