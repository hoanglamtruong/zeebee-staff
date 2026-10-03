import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

export default function RegisterPage() {
  const roleOptions = ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="zb-card w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--zb-gold)]">ZEEBEE</h1>
          <p className="text-sm text-white/70 mt-1">Đăng ký tài khoản nhân viên</p>
        </div>
        <AuthForm mode="register" roleOptions={roleOptions} />
        <p className="text-sm text-white/60 text-center mt-6">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-[var(--zb-gold)] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
