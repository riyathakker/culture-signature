import { redirect } from "next/navigation";

// Addresses was folded into the main /account page — redirect any old
// bookmarks/PWA shortcuts there instead of 404ing.
export default function AddressesRedirect() {
  redirect("/account");
}
