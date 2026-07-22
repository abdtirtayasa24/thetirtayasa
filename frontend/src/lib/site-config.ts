const whatsappMessage =
  "Hi Abdul, I found your contact on your website. I'm interested with your profile, so can we discuss more?";

export const siteConfig = {
  ownerName: "Abdul F. Tirtayasa",
  assistantName: "Tirtayasa AI",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thetirtayasa.my.id",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "abdtirtayasa24@gmail.com",
    whatsappMessage,
    whatsappUrl:
      process.env.NEXT_PUBLIC_WHATSAPP_URL ??
      `https://wa.me/6282121172378?text=${encodeURIComponent(whatsappMessage)}`,
  },
  resume: {
    url: process.env.NEXT_PUBLIC_RESUME_URL ?? "",
    basename: process.env.NEXT_PUBLIC_RESUME_BASENAME ?? "CV_Abdul-F-Tirtayasa",
  },
  featuredProjectLimit: 3,
} as const;
