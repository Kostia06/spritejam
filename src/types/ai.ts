export type AiFeature = 'generate_sprite' | 'interpolate_frame' | 'suggest_palette' | 'autocomplete';

export interface GeneratedPixel {
  x: number;
  y: number;
  color: string;
}

export interface GenerateResult {
  pixels: GeneratedPixel[];
  palette: string[];
  description: string;
}

export interface InterpolateResult {
  frames: Array<{
    index: number;
    pixels: GeneratedPixel[];
    duration_ms: number;
  }>;
  fps: number;
  frame_count: number;
}

export interface PaletteResult {
  colors: Array<{ hex: string; name: string }>;
  theme: string;
}

export interface AutocompleteResult {
  added_pixels: GeneratedPixel[];
  description: string;
}
