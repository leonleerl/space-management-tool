import React, { FC } from 'react'
import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button, Popconfirm } from 'antd';
import { useStaffGrid } from '@/hooks/useStaffGrid';
import { useRoom } from '@/hooks/useRoomOptions';
import { useStaffPosition } from '@/hooks/useStaffPosition';

const STAFF_SOURCES = ['Academic', 'Research', 'Administrative', 'Visiting'];

const EconomicsStaff: FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave, handleAdd } = useStaffGrid('Economics');
  const { roomOptions } = useRoom('EconomicsLevel');
  const { staffPositions } = useStaffPosition();

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Economics</div>
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
          { type: 'autocomplete', source: staffPositions, allowInvalid: false, filter: false, strict: true },  // dropdown
          {},
          {
            type: 'dropdown',
            source: roomOptions,
            allowInvalid: false,
            filter: true,
            strict: true,
          },
          { type: 'autocomplete', source: STAFF_SOURCES, allowInvalid: false, filter: false, strict: true } // dropdown
        ]}
        colWidths={[180, 150, 100, 100, 120]}
        data={gridRows}
        rowHeaders={true}
        height="600px"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        columnSorting={true}
    />
    </div>
  )
}

export { EconomicsStaff }
