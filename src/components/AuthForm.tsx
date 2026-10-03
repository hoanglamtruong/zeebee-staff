"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/roles";

interface Props {
  mode: "login" | "register";
  roleOptions?: { value: Role; label: string }[];
}

export default function AuthForm({ mode, roleOptions }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login" ? { email, password } : { email, password, fullName, role };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Không thể kết nối tới máy chủ");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="block text-sm mb-1 text-white/80">Họ và tên</label>
          <input
            className="zb-input w-full px-3 py-2"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm mb-1 text-white/80">Email</label>
        <input
          className="zb-input w-full px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-white/80">Mật khẩu</label>
        <input
          className="zb-input w-full px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>

      {mode === "register" && roleOptions && (
        <div>
          <label className="block text-sm mb-1 text-white/80">Vai trò / Bộ phận</label>
          <select
            className="zb-input w-full px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            required
          >
            <option value="" disabled>
              Chọn vai trò
            </option>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-[var(--zb-orange)]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="zb-btn-primary w-full py-2.5 disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
      </button>
    </form>
  );
}
