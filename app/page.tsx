import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to events page as main landing
  redirect("/events")
}
