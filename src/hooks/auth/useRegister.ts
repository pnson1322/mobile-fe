import { getApiErrorMessage } from "@/services/apiError";
import { registerApi } from "@/services/auth.api";
import { setAccessToken } from "@/storage/authStorage";
import { shake } from "@/utils/shake";
import { isValidEmail } from "@/utils/validators";
import { useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

type RegisterTouched = {
  fullName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

export function useRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<RegisterTouched>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const shakeX = useRef(new Animated.Value(0)).current;

  const nameTrim = fullName.trim();
  const emailTrim = email.trim();

  const nameErr = !touched.fullName
    ? null
    : !nameTrim
      ? "Vui lòng nhập họ và tên."
      : nameTrim.length < 2
        ? "Họ và tên tối thiểu 2 ký tự."
        : null;

  const emailErr = !touched.email
    ? null
    : !emailTrim
      ? "Vui lòng nhập email."
      : !isValidEmail(emailTrim)
        ? "Email không đúng định dạng."
        : null;

  const passwordErr = !touched.password
    ? null
    : !password
      ? "Vui lòng nhập mật khẩu."
      : password.length < 8
        ? "Mật khẩu tối thiểu 8 ký tự."
        : null;

  const confirmErr = !touched.confirmPassword
    ? null
    : !confirmPassword
      ? "Vui lòng nhập lại mật khẩu."
      : confirmPassword.length < 8
        ? "Mật khẩu tối thiểu 8 ký tự."
        : confirmPassword !== password
          ? "Mật khẩu nhập lại không khớp."
          : null;

  const isFormValid = useMemo(() => {
    return (
      nameTrim.length >= 2 &&
      isValidEmail(emailTrim) &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      confirmPassword === password
    );
  }, [nameTrim, emailTrim, password, confirmPassword]);

  function markAllTouched() {
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
  }

  async function submit(opts?: {
    onSuccess?: () => void;
    onError?: () => void;
    simulateFail?: boolean;
  }) {
    markAllTouched();

    const invalid =
      nameTrim.length < 2 ||
      !isValidEmail(emailTrim) ||
      password.length < 8 ||
      confirmPassword.length < 8 ||
      confirmPassword !== password;

    if (invalid) {
      shake(shakeX);
      opts?.onError?.();
      return;
    }

    try {
      setLoading(true);

      if (opts?.simulateFail) {
        await new Promise((r) => setTimeout(r, 500));
        opts?.onError?.();
        return;
      }

      const res = await registerApi({
        fullName: nameTrim,
        email: emailTrim,
        password,
      });

      await setAccessToken(res.accessToken);

      opts?.onSuccess?.();
    } catch (err) {
      void getApiErrorMessage(err);
      opts?.onError?.();
    } finally {
      setLoading(false);
    }
  }

  return {
    fullName,
    email,
    password,
    confirmPassword,

    showPassword,
    showConfirm,
    loading,
    touched,

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
  };
}
