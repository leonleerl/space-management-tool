'use client';

import React, { useRef, RefObject } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useFilteredStudents } from '@/app/features/students/components/useFilteredStudents'; 
import { usePreventScrollBleed } from '@/components/usePreventScrollBleed'
import { saveStudentsData } from '@/app/features/students/components/saveStudentsData';
import 'handsontable/dist/handsontable.min.css';
import { Button } from 'antd';

// register Handsontable's modules
registerAllModules();

export default function GF_DA_S() {
  const data = useFilteredStudents('GF-DA');
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<any>(null);

  // prevent scroll bleed
  usePreventScrollBleed(containerRef as RefObject<HTMLDivElement>, '.ht_master .wtHolder');
  const classification = "GF-DA"

  return (
    <div className="h-auto p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ground Floor - DA Staff</h2>
        <Button
          type="primary"
          onClick={() => {
            console.log('Saving Ground Floor - DA data');
            saveStudentsData(hotRef, classification);
          }}
        >
          Save Changes
        </Button>
      </div>
  
      <div
        ref={containerRef}
        className="border rounded shadow bg-white overflow-auto h-[90vh] overscroll-contain"
      >
        <HotTable
          ref={hotRef}
          data={data}
          width="100%"
          height="100%"
          colHeaders={['Name', 'End Date', 'Comment', 'Ext No','Pod No', 'Type']}
          columns={[
            { data: 'Name' },
            { data: 'End Date' },
            { data: 'Comment' },
            { data: 'Ext No' },
            { data: 'Pod No' },
            {
              data: 'Type',
              type: 'dropdown',
              source: ['HDR', 'New PhD in 2025', 'PhDs', 'Mphil', 'Visiting Student', 'Research Assistant', 'Casual Staff', 'Other'],
              strict: true,
              allowInvalid: false
            }
          ]}
          colWidths={[300, 200, 400, 150, 150, 150]}
          rowHeaders={true}
          contextMenu={{
            items: [
              'row_above',
              'row_below',
              'remove_row',
              'undo',
              'redo',
            ],
          }}
          manualColumnResize={true}
          autoWrapRow={true}
          autoWrapCol={true}
          licenseKey="non-commercial-and-evaluation"
          stretchH="all"
        />
      </div>

    </div>
  );
}