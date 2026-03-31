'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';
import { el, enUS, ru, tr, bg, he } from 'date-fns/locale';
import type { Locale } from '@/i18n-config';

// Locales mapping corresponding to our Supported locales
const localeMap: Record<string, any> = {
  el: el,
  en: enUS,
  ru: ru,
  tr: tr,
  bg: bg,
  he: he,
};

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  lang?: Locale | string;
};

function CustomDatePicker({
  className,
  showOutsideDays = true,
  lang = 'en',
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={localeMap[lang] || enUS}
      showOutsideDays={showOutsideDays}
      className={cn('p-4 font-sans bg-white text-[var(--color-text)]', className)}
      style={{
        '--rdp-accent-color': 'var(--color-accent)',
        '--rdp-accent-background-color': 'var(--color-neutral-100)',
        '--rdp-day-height': '2.5rem',
        '--rdp-day-width': '2.5rem',
        '--rdp-today-color': 'var(--color-accent)',
        '--rdp-selected-border': 'none',
        '--rdp-range_start-date-background-color': 'var(--color-accent)',
        '--rdp-range_end-date-background-color': 'var(--color-accent)',
        '--rdp-range_middle-background-color': 'var(--color-neutral-100)',
      } as React.CSSProperties}
      classNames={{
        caption_label: 'text-xl font-serif font-medium tracking-wide',
        day_button: 'rdp-day_button hover:bg-[var(--color-neutral-100)] rounded-full transition-colors',
      }}
      formatters={{
        formatCaption: (date, options) => {
          const month = date.toLocaleString(options?.locale?.code || 'en-US', { month: 'long' });
          const year = date.toLocaleString(options?.locale?.code || 'en-US', { year: 'numeric' });
          return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
        }
      }}
      {...props}
    />
  );
}

CustomDatePicker.displayName = 'CustomDatePicker';

export { CustomDatePicker };
