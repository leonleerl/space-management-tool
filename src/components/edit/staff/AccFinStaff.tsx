import React, { FC } from 'react'

import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button } from 'antd';
import { useStaffGrid } from '@/hooks/useStaffGrid';

const AccFinStaff : FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave } = useStaffGrid('AccFin');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Accounting & Finance Staff</div>
        <Button type='primary' onClick={handleSave} loading={isSaving}>Save Changes</Button>
      </div>

    <HotTable
      ref={hotRef}
      themeName="ht-theme-main"
      colHeaders={['Full Name', 'Position', 'Ext No', 'Room', 'Source']}
      data={gridRows}
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
