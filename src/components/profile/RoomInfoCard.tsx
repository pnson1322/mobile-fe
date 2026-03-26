import { ProfileInfoListCard } from "@/components/profile/ProfileInfoListCard";

type Props = {
  room: {
    id: string;
    name: string;
    building: string;
  } | null;
};

export function RoomInfoCard({ room }: Props) {
  return (
    <ProfileInfoListCard
      icon="home-outline"
      title="Thông tin phòng"
      items={[
        { label: "Phòng", value: room?.name ?? null },
        { label: "Tòa", value: room?.building ?? null },
      ]}
    />
  );
}
