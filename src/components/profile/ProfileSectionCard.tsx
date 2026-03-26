import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
};

export function ProfileSectionCard({ icon, title, children }: Props) {
  return (
    <View
      className="rounded-[24px] px-5 py-5"
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
      <View className="mb-4 flex-row items-center gap-2">
        <Ionicons name={icon} size={20} color={Colors.textSecondary} />
        <Text
          className="text-[15px] font-bold"
          style={{ color: Colors.textPrimary }}
        >
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}
