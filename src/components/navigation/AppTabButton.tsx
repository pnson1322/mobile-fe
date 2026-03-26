import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

type Props = BottomTabBarButtonProps & {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
};

export function AppTabButton({
  label,
  iconName,
  focused,
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
  activeColor = Colors.accent,
  inactiveColor = Colors.textSecondary,
  activeBackgroundColor = "rgba(20, 184, 166, 0.18)",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: focused }}
      android_ripple={null}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 108,
          minHeight: 64,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 22,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? activeBackgroundColor : "transparent",
        }}
      >
        <Ionicons
          name={iconName}
          size={22}
          color={focused ? activeColor : inactiveColor}
        />

        <Text
          style={{
            marginTop: 4,
            fontSize: 12,
            fontWeight: "600",
            color: focused ? activeColor : inactiveColor,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
