import { getApiErrorMessage } from "@/services/apiError";
import { loginApi } from "@/services/auth.api";
import { setAccessToken, setRefreshToken } from "@/storage/authStorage";
import { decodeAccessToken, getUserRoleFromToken } from "@/utils/jwt";
import { shake } from "@/utils/shake";
import { isValidEmail } from "@/utils/validators";
import { useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

type LoginTouched = { email: boolean; password: boolean };

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<LoginTouched>({
    email: false,
    password: false,
  });

  const shakeX = useRef(new Animated.Value(0)).current;

  const emailTrim = email.trim();

  const emailErr: string | null = !touched.email
    ? null
    : !emailTrim
      ? "Vui lòng nhập email."
      : !isValidEmail(emailTrim)
        ? "Email không đúng định dạng."
        : null;

  const passwordErr: string | null = !touched.password
    ? null
    : !password
      ? "Vui lòng nhập mật khẩu."
      : password.length < 8
        ? "Mật khẩu tối thiểu 8 ký tự."
        : null;

  const isFormValid = useMemo(() => {
    return isValidEmail(emailTrim) && password.length >= 8;
  }, [emailTrim, password]);

  function markAllTouched() {
    setTouched({ email: true, password: true });
  }

  async function submit(opts?: {
    onSuccess?: (role?: string | null) => void;
    onError?: () => void;
  }) {
    markAllTouched();

    const invalid = !isValidEmail(emailTrim) || password.length < 8;
    if (invalid) {
      shake(shakeX);
      opts?.onError?.();
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ email: emailTrim, password });

      await setAccessToken(res.token);
      await setRefreshToken(res.refreshToken);

      const payload = decodeAccessToken(res.token);
      const role = getUserRoleFromToken(res.token);

      console.log("payload =", payload);
      console.log("role =", role);

      opts?.onSuccess?.(role);
    } catch (error: any) {
      if (error.response) {
        console.log("Dữ liệu lỗi từ server:", error.response.data);
      } else if (error.request) {
        console.log(
          "Không kết nối được server, kiểm tra IP/Port:",
          error.request,
        );
      } else {
        console.log("Lỗi code:", error.message);
      }
      void getApiErrorMessage(error);
      opts?.onError?.();
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
