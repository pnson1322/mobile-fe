import { AppInput } from "@/components/AppInput";
import { AppSelect } from "@/components/AppSelect";
import { FormSection } from "@/components/profile/FormSection";
import { BuildingItem, RoomTypeItem } from "@/services/room.api";
import { formatCurrency } from "@/utils/room";
import { Text, View } from "react-native";

type Props = {
  buildingId: string;
  name: string;
  floor: string;
  roomTypeId: string;
  buildings: BuildingItem[];
  roomTypes: RoomTypeItem[];
  onChangeBuildingId: (value: string) => void;
  onChangeName: (value: string) => void;
  onChangeFloor: (value: string) => void;
  onChangeRoomTypeId: (value: string) => void;
};

export function RoomEditFormCard({
  buildingId,
  name,
  floor,
  roomTypeId,
  buildings,
  roomTypes,
  onChangeBuildingId,
  onChangeName,
  onChangeFloor,
  onChangeRoomTypeId,
}: Props) {
  const selectedRoomType =
    roomTypes.find((item) => item.id === roomTypeId) ?? null;

  return (
    <FormSection title="Chỉnh sửa thông tin">
      <AppSelect
        label="Tòa"
        value={buildingId || null}
        options={buildings.map((item) => ({
          label: `${item.name} (${item.code})`,
          value: item.id,
          description: `${item.zoneName} • ${item.totalFloors} tầng`,
        }))}
        placeholder="Chọn tòa"
        onSelect={onChangeBuildingId}
      />

      <AppInput
        label="Tên phòng"
        value={name}
        onChangeText={onChangeName}
        placeholder="Ví dụ: A101"
      />

      <AppInput
        label="Tầng"
        value={floor}
        onChangeText={onChangeFloor}
        placeholder="Ví dụ: 1"
        keyboardType="number-pad"
      />

      <AppSelect
        label="Loại phòng"
        value={roomTypeId || null}
        options={roomTypes.map((item) => ({
          label: item.name,
          value: item.id,
          description: `${item.capacity} người • ${formatCurrency(item.basePrice)}`,
        }))}
        placeholder="Chọn loại phòng"
        onSelect={onChangeRoomTypeId}
      />

      {selectedRoomType ? (
        <View className="rounded-[20px] bg-slate-50 px-4 py-4">
          <Text className="text-[13px] font-semibold text-textSecondary">
            Thông tin loại phòng
          </Text>

          <Text className="mt-2 text-[16px] font-bold text-textPrimary">
            {selectedRoomType.name}
          </Text>

          <Text className="mt-1 text-[14px] text-textSecondary">
            Sức chứa: {selectedRoomType.capacity} người
          </Text>

          <Text className="mt-1 text-[14px] text-textSecondary">
            Giá cơ bản: {formatCurrency(selectedRoomType.basePrice)}
          </Text>
        </View>
      ) : null}
    </FormSection>
  );
}
