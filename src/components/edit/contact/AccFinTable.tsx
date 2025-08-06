import React, { FC, useEffect, useState } from 'react'

import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { ContactDto } from '@/types/contact';

const AccFinTable : FC<HotTableProps> = (props) => {
  const [data, setData] = useState<ContactDto[]>([]);

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div className='font-black text-2xl'>Accounting & Finance Staff</div>

    <HotTable
      themeName="ht-theme-main"
      colHeaders={['Full Name', 'Position', 'Ext No', 'Room', 'Source']}
      data={data.map(item =>{
        return [
          item.fullName,
          item.position,
          item.extNo,
          item.room.roomNo,
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

export { AccFinTable }
