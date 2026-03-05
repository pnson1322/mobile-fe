import { http } from "@/services/http";

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  // optional: user
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
};

export async function loginApi(body: LoginBody) {
  const { data } = await http.post<AuthResponse>("/auth/login", body);
  return data;
}

export async function registerApi(body: RegisterBody) {
  const { data } = await http.post<AuthResponse>("/auth/register", body);
  return data;
}
