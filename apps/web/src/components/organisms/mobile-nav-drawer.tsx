"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { HeaderSearch } from "@/components/molecules/header-search";
import { getAccountLink, type NavItem } from "@/lib/nav";
import { PersonOutlineOutlined } from "@mui/icons-material";

type MobileNavDrawerProps = { navItems: NavItem[]; isAuthenticated: boolean };

export function MobileNavDrawer({
  navItems,
  isAuthenticated,
}: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const close = () => setOpen(false);
  const account = getAccountLink(isAuthenticated);

  return (
    <>
      <IconButton
        aria-label="باز کردن منو"
        onClick={() => setOpen(true)}
        sx={{ display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      {/* closes itself if the viewport grows past md while open (avoids a stuck scroll lock) */}
      <Drawer
        open={open && !isDesktop}
        onClose={close}
        sx={{ "& .MuiDrawer-paper": { width: 300, maxWidth: "85vw" } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          <BrandLogo onClick={close} />
          <IconButton aria-label="بستن منو" onClick={close}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <HeaderSearch fullWidth onSubmit={close} />
        </Box>
        <List component="nav" aria-label="ناوبری" disablePadding>
          {navItems.map((item) => (
            <ListItemButton key={item.href} href={item.href} onClick={close}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List disablePadding>
          <ListItemButton href={account.href} onClick={close}>
            <ListItemIcon>
              <PersonOutlineOutlined />
            </ListItemIcon>
            <ListItemText primary={account.label} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
