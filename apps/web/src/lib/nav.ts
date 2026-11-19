export type NavItem = { label: string; href: string };

export function buildNavItems(
  categories: { slug: string; name: string }[],
): NavItem[] {
  return [
    { label: "همه محصولات", href: "/products" },
    ...categories.map((c) => ({
      label: c.name,
      href: `/products?category=${encodeURIComponent(c.slug)}`,
    })),
  ];
}

export function getAccountLink(isAuthenticated: boolean): NavItem {
  return isAuthenticated
    ? { label: "حساب کاربری", href: "/account" }
    : { label: "ورود / ثبت‌نام", href: "/login" };
}
