import React, { FC } from "react";

import { HotTable, HotTableProps } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import { Button, Popconfirm } from "antd";
import { useStaffGrid } from "@/hooks/useStaffGrid";

// Dean's Office specific position list
// Customized based on actual data from contact_list.json
const STAFF_POSITIONS = [
  "Dean",
  "Associate Dean",
  "Director MBA Program",
  "Adjunct Associate Professor",
  "Senior Lecturer",
  "Lecturer",
  "Senior School Operations Coordinator",
  "School Operations Coordinator",
  "School Operations Officer",
  "Project Officer",
  "UWA PPI - Director",
  "UWA PPI - Executive Officer",
  "Administrative Officer",
];

// Dean's Office source types
const STAFF_SOURCES = ["Academic", "Administrative", "Executive", "PPI"];

const DeanStaff: FC<HotTableProps> = () => {
  // Key: Use "Dean's Office" as department name
  // This aligns with "Classification": "Deans Office" in contact_list.json
  const { hotRef, gridRows, isSaving, handleSave, handleAdd } =
    useStaffGrid("Dean's Office");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-black text-2xl">Dean's Office Staff</div>
        <div className="flex gap-2">
          <Button type="primary" onClick={handleAdd}>
            Add
          </Button>
          <Popconfirm
            title="Confirm Save"
            description="Are you sure you want to save the changes?"
            okText="Save"
            cancelText="Cancel"
            onConfirm={handleSave}
          >
            <Button color="cyan" variant="solid" loading={isSaving}>
              Save Changes
            </Button>
          </Popconfirm>
        </div>
      </div>

      <HotTable
        ref={hotRef}
        themeName="ht-theme-main"
        colHeaders={["Full Name", "Position", "Ext No", "Room", "Source"]}
        columns={[
          {}, // Full Name - free text input
          {
            type: "autocomplete",
            source: STAFF_POSITIONS,
            allowInvalid: false,
            filter: false,
            strict: true,
          }, // Position - dropdown selection
          {}, // Ext No - free text input
          {}, // Room - free text input
          {
            type: "autocomplete",
            source: STAFF_SOURCES,
            allowInvalid: false,
            filter: false,
            strict: true,
          }, // Source - dropdown selection
        ]}
        data={gridRows}
        rowHeaders={true}
        height="600px"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    </div>
  );
};

export { DeanStaff };
