import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { calculateAge, genderToVietnamese } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

type Props = {
  fullName: string;
  gender: "Male" | "Female" | "Other" | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  onEditPress: () => void;
};

export function ProfileHeader({
  fullName,
  gender,
  dateOfBirth,
  avatarUrl,
  onEditPress,
}: Props) {
  const age = calculateAge(dateOfBirth);

  return (
    <View style={{ backgroundColor: Colors.background }}>
      <View className="relative">
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 180,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        />

        <View className="-mt-[74px] px-6">
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 138,
              height: 138,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              className="overflow-hidden rounded-full"
              style={{
                width: 128,
                height: 128,
                backgroundColor: Colors.surface,
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
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
                    size={44}
                    color={Colors.textSecondary}
                  />
                </View>
              )}
            </View>
          </LinearGradient>

          <Text
            className="mt-4 text-[28px] font-extrabold"
            style={{ color: Colors.textPrimary }}
          >
            {fullName}
          </Text>

          <Text
            className="mt-1 text-[16px] font-medium"
            style={{ color: Colors.textSecondary }}
          >
            {genderToVietnamese(gender)}
            {age !== null ? ` • ${age} tuổi` : ""}
          </Text>

          <View className="mt-5">
            <AppButton title="Chỉnh sửa hồ sơ" onPress={onEditPress} />
          </View>
        </View>
      </View>
    </View>
  );
}
