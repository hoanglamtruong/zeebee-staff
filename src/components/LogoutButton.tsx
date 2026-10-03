"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10"
    >
      Đăng xuất
    </button>
  );
}
