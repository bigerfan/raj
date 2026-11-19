import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { NavItem } from "@/lib/nav";

const MAX_LINKS = 6; // "all products" + 5 categories; the rest live in /products

export function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      {items.slice(0, MAX_LINKS).map((item) => (
        <Button key={item.href} href={item.href} color="inherit">
          {item.label}
        </Button>
      ))}
    </Stack>
  );
}
