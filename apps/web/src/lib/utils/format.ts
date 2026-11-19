// One-line switch: "fa-IR" gives Persian digits (note: it also uses the Persian thousands separator).
const NUMBER_LOCALE = "en-US";
const CURRENCY_LABEL = "تومان";

const numberFormat = new Intl.NumberFormat(NUMBER_LOCALE);

export const formatNumber = (value: number) => numberFormat.format(value);

export const formatPrice = (amount: number) =>
  `${formatNumber(amount)} ${CURRENCY_LABEL}`;

/** "تکی" for 1, "بسته 6 عددی" otherwise. */
export const formatPackLabel = (unitsPerPack: number) =>
  unitsPerPack === 1 ? "تکی" : `بسته ${formatNumber(unitsPerPack)} عددی`;

/** Price of a single unit inside a pack, rounded. Wholesale buyers compare by this number. */
export const getUnitPrice = (packPrice: number, unitsPerPack: number) =>
  Math.round(packPrice / unitsPerPack);
