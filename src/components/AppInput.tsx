import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;

  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisible?: () => void;

  error?: string | null;
} & Omit<TextInputProps, "value" | "onChangeText">;

export function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePasswordVisible,
  error,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const borderClass = error
    ? "border-red-500"
    : focused
      ? "border-primaryLight"
      : "border-slate-200";

  return (
    <View className="gap-2">
      <Text className="text-[13px] font-semibold text-textSecondary">
        {label}
      </Text>

      <View
        className={[
          "h-[52px] rounded-2xl border bg-slate-50 px-4 flex-row items-center",
          borderClass,
        ].join(" ")}
      >
        <TextInput
          ref={inputRef}
          className="flex-1 text-[15px] text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {showPasswordToggle ? (
          <Pressable
            onPressIn={() => {
              onTogglePasswordVisible?.();

              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            hitSlop={12}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={focused ? "#3B82F6" : "#64748B"}
            />
          </Pressable>
        ) : null}
      </View>

      {!!error && (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      )}
    </View>
  );
}
