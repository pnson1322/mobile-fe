import { AppButton } from "@/components/AppButton";
import { RoomDetailOverviewCard } from "@/components/room/RoomDetailOverviewCard";
import { RoomEditFormCard } from "@/components/room/RoomEditFormCard";
import { RoomResidentsPlaceholderCard } from "@/components/room/RoomResidentsPlaceholderCard";
import { RoomStatusInlineCard } from "@/components/room/RoomStatusInlineCard";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useRoomDetailsEditor } from "@/hooks/room/useRoomDetailsEditor";
import { useRoomDetailsLeaveGuard } from "@/hooks/room/useRoomDetailsLeaveGuard";
import { useRoomFormOptions } from "@/hooks/room/useRoomFormOptions";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function RoomDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { room, loading, refreshing, error, refetch, setRoom } = useRoomDetails(
    typeof id === "string" ? id : undefined,
  );

  const {
    buildings,
    roomTypes,
    loading: optionsLoading,
    error: optionsError,
    refetch: refetchOptions,
  } = useRoomFormOptions();

  const editor = useRoomDetailsEditor({
    room,
    buildings,
    roomTypes,
    refetch,
    setRoom,
    showSuccess: () =>
      showToast({
        type: "success",
        title: "Cập nhật thành công",
        message: "Thông tin phòng đã được cập nhật.",
      }),
    showError: (message) =>
      showToast({
        type: "error",
        title: "Cập nhật thất bại",
        message,
      }),
  });

  const { handleBack } = useRoomDetailsLeaveGuard({
    hasChanges: editor.hasChanges,
    loading: editor.saving,
    onDiscard: editor.resetDraftFromRoom,
  });

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  if (loading || optionsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!room || error || optionsError || !editor.previewRoom) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          className="px-5 pb-5"
          style={{
            paddingTop: insets.top + 12,
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
              Chi tiết phòng
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-[16px] font-semibold text-textPrimary">
            {error || optionsError || "Không tải được chi tiết phòng."}
          </Text>

          <Pressable
            onPress={() => {
              void refetch();
              void refetchOptions();
            }}
            className="mt-4 h-12 items-center justify-center rounded-2xl px-5 bg-primary"
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

          <Text className="text-[24px] font-extrabold text-white">
            Chi tiết phòng
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-7"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <RoomDetailOverviewCard room={editor.previewRoom} />

          <RoomEditFormCard
            buildingId={editor.buildingId}
            name={editor.name}
            floor={editor.floor}
            roomTypeId={editor.roomTypeId}
            buildings={buildings}
            roomTypes={roomTypes}
            onChangeBuildingId={editor.setBuildingId}
            onChangeName={editor.setName}
            onChangeFloor={editor.setFloor}
            onChangeRoomTypeId={editor.setRoomTypeId}
          />

          <RoomResidentsPlaceholderCard />

          <RoomStatusInlineCard
            value={editor.selectedStatus}
            onChange={editor.setSelectedStatus}
          />

          {editor.hasChanges ? (
            <AppButton
              title="Lưu thay đổi"
              onPress={() => void editor.saveChanges()}
              loading={editor.saving}
              disabled={!editor.isFormValid || editor.saving}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
