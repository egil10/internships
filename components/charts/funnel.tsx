"use client";

export function Funnel({ data }: { data: { stage: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const w = (d.count / max) * 100;
        const intensity = 1 - i * 0.1;
        return (
          <div key={d.stage} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted">{d.stage}</span>
              <span className="tabular-nums font-medium">{d.count}</span>
            </div>
            <div className="h-7 w-full rounded-md bg-bg overflow-hidden border border-border/50">
              <div
                className="h-full rounded-md bg-accent transition-all"
                style={{
                  width: `${w}%`,
                  opacity: Math.max(intensity, 0.25),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
