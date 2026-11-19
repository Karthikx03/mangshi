import mongoose from "mongoose";

/** Wraps an async route handler so rejected promises reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, _res, next) {
  next(new HttpError(404, `Not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)[0]?.message ?? "Invalid input";
    return res.status(400).json({ error: message });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}` });
  }
  const status = err.status ?? 500;
  if (status >= 500) console.error("[api]", err);
  res.status(status).json({ error: status >= 500 ? "Internal server error" : err.message });
}

/** Rejects malformed ObjectIds with 400 and missing documents with 404. */
export function ensureFound(doc) {
  if (!doc) throw new HttpError(404, "Record not found");
  return doc;
}
