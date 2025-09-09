import React from 'react'
import { HotTable } from '@handsontable/react-wrapper'
import 'handsontable/styles/handsontable.css'
import 'handsontable/styles/ht-theme-main.css'
import { Button, Popconfirm } from 'antd'
import { useStaffSource as useStaffSourceGrid } from '@/hooks/useStaffSource'

function StaffSource() {
  const { hotRef, gridRows, isSaving, handleAdd, handleSave } = useStaffSourceGrid()

  return (
    <div className=' p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='font-black text-2xl'>Staff Sources</div>
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
        themeName='ht-theme-main'
        colHeaders={['Staff Source']}
        colWidths={[300]}
        data={gridRows}
        rowHeaders={true}
        height='600px'
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey='non-commercial-and-evaluation'
        columnSorting={true}
      />
    </div>
  )
}

export { StaffSource };
