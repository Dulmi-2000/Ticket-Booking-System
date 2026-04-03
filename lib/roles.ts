import type { UserRole } from "./types"

/** Normalizes API/DB/JWT values: ADMIN, admin, ROLE_ADMIN → "admin". */
export function normalizeUserRole(role: unknown): UserRole {
  const r = String(role ?? "")
    .trim()
    .toLowerCase()
    .replace(/^role_/, "")
  if (r === "admin") return "admin"
  return "user"
}

export function isAdminRole(role: unknown): boolean {
  return normalizeUserRole(role) === "admin"
}
