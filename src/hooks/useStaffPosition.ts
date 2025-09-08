import { useEffect, useRef, useState } from "react";
import type { HotTableRef } from '@handsontable/react-wrapper';
import { message } from 'antd';

type GridCell = string | null;

export function useStaffPosition() {
    const hotRef = useRef<HotTableRef>(null);
    const [gridRows, setGridRows] = useState<GridCell[][]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [staffPositions, setStaffPositions] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/staffPosition')
            .then((res) => res.json())
            .then((rows: string[]) => {
                setStaffPositions(rows);
                const data: GridCell[][] = Array.isArray(rows)
                    ? rows.map((name) => [name ?? null])
                    : [];
                setGridRows(data);
            })
            .catch((err) => {
                console.error(err);
                message.error('Failed to load staff positions');
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

            await fetch('/api/staffPosition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(names),
            });

            message.success('Saved staff positions');
        } catch (err) {
            console.error(err);
            message.error('Failed to save staff positions');
        } finally {
            setIsSaving(false);
        }
    };

    return { hotRef, gridRows, isSaving, handleAdd, handleSave, staffPositions } as const;
}

