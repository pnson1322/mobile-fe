import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({ title, onPress, loading, disabled }: Props) {
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={[
        "h-[52px] rounded-2xl items-center justify-center overflow-hidden",
        isDisabled ? "opacity-60" : "active:opacity-90",
      ].join(" ")}
    >
      <View className="absolute inset-0 rounded-2xl bg-primary" />
      <View className="absolute inset-0 rounded-2xl bg-primaryLight opacity-10" />

      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-[16px] font-bold text-white">{title}</Text>
      )}
    </Pressable>
  );
}
