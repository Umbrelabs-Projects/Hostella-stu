import { FooterSection, NavLink } from "@/types/common";

export const navLinks: NavLink[] = [
  { link: "/", text: "Home" },
  { link: "/about-us", text: "About Us" },
  { link: "/services", text: "Services" },
  { link: "/blog", text: "Blog" },
  { link: "/projects", text: "Projects" },
];
export const footerSections: FooterSection[] = [
  {
    title: "Discover",
    links: [
      { text: "blog", link: "/blog" },
      { text: "careers", link: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Terms of use", link: "/terms-of-use" },
      { text: "Privacy Policy", link: "/privacy-policy" },
      { text: "FAQs", link: "/faq" },
    ],
  },
  {
    title: "Get Connected",
    iconLink: [
      { icon: "/assets/pngs/x.png", link: "https://twitter.com" },
      { icon: "/assets/pngs/linkedIn.png", link: "https://linkedin.com" },
      { icon: "/assets/pngs/facebook.png", link: "https://facebook.com" },
      { icon: "/assets/pngs/instagram.png", link: "https://instagram.com" },
    ],
  },
];
