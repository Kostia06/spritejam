import { useState } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { ToolBar } from '@/components/editor/ToolBar';
import { PixelCanvas } from '@/components/editor/PixelCanvas';
import { activeColor } from '@/signals/editor';
import { layers, activeLayerId } from '@/signals/layers';
import { frames, currentFrameIndex, isPlaying, fps } from '@/signals/animation';
import { layerPanelOpen, aiPanelOpen, timelineOpen } from '@/signals/ui';
import { paletteColors } from '@/signals/palette';

/* ============================================
   Collapsible Panel
   ============================================ */

interface PanelProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: preact.ComponentChildren;
}

function Panel({ title, isOpen, onToggle, children }: PanelProps) {
  return (
    <div class="border-b border-[var(--border)]/30 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        class="flex min-h-[44px] w-full items-center justify-between px-3 py-2 text-left font-pixel text-xs font-semibold text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors cursor-pointer"
      >
        {title}
        <svg
          class={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div class="px-3 pb-3">{children}</div>}
    </div>
  );
}

/* ============================================
   Layers Panel
   ============================================ */

function LayersPanel() {
  const layerList = layers.value;
  const activeId = activeLayerId.value;

  return (
    <div class="space-y-1">
      {layerList.length === 0 ? (
        <p class="text-xs text-[var(--text-2)] py-2">No layers yet</p>
      ) : (
        layerList.map((layer) => {
          const isActive = layer.id === activeId;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => { activeLayerId.value = layer.id; }}
              class={`flex min-h-[36px] w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[var(--bg-2)] border-l-2 border-l-[var(--primary)] text-[var(--text-0)]'
                  : 'text-[var(--text-1)] hover:bg-[var(--bg-2)]/50'
              }`}
            >
              <div
                class="w-2 h-2 rounded-sm flex-shrink-0"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                    : 'var(--text-2)',
                }}
              />
              <span class="truncate">{layer.name}</span>
              {!layer.visible && (
                <span class="ml-auto text-[8px] text-[var(--text-2)]">hidden</span>
              )}
            </button>
          );
        })
      )}

      <button
        type="button"
        class="flex min-h-[36px] w-full items-center justify-center gap-1 rounded-md border border-dashed border-[var(--border)] text-xs text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--primary)] transition-colors cursor-pointer"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Layer
      </button>
    </div>
  );
}

/* ============================================
   AI Tools Panel
   ============================================ */

function AiToolsPanel() {
  const AI_TOOLS = [
    { label: 'Generate Sprite', cost: 5 },
    { label: 'Interpolate Frames', cost: 3 },
    { label: 'Suggest Palette', cost: 1 },
    { label: 'Auto-Complete', cost: 3 },
  ];

  return (
    <div class="space-y-2">
      {AI_TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          class="flex min-h-[36px] w-full items-center justify-between rounded-md bg-[var(--bg-2)]/50 px-2 py-1.5 text-xs text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors cursor-pointer"
        >
          <span>{tool.label}</span>
          <span class="text-gradient font-pixel font-bold">
            {tool.cost}cr
          </span>
        </button>
      ))}
    </div>
  );
}

/* ============================================
   Palette Panel
   ============================================ */

function PalettePanel() {
  const colors = paletteColors.value;
  const current = activeColor.value;

  return (
    <div class="grid grid-cols-4 gap-1">
      {colors.map((color) => {
        const isActive = color === current;
        return (
          <button
            key={color}
            type="button"
            onClick={() => { activeColor.value = color; }}
            title={color}
            class={`aspect-square rounded-md cursor-pointer transition-transform duration-100 hover:scale-110 ${
              isActive ? 'ring-2 ring-offset-1 ring-offset-[var(--bg-1)] scale-110' : ''
            }`}
            style={{
              backgroundColor: color,
              ringColor: isActive
                ? 'var(--primary)'
                : undefined,
            }}
            aria-label={`Color ${color}`}
          />
        );
      })}
    </div>
  );
}

/* ============================================
   Timeline
   ============================================ */

function Timeline() {
  const frameList = frames.value;
  const currentIdx = currentFrameIndex.value;
  const playing = isPlaying.value;
  const fpsValue = fps.value;

  return (
    <div class="flex items-center gap-3 px-3 py-2">
      {/* Playback controls */}
      <div class="flex items-center gap-1">
        <button
          type="button"
          onClick={() => { isPlaying.value = !playing; }}
          class="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors cursor-pointer"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <span class="text-[10px] text-[var(--text-2)] font-pixel min-w-[40px] text-center">
          {fpsValue} FPS
        </span>
      </div>

      {/* Frame strip */}
      <div class="flex-1 flex items-center gap-1 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
        {frameList.length === 0 ? (
          <span class="text-xs text-[var(--text-2)]">No frames</span>
        ) : (
          frameList.map((frame, i) => {
            const isCurrent = i === currentIdx;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => { currentFrameIndex.value = i; }}
                class={`min-h-[36px] min-w-[36px] flex-shrink-0 flex items-center justify-center rounded-md text-[10px] font-pixel cursor-pointer transition-all duration-100 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-[0_0_8px_rgba(108,92,231,0.4)]'
                    : 'bg-[var(--bg-2)] text-[var(--text-2)] hover:text-[var(--text-1)]'
                }`}
              >
                {i + 1}
              </button>
            );
          })
        )}

        <button
          type="button"
          class="min-h-[36px] min-w-[36px] flex-shrink-0 flex items-center justify-center rounded-md border border-dashed border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--primary)] transition-colors cursor-pointer"
          aria-label="Add frame"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ============================================
   Editor Page
   ============================================ */

interface EditorProps {
  projectId?: string;
}

export function Editor({ projectId: _projectId }: EditorProps) {
  const [rightTab] = useState<'layers' | 'ai'>('layers');

  return (
    <PageTransition>
      <div class="fixed inset-0 top-14 flex flex-col bg-[var(--bg-0)]">
        <div class="flex flex-1 overflow-hidden">
          {/* Left: ToolBar */}
          <div class="flex-shrink-0 p-2">
            <ToolBar />
          </div>

          {/* Center: Canvas */}
          <div class="flex-1 relative overflow-hidden bg-[var(--canvas-bg)]">
            <PixelCanvas />
          </div>

          {/* Right: Sidebar */}
          <div class="hidden md:flex flex-shrink-0 w-56 flex-col glass-strong border-l border-[var(--border)]/30 overflow-y-auto">
            <Panel
              title="Layers"
              isOpen={layerPanelOpen.value}
              onToggle={() => { layerPanelOpen.value = !layerPanelOpen.value; }}
            >
              <LayersPanel />
            </Panel>

            <Panel
              title="AI Tools"
              isOpen={aiPanelOpen.value}
              onToggle={() => { aiPanelOpen.value = !aiPanelOpen.value; }}
            >
              <AiToolsPanel />
            </Panel>

            <Panel
              title="Palette"
              isOpen={true}
              onToggle={() => {}}
            >
              <PalettePanel />
            </Panel>
          </div>
        </div>

        {/* Bottom: Timeline */}
        {timelineOpen.value && (
          <div class="flex-shrink-0 glass-strong border-t border-[var(--border)]/30">
            <Timeline />
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default Editor;
