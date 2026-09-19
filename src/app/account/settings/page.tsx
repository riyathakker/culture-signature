import { redirect } from "next/navigation";

// Settings was folded into the main /account page — redirect any old
// bookmarks/PWA shortcuts there instead of 404ing.
export default function SettingsRedirect() {
  redirect("/account");
}
