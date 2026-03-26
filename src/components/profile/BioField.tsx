import { Colors } from "@/constants/colors";
import { Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  maxLength?: number;
  error?: string | null;
  onChangeText: (text: string) => void;
};

export function BioField({
  label,
  value,
  maxLength = 200,
  error,
  onChangeText,
}: Props) {
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
          minHeight: 150,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Chia sẻ đôi điều về bản thân"
          placeholderTextColor={Colors.textSecondary}
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
          className="text-[15px] leading-7 text-textPrimary"
          style={{ minHeight: 105 }}
        />

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm text-textSecondary">
            Chia sẻ đôi điều về bản thân
          </Text>
          <Text className="text-sm font-semibold text-textSecondary">
            {value.length}/{maxLength}
          </Text>
        </View>
      </View>

      {!!error && (
        <Text className="text-xs font-semibold text-red-500">{error}</Text>
      )}
    </View>
  );
}
