export interface AttributeDatum {
  label: string
  value: number
  /** CSS colour for the fill. Falls back to the terracotta accent. */
  color?: string
}

interface AttributeBarsProps {
  items: AttributeDatum[]
  /** 0–max scale; the data pack uses 0–100. */
  max?: number
  /** Show the numeric value at the end of each bar. */
  showValues?: boolean
}

/**
 * Reusable animated bar group. Purely presentational — it knows nothing about
 * coffee; callers pass whatever attributes they want to visualise. Fills use a
 * CSS width transition, so they animate smoothly whenever a value changes and
 * are never left empty by a paused animation frame.
 */
export function AttributeBars({ items, max = 100, showValues = true }: AttributeBarsProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.value / max) * 100))
        return (
          <div key={item.label} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
            <span className="text-sm text-soft">{item.label}</span>
            <div className="flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-sand">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: item.color ?? 'var(--color-accent)' }}
                />
              </div>
              {showValues && (
                <span className="w-7 shrink-0 text-right text-xs tabular-nums text-faint">
                  {Math.round(item.value)}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
