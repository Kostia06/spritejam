import type { Env } from '../index';

export function buildSystemPrompt(
  canvasWidth: number,
  canvasHeight: number,
  palette?: string[],
): string {
  const paletteClause = palette?.length
    ? `Restrict colors to this palette: ${palette.join(', ')}.`
    : 'Choose an appropriate pixel art color palette.';

  return [
    'You are a pixel art generation AI for Sprynt.',
    `Canvas size: ${canvasWidth}x${canvasHeight} pixels.`,
    'Coordinates start at (0,0) in the top-left corner.',
    `x ranges from 0 to ${canvasWidth - 1}, y ranges from 0 to ${canvasHeight - 1}.`,
    paletteClause,
    '',
    'CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no explanation.',
    'Output format for sprites: { "pixels": [{"x": 0, "y": 0, "color": "#RRGGBB"}, ...], "palette": ["#RRGGBB", ...], "metadata": {"description": "..."} }',
    'Output format for frames: { "frames": [{"index": 0, "pixels": [...], "durationMs": 83}, ...], "fps": 12, "palette": [...], "metadata": {"animationType": "...", "frameCount": N} }',
    'Output format for palette: { "colors": [{"hex": "#RRGGBB", "name": "..."}, ...], "theme": "...", "description": "..." }',
    'Output format for autocomplete: { "addedPixels": [{"x": 0, "y": 0, "color": "#RRGGBB"}, ...], "description": "..." }',
    '',
    'Only include non-transparent pixels. Each pixel must have valid x, y within canvas bounds and a valid hex color.',
  ].join('\n');
}

export async function callGemini(
  env: Env,
  systemPrompt: string,
  userPrompt: string,
): Promise<unknown> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json<{
    candidates: Array<{
      content: {
        parts: Array<{ text: string }>;
      };
    }>;
  }>();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return JSON.parse(text);
}
