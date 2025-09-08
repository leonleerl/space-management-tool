import React, { FC } from 'react'
import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button, Popconfirm } from 'antd';
import { useRoomGrid } from '@/hooks/useRoomGrid';

const AccFinRoom: FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleAdd, handleSave } = useRoomGrid('AccountingFinanceLevel');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Accounting & Finance Rooms</div>
        <div className='flex gap-2'>
          <Button type='primary' onClick={handleAdd}>Add</Button>
          <Popconfirm
            title='Confirm Save'
            description='If you remove any room, all staff and students in that room will be deleted. Are to save?'
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
        colHeaders={['Room No', 'Key Locker', 'Location']}
        columns={[{}, {}, { readOnly: true, className: 'htDimmed' } ]}
        data={gridRows}
        rowHeaders={true}
        height="600px"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

export { AccFinRoom }
