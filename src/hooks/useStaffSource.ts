import { useEffect, useRef, useState } from "react";
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';

type GridCell = string | null;

/**
 * Manage Staff Source grid data and persistence
 */
export function useStaffSource() {
  const hotRef = useRef<HotTableRef>(null);
  const [gridRows, setGridRows] = useState<GridCell[][]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [staffSources, setStaffSources] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/staffSource')
      .then((res) => res.json())
      .then((rows: string[]) => {
        setStaffSources(rows);
        const data: GridCell[][] = Array.isArray(rows)
          ? rows.map((name) => [name ?? null])
          : [];
        setGridRows(data);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load staff sources');
      });
  }, []);

  const handleAdd = () => {
    setGridRows((prev) => [...prev, [null]]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const hot = hotRef.current?.hotInstance;
    try {
      const data = (hot?.getData() ?? gridRows) as GridCell[][];
      setGridRows(data);

      const names = Array.from(
        new Set(
          data
            .map((row) => (Array.isArray(row) ? String(row[0] ?? '').trim() : ''))
            .filter((v) => v.length > 0)
        )
      );

      await fetch('/api/staffSource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(names),
      });

      message.success('Saved staff sources');
    } catch (err) {
      console.error(err);
      message.error('Failed to save staff sources');
    } finally {
      setIsSaving(false);
    }
  };

  return { hotRef, gridRows, isSaving, handleAdd, handleSave, staffSources } as const;
}


