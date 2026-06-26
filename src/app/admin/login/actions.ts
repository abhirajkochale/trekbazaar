"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, createSessionToken } from "@/lib/auth";

export type LoginState = { error: string } | null;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = (formData.get("password") as string) ?? "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      error:
        "Admin login isn't configured: ADMIN_PASSWORD is not set on the server.",
    };
  }
  if (password !== expected) {
    return { error: "Incorrect password." };
  }

  const { token, expires } = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expires),
  });

  redirect("/admin");
}
