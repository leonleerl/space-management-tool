import React, { FC, useEffect, useRef, useState } from 'react'

import { HotTable, HotTableProps, HotTableRef } from '@handsontable/react-wrapper';
// import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { StaffDto } from '@/types/staff';
import { Button } from 'antd';

const AccFinStaff : FC<HotTableProps> = () => {
  const [data, setData] = useState<StaffDto[]>([]);
  const hotRef = useRef<HotTableRef>(null);

  useEffect(() => {
    fetch(`/api/staff?department=AccFin`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  const saveClickCallback = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const gridData = hot.getData();

    const normalize = (value: unknown): string | null => {
      if (value === undefined || value === null) return null;
      const s = String(value).trim();
      return s.length === 0 ? null : s;
    };

    const staffDtos: StaffDto[] = gridData
      .filter((row) => Array.isArray(row) && row.some((cell) => cell && String(cell).trim().length > 0))
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
          department: { id: 0, name: 'AccFin' },
        } as StaffDto;
      });
    console.log(staffDtos)
    fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffDtos),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('Saved staff:', res);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Accounting & Finance Staff</div>
        <Button type='primary' onClick={saveClickCallback}>Save Changes</Button>
      </div>

    <HotTable
      ref={hotRef}
      themeName="ht-theme-main"
      colHeaders={['Full Name', 'Position', 'Ext No', 'Room', 'Source']}
      data={data.map(item =>{
        return [
          item.fullName,
          item.position,
          item.extNo,
          item.room?.roomNo,
          item.source
        ]
      })}
      rowHeaders={true}
      height="auto"
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation" // for non-commercial use only
    />
    </div>
  )
}

export { AccFinStaff }
