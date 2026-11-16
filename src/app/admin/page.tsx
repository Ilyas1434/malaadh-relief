import type { Metadata } from "next";
import { AdminApp } from "@/components/AdminApp";
import { CalligraphyMark } from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The page itself holds nothing private. It asks the server who is signed in, and
// everything it can do goes through routes that check the session again.
export default function AdminPage() {
  return <AdminApp mark={<CalligraphyMark className="block h-full" />} />;
}
