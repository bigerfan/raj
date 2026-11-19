import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { siteConfig } from "@/config/site";

type BrandLogoProps = { onClick?: () => void };

export function BrandLogo({ onClick }: BrandLogoProps) {
  return (
    <ButtonBase
      href="/"
      onClick={onClick}
      aria-label={siteConfig.name}
      sx={{ borderRadius: 1, px: 0.5 }}
    >
      <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
        {siteConfig.name}
      </Typography>
    </ButtonBase>
  );
}
