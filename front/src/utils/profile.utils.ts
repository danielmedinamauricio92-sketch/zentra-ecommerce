import { User } from "@/types/user";

const missingValues = new Set(["", "pendiente", "pendiente de completar"]);

export function isProfileComplete(user: User | null) {
  if (!user) return false;

  return [user.name, user.address, user.phone].every((value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return !missingValues.has(normalized);
  });
}
