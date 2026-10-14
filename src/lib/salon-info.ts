// PLACEHOLDER business details — replace with the owner's real information.
export const SALON = {
  name: "LM Hair Salon",
  tagline: "Style. Beauty. Confidence.",
  phone: "+27 00 000 0000",
  email: "hello@lmhairsalon.example",
  address: "Address to be confirmed, Johannesburg, South Africa",
  hours: [
    { day: "Monday – Friday", time: "08:00 – 18:00" },
    { day: "Saturday", time: "08:00 – 16:00" },
    { day: "Sunday & Public Holidays", time: "Closed" },
  ],
  // booking hours used for slot generation (24h)
  openHour: 8,
  closeHour: 17,
  closedDays: [0], // Sunday
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
  isPlaceholder: true,
};

export const formatRand = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

export const formatDuration = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m} min`;
