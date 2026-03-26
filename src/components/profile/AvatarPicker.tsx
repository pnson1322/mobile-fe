import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  imageUri: string | null;
  onPress: () => void;
};

export function AvatarPicker({ imageUri, onPress }: Props) {
  return (
    <View className="items-center">
      <View className="relative">
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 146,
            height: 146,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            className="overflow-hidden rounded-full"
            style={{
              width: 134,
              height: 134,
              backgroundColor: Colors.surface,
            }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: "#E5E7EB" }}
              >
                <Ionicons
                  name="person"
                  size={46}
                  color={Colors.textSecondary}
                />
              </View>
            )}
          </View>
        </LinearGradient>

        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            right: -2,
            bottom: 2,
            width: 58,
            height: 58,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={onPress}
            className="items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              backgroundColor: Colors.accent,
            }}
          >
            <Ionicons name="camera" size={22} color="white" />
          </Pressable>
        </LinearGradient>
      </View>

      <Text
        className="mt-4 text-center text-[15px] font-medium"
        style={{ color: Colors.textSecondary }}
      >
        Nhấn để thay đổi ảnh đại diện
      </Text>
    </View>
  );
}
