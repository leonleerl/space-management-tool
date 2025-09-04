
import { useEffect, useRef, useState } from 'react';
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';

type GridCell = string | null;

interface RoomLocationApiDto {
  id: number;
  name: string;
}

interface RoomApiDto {
  id: number;
  roomNo: string;
  keyLocker: string | null;
  location?: RoomLocationApiDto | null;
}

export function useRoomGrid(locationName: string) {
  const hotRef = useRef<HotTableRef>(null);
  const [gridRows, setGridRows] = useState<GridCell[][]>([]);

  useEffect(() => {
    if (!locationName) return;
    fetch(`/api/room?location=${encodeURIComponent(locationName)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((rows: RoomApiDto[]) => {
        setGridRows(
          rows.map((item) => [
            item.roomNo ?? null,
            item.keyLocker ?? null,
            item.location?.name ?? null,
          ])
        );
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load rooms');
      });
  }, [locationName]);

  const handleAdd = () => {
    setGridRows((previousRows) => {
      const numberOfColumns = previousRows[0]?.length ?? 3;
      const emptyRow: GridCell[] = Array(numberOfColumns).fill(null);
      return [...previousRows, emptyRow];
    });
  };

  return { hotRef, gridRows, setGridRows, handleAdd } as const;
}

