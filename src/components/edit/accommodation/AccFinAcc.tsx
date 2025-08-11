'use client';

import React from'react';
import { Slider } from 'antd';
import { HotTableView } from "@/components";
import { useState } from 'react';
import { useMapData } from '@/hooks/useMapData';

function AccFinAcc() {
  const { cellData, layoutData, setCellData, setLayoutData } = useMapData('accounting_finance');
  const [scale, setScale] = useState(1);


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