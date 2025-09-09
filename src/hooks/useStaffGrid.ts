import { useEffect, useRef, useState } from 'react';
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';
import type { StaffDto } from '@/types/staff';

type GridCell = string | null;

export function useStaffGrid(departmentName: string) {
  const hotRef = useRef<HotTableRef>(null);
  const [gridRows, setGridRows] = useState<GridCell[][]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/staff?department=${encodeURIComponent(departmentName)}`)
      .then((res) => res.json())
      .then((rows: StaffDto[]) => {
        setGridRows(
          rows.map((item) => [
            item.fullName ?? null,
            item.position ?? null,
            item.extNo ?? null,
            item.room?.roomNo ?? null,
            item.source ?? null,
          ])
        );
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load staff');
      });
  }, [departmentName]);

  const normalize = (value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const s = String(value).trim();
    return s.length === 0 ? null : s;
  };

  const handleSave: () => Promise<void> = async () => {
    setIsSaving(true);
    const hot = hotRef.current?.hotInstance;
    if (!hot) {
      setIsSaving(false);
      return;
    }

    const gridData = hot.getData();
    setGridRows(gridData as GridCell[][]);

    const staffDtos: StaffDto[] = gridData
      .filter(
        (row) => Array.isArray(row) && row.some((cell) => cell && String(cell).trim().length > 0)
      )
      .map((row) => {
        const fullName = normalize(row[0]) ?? '';
        const position = normalize(row[1]);
        const extNo = normalize(row[2]);
        const roomNo = normalize(row[3]);
        const source = normalize(row[4]);

        return {
          id: 0,
          fullName,
          position,
          extNo,
          source,
          room: roomNo
            ? {
                id: 0,
                roomNo,
                keyLocker: null,
                roomLocation: null,
              }
            : null,
          department: { id: 0, name: departmentName },
        } as StaffDto;
      });

    fetch(`/api/staff?department=${encodeURIComponent(departmentName)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffDtos),
    })
      .then(() => {
        message.success('Saved staff');
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to save staff');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleAdd = () => {
    setGridRows((previousRows) => {
      const numberOfColumns = previousRows[0]?.length ?? 5;
      const emptyRow: GridCell[] = Array(numberOfColumns).fill(null);
      return [...previousRows, emptyRow];
    });

  };

  return { hotRef, gridRows, setGridRows, isSaving, handleSave, handleAdd } as const;
}


