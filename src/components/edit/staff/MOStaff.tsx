import React, { FC } from 'react'
import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button, Popconfirm } from 'antd';
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

const MOStaff: FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave, handleAdd } = useStaffGrid('MGMT & ORGS');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Management & Organizations Staff</div>
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
          { type: 'autocomplete', source: STAFF_POSITIONS, allowInvalid: false, filter: false, strict: true },  // dropdown
          {},
          {},
          { type: 'autocomplete', source: STAFF_SOURCES, allowInvalid: false, filter: false, strict: true } // dropdown
        ]}
        data={gridRows}
        rowHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"  // for non-commercial use only
      />
    </div>
  )
}

export { MOStaff }