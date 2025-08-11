export interface CellMeta {
    rowStart: number;
    colStart: number;
    rowEnd: number;
    colEnd: number;
    content: string;
    bgColor?: string;
    border?: {
      left?: string | null;
      right?: string | null;
      top?: string | null;
      bottom?: string | null;
    };
    comment?: string | null;
    // optional fields that may appear in source JSON
    room?: string;
    keylocker?: string;
  }
  
  export interface LayoutMeta {
    row_heights: Record<string, number>;
    column_widths: Record<string, number>;
  }
  
  
  