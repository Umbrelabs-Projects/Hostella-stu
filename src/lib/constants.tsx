import { FooterSection, NavLink } from "@/types/common";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Twitter,
} from "lucide-react";

export const navLinks: NavLink[] = [
  { link: "/", text: "Home" },
  { link: "/gallery", text: "Gallery" },
  { link: "/about-us", text: "About Us" },
  { link: "/contact-us", text: "Contact Us" },
];
export const footerSections: FooterSection[] = [
  {
    title: "Discover",
    links: [{ text: "blog", link: "/blog" }],
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
      { icon: Twitter, link: "https://twitter.com" },
      { icon: LinkedinIcon, link: "https://linkedin.com" },
      { icon: FacebookIcon, link: "https://facebook.com" },
      { icon: InstagramIcon, link: "https://instagram.com" },
    ],
  },
];
