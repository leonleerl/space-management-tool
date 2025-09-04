
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
  const [isSaving, setIsSaving] = useState(false);

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
      // Pre-fill read-only Location column with current location name
      if (numberOfColumns >= 3) emptyRow[2] = locationName;
      return [...previousRows, emptyRow];
    });
  };

  const normalize = (value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const s = String(value).trim();
    return s.length === 0 ? null : s;
  };

  const handleSave: () => Promise<void> = async () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;
    setIsSaving(true);

    const gridData = hot.getData();
    setGridRows(gridData as GridCell[][]);

    // Map rows to API DTOs
    const payload: RoomApiDto[] = gridData
      .filter((row) => Array.isArray(row) && row.some((cell) => cell && String(cell).trim().length > 0))
      .map((row) => {
        const roomNo = normalize(row[0]);
        const keyLocker = normalize(row[1]);
        // If location column is empty (new rows), fall back to current locationName
        const locationFromGrid = normalize(row[2]);
        const effectiveLocationName = locationFromGrid ?? (locationName ? String(locationName) : null);
        return {
          id: 0,
          roomNo: roomNo ?? '',
          keyLocker: keyLocker,
          location: effectiveLocationName ? { id: 0, name: effectiveLocationName } : null,
        } as RoomApiDto;
      })
      .filter((r) => r.roomNo && r.roomNo.trim().length > 0);

    fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        message.success('Saved rooms');
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to save rooms');
      })
      .finally(() => setIsSaving(false));
  };

  return { hotRef, gridRows, setGridRows, isSaving, handleAdd, handleSave } as const;
}

