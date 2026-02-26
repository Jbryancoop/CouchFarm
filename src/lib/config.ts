export const siteConfig = {
  name: "Colorado Couch Ranch",
  tagline: "Quality Couches, Ranch-Style Hospitality",
  description:
    "Colorado's premier destination for quality pre-owned couches. Browse our curated selection or tell us what you're looking for.",
  phone: "",
  email: "info@coloradocouchranch.com",
  address: "",
  social: {
    facebook: "",
    instagram: "",
  },
};

export const couchStyles = [
  { value: "classic_modular", label: "Classic Modular" },
  { value: "u_shape", label: "U-Shape" },
  { value: "l_shape", label: "L-Shape" },
  { value: "sectional", label: "Sectional" },
  { value: "sofa", label: "Sofa" },
  { value: "loveseat", label: "Loveseat" },
  { value: "sleeper", label: "Sleeper" },
  { value: "reclining", label: "Reclining" },
  { value: "other", label: "Other" },
] as const;

export const couchColors = [
  "Beige",
  "Black",
  "Blue",
  "Brown",
  "Cream",
  "Gray",
  "Green",
  "Navy",
  "Orange",
  "Red",
  "Tan",
  "White",
  "Other",
] as const;

export const conditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
] as const;

export const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "venmo", label: "Venmo" },
  { value: "cashapp", label: "Cash App" },
] as const;

export const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "craigslist", label: "Craigslist" },
  { value: "tiktok", label: "TikTok" },
  { value: "other", label: "Other" },
] as const;
