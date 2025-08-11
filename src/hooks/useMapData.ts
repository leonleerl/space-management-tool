import { useEffect, useState } from 'react';
import type { CellMeta, LayoutMeta } from '@/types/map';

export function useMapData(mapName: string) {
  const [cellData, setCellData] = useState<CellMeta[] | null>(null);
  const [layoutData, setLayoutData] = useState<LayoutMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/get-map-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mapName }),
        });
        if (!res.ok) throw new Error('Failed to fetch map data');
        const data = await res.json();
        if (!isMounted) return;
        setCellData(data.cells);
        setLayoutData(data.layout);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [mapName]);

  return { cellData, layoutData, setCellData, setLayoutData, isLoading } as const;
}


