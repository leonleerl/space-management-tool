

import React, { FC, useEffect, useState } from 'react'

import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button, Popconfirm, message } from 'antd';
import { useStaffGrid } from '@/hooks/useStaffGrid';

// static data for staff positions
// This can be replaced with dynamic data from a database or API if needed - TODO
const STAFF_POSITIONS = [
  'Lecturer',
  'Senior Lecturer',
  'Associate Professor',
  'Professor',
  'Research Fellow',
  'Postdoctoral Researcher',
  'Teaching Assistant',
  'Administrative Officer'
];

const STAFF_SOURCES = ['Academic', 'Research', 'Administrative', 'Visiting'];

const AccFinStaff : FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave, handleAdd } = useStaffGrid('AccFin');
  const [roomOptions, setRoomOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/room?location=AccountingFinanceLevel')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((rooms: Array<{ roomNo?: string | null }>) => {
        const options = Array.isArray(rooms)
          ? rooms
              .map((r) => (r.roomNo ?? '').toString().trim())
              .filter((v) => v.length > 0)
          : [];
        setRoomOptions(options);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load rooms');
      });
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Accounting & Finance Staff</div>
        <div className='flex gap-2'>
          <Button type='primary' onClick={handleAdd}>Add</Button>
          <Popconfirm
            title='Confirm Save'
            description='Are you sure you want to save the changes?'
            okText='Save'
            cancelText='Cancel'
            onConfirm={handleSave}
          >
            <Button color='cyan' variant='solid' loading={isSaving}>Save Changes</Button>
          </Popconfirm>
        </div>
      </div>

    <HotTable
      ref={hotRef}
      themeName="ht-theme-main"
      colHeaders={['Full Name', 'Position', 'Ext No', 'Room', 'Source']}
      columns={[
        {},
        { type: 'dropdown', source: STAFF_POSITIONS, allowInvalid: false, filter: false, strict: true },  // dropdown
        {},
        {
          type: 'dropdown',
          source: roomOptions,
          allowInvalid: false,
          filter: true,
          strict: true,
        },
        { type: 'dropdown', source: STAFF_SOURCES, allowInvalid: false, filter: false, strict: true } // dropdown
      ]}
      data={gridRows}
      rowHeaders={true}
      height="600px"
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation" // for non-commercial use only
    />
    </div>
  )
}

export { AccFinStaff }

