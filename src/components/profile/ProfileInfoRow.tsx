import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

type Props = {
  label: string;
  value: string | null | undefined;
};

export function ProfileInfoRow({ label, value }: Props) {
  return (
    <View className="gap-1 py-2">
      <Text
        className="text-[12px] font-semibold"
        style={{ color: Colors.textSecondary }}
      >
        {label}
      </Text>

      <Text
        className="text-[15px] font-medium leading-6"
        style={{ color: Colors.textPrimary }}
      >
        {value?.trim() ? value : "Chưa cập nhật"}
      </Text>
    </View>
  );
}
