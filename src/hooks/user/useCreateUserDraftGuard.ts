import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, BackHandler } from "react-native";

type Params = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  loading: boolean;
  reset: () => void;
  onResetExtra?: () => void;
};

export function useCreateUserDraftGuard({
  fullName,
  email,
  password,
  role,
  loading,
  reset,
  onResetExtra,
}: Params) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  const hasChanges = useMemo(() => {
    return (
      !!fullName.trim() || !!email.trim() || !!password || role !== "student"
    );
  }, [fullName, email, password, role]);

  const resetFormState = useCallback(() => {
    reset();
    onResetExtra?.();
    setFormKey((prev) => prev + 1);
  }, [reset, onResetExtra]);

  const resetFormAndBack = useCallback(() => {
    resetFormState();
    router.back();
  }, [resetFormState, router]);

  const handleBack = useCallback(() => {
    if (!hasChanges || loading) {
      resetFormAndBack();
      return;
    }

    Alert.alert(
      "Chưa lưu thay đổi",
      "Bạn có muốn rời màn hình mà không lưu thông tin người dùng mới không?",
      [
        { text: "Ở lại", style: "cancel" },
        {
          text: "Rời đi",
          style: "destructive",
          onPress: resetFormAndBack,
        },
      ],
    );
  }, [hasChanges, loading, resetFormAndBack]);

  useFocusEffect(
    useCallback(() => {
      setFormKey((prev) => prev + 1);
    }, []),
  );

  useEffect(() => {
    const onBackPress = () => {
      if (!hasChanges || loading) return false;

      Alert.alert(
        "Chưa lưu thay đổi",
        "Bạn có muốn rời màn hình mà không lưu thông tin người dùng mới không?",
        [
          { text: "Ở lại", style: "cancel" },
          {
            text: "Rời đi",
            style: "destructive",
            onPress: resetFormAndBack,
          },
        ],
      );

      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [hasChanges, loading, resetFormAndBack]);

  return {
    formKey,
    hasChanges,
    handleBack,
    resetFormState,
  };
}
