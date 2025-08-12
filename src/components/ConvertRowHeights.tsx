 function ConvertRowHeights(heights: Record<string, number> | null | undefined): number[] {
  if (!heights) return [];
  const keys = Object.keys(heights).map(k => parseInt(k)).filter(n => !isNaN(n));
  const maxIndex = keys.length > 0 ? Math.max(...keys) : 0;

  return Array.from({ length: maxIndex }, (_, i) => {
    const h = heights[(i + 1).toString()];
    return h ? h * 2 : 24;
  });
}

 function ConvertColWidths(widths: Record<string, number> | null | undefined): number[] {
  if (!widths) return [];
  const colIndex = (col: string) =>
    col.split('').reduce((acc, c, i) => acc * 26 + (c.charCodeAt(0) - 64), 0) - 1;

  const maxIndex = Math.max(...Object.keys(widths).map(colIndex));
  const result = Array(maxIndex + 1).fill(80);

  for (const [col, width] of Object.entries(widths)) {
    const idx = colIndex(col);
    result[idx] = width * 7;
  }

  return result;
}

export { ConvertRowHeights, ConvertColWidths }