import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert, BackHandler } from "react-native";

type Params = {
  hasChanges: boolean;
  loading: boolean;
  onDiscard: () => void;
};

export function useRoomDetailsLeaveGuard({
  hasChanges,
  loading,
  onDiscard,
}: Params) {
  const router = useRouter();

  const confirmLeave = useCallback(() => {
    if (!hasChanges || loading) {
      onDiscard();
      router.back();
      return;
    }

    Alert.alert(
      "Chưa lưu thay đổi",
      "Bạn có muốn rời màn hình mà không lưu thay đổi không?",
      [
        { text: "Ở lại", style: "cancel" },
        {
          text: "Rời đi",
          style: "destructive",
          onPress: () => {
            onDiscard();
            router.back();
          },
        },
      ],
    );
  }, [hasChanges, loading, onDiscard, router]);

  useEffect(() => {
    const onBackPress = () => {
      if (!hasChanges || loading) return false;

      confirmLeave();
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [hasChanges, loading, confirmLeave]);

  return {
    handleBack: confirmLeave,
  };
}
