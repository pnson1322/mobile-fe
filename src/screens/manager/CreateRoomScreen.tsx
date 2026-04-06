import { RoomForm } from "@/components/room/RoomForm";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { emitRoomListRefresh } from "@/hooks/room/roomRefreshBus";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useCreateRoomDraftGuard } from "@/hooks/room/useCreateRoomDraftGuard";
import { useRoomFormOptions } from "@/hooks/room/useRoomFormOptions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function CreateRoomScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const form = useCreateRoom();
  const { buildings, roomTypes, loading, error, refetch } =
    useRoomFormOptions();

  const { formKey, handleBack, resetFormState } = useCreateRoomDraftGuard({
    form,
  });

  async function handleSubmit() {
    await form.submit({
      onSuccess: () => {
        resetFormState();
        emitRoomListRefresh();

        showToast({
          type: "success",
          title: "Tạo phòng thành công",
          message: "Phòng mới đã được thêm vào hệ thống.",
        });

        router.back();
      },
      onError: (message) => {
        showToast({
          type: "error",
          title: "Tạo phòng thất bại",
          message,
        });
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          className="px-5 pb-5"
          style={{
            paddingTop: insets.top - 10,
            backgroundColor: Colors.primary,
          }}
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={handleBack}
              className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>

            <Text className="text-[24px] font-extrabold text-white">
              Thêm phòng
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-center text-[16px] font-semibold"
            style={{ color: Colors.textPrimary }}
          >
            {error}
          </Text>

          <Pressable
            onPress={() => void refetch()}
            className="mt-4 h-12 items-center justify-center rounded-2xl px-5"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="font-bold text-white">Thử lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-5"
        style={{
          paddingTop: insets.top - 10,
          backgroundColor: Colors.primary,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-[24px] font-extrabold text-white">
              Thêm phòng
            </Text>
            <Text className="mt-1 text-[14px] text-white/85">
              Tạo mới phòng trong ký túc xá
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View key={formKey}>
          <RoomForm
            form={form}
            buildings={buildings}
            roomTypes={roomTypes}
            onSubmit={() => void handleSubmit()}
            onCancel={handleBack}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
