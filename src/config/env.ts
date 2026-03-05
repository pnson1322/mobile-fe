import Constants from "expo-constants";

const extra =
  Constants.expoConfig?.extra ??
  (Constants as any).manifest?.extra ??
  (Constants as any).manifest2?.extra ??
  {};

export const ENV = {
  API_BASE_URL: (extra.API_BASE_URL as string) ?? "http://10.0.2.2:3000",
};
