import type { Metadata } from "next";
import Box from "@mui/material/Box";
import { ThemeRegistry } from "@/theme/theme-registry";
import { SiteHeader } from "@/components/organisms/site-header";
import { SiteFooter } from "@/components/organisms/site-footer";
import { getCurrentUser } from "@/lib/api/server/auth";
import { getCategories } from "@/lib/api/server/categories";
import { buildNavItems } from "@/lib/nav";
import { siteConfig } from "@/config/site";
import { estedad } from "./fonts";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    getCategories().catch(() => []), // header must survive an API outage
  ]);

  return (
    <html lang="fa" dir="rtl" className={estedad.className}>
      <body>
        <ThemeRegistry>
          <Box
            sx={{
              minHeight: "100dvh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SiteHeader
              navItems={buildNavItems(categories)}
              isAuthenticated={Boolean(user)}
            />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <SiteFooter />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
