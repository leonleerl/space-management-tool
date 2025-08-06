import React, { FC, useEffect, useRef, useState } from 'react'

import { HotTable, HotTableProps, HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { ContactDto } from '@/types/contact';
import { Button } from 'antd';

const AccFinTable : FC<HotTableProps> = (props) => {
  const [data, setData] = useState<ContactDto[]>([]);
  const hotRef = useRef<HotTableRef>(null);

  useEffect(() => {
    fetch(`/api/contact?contactCategory=AccFin`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  const saveClickCallback = (event: React.MouseEvent<HTMLButtonElement>) => {
    const hot = hotRef.current?.hotInstance;
    console.log(hot?.getData());
    console.log("saveButton clicked")
    alert(hot?.getData())
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
