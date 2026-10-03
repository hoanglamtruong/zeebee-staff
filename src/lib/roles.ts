export const ROLES = [
  "SALES",
  "MARKETING",
  "FINANCE",
  "PRODUCTION",
  "OPERATIONS",
  "HR",
  "CEO",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SALES: "Bán hàng",
  MARKETING: "Marketing",
  FINANCE: "Tài chính",
  PRODUCTION: "Sản xuất",
  OPERATIONS: "Vận hành",
  HR: "Nhân sự",
  CEO: "CEO",
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
