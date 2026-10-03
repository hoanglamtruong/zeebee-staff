import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROLES, ROLE_LABELS } from "@/lib/roles";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="flex-1 px-4 py-8 max-w-4xl w-full mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[var(--zb-gold)]">ZEEBEE PORTAL</h1>
          <p className="text-sm text-white/70">
            Xin chào, <span className="text-white font-medium">{session.fullName}</span> —{" "}
            {ROLE_LABELS[session.role]}
          </p>
        </div>
        <LogoutButton />
      </header>

      <section className="zb-card p-6 mb-6">
        <p className="text-white/80">
          Đây là khu vực làm việc dành cho vai trò <strong>{ROLE_LABELS[session.role]}</strong>.
          Các module nghiệp vụ chi tiết sẽ được bổ sung ở các vòng NÂNG CẤP tiếp theo.
        </p>
      </section>

      <h2 className="text-sm uppercase tracking-wide text-white/50 mb-3">
        Các khu vực trong hệ thống
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map((r) => (
          <div
            key={r}
            className={`zb-card p-4 flex items-center justify-between ${
              r === session.role ? "border-[var(--zb-gold)]" : ""
            }`}
          >
            <span className="font-medium">{ROLE_LABELS[r]}</span>
            <span className="text-xs text-white/50">
              {r === session.role ? "Khu vực của bạn" : "Sắp ra mắt"}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
