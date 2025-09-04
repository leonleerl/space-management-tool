import React, { FC } from 'react'
import { HotTable, HotTableProps } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { Button } from 'antd';
import { useRoomGrid } from '@/hooks/useRoomGrid';

const MarketingRoom: FC<HotTableProps> = () => {
  const { hotRef, gridRows, handleAdd } = useRoomGrid('Marketing');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-black text-2xl'>Marketing Rooms</div>
        <div className='flex gap-2'>
          <Button type='primary' onClick={handleAdd}>Add</Button>
        </div>
      </div>

      <HotTable
        ref={hotRef}
        themeName="ht-theme-main"
        colHeaders={['Room No', 'Key Locker', 'Location']}
        columns={[{}, {}, {}]}
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

export { MarketingRoom }
