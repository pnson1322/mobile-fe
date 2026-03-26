import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { KeyboardScreen } from "@/components/KeyboardScreen";
import { ScreenGradient } from "@/components/ScreenGradient";
import { useToast } from "@/components/toast/ToastProvider";
import { useLogin } from "@/hooks/auth/useLogin";
import { Link, useRouter } from "expo-router";
import { Animated, Text, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    email,
    password,
    showPassword,
    loading,
    emailErr,
    passwordErr,
    isFormValid,
    shakeX,
    setEmail,
    setPassword,
    setShowPassword,
    setTouched,
    submit,
  } = useLogin();

  return (
    <KeyboardScreen>
      <ScreenGradient>
        <Animated.View
          className="rounded-3xl bg-white px-5 py-6 shadow-lg"
          style={{ transform: [{ translateX: shakeX }] }}
        >
          <Text className="text-[28px] font-extrabold text-slate-900">
            Đăng nhập
          </Text>
          <Text className="mt-1 text-slate-500 text-[15px]">
            Chào mừng bạn quay lại 👋
          </Text>

          <View className="mt-5 gap-4">
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
              returnKeyType="done"
            />
          </View>

          <View className="mt-3 items-end">
            <Text className="text-primary font-bold text-[14px]">
              Quên mật khẩu?
            </Text>
          </View>

          <View className="mt-5">
            <AppButton
              title="Đăng nhập"
              disabled={!isFormValid}
              loading={loading}
              onPress={() =>
                submit({
                  onSuccess: (role) => {
                    showToast({
                      type: "success",
                      title: "Thành công",
                      message: "Đăng nhập thành công 🎉",
                      durationMs: 2600,
                    });

                    setTimeout(() => {
                      if (role === "Admin") {
                        router.replace("/admin");
                      } else if (role === "Student") {
                        router.replace("/(student)/profile");
                      } else if (role === "Manager") {
                        router.replace("/(manager)/rooms");
                      } else {
                        router.replace("/(auth)/login");
                      }
                    }, 650);
                  },
                  onError: () =>
                    showToast({
                      type: "error",
                      title: "Thất bại",
                      message: "Đăng nhập thất bại.",
                      durationMs: 2600,
                    }),
                })
              }
            />
          </View>

          <View className="mt-4 flex-row justify-center gap-2">
            <Text className="text-slate-700 text-[15px]">
              Chưa có tài khoản?
            </Text>
            <Link
              className="text-primary font-extrabold text-[15px]"
              href="/(auth)/register"
            >
              Đăng ký
            </Link>
          </View>
        </Animated.View>
      </ScreenGradient>
    </KeyboardScreen>
  );
}
