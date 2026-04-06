import { ToastProvider } from "@/components/toast/ToastProvider";
import { ENV } from "@/config/env";
import {
  clearAuthTokens,
  getAuthTokens,
  setAuthTokens,
} from "@/storage/authStorage";
import { getUserRoleFromToken, isTokenExpired } from "@/utils/jwt";
import axios from "axios";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

type RefreshResponse = {
  meta: unknown;
  data: {
    token: string;
    refreshToken: string;
  };
};

function getHomeRouteByRole(role: string | null) {
  switch (role) {
    case "Admin":
      return "/(admin)/users";
    case "Student":
      return "/(student)/profile";
    case "Manager":
    case "SeniorManager":
      return "/(manager)/rooms";
    default:
      return "/(auth)/login";
  }
}

async function refreshSessionIfNeeded() {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken || !refreshToken) {
    return null;
  }

  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  const response = await axios.post<RefreshResponse>(
    `${ENV.API_BASE_URL}/api/auth/refresh-token`,
    {
      accessToken,
      refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000,
    },
  );

  const newAccessToken = response.data?.data?.token;
  const newRefreshToken = response.data?.data?.refreshToken;

  if (!newAccessToken || !newRefreshToken) {
    throw new Error("Refresh API did not return token or refreshToken");
  }

  await setAuthTokens(newAccessToken, newRefreshToken);

  return newAccessToken;
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const first = segments[0];
        const inAuthGroup = first === "(auth)";

        const { accessToken, refreshToken } = await getAuthTokens();

        if (!mounted) return;

        if (!accessToken && !refreshToken) {
          if (!inAuthGroup) {
            router.replace("/(auth)/login");
            return;
          }

          setReady(true);
          return;
        }

        let tokenToUse = accessToken;

        if (!tokenToUse && refreshToken) {
          await clearAuthTokens();

          if (!mounted) return;
          router.replace("/(auth)/login");
          return;
        }

        if (tokenToUse && isTokenExpired(tokenToUse)) {
          try {
            tokenToUse = await refreshSessionIfNeeded();
          } catch {
            await clearAuthTokens();

            if (!mounted) return;
            router.replace("/(auth)/login");
            return;
          }
        }

        if (!tokenToUse) {
          await clearAuthTokens();

          if (!mounted) return;
          router.replace("/(auth)/login");
          return;
        }

        const role = getUserRoleFromToken(tokenToUse);
        const homeRoute = getHomeRouteByRole(role);

        if (inAuthGroup) {
          router.replace(homeRoute);
          return;
        }

        if (first === "(admin)" && role !== "Admin") {
          router.replace(homeRoute);
          return;
        }

        if (first === "(student)" && role !== "Student") {
          router.replace(homeRoute);
          return;
        }

        if (
          first === "(manager)" &&
          role !== "Manager" &&
          role !== "SeniorManager"
        ) {
          router.replace(homeRoute);
          return;
        }

        setReady(true);
      } catch {
        await clearAuthTokens();

        if (!mounted) return;
        router.replace("/(auth)/login");
      }
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
