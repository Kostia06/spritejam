import { signal } from '@preact/signals';

export const paletteColors = signal<string[]>([
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#808080', '#C0C0C0', '#800000', '#008000',
  '#000080', '#808000', '#800080', '#008080',
]);

export const paletteName = signal('Default');
