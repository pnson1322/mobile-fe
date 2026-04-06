import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, BackHandler } from "react-native";

type Params = {
  form: {
    buildingId: string;
    name: string;
    floor: string;
    roomTypeId: string;
    loading: boolean;
    reset: () => void;
  };
};

export function useCreateRoomDraftGuard({ form }: Params) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  const hasChanges = useMemo(() => {
    return (
      !!form.buildingId ||
      !!form.name.trim() ||
      !!form.floor.trim() ||
      !!form.roomTypeId
    );
  }, [form.buildingId, form.name, form.floor, form.roomTypeId]);

  const resetFormState = useCallback(() => {
    form.reset();
    setFormKey((prev) => prev + 1);
  }, [form]);

  const resetFormAndBack = useCallback(() => {
    resetFormState();
    router.back();
  }, [resetFormState, router]);

  const handleBack = useCallback(() => {
    if (!hasChanges || form.loading) {
      resetFormAndBack();
      return;
    }

    Alert.alert(
      "Chưa lưu thay đổi",
      "Bạn có muốn rời màn hình mà không lưu thông tin phòng mới không?",
      [
        { text: "Ở lại", style: "cancel" },
        {
          text: "Rời đi",
          style: "destructive",
          onPress: resetFormAndBack,
        },
      ],
    );
  }, [hasChanges, form.loading, resetFormAndBack]);

  useFocusEffect(
    useCallback(() => {
      setFormKey((prev) => prev + 1);

      return () => {
        form.reset();
        setFormKey((prev) => prev + 1);
      };
    }, [form]),
  );

  useEffect(() => {
    const onBackPress = () => {
      if (!hasChanges || form.loading) return false;

      Alert.alert(
        "Chưa lưu thay đổi",
        "Bạn có muốn rời màn hình mà không lưu thông tin phòng mới không?",
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
  }, [hasChanges, form.loading, resetFormAndBack]);

  return {
    formKey,
    hasChanges,
    handleBack,
    resetFormAndBack,
    resetFormState,
  };
}
