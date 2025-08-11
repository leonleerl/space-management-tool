"use client";

import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react-wrapper";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { ConvertRowHeights, ConvertColWidths } from "@/components";
import type { CellMeta, LayoutMeta } from "@/features/accommodation-map/types";

// types moved to features/accommodation-map/types

interface Props {
  cellData: CellMeta[];
  layoutData: LayoutMeta;
  onUpdate?: (cells: CellMeta[], layout: LayoutMeta) => void;
}

function colorRenderer(
  instance: Handsontable.Core,
  td: HTMLTableCellElement,
  row: number,
  col: number,
  prop: any,
  value: any,
  cellProperties: Handsontable.CellProperties
) {
  Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, cellProperties);

  if ((cellProperties as any).bgColor) {
    td.style.backgroundColor = (cellProperties as any).bgColor;
  }
}

const HotTableView: React.FC<Props> = ({ cellData, layoutData }) => {
  const [data, setData] = useState<string[][]>([]);
  const [mergeCells, setMergeCells] = useState<Handsontable.GridSettings["mergeCells"]>();
  const [cellMeta, setCellMeta] = useState<Record<string, any>>({}); 

  useEffect(() => {
    if (!cellData || !layoutData) return;

    const maxRow = Math.max(...cellData.map(c => c.rowEnd));
    const maxCol = Math.max(...cellData.map(c => c.colEnd));

    const tableData = Array.from({ length: maxRow }, () => Array(maxCol).fill(""));
    const merges: NonNullable<Handsontable.GridSettings["mergeCells"]> = [];
    const meta: Record<string, any> = {};

    for (const cell of cellData) {
      const r = cell.rowStart - 1;
      const c = cell.colStart - 1;
      tableData[r][c] = cell.content || "";

      if (cell.rowEnd > cell.rowStart || cell.colEnd > cell.colStart) {
        merges.push({
          row: r,
          col: c,
          rowspan: cell.rowEnd - cell.rowStart + 1,
          colspan: cell.colEnd - cell.colStart + 1,
        });
      }

      meta[`${r},${c}`] = {
        className: "htMiddle htCenter",
        renderer: colorRenderer, 
        comment: cell.comment ? { value: cell.comment } : undefined,
        bgColor: cell.bgColor, 
      };
    }

    setData(tableData);
    setMergeCells(merges);
    setCellMeta(meta);
  }, [cellData, layoutData]);

  return (
    <HotTable
      data={data}
      colHeaders={false}
      rowHeaders={false}
      licenseKey="non-commercial-and-evaluation"
      mergeCells={mergeCells || []}
      comments={true}
      height="auto"
      width="auto"
      rowHeights={layoutData?.row_heights ? ConvertRowHeights(layoutData.row_heights) : []}
      colWidths={layoutData?.column_widths ? ConvertColWidths(layoutData.column_widths) : []}
      cells={(row, col) => cellMeta[`${row},${col}`] || {}}
      renderAllRows={false}
      viewportRowRenderingOffset={30}
      viewportColumnRenderingOffset={10}
    />
  );
};

export { HotTableView };