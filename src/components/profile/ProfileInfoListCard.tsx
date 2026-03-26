import { ProfileInfoRow } from "@/components/profile/ProfileInfoRow";
import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type Item = {
  label: string;
  value: string | null | undefined;
};

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  items: Item[];
};

export function ProfileInfoListCard({ icon, title, items }: Props) {
  return (
    <ProfileSectionCard icon={icon} title={title}>
      <View className="gap-1">
        {items.map((item, index) => (
          <ProfileInfoRow
            key={`${title}-${item.label}-${index}`}
            label={item.label}
            value={item.value}
          />
        ))}
      </View>
    </ProfileSectionCard>
  );
}
