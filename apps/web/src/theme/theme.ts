"use client";

import { createTheme } from "@mui/material/styles";
import { faIR } from "@mui/material/locale";
import { colors } from "./tokens";

const fontFamily = 'var(--font-vazir), Tahoma, "Segoe UI", sans-serif';

// Persian letters connect to each other; any letter-spacing breaks the joins,
// and MUI sets some by default (e.g. on buttons), so every variant resets it.
const variant = (fontSize: string, fontWeight: number, lineHeight: number) => ({
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing: "normal",
});

export const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      mode: "light",
      primary: {
        main: colors.sage.main,
        light: colors.sage.light,
        dark: colors.sage.dark,
        contrastText: colors.ink.primary,
      },
      secondary: {
        main: colors.rose.main,
        light: colors.rose.light,
        dark: colors.rose.dark,
        contrastText: colors.ink.primary,
      },
      accent: {
        main: colors.champagne.main,
        light: colors.champagne.light,
        dark: colors.champagne.dark,
        contrastText: colors.ink.primary,
      },
      // muted status colors so they don't clash with the palette
      error: { main: "#B4534B" },
      warning: { main: "#C58F3D" },
      info: { main: "#6D8CA3" },
      success: { main: "#5F8A5A" },
      background: { default: colors.ivory, paper: colors.surface },
      text: { primary: colors.ink.primary, secondary: colors.ink.secondary },
      divider: colors.line,
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily,
      h1: variant("2.25rem", 700, 1.4),
      h2: variant("1.875rem", 700, 1.4),
      h3: variant("1.5rem", 600, 1.5),
      h4: variant("1.25rem", 600, 1.5),
      h5: variant("1.125rem", 600, 1.6),
      h6: variant("1rem", 600, 1.6),
      subtitle1: variant("1rem", 500, 1.8),
      subtitle2: variant("0.875rem", 500, 1.8),
      body1: variant("1rem", 400, 1.9),
      body2: variant("0.875rem", 400, 1.8),
      caption: variant("0.75rem", 400, 1.6),
      button: { ...variant("0.9375rem", 600, 1.5), textTransform: "none" },
      overline: { ...variant("0.75rem", 500, 1.6), textTransform: "none" },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        variants: [
          // filled buttons keep dark text, so hover must stay light (MUI's default dark hover would hide the text)
          {
            props: { variant: "contained", color: "primary" },
            style: { "&:hover": { backgroundColor: colors.sage.hover } },
          },
          {
            props: { variant: "contained", color: "secondary" },
            style: { "&:hover": { backgroundColor: colors.rose.hover } },
          },
          {
            props: { variant: "contained", color: "accent" },
            style: { "&:hover": { backgroundColor: colors.champagne.hover } },
          },
          // text and outlined buttons use the text-safe sage
          {
            props: { variant: "outlined", color: "primary" },
            style: { color: colors.sage.dark, borderColor: colors.sage.main },
          },
          {
            props: { variant: "text", color: "primary" },
            style: { color: colors.sage.dark },
          },
        ],
      },
      MuiLink: {
        defaultProps: { underline: "hover", color: "primary.dark" },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.sage.dark,
              borderWidth: 2,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { "&.Mui-focused": { color: colors.sage.dark } },
        },
      },
    },
  },
  faIR, // Persian text for MUI's built-in labels (pagination, aria labels)
);
