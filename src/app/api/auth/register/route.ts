import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createUser, getUserByEmail } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { isRole } from "@/lib/roles";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const role = typeof body?.role === "string" ? body.role : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Mật khẩu phải có ít nhất 8 ký tự" }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: "Vui lòng nhập họ tên" }, { status: 400 });
  }
  if (!isRole(role)) {
    return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "Email này đã được đăng ký" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({
    id: randomUUID(),
    email,
    passwordHash,
    fullName,
    role,
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
