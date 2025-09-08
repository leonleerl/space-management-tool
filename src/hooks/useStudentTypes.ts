import { useEffect, useRef, useState } from "react";
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';

type GridCell = string | null;

export function useStudentTypes() {
    const hotRef = useRef<HotTableRef>(null);
    const [gridRows, setGridRows] = useState<GridCell[][]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/studentType')
            .then((res) => res.json())
            .then((rows: string[]) => {
                const data: GridCell[][] = Array.isArray(rows)
                    ? rows.map((name) => [name ?? null])
                    : [];
                setGridRows(data);
            })
            .catch((err) => {
                console.error(err);
                message.error('Failed to load student types');
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

            await fetch('/api/studentType', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(names),
            });

            message.success('Saved student types');
        } catch (err) {
            console.error(err);
            message.error('Failed to save student types');
        } finally {
            setIsSaving(false);
        }
    };

    return { hotRef, gridRows, isSaving, handleAdd, handleSave } as const;
}