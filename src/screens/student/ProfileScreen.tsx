import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoListCard } from "@/components/profile/ProfileInfoListCard";
import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { RoomInfoCard } from "@/components/profile/RoomInfoCard";
import { Colors } from "@/constants/colors";
import useProfile from "@/hooks/profile/useProfile";
import { formatDateToDisplay, genderToVietnamese } from "@/utils/date";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, refreshing, refetch } = useProfile();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: Colors.background }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: Colors.background }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-center text-base font-semibold"
            style={{ color: Colors.textPrimary }}
          >
            Không tải được thông tin hồ sơ.
          </Text>

          <Pressable
            onPress={() => void refetch()}
            className="mt-4 h-12 items-center justify-center rounded-2xl px-5"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="font-bold text-white">Thử lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: Colors.background }}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          fullName={profile.fullName}
          gender={profile.gender}
          dateOfBirth={profile.dateOfBirth}
          avatarUrl={profile.avatarUrl}
          onEditPress={() => router.push("/(student)/edit-profile")}
        />

        <View className="gap-6 px-6 pt-6">
          <ProfileSectionCard icon="chatbubble-outline" title="Giới thiệu">
            <Text
              className="text-[15px] leading-8"
              style={{ color: Colors.textPrimary }}
            >
              {profile.bio?.trim() || "Bạn chưa cập nhật phần giới thiệu."}
            </Text>
          </ProfileSectionCard>

          <RoomInfoCard room={profile.room} />

          <ProfileInfoListCard
            icon="information-circle-outline"
            title="Thông tin chung"
            items={[
              {
                label: "Ngày sinh",
                value: formatDateToDisplay(profile.dateOfBirth),
              },
              {
                label: "Giới tính",
                value: genderToVietnamese(profile.gender),
              },
              {
                label: "Sinh viên năm",
                value: profile.studentYear,
              },
              {
                label: "Trường",
                value: profile.school,
              },
              {
                label: "Khoa",
                value: profile.faculty,
              },
              {
                label: "MSSV",
                value: profile.studentCode,
              },
              {
                label: "CCCD",
                value: profile.citizenId,
              },
              {
                label: "Nơi cấp CCCD",
                value: profile.citizenIdIssuedPlace,
              },
              {
                label: "Dân tộc",
                value: profile.ethnicity,
              },
              {
                label: "Tôn giáo",
                value: profile.religion,
              },
            ]}
          />

          <ProfileInfoListCard
            icon="location-outline"
            title="Thông tin cư trú, liên hệ"
            items={[
              {
                label: "Tỉnh/Thành phố",
                value: profile.province,
              },
              {
                label: "Quận/Huyện",
                value: profile.district,
              },
              {
                label: "Phường/Xã",
                value: profile.ward,
              },
              {
                label: "Số nhà, tên đường, tổ/xóm, khu",
                value: profile.addressLine,
              },
              {
                label: "Email",
                value: profile.email,
              },
              {
                label: "Số điện thoại",
                value: profile.phoneNumber,
              },
            ]}
          />

          <ProfileInfoListCard
            icon="call-outline"
            title="Thông tin liên lạc"
            items={[
              {
                label: "Người liên hệ",
                value: profile.emergencyContactName,
              },
              {
                label: "Số điện thoại",
                value: profile.emergencyContactPhoneNumber,
              },
              {
                label: "Địa chỉ liên lạc",
                value: profile.emergencyContactAddress,
              },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
