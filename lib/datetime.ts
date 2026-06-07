export const APP_TIMEZONE = "Asia/Jakarta" as const;
export const APP_LOCALE = "id-ID" as const;

export function formatDateTime(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    ...options,
  });
}

export function formatDate(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  return formatDateTime(value, {
    dateStyle: "medium",
    ...options,
  });
}
