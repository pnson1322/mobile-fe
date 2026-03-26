import { Colors } from "@/constants/colors";
import { formatDateToDisplay } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  helperText?: string;
  error?: string | null;
  onPress: () => void;
};

export function DateField({ label, value, helperText, error, onPress }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-[13px] font-semibold text-textSecondary">
        {label}
      </Text>

      <Pressable
        onPress={onPress}
        className="h-[52px] flex-row items-center rounded-2xl bg-slate-50 px-4"
        style={{
          borderWidth: 1,
          borderColor: error ? Colors.error : Colors.border,
        }}
      >
        <Text
          className={[
            "flex-1 text-[15px]",
            value ? "text-textPrimary" : "text-textSecondary",
          ].join(" ")}
        >
          {value ? formatDateToDisplay(value) : "Chọn ngày sinh"}
        </Text>

        <Ionicons
          name="calendar-outline"
          size={20}
          color={Colors.textSecondary}
        />
      </Pressable>

      {helperText ? (
        <Text className="text-sm text-textSecondary">{helperText}</Text>
      ) : null}

      {!!error && (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      )}
    </View>
  );
}
