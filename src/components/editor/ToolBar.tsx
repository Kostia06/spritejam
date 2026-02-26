import { activeTool } from '@/signals/editor';
import type { Tool } from '@/types/canvas';

/* ============================================
   Tool Definitions
   ============================================ */

interface ToolDef {
  id: Tool;
  label: string;
  shortcut: string;
  icon: string;
}

const TOOLS: ToolDef[] = [
  { id: 'pencil', label: 'Pencil', shortcut: 'P', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z' },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', icon: 'M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' },
  { id: 'bucket', label: 'Fill', shortcut: 'F', icon: 'M3 3l1.664 1.664M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' },
  { id: 'line', label: 'Line', shortcut: 'L', icon: 'M4.5 19.5l15-15' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: 'M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z' },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z' },
  { id: 'selection', label: 'Selection', shortcut: 'S', icon: 'M9 4.5v15m6-15v15m-10.875-6h15.75m-15.75-3h15.75' },
  { id: 'eyedropper', label: 'Eyedropper', shortcut: 'I', icon: 'M15 11.25l1.5 1.5.75-.75V8.758l2.276-2.276a.75.75 0 00-1.06-1.06L16.19 7.696H12.99l-.75.75 1.5 1.5-6.99 6.99-1.5 1.5 1.5 1.5 1.5-1.5 6.99-6.99z' },
  { id: 'mirror', label: 'Mirror', shortcut: 'M', icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5' },
];

/* ============================================
   ToolBar Component
   ============================================ */

export function ToolBar() {
  function selectTool(tool: Tool) {
    activeTool.value = tool;
  }

  return (
    <div class="flex flex-col gap-1 glass-strong rounded-xl p-2 w-12">
      {TOOLS.map((tool) => {
        const isActive = activeTool.value === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => selectTool(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            aria-label={tool.label}
            aria-pressed={isActive}
            class={`relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150 ${
              isActive
                ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-[0_0_12px_rgba(108,92,231,0.5)]'
                : 'text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)]'
            }`}
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d={tool.icon} />
            </svg>

            {/* Shortcut hint */}
            <span class="absolute -right-0.5 -top-0.5 text-[8px] text-[var(--text-2)] font-pixel leading-none">
              {tool.shortcut}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ToolBar;
