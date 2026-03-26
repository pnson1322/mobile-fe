import { ToastProvider } from "@/components/toast/ToastProvider";
import { clearAuthTokens, getAccessToken } from "@/storage/authStorage";
import { getUserRoleFromToken, isTokenExpired } from "@/utils/jwt";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

function getHomeRouteByRole(role: string | null) {
  switch (role) {
    case "Admin":
      return "/admin";
    case "Student":
      return "/(student)/profile";
    case "Manager":
      return "/(manager)/rooms";
    default:
      return "/(auth)/login";
  }
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const token = await getAccessToken();
      if (!mounted) return;

      const first = segments[0];
      const inAuthGroup = first === "(auth)";

      if (!token) {
        if (!inAuthGroup) {
          router.replace("/(auth)/login");
          return;
        }

        setReady(true);
        return;
      }

      if (isTokenExpired(token)) {
        await clearAuthTokens();

        if (!mounted) return;
        router.replace("/(auth)/login");
        return;
      }

      const role = getUserRoleFromToken(token);
      const homeRoute = getHomeRouteByRole(role);

      if (inAuthGroup) {
        router.replace(homeRoute);
        return;
      }

      if (first === "admin" && role !== "Admin") {
        router.replace(homeRoute);
        return;
      }

      if (first === "(student)" && role !== "Student") {
        router.replace(homeRoute);
        return;
      }

      if (first === "(manager)" && role !== "Manager") {
        router.replace(homeRoute);
        return;
      }

      setReady(true);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router, segments]);

  if (!ready) return null;

  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ToastProvider>
  );
}
