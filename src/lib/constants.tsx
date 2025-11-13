import { FooterSection, NavLink } from "@/types/common";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "lucide-react";
import { images } from "./images";

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
      { icon: XIcon, link: "https://twitter.com" },
      { icon: LinkedinIcon, link: "https://linkedin.com" },
      { icon: FacebookIcon, link: "https://facebook.com" },
      { icon: InstagramIcon, link: "https://instagram.com" },
    ],
  },
];

export const hostelsData = [
  {
    id: 1,
    name: "Lienda Ville",
    location: "Kotei",
    rating: 4.9,
    description: "Modern facilities with 24/7 security",
    image: images.hostel0,
  },
  {
    id: 2,
    name: "Gabealle Verd",
    location: "Kotei",
    rating: 4.9,
    description: "Modern facilities with 24/7 security",
    image: images.hostel1,
  },
  {
    id: 3,
    name: "WestVille",
    location: "Ayeduase",
    rating: 4.8,
    description: "Affordable rooms near campus",
    image: images.hostel2,
  },
  {
    id: 4,
    name: "NorthVille",
    location: "Bomso",
    rating: 4.8,
    description: "Affordable rooms near campus",
    image: images.hostel3,
  },
  {
    id: 5,
    name: "South Ridge Hostel",
    location: "Ayigya",
    rating: 4.7,
    description: "Spacious rooms with steady power and Wi-Fi",
    image: images.hostel0,
  },
  {
    id: 6,
    name: "EastVille Lodge",
    location: "Kentinkrono",
    rating: 4.6,
    description: "Quiet environment ideal for students",
    image: images.hostel1,
  },
  {
    id: 7,
    name: "Royal Heights",
    location: "Ayeduase",
    rating: 4.9,
    description: "Premium student residence with gym access",
    image: images.hostel2,
  },
  {
    id: 8,
    name: "Suncrest Hostel",
    location: "Kotei",
    rating: 4.7,
    description: "Comfortable and modern with serene surroundings",
    image: images.hostel3,
  },
  {
    id: 9,
    name: "HillTop Apartments",
    location: "Bomso",
    rating: 4.8,
    description: "Fully furnished rooms close to campus",
    image: images.hostel0,
  },
];

export const roomsData = [
  {
    id: 1,
    title: "One-in-One",
    price: "GHC 2,500",
    description: "Private room with personal space",
    available: "5 Rooms Available",
    image: images.oneInRoom,
  },
  {
    id: 2,
    title: "Two-in-One",
    price: "GHC 2,500",
    description: "Private room with personal space",
    available: "5 Rooms Available",
    image: images.twoInRoom,
  },
  // Add more rooms if needed
];
