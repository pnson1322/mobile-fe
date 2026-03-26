import { http } from "@/services/http";

export type Gender = "Male" | "Female" | "Other";

export type ProfileData = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  gender: Gender | null;
  dateOfBirth: string | null; // YYYY-MM-DD
  bio: string | null;
  avatarUrl: string | null;

  studentCode: string | null;
  studentYear: string | null;
  school: string | null;
  faculty: string | null;

  citizenId: string | null;
  citizenIdIssuedPlace: string | null;
  ethnicity: string | null;
  religion: string | null;

  province: string | null;
  district: string | null;
  ward: string | null;
  addressLine: string | null;

  emergencyContactName: string | null;
  emergencyContactPhoneNumber: string | null;
  emergencyContactAddress: string | null;

  room: {
    id: string;
    name: string;
    building: string;
  } | null;
};

type ApiResponse<T> = {
  data: T;
  meta: null;
};

export type UpdateProfileBody = {
  fullName: string;
  phoneNumber?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  bio?: string | null;

  studentYear?: string | null;
  school?: string | null;
  faculty?: string | null;

  citizenId?: string | null;
  citizenIdIssuedPlace?: string | null;
  ethnicity?: string | null;
  religion?: string | null;

  province?: string | null;
  district?: string | null;
  ward?: string | null;
  addressLine?: string | null;

  emergencyContactName?: string | null;
  emergencyContactPhoneNumber?: string | null;
  emergencyContactAddress?: string | null;
};

type UploadAvatarResponse = {
  avatarUrl: string;
};

export async function getMyProfile() {
  const { data } = await http.get<ApiResponse<ProfileData>>("/api/profile/me");
  return data.data;
}

export async function updateMyProfile(body: UpdateProfileBody) {
  const { data } = await http.put<ApiResponse<ProfileData>>(
    "/api/profile/me",
    body,
  );
  return data.data;
}

export async function uploadMyAvatar(uri: string) {
  const formData = new FormData();

  const filename = uri.split("/").pop() || "avatar.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase();

  let mimeType = "image/jpeg";
  if (ext === "png") mimeType = "image/png";
  if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  if (ext === "webp") mimeType = "image/webp";

  formData.append("file", {
    uri,
    name: filename,
    type: mimeType,
  } as any);

  const { data } = await http.post<ApiResponse<UploadAvatarResponse>>(
    "/api/profile/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
}
