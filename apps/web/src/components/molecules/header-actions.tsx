import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { getAccountLink } from "@/lib/nav";
import { PersonOutlineOutlined } from "@mui/icons-material";

export function HeaderActions({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const account = getAccountLink(isAuthenticated);
  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <IconButton href={account.href} aria-label={account.label}>
        <PersonOutlineOutlined />
      </IconButton>
      <IconButton href="/cart" aria-label="سبد خرید">
        <ShoppingBagOutlinedIcon />
      </IconButton>
    </Stack>
  );
}
