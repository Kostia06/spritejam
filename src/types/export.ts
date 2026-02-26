export type ExportFormat = 'png_frames' | 'sprite_sheet' | 'css' | 'canvas_js' | 'batch';

export interface ExportOptions {
  format: ExportFormat;
  scale: number;
  includeBackground: boolean;
  frameRange?: [number, number];
}
