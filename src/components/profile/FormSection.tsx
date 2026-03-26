import { Colors } from "@/constants/colors";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  children: ReactNode;
};

export function FormSection({ title, children }: Props) {
  return (
    <View className="gap-3">
      {title ? (
        <Text
          className="text-[18px] font-bold"
          style={{ color: Colors.textPrimary }}
        >
          {title}
        </Text>
      ) : null}

      <View
        className="rounded-[24px] px-4 py-5"
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          shadowColor: "#000",
          shadowOpacity: 0.03,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }}
      >
        <View className="gap-4">{children}</View>
      </View>
    </View>
  );
}
