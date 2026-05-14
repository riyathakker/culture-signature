
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { ROUTES } from "./routes";

export const socialLinks = [
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/culture_signature/",
    label: "Instagram",
  },
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/culturesignature",
    label: "Facebook",
  },
  {
    icon: PinterestIcon,
    href: "https://in.pinterest.com/culturesignature/",
    label: "Pinterest",
  },
  {
    icon: LinkedInIcon,
    href: "https://www.linkedin.com/company/culture-signature/",
    label: "LinkedIn",
  },
];

export const navigationLinks = [
  { name: "Home", href: ROUTES.HOME },
  { name: "New Arrivals", href: ROUTES.NEW_ARRIVALS },
  { name: "Collections", href: ROUTES.COLLECTIONS },
  { name: "About Us", href: ROUTES.ABOUT_US },
  { name: "Contact Us", href: ROUTES.CONTACT_US },
];
