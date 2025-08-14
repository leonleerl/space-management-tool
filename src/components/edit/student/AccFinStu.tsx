import React, { FC } from 'react'

import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button } from 'antd';
import { useStudentGrid } from '@/hooks/useStudentGrid';

const AccFinStu : FC<HotTableProps> = () => {
  const { hotRef, gridRows, isSaving, handleSave, handleAdd, studentTypes } = useStudentGrid('AccFin');

  return (
    <div className=' p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='font-black text-2xl'>Accounting & Finance Student</div>
        <div className='flex gap-2'>
          <Button type='primary' onClick={handleAdd}>Add</Button>
          <Button color='cyan' variant='solid' onClick={handleSave} loading={isSaving}>Save Changes</Button>
        </div>
      </div>

    <HotTable
      ref={hotRef}
      themeName="ht-theme-main"
      colHeaders={['Full Name', 'End Date', 'Comment', 'Ext No', 'Pod No', 'Room', 'Type']}
      columns={[
        {},
        {},
        {},
        {},
        {},
        {},
        { type: 'autocomplete', source: studentTypes, allowInvalid: false, filter: false }
      ]}
      colWidths={[180, 100, 220, 100, 100, 100,180]}
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

export { AccFinStu }
