'use client';

import React from'react';
import { Slider } from 'antd';
import { HotTableView } from "@/components";
import type { CellMeta, LayoutMeta } from "@/components";
import { useEffect, useState, useRef } from 'react';

function AccFinAcc() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellData, setCellData] = useState<CellMeta[] | null>(null);
  const [layoutData, setLayoutData] = useState<LayoutMeta | null>(null);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    async function fetchMapData() {
      try {
        const res = await fetch("/api/get-map-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mapName: "accounting_finance" })
        });
  
        if (!res.ok) throw new Error("Failed to fetch map data");
  
        const data = await res.json();

        const dataPatch = await fetch("/api/accommodation?roomLocation=AccFin", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(res => res.json());

        // new logic
          if (dataPatch && dataPatch.length > 0) {
            dataPatch.forEach((roomData: any) => {
              const roomNo = roomData.roomNo;
              
              const matchingCellIndex = data.cells.findIndex((cell: any) => cell.room === roomNo);
              
              if (matchingCellIndex !== -1) {
                const allPeople: string[] = [];
                
                if (roomData.staff && roomData.staff.length > 0) {
                  roomData.staff.forEach((person: any) => {
                    const fullName = [person.firstName, person.middleName, person.lastName]
                      .filter(name => name !== null && name !== undefined)
                      .join(' ');
                    allPeople.push(fullName);
                    
                    if (person.extNo) {
                      allPeople.push(`Ext: ${person.extNo}`);
                    }
                  });
                }
                
                if (roomData.students && roomData.students.length > 0) {
                  roomData.students.forEach((person: any) => {
                    const fullName = [person.firstName, person.middleName, person.lastName]
                      .filter(name => name !== null && name !== undefined)
                      .join(' ');
                    allPeople.push(fullName);
                    
                    if (person.extNo) {
                      allPeople.push(`Ext: ${person.extNo}`);
                    }
                  });
                }
                
                const contentParts = [roomNo, ...allPeople];
                
                if (roomData.keyLocker) {
                  contentParts.push(`Key Locker: ${roomData.keyLocker}`);
                }
                
                const newContent = contentParts.join('\n');
                
                data.cells[matchingCellIndex].content = newContent;
              }
            });
          }
                  
        setCellData(data.cells);
        setLayoutData(data.layout);
      } catch (err) {
        console.error(err);
      }
    }
  
    fetchMapData();
  }, []);

  return (
    <div className="flex flex-col w-full border-2"
      style={{
        height: 'calc(90vh - 4rem)', // Limit height to 90vh - navbar height
        overflow: 'auto',             // Allow scrolling if content exceeds height
      }}
    >
      <div className='flex justify-between items-center mb-4 px-4 pt-4'>
        <h2 className="text-xl font-bold">Accounting & Finance</h2>

      </div>

      <div className="px-4 mb-2">
        <Slider
          min={0.5}
          max={2}
          step={0.05}
          value={scale}
          onChange={(value) => {
            if (typeof value === 'number') {
              setScale(value);
            }
          }}
          tooltip={{ formatter: (value) => `${Math.round((value ?? 1) * 100)}%` }}
        />
      </div>

      <div
        className="flex-grow px-4"
        style={{
          overflow: 'auto',
          maxHeight: '100%',
          maxWidth: '100%',
        }}
      >
        {cellData && layoutData ? (
          <div style={{ width: 'fit-content', height: 'fit-content' }}>
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  minWidth: '3500px',   
                  minHeight: '700px',   
                }}
              >
                <HotTableView
                  cellData={cellData}
                  layoutData={layoutData}
                  onUpdate={(newCells, newLayout) => {
                    setCellData(newCells);
                    setLayoutData(newLayout);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="p-4">Loading table...</p>
        )}
      </div>
    </div>
  );
}

export { AccFinAcc }