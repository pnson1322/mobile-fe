import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label: string;
  value: T | null;
  placeholder?: string;
  options: Option<T>[];
  error?: string | null;
  onSelect: (value: T) => void;
};

export function SelectField<T extends string>({
  label,
  value,
  placeholder = "Chọn",
  options,
  error,
  onSelect,
}: Props<T>) {
  return (
    <View className="gap-2">
      <Text className="text-[13px] font-semibold text-textSecondary">
        {label}
      </Text>

      <View
        className="rounded-2xl bg-slate-50 px-4 py-3"
        style={{
          borderWidth: 1,
          borderColor: error ? Colors.error : Colors.border,
        }}
      >
        {options.map((item, index) => {
          const selected = value === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onSelect(item.value)}
              className={[
                "flex-row items-center justify-between py-3",
                index !== options.length - 1 ? "border-b border-slate-200" : "",
              ].join(" ")}
            >
              <Text
                className="text-[16px] font-medium"
                style={{
                  color: selected ? Colors.textPrimary : Colors.textSecondary,
                }}
              >
                {item.label}
              </Text>

              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={selected ? Colors.primary : Colors.textSecondary}
              />
            </Pressable>
          );
        })}

        {!value ? (
          <Text className="mt-1 text-sm text-textSecondary">{placeholder}</Text>
        ) : null}
      </View>

      {!!error && (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      )}
    </View>
  );
}
