import { clearAccessToken } from "@/storage/authStorage";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await clearAccessToken();
    router.replace("/(auth)/login");
  }, [router]);
}
