import { useEffect, useRef, useState } from 'react';
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';
import { StudentDto, StudentEntity } from '@/types/student';

type GridCell = string | null;

export function useStudentGrid(departmentName: string) {
  const hotRef = useRef<HotTableRef>(null);
  const [gridRows, setGridRows] = useState<GridCell[][]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const formatDateToYyyyMmDd = (value: unknown): string | null => {
    if (!value) return null;
    try {
      const date = value instanceof Date ? value : new Date(String(value));
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString().slice(0, 10);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetch(`/api/student?department=${encodeURIComponent(departmentName)}`)
      .then((res) => res.json())
      .then((rows: StudentEntity[]) => {
        setGridRows(
          rows.map((item) => {
            const fullName = [item.firstName, item.middleName, item.lastName]
              .filter((part) => part && String(part).trim().length > 0)
              .join(' ')
              .trim();

            return [
              fullName.length > 0 ? fullName : null,
              formatDateToYyyyMmDd(item.endDate),
              item.comment ?? null,
              item.extNo ?? null,
              item.podNo ?? null,
              item.type?.name ?? null,
            ];
          })
        );
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load student');
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

    const studentDtos: StudentDto[] = gridData
      .filter(
        (row) => Array.isArray(row) && row.some((cell) => cell && String(cell).trim().length > 0)
      )
      .map((row) => {
        const fullName = normalize(row[0]) ?? '';
        const endDateString = normalize(row[1]);
        const endDate = endDateString ? new Date(endDateString) : null;
        const comment = normalize(row[2]);
        const extNo = normalize(row[3]);
        const podNo = normalize(row[4]);
        const type = normalize(row[5]);

        return {
          id: 0,
          fullName,
          comment,
          extNo,
          podNo,
          endDate,
          room: null,
          type: type ? { id: 0, name: type } : null,
          department: { id: 0, name: departmentName },
        } as StudentDto;
      });

    fetch('/api/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentDtos),
    })
      .then(() => {
        message.success('Saved student');
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to save student');
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


