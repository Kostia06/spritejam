export type Tool = 'pencil' | 'eraser' | 'bucket' | 'line' | 'rectangle' | 'ellipse' | 'selection' | 'eyedropper' | 'mirror';

export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface Layer {
  id: string;
  name: string;
  pixels: Map<string, string>;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface Frame {
  id: string;
  order: number;
  layers: Layer[];
  durationMs: number;
}

export interface Project {
  id: string;
  title: string;
  canvasWidth: number;
  canvasHeight: number;
  fps: number;
  frames: Frame[];
  palette: string[];
}
