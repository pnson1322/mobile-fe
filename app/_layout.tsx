import { ToastProvider } from "@/components/toast/ToastProvider";
import { getAccessToken } from "@/storage/authStorage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const token = await getAccessToken();
      if (!mounted) return;

      const first = segments?.[0];
      const inAuth = first === "(auth)";

      if (!token && !inAuth) {
        router.replace("/(auth)/login");
      } else if (token && inAuth) {
        router.replace("/profile");
      }

      setReady(true);
    })();

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
