import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { RoomStatus } from "@/services/room.api";
import { getRoomStatusColors, roomStatusToVietnamese } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  roomName?: string;
  value: RoomStatus;
  loading?: boolean;
  confirmDisabled?: boolean;
  onChange: (status: RoomStatus) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function RoomStatusSheet({
  visible,
  roomName,
  value,
  loading,
  confirmDisabled = false,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  const options: {
    value: RoomStatus;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      value: "AVAILABLE",
      description: "Phòng sẵn sàng cho người ở mới",
      icon: "checkmark-circle-outline",
    },
    {
      value: "FULL",
      description: "Phòng đã đủ sức chứa",
      icon: "close-circle-outline",
    },
    {
      value: "MAINTENANCE",
      description: "Phòng đang bảo trì hoặc sửa chữa",
      icon: "construct-outline",
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/35" onPress={onClose} />

        <View
          className="rounded-t-[32px] px-5 pb-8 pt-3"
          style={{ backgroundColor: Colors.surface }}
        >
          <View className="items-center">
            <View
              className="h-1.5 w-14 rounded-full"
              style={{ backgroundColor: "#CBD5E1" }}
            />
          </View>

          <Text
            className="mt-5 text-[24px] font-extrabold"
            style={{ color: Colors.textPrimary }}
          >
            Cập nhật trạng thái phòng
          </Text>

          {!!roomName && (
            <Text
              className="mt-2 text-[15px]"
              style={{ color: Colors.textSecondary }}
            >
              Phòng {roomName}
            </Text>
          )}

          <View className="mt-5 gap-4">
            {options.map((option) => {
              const selected = value === option.value;
              const tone = getRoomStatusColors(option.value);

              return (
                <Pressable
                  key={option.value}
                  onPress={() => onChange(option.value)}
                  className="rounded-[22px] p-4"
                  style={{
                    backgroundColor: selected
                      ? tone.background
                      : Colors.surface,
                    borderWidth: 1.5,
                    borderColor: selected ? tone.dot : Colors.border,
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: selected ? tone.dot : "#F8FAFC",
                      }}
                    >
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={selected ? "#FFFFFF" : tone.dot}
                      />
                    </View>

                    <View className="flex-1">
                      <Text
                        className="text-[18px] font-bold"
                        style={{ color: Colors.textPrimary }}
                      >
                        {roomStatusToVietnamese(option.value)}
                      </Text>
                      <Text
                        className="mt-1 text-[14px]"
                        style={{ color: Colors.textSecondary }}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 h-[52px] items-center justify-center rounded-2xl"
              style={{
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text
                className="text-[16px] font-bold"
                style={{ color: Colors.textSecondary }}
              >
                Hủy
              </Text>
            </Pressable>

            <View className="flex-1">
              <AppButton
                title="Xác nhận"
                onPress={onConfirm}
                loading={loading}
                disabled={confirmDisabled || loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
