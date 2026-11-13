const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC = "٠١٢٣٤٥٦٧٨٩";

export function toLatinDigits(s: string): string {
  return s
    .replace(/[۰-۹]/g, (d) => String(PERSIAN.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC.indexOf(d)));
}

/**
 * Assumes Iranian mobile numbers. Canonical form: 09XXXXXXXXX.
 * If you need international numbers later, change only this function.
 */
export function normalizePhone(input: string): string | null {
  const s = toLatinDigits(input).replace(/[\s\-()]/g, "");
  const m = s.match(/^(?:\+98|0098|98|0)?(9\d{9})$/);
  return m ? `0${m[1]}` : null;
}
