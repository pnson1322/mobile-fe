import { Colors } from "@/constants/colors";
import { RoomStatus } from "@/services/room.api";
import { getRoomStatusColors, roomStatusToVietnamese } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  value: RoomStatus;
  onChange: (status: RoomStatus) => void;
};

export function RoomStatusInlineCard({ value, onChange }: Props) {
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
    <View
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text
        className="text-[18px] font-bold"
        style={{ color: Colors.textPrimary }}
      >
        Trạng thái phòng
      </Text>

      <View className="mt-4 gap-4">
        {options.map((option) => {
          const selected = value === option.value;
          const tone = getRoomStatusColors(option.value);

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className="rounded-[22px] p-4"
              style={{
                backgroundColor: selected ? tone.background : Colors.surface,
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
    </View>
  );
}
