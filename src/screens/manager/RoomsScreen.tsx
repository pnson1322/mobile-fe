import { RoomCard } from "@/components/room/RoomCard";
import { RoomSearchBox } from "@/components/room/RoomSearchBox";
import { RoomStatusSheet } from "@/components/room/RoomStatusSheet";
import { RoomSummaryTabs } from "@/components/room/RoomSummaryTabs";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { subscribeRoomListRefresh } from "@/hooks/room/roomRefreshBus";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useRooms } from "@/hooks/room/useRooms";
import { useUpdateRoomStatus } from "@/hooks/room/useUpdateRoomStatus";
import { RoomItem, RoomStatus } from "@/services/room.api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function RoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const {
    items,
    counts,
    search,
    status,
    loading,
    refreshing,
    loadingMore,
    filtering,
    error,
    setSearch,
    setStatus,
    refetch,
    loadMore,
  } = useRooms();

  const { loading: updatingStatus, submit } = useUpdateRoomStatus();

  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>("AVAILABLE");

  const roomDetails = useRoomDetails(selectedRoom?.id);

  useEffect(() => {
    const unsubscribe = subscribeRoomListRefresh(() => {
      void refetch({ silent: true });
    });

    return unsubscribe;
  }, [refetch]);

  useEffect(() => {
    if (selectedRoom) {
      setSelectedStatus(selectedRoom.roomStatus);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (roomDetails.room?.roomStatus) {
      setSelectedStatus(roomDetails.room.roomStatus);
    }
  }, [roomDetails.room?.roomStatus]);

  function openStatusSheet(room: RoomItem) {
    setSelectedRoom(room);
  }

  async function handleConfirmStatus() {
    if (!roomDetails.room) return;

    await submit(roomDetails.room, selectedStatus, {
      onSuccess: async () => {
        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Trạng thái phòng đã được cập nhật.",
        });
        setSelectedRoom(null);
        await refetch({ silent: true });
      },
      onError: (message) => {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message,
        });
      },
    });
  }

  const statusChanged =
    !!selectedRoom && selectedStatus !== selectedRoom.roomStatus;

  const resultText = useMemo(() => {
    const keyword = search.trim();
    const hasSearch = keyword.length > 0;

    if (hasSearch) {
      return `${items.length} phòng tìm thấy`;
    }

    if (status === "AVAILABLE") {
      return `${counts.AVAILABLE} phòng còn trống`;
    }

    if (status === "FULL") {
      return `${counts.FULL} phòng đã đầy`;
    }

    if (status === "MAINTENANCE") {
      return `${counts.MAINTENANCE} phòng đang bảo trì`;
    }

    return `${counts.Total} phòng trong hệ thống`;
  }, [search, status, counts, items.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-1" style={{ backgroundColor: Colors.background }}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: insets.top + 10,
            paddingBottom: 70,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <Text className="text-[28px] font-extrabold text-white">Phòng</Text>
          <Text className="mt-2 text-[15px] text-white/90">
            Quản lý trạng thái và sức chứa phòng
          </Text>
        </LinearGradient>

        <View className="-mt-10 px-5">
          <RoomSearchBox value={search} onChangeText={setSearch} />
        </View>

        <View className="px-5 pt-5">
          <RoomSummaryTabs
            summary={{
              all: counts.Total,
              available: counts.AVAILABLE,
              full: counts.FULL,
              maintenance: counts.MAINTENANCE,
            }}
            selected={status}
            onChange={setStatus}
          />

          <View className="mt-5 flex-row items-center">
            <Text
              className="flex-1 text-[16px] font-semibold"
              style={{ color: Colors.textSecondary }}
            >
              {resultText}
            </Text>

            {filtering ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : null}
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text
              className="text-center text-[16px] font-semibold"
              style={{ color: Colors.textPrimary }}
            >
              {error}
            </Text>

            <Pressable
              onPress={() => void refetch({ refreshing: true })}
              className="mt-4 h-12 items-center justify-center rounded-2xl px-5"
              style={{ backgroundColor: Colors.primary }}
            >
              <Text className="font-bold text-white">Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 6,
              paddingBottom: 120,
              gap: 16,
            }}
            renderItem={({ item }) => (
              <RoomCard
                item={item}
                onPressChangeStatus={() => openStatusSheet(item)}
                onPressDetails={() =>
                  router.push({
                    pathname: "/(manager)/room-details/[id]",
                    params: {
                      id: item.id,
                    },
                  })
                }
              />
            )}
            onEndReached={() => void loadMore()}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void refetch({ refreshing: true })}
              />
            }
            ListEmptyComponent={
              <View
                className="mt-2 rounded-[24px] p-5"
                style={{
                  backgroundColor: Colors.surface,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <Text
                  className="text-[15px]"
                  style={{ color: Colors.textSecondary }}
                >
                  Không có phòng nào phù hợp.
                </Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        <Pressable
          onPress={() => router.push("/(manager)/create-room")}
          className="absolute right-5 h-16 w-16 items-center justify-center rounded-full"
          style={{
            bottom: 24 + insets.bottom,
            backgroundColor: Colors.primaryLight,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>

        <RoomStatusSheet
          visible={!!selectedRoom}
          roomName={selectedRoom?.name}
          value={selectedStatus}
          loading={updatingStatus || roomDetails.loading}
          confirmDisabled={!statusChanged}
          onChange={setSelectedStatus}
          onClose={() => setSelectedRoom(null)}
          onConfirm={() => void handleConfirmStatus()}
        />
      </View>
    </SafeAreaView>
  );
}
