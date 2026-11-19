import Form from "next/form";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";

type HeaderSearchProps = { fullWidth?: boolean; onSubmit?: () => void };

export function HeaderSearch({ fullWidth, onSubmit }: HeaderSearchProps) {
  return (
    <Box sx={{ width: fullWidth ? "100%" : 260 }}>
      <Form action="/products" onSubmit={onSubmit} role="search">
        <OutlinedInput
          name="q"
          size="small"
          fullWidth
          placeholder="جستجوی محصولات"
          slotProps={{ input: { "aria-label": "جستجو" } }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          }
        />
      </Form>
    </Box>
  );
}
