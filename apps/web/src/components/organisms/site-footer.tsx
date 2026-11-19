import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  ); // Jalali year
  return (
    <Box component="footer" sx={{ mt: 8 }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          © {year} {siteConfig.name}
        </Typography>
      </Container>
    </Box>
  );
}
