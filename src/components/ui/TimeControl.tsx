import { Play, Pause, FastForward, Rewind, Gauge } from 'lucide-react';
import { useWatchStore } from '../../store/useWatchStore';

const PRESETS = [
  { label: '0.1×', value: 0.1 },
  { label: '0.5×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '5×', value: 5 },
  { label: '20×', value: 20 },
  { label: '50×', value: 50 },
];

export function TimeControl() {
  const timeScale = useWatchStore((s) => s.timeScale);
  const setTimeScale = useWatchStore((s) => s.setTimeScale);
  const isPlaying = useWatchStore((s) => s.isPlaying);
  const togglePlay = useWatchStore((s) => s.togglePlay);

  return (
    <div className="absolute bottom-7 left-1/2 z-10 w-[min(680px,92vw)] -translate-x-1/2">
      <div
        className="rounded-2xl border border-[#d4af37]/20 px-5 py-4 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(145deg, rgba(12,10,6,0.88), rgba(6,10,20,0.78))',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.08)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37]/25 to-[#8b6914]/20 text-[#ffd88a] shadow-[0_0_18px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)]"
          >
            {isPlaying ? (
              <Pause size={20} strokeWidth={2} />
            ) : (
              <Play size={20} strokeWidth={2} className="translate-x-[1px]" />
            )}
          </button>

          <button
            onClick={() => setTimeScale(Math.max(0.1, timeScale / 2))}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#8a7a5a] transition-all hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
          >
            <Rewind size={16} strokeWidth={1.8} />
          </button>

          <div className="relative flex flex-1 flex-col">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#8a7a5a]">
                <Gauge size={13} strokeWidth={1.5} />
                <span
                  className="text-[10.5px] tracking-[0.25em]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  TIME FLOW
                </span>
              </div>
              <span
                className="text-[15px] font-light tracking-wider text-[#ffd88a]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {timeScale.toFixed(1)}
                <span className="ml-0.5 text-[12px] text-[#b89650]">×</span>
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-white/[0.04]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#8b6914] via-[#d4af37] to-[#ffd88a] transition-all duration-150"
                style={{
                  width: `${((timeScale - 0.1) / (50 - 0.1)) * 100}%`,
                  boxShadow: '0 0 10px rgba(212,175,55,0.5)',
                }}
              />
              <input
                type="range"
                min={0.1}
                max={50}
                step={0.1}
                value={timeScale}
                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
              />
              <div
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#ffd88a] bg-[#2a1f0a] shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all duration-150"
                style={{
                  left: `calc(${((timeScale - 0.1) / (50 - 0.1)) * 100}% - 8px)`,
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setTimeScale(p.value)}
                  className={`text-[10px] transition-colors ${
                    Math.abs(timeScale - p.value) < 0.05
                      ? 'text-[#ffd88a]'
                      : 'text-[#5a4a2a] hover:text-[#b89650]'
                  }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setTimeScale(Math.min(50, timeScale * 2))}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#8a7a5a] transition-all hover:border-[#d4af37]/40 hover:bg-[#d4af37]/10 hover:text-[#d4af37]"
          >
            <FastForward size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
