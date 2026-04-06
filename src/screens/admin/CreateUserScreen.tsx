import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { AppSelect } from "@/components/AppSelect";
import { FormSection } from "@/components/profile/FormSection";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useCreateUser } from "@/hooks/user/useCreateUser";
import { useCreateUserDraftGuard } from "@/hooks/user/useCreateUserDraftGuard";
import { emitUserListRefresh } from "@/hooks/user/userRefreshBus";
import { UserRole } from "@/services/user.api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ROLE_OPTIONS: { label: string; value: UserRole; description: string }[] =
  [
    {
      label: "Admin",
      value: "admin",
      description: "Toàn quyền hệ thống",
    },
    {
      label: "Quản lý",
      value: "manager",
      description: "Quản lý phòng và cư dân",
    },
    {
      label: "QL cấp cao",
      value: "seniormanager",
      description: "Quản lý vận hành cấp cao",
    },
    {
      label: "Sinh viên",
      value: "student",
      description: "Quyền truy cập cơ bản",
    },
  ];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Quản lý",
  seniormanager: "QL cấp cao",
  student: "Sinh viên",
};

function getRolePreviewTone(role: UserRole) {
  switch (role) {
    case "admin":
      return { bg: "#EEF2FF", text: Colors.primary };
    case "manager":
      return { bg: "#EFF6FF", text: Colors.primaryLight };
    case "seniormanager":
      return { bg: "#EEF2FF", text: "#6366F1" };
    default:
      return { bg: "#ECFDF5", text: "#10B981" };
  }
}

export function CreateUserScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useCreateUser();

  const { formKey, handleBack, resetFormState } = useCreateUserDraftGuard({
    fullName: form.fullName,
    email: form.email,
    password: form.password,
    role: form.role,
    loading: form.loading,
    reset: form.reset,
    onResetExtra: () => setPasswordVisible(false),
  });

  async function handleSubmit() {
    await form.submit({
      onSuccess: () => {
        resetFormState();
        emitUserListRefresh();

        showToast({
          type: "success",
          title: "Tạo người dùng thành công",
          message: "Người dùng mới đã được thêm vào hệ thống.",
        });

        router.back();
      },
      onError: (message) => {
        showToast({
          type: "error",
          title: "Tạo người dùng thất bại",
          message,
        });
      },
    });
  }

  const selectedRoleTone = getRolePreviewTone(form.role);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-5"
        style={{
          paddingTop: insets.top - 10,
          backgroundColor: Colors.primary,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-[24px] font-extrabold text-white">
              Tạo người dùng
            </Text>
            <Text className="mt-1 text-[14px] text-white/85">
              Thêm mới tài khoản vào hệ thống
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View key={formKey} className="gap-6">
          <FormSection title="Thông tin cơ bản">
            <AppInput
              label="Họ tên"
              value={form.fullName}
              onChangeText={(text) => {
                form.setFullName(text);
                form.setTouched((prev) => ({ ...prev, fullName: true }));
              }}
              placeholder="Nhập họ tên"
              autoCapitalize="words"
              error={form.fullNameErr}
            />

            <AppInput
              label="Email"
              value={form.email}
              onChangeText={(text) => {
                form.setEmail(text);
                form.setTouched((prev) => ({ ...prev, email: true }));
              }}
              placeholder="Nhập email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={form.emailErr}
            />

            <AppInput
              label="Mật khẩu"
              value={form.password}
              onChangeText={(text) => {
                form.setPassword(text);
                form.setTouched((prev) => ({ ...prev, password: true }));
              }}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!passwordVisible}
              showPasswordToggle
              isPasswordVisible={passwordVisible}
              onTogglePasswordVisible={() =>
                setPasswordVisible((prev) => !prev)
              }
              error={form.passwordErr}
            />

            <AppSelect
              label="Vai trò"
              value={form.role}
              options={ROLE_OPTIONS}
              placeholder="Chọn vai trò"
              onSelect={(value) => {
                form.setRole(value);
                form.setTouched((prev) => ({ ...prev, role: true }));
              }}
            />
          </FormSection>

          <FormSection title="Xem trước">
            <View
              className="rounded-[22px] p-4"
              style={{
                backgroundColor: "#F8FAFC",
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View className="flex-row items-start">
                <View
                  className="mr-4 h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#E2E8F0" }}
                >
                  <Ionicons
                    name="person-outline"
                    size={26}
                    color={Colors.textSecondary}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className="text-[20px] font-extrabold"
                    style={{ color: Colors.textPrimary }}
                  >
                    {form.fullName.trim() || "Tên người dùng"}
                  </Text>

                  <Text
                    className="mt-1 text-[14px]"
                    style={{ color: Colors.textSecondary }}
                  >
                    {form.email.trim() || "email@example.com"}
                  </Text>

                  <View
                    className="mt-3 self-start rounded-full px-3 py-2"
                    style={{ backgroundColor: selectedRoleTone.bg }}
                  >
                    <Text
                      className="text-[12px] font-bold"
                      style={{ color: selectedRoleTone.text }}
                    >
                      {ROLE_LABELS[form.role]}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </FormSection>

          <View className="gap-4 pb-8">
            <AppButton
              title="Tạo người dùng"
              onPress={() => void handleSubmit()}
              loading={form.loading}
              disabled={!form.isFormValid}
            />

            <Pressable
              onPress={handleBack}
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
      </ScrollView>
    </SafeAreaView>
  );
}
