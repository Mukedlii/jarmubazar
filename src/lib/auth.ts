import { APP } from "@/lib/config";

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === APP.adminEmail.toLowerCase();
}
