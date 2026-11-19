import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { DesktopNav } from "@/components/molecules/desktop-nav";
import { HeaderActions } from "@/components/molecules/header-actions";
import { HeaderSearch } from "@/components/molecules/header-search";
import { MobileNavDrawer } from "@/components/organisms/mobile-nav-drawer";
import type { NavItem } from "@/lib/nav";

type SiteHeaderProps = { navItems: NavItem[]; isAuthenticated: boolean };

export function SiteHeader({ navItems, isAuthenticated }: SiteHeaderProps) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <MobileNavDrawer
            navItems={navItems}
            isAuthenticated={isAuthenticated}
          />
          <BrandLogo />
          <Box
            component="nav"
            aria-label="ناوبری اصلی"
            sx={{ display: { xs: "none", md: "block" }, ms: 2 }}
          >
            <DesktopNav items={navItems} />
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <HeaderSearch />
          </Box>
          <HeaderActions isAuthenticated={isAuthenticated} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
