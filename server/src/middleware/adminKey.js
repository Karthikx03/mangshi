import { HttpError } from "./errors.js";

/** Guards admin-only routes with a shared secret sent as the `x-admin-key` header. */
export function requireAdminKey(req, _res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected || req.get("x-admin-key") !== expected) {
    return next(new HttpError(401, "Admin key required"));
  }
  next();
}
