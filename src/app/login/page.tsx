import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="zb-card w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--zb-gold)]">ZEEBEE</h1>
          <p className="text-sm text-white/70 mt-1">Cổng đăng nhập nội bộ nhân viên</p>
        </div>
        <AuthForm mode="login" />
        <p className="text-sm text-white/60 text-center mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-[var(--zb-gold)] hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  );
}
