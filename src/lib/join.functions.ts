import { createServerFn } from "@tanstack/react-start";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitJoinRequest = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; role: string; note?: string }) => {
    const name = String(input.name || "")
      .trim()
      .slice(0, 100);
    const email = String(input.email || "")
      .trim()
      .slice(0, 200);
    const role = String(input.role || "")
      .trim()
      .slice(0, 40);
    if (!name) throw new Error("Name is required");
    if (!EMAIL_RE.test(email)) throw new Error("A valid email is required");
    if (!role) throw new Error("Role is required");
    return {
      name,
      email,
      role,
      note: input.note ? String(input.note).trim().slice(0, 1000) : null,
    };
  })
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./db.server");
    const { error } = await publicServerClient().from("join_requests").insert(data);
    if (error) throw error;
    return { ok: true };
  });
