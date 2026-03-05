import type { AxiosError } from "axios";

export function getApiErrorMessage(err: unknown, fallback = "Có lỗi xảy ra.") {
  const e = err as AxiosError<any>;
  const msg =
    e?.response?.data?.message || e?.response?.data?.error || e?.message;

  if (typeof msg === "string" && msg.trim()) return msg.trim();
  return fallback;
}
