import { emitRoomListRefresh } from "@/hooks/room/roomRefreshBus";
import { useUpdateRoom } from "@/hooks/room/useUpdateRoom";
import {
  BuildingItem,
  RoomDetail,
  RoomStatus,
  RoomTypeItem,
} from "@/services/room.api";
import { useCallback, useEffect, useMemo, useState } from "react";

type Params = {
  room: RoomDetail | null;
  buildings: BuildingItem[];
  roomTypes: RoomTypeItem[];
  refetch: () => Promise<void>;
  setRoom: React.Dispatch<React.SetStateAction<RoomDetail | null>>;
  showSuccess: () => void;
  showError: (message: string) => void;
};

export function useRoomDetailsEditor({
  room,
  buildings,
  roomTypes,
  refetch,
  setRoom,
  showSuccess,
  showError,
}: Params) {
  const { loading: saving, submit } = useUpdateRoom();

  const [buildingId, setBuildingId] = useState("");
  const [name, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>("AVAILABLE");

  const resetDraftFromRoom = useCallback(
    (nextRoom = room) => {
      if (!nextRoom) return;

      setBuildingId(nextRoom.buildingId);
      setName(nextRoom.name);
      setFloor(String(nextRoom.floor));
      setRoomTypeId(nextRoom.roomTypeId);
      setSelectedStatus(nextRoom.roomStatus);
    },
    [room],
  );

  useEffect(() => {
    resetDraftFromRoom();
  }, [resetDraftFromRoom]);

  const parsedFloor = useMemo(() => {
    const n = Number(floor);
    return Number.isFinite(n) ? n : NaN;
  }, [floor]);

  const hasChanges = useMemo(() => {
    if (!room) return false;

    return (
      buildingId !== room.buildingId ||
      name.trim() !== room.name ||
      parsedFloor !== room.floor ||
      roomTypeId !== room.roomTypeId ||
      selectedStatus !== room.roomStatus
    );
  }, [room, buildingId, name, parsedFloor, roomTypeId, selectedStatus]);

  const isFormValid = useMemo(() => {
    return (
      !!buildingId &&
      !!name.trim() &&
      !!roomTypeId &&
      Number.isFinite(parsedFloor) &&
      parsedFloor >= 0
    );
  }, [buildingId, name, roomTypeId, parsedFloor]);

  const previewRoom = useMemo(() => {
    if (!room) return null;

    return {
      ...room,
      buildingId,
      buildingName:
        buildings.find((item) => item.id === buildingId)?.name ||
        room.buildingName,
      name: name.trim() || room.name,
      floor: Number.isFinite(parsedFloor) ? parsedFloor : room.floor,
      roomTypeId,
      roomTypeName:
        roomTypes.find((item) => item.id === roomTypeId)?.name ||
        room.roomTypeName,
      basePrice:
        roomTypes.find((item) => item.id === roomTypeId)?.basePrice ||
        room.basePrice,
      capacity:
        roomTypes.find((item) => item.id === roomTypeId)?.capacity ||
        room.capacity,
      roomStatus: selectedStatus,
    };
  }, [
    room,
    buildingId,
    name,
    parsedFloor,
    roomTypeId,
    roomTypes,
    buildings,
    selectedStatus,
  ]);

  const saveChanges = useCallback(async () => {
    if (!room || !isFormValid || !hasChanges) return;

    await submit(
      room.id,
      {
        buildingId,
        name: name.trim(),
        floor: parsedFloor,
        roomTypeId,
        roomStatus: selectedStatus,
      },
      {
        onSuccess: async () => {
          showSuccess();
          emitRoomListRefresh();

          const selectedBuilding =
            buildings.find((item) => item.id === buildingId) ?? null;
          const selectedRoomType =
            roomTypes.find((item) => item.id === roomTypeId) ?? null;

          setRoom((prev) =>
            prev
              ? {
                  ...prev,
                  buildingId,
                  buildingName: selectedBuilding?.name || prev.buildingName,
                  name: name.trim(),
                  floor: parsedFloor,
                  roomTypeId,
                  roomTypeName: selectedRoomType?.name || prev.roomTypeName,
                  basePrice: selectedRoomType?.basePrice ?? prev.basePrice,
                  capacity: selectedRoomType?.capacity ?? prev.capacity,
                  roomStatus: selectedStatus,
                }
              : prev,
          );

          await refetch();
        },
        onError: showError,
      },
    );
  }, [
    room,
    isFormValid,
    hasChanges,
    submit,
    buildingId,
    name,
    parsedFloor,
    roomTypeId,
    selectedStatus,
    showSuccess,
    showError,
    buildings,
    roomTypes,
    setRoom,
    refetch,
  ]);

  return {
    buildingId,
    name,
    floor,
    roomTypeId,
    selectedStatus,
    parsedFloor,
    hasChanges,
    isFormValid,
    previewRoom,
    saving,
    setBuildingId,
    setName,
    setFloor,
    setRoomTypeId,
    setSelectedStatus,
    resetDraftFromRoom,
    saveChanges,
  };
}
