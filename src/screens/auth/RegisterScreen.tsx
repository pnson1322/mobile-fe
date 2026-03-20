import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardScreen } from "@/components/KeyboardScreen";
import { ScreenGradient } from "@/components/ScreenGradient";
import { useToast } from "@/components/toast/ToastProvider";
import { useRegister } from "@/hooks/auth/useRegister";
import { Link, useRouter } from "expo-router";
import { Animated, Text, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    fullName,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirm,
    loading,
    nameErr,
    emailErr,
    passwordErr,
    confirmErr,
    isFormValid,
    shakeX,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirm,
    setTouched,
    submit,
  } = useRegister();

  return (
    <KeyboardScreen>
      <ScreenGradient>
        <Animated.View
          className="rounded-3xl bg-white px-5 py-6 shadow-lg"
          style={{ transform: [{ translateX: shakeX }] }}
        >
          <Text className="text-[28px] font-extrabold text-slate-900">
            Đăng ký
          </Text>
          <Text className="mt-1 text-slate-500 text-[15px]">
            Tạo tài khoản để bắt đầu ✨
          </Text>

          <View className="mt-5 gap-4">
            <AppInput
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChangeText={setFullName}
              error={nameErr}
              onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailErr}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePasswordVisible={() => setShowPassword((v) => !v)}
              error={passwordErr}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              returnKeyType="next"
            />

            <AppInput
              label="Nhập lại mật khẩu"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              showPasswordToggle
              isPasswordVisible={showConfirm}
              onTogglePasswordVisible={() => setShowConfirm((v) => !v)}
              error={confirmErr}
              onBlur={() =>
                setTouched((p) => ({ ...p, confirmPassword: true }))
              }
              returnKeyType="done"
            />
          </View>

          <View className="mt-5">
            <AppButton
              title="Tạo tài khoản"
              disabled={!isFormValid}
              loading={loading}
              onPress={() =>
                submit({
                  onSuccess: () => {
                    showToast({
                      type: "success",
                      title: "Thành công",
                      message: "Tạo tài khoản thành công 🎉",
                      durationMs: 2800,
                    });
                    setTimeout(() => router.replace("/"), 800);
                  },
                  onError: () =>
                    showToast({
                      type: "error",
                      title: "Thất bại",
                      message: "Đăng ký thất bại.",
                      durationMs: 2800,
                    }),
                })
              }
            />
          </View>

          <View className="mt-4 flex-row justify-center gap-2">
            <Text className="text-slate-700 text-[15px]">Đã có tài khoản?</Text>
            <Link
              className="text-primary font-extrabold text-[15px]"
              href="/(auth)/login"
            >
              Đăng nhập
            </Link>
          </View>
        </Animated.View>
      </ScreenGradient>
    </KeyboardScreen>
  );
}
