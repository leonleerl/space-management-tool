import React, { FC } from 'react'

import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button, Popconfirm } from 'antd';
import { useStudentGrid } from '@/hooks/useStudentGrid';
import { useRoom } from '@/hooks/useRoomOptions';

const GroundFloorDAStu: FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave, handleAdd, studentTypes } = useStudentGrid('GroundFloorDA');
  const { roomOptions } = useRoom('GroundFloorDA');
  return (
    <div className=' p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='font-black text-2xl'>GroundFloor - DA Student</div>
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
      colHeaders={['Full Name', 'End Date', 'Comment', 'Ext No', 'Pod No', 'Room', 'Type']}
      columns={[
        {},
        { type: 'date', allowInvalid: false, filter: false, dateFormat: 'YYYY-MM-DD', correctFormat: true },
        {},
        {},
        {},
        { type: 'dropdown', source: roomOptions, allowInvalid: false, filter: true, strict: true },
        { type: 'autocomplete', source: studentTypes, allowInvalid: false, filter: false }
      ]}
      colWidths={[160, 160, 160, 140, 140, 140, 140]}
      data={gridRows}
      rowHeaders={true}
      height="600px"
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation" 
      columnSorting={true}
    />
    </div>
  )
}

export { GroundFloorDAStu }
