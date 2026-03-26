import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardScreen } from "@/components/KeyboardScreen";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { BioField } from "@/components/profile/BioField";
import { DateField } from "@/components/profile/DateField";
import { EditProfileHeader } from "@/components/profile/EditProfileHeader";
import { FormSection } from "@/components/profile/FormSection";
import { SelectField } from "@/components/profile/SelectField";
import { Colors } from "@/constants/colors";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { ProfileData } from "@/services/profile.api";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

type Props = {
  profile: ProfileData;
  onBack: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
};

export function EditProfileForm({ profile, onBack, onSaved, onError }: Props) {
  const form = useUpdateProfile(profile);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = useMemo(
    () => [
      { label: "Nam", value: "Male" as const },
      { label: "Nữ", value: "Female" as const },
      { label: "Khác", value: "Other" as const },
    ],
    [],
  );

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      onError("Bạn cần cấp quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    form.setLocalAvatarUri(asset.uri);
  }

  async function handleSubmit() {
    await form.submit({
      onSuccess: () => {
        onSaved();
      },
      onError: (message) => {
        onError(message);
      },
    });
  }

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.background }}>
      <KeyboardScreen>
        <EditProfileHeader onBack={onBack} />

        <View className="-mt-2 flex-1 px-5 pb-8">
          <View
            className="items-center rounded-t-[28px] pt-2"
            style={{ backgroundColor: Colors.background }}
          >
            <AvatarPicker
              imageUri={form.previewAvatarUri}
              onPress={() => void handlePickAvatar()}
            />
          </View>

          <View className="mt-7 gap-6">
            <FormSection title="Thông tin cá nhân">
              <AppInput
                label="Họ và tên"
                value={form.fullName}
                onChangeText={form.setFullName}
                placeholder="Nhập họ và tên"
                error={form.fullNameErr}
                autoCapitalize="words"
                onBlur={() =>
                  form.setTouched((prev) => ({ ...prev, fullName: true }))
                }
              />

              <View className="gap-2">
                <Text
                  className="text-[13px] font-semibold"
                  style={{ color: Colors.textSecondary }}
                >
                  Email
                </Text>

                <View
                  className="h-[52px] flex-row items-center rounded-2xl px-4"
                  style={{
                    backgroundColor: "#F1F5F9",
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                >
                  <Text
                    className="flex-1 text-[15px]"
                    style={{ color: Colors.textSecondary }}
                  >
                    {form.email}
                  </Text>
                </View>

                <Text
                  className="text-sm"
                  style={{ color: Colors.textSecondary }}
                >
                  Liên hệ quản trị viên nếu bạn cần thay đổi email
                </Text>
              </View>

              <AppInput
                label="Số điện thoại"
                value={form.phoneNumber}
                onChangeText={form.setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                error={form.phoneErr}
                onBlur={() =>
                  form.setTouched((prev) => ({ ...prev, phoneNumber: true }))
                }
              />

              <BioField
                label="Tiểu sử"
                value={form.bio}
                onChangeText={form.setBio}
                error={form.bioErr}
                maxLength={200}
              />
            </FormSection>

            <FormSection title="Thông tin chung">
              <DateField
                label="Ngày sinh"
                value={form.dateOfBirth}
                error={form.dateErr}
                onPress={() => setShowDatePicker(true)}
              />

              <SelectField
                label="Giới tính"
                value={form.gender}
                options={genderOptions}
                onSelect={form.setGender}
              />

              <AppInput
                label="Sinh viên năm"
                value={form.studentYear}
                onChangeText={form.setStudentYear}
                placeholder="Ví dụ: Năm 2"
              />

              <AppInput
                label="Trường"
                value={form.school}
                onChangeText={form.setSchool}
                placeholder="Nhập tên trường"
              />

              <AppInput
                label="Khoa"
                value={form.faculty}
                onChangeText={form.setFaculty}
                placeholder="Nhập tên khoa"
              />

              <View className="gap-2">
                <Text
                  className="text-[13px] font-semibold"
                  style={{ color: Colors.textSecondary }}
                >
                  MSSV
                </Text>

                <View
                  className="h-[52px] flex-row items-center rounded-2xl px-4"
                  style={{
                    backgroundColor: "#F1F5F9",
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                >
                  <Text
                    className="flex-1 text-[15px]"
                    style={{ color: Colors.textSecondary }}
                  >
                    {form.studentCode || "Chưa cập nhật"}
                  </Text>
                </View>
              </View>

              <AppInput
                label="CCCD"
                value={form.citizenId}
                onChangeText={form.setCitizenId}
                placeholder="Nhập số CCCD"
                keyboardType="number-pad"
              />

              <AppInput
                label="Nơi cấp CCCD"
                value={form.citizenIdIssuedPlace}
                onChangeText={form.setCitizenIdIssuedPlace}
                placeholder="Nhập nơi cấp CCCD"
              />

              <AppInput
                label="Dân tộc"
                value={form.ethnicity}
                onChangeText={form.setEthnicity}
                placeholder="Nhập dân tộc"
              />

              <AppInput
                label="Tôn giáo"
                value={form.religion}
                onChangeText={form.setReligion}
                placeholder="Nhập tôn giáo"
              />
            </FormSection>

            <FormSection title="Thông tin cư trú, liên hệ">
              <AppInput
                label="Tỉnh/Thành phố"
                value={form.province}
                onChangeText={form.setProvince}
                placeholder="Nhập tỉnh/thành phố"
              />

              <AppInput
                label="Quận/Huyện"
                value={form.district}
                onChangeText={form.setDistrict}
                placeholder="Nhập quận/huyện"
              />

              <AppInput
                label="Phường/Xã"
                value={form.ward}
                onChangeText={form.setWard}
                placeholder="Nhập phường/xã"
              />

              <AppInput
                label="Số nhà, tên đường, tổ/xóm, khu"
                value={form.addressLine}
                onChangeText={form.setAddressLine}
                placeholder="Nhập địa chỉ chi tiết"
              />
            </FormSection>

            <FormSection title="Thông tin liên lạc">
              <AppInput
                label="Người liên hệ"
                value={form.emergencyContactName}
                onChangeText={form.setEmergencyContactName}
                placeholder="Nhập tên người liên hệ"
              />

              <AppInput
                label="Số điện thoại"
                value={form.emergencyContactPhoneNumber}
                onChangeText={form.setEmergencyContactPhoneNumber}
                placeholder="Nhập số điện thoại người liên hệ"
                keyboardType="phone-pad"
                error={form.emergencyPhoneErr}
                onBlur={() =>
                  form.setTouched((prev) => ({
                    ...prev,
                    emergencyContactPhoneNumber: true,
                  }))
                }
              />

              <AppInput
                label="Địa chỉ liên lạc"
                value={form.emergencyContactAddress}
                onChangeText={form.setEmergencyContactAddress}
                placeholder="Nhập địa chỉ liên lạc"
              />
            </FormSection>

            <View className="mt-1 gap-4 pb-8">
              <AppButton
                title="Lưu thay đổi"
                onPress={() => void handleSubmit()}
                loading={form.loading}
              />

              <Pressable
                onPress={onBack}
                className="h-[52px] items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: Colors.surface,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <Text
                  className="text-[16px] font-bold"
                  style={{ color: Colors.textPrimary }}
                >
                  Hủy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardScreen>

      {showDatePicker ? (
        <DateTimePicker
          value={
            form.dateOfBirth
              ? new Date(form.dateOfBirth)
              : new Date("2003-01-01")
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            if (Platform.OS !== "ios") {
              setShowDatePicker(false);
            }

            if (!selectedDate) return;

            const year = selectedDate.getFullYear();
            const month = `${selectedDate.getMonth() + 1}`.padStart(2, "0");
            const day = `${selectedDate.getDate()}`.padStart(2, "0");

            form.setDateOfBirth(`${year}-${month}-${day}`);
            form.setTouched((prev) => ({ ...prev, dateOfBirth: true }));
          }}
        />
      ) : null}
    </View>
  );
}
