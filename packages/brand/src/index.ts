/**
 * @couchfarm/brand — shared design tokens for the Couch Farm brand.
 *
 * Values are mirrored from apps/web/src/app/globals.css (the `--ccf-*` CSS
 * custom properties). Cross-platform divergence (Tailwind classes vs RN
 * StyleSheet) is left to each consumer.
 *
 * Note: the brand name "navy" maps to the `--ccf-navy` color even though the
 * legacy globals.css uses the variable name "navy" for a deep blue. Same for
 * "cyan" — these come straight from the design tokens.
 */

export const colors = {
  // Navy (the primary brand color)
  navy: "#003986",
  navyLight: "#1A5CAF",
  navyDark: "#002A63",

  // Cyan accent
  cyan: "#0DD5FF",
  cyanLight: "#7AE8FF",
  cyanDark: "#0AB8DD",
  cyanBg: "#E6FAFF",

  // Sunny accent
  sunny: "#FEE56B",
  sunnyLight: "#FFF0A3",
  sunnyDark: "#E5CC4F",

  // Cherry accent
  cherry: "#FB104B",
  cherryLight: "#FF4D7A",
  cherryDark: "#D40D3F",

  // Neutrals (chalk = the cream background)
  cream: "#FAF5E3",
  white: "#FFFFFF",
  black: "#0A1628",

  // Gray scale (5 stops, light → dark)
  gray50: "#E8ECF1",
  gray100: "#D1D8E1",
  gray300: "#9AA5B5",
  gray500: "#5A6A7E",
  gray700: "#3A4658",

  // Status colors
  success: "#22c55e",
  successBg: "#dcfce7",
  error: "#FB104B",
  warning: "#FEE56B",
} as const;

export type BrandColor = keyof typeof colors;

export const typography = {
  display: "Rubik",
  body: "Rubik",
  /**
   * Aliases for the type families specified in the cross-platform brand
   * sketch. Actual web/mobile font loading is per-app.
   */
  fraunces: "Fraunces",
  inter: "Inter",
} as const;

export const spacing = {
  radius: 20,
  radiusLg: 32,
  radiusSm: 12,
  radiusPill: 50,
  container: 1200,
  gutter: 24,
} as const;

export const logo = {
  cowCircle: {
    /**
     * Web: apps/web serves this from `public/brand/cow-circle.png`.
     * Mobile: a copy will live in `apps/mobile/assets/` once that app exists.
     */
    path: "/brand/cow-circle.png",
  },
} as const;
