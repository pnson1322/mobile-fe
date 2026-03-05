import "dotenv/config";

export default {
  expo: {
    name: "dormitory-social-app",
    slug: "dormitory-social-app",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
};
