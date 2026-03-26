import { AppTabsLayout } from "@/components/navigation/AppTabsLayout";

export default function StudentLayout() {
  return (
    <AppTabsLayout
      tabs={[
        {
          name: "profile",
          label: "Hồ sơ",
          iconName: "person-outline",
        },
        {
          name: "my-room",
          label: "Phòng tôi",
          iconName: "home-outline",
        },
        {
          name: "community",
          label: "Cộng đồng",
          iconName: "people-outline",
        },
        {
          name: "settings",
          label: "Cài đặt",
          iconName: "settings-outline",
        },
        {
          name: "edit-profile",
          label: "Chỉnh sửa",
          iconName: "create-outline",
          hidden: true,
        },
      ]}
    />
  );
}
