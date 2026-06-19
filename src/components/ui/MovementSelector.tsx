import { Cog, Gauge, Sparkles } from 'lucide-react';
import { MOVEMENT_LIST, MOVEMENTS } from '../../data/movements';
import { useWatchStore } from '../../store/useWatchStore';
import type { MovementType } from '../../types';
import { cn } from '../../lib/utils';

const ICONS: Record<MovementType, any> = {
  'swiss-lever': Cog,
  'co-axial': Gauge,
  tourbillon: Sparkles,
};

export function MovementSelector() {
  const movementType = useWatchStore((s) => s.movementType);
  const setMovementType = useWatchStore((s) => s.setMovementType);

  return (
    <div className="absolute left-5 top-28 z-10 w-[260px]">
      <div
        className="rounded-2xl border border-[#d4af37]/20 p-4 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(145deg, rgba(20,16,8,0.85), rgba(8,12,24,0.75))',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.08)',
        }}
      >
        <div
          className="mb-3 text-center text-[11px] font-light tracking-[0.35em] text-[#b89650]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          — M O V E M E N T —
        </div>

        <div className="flex flex-col gap-2">
          {MOVEMENT_LIST.map((type) => {
            const Icon = ICONS[type];
            const config = MOVEMENTS[type];
            const active = movementType === type;
            return (
              <button
                key={type}
                onClick={() => setMovementType(type)}
                className={cn(
                  'group relative overflow-hidden rounded-xl px-4 py-3 text-left transition-all duration-300',
                  active
                    ? 'border border-[#d4af37]/60 bg-gradient-to-r from-[#d4af37]/18 via-[#b89650]/10 to-transparent shadow-[0_0_18px_rgba(212,175,55,0.18)]'
                    : 'border border-white/5 hover:border-[#d4af37]/30 hover:bg-white/[0.03]',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300',
                      active
                        ? 'bg-[#d4af37]/25 text-[#ffd88a] shadow-[inset_0_0_10px_rgba(212,175,55,0.25)]'
                        : 'bg-white/[0.04] text-[#8a7a5a] group-hover:text-[#d4af37]',
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span
                      className={cn(
                        'text-[14px] tracking-wider transition-colors',
                        active ? 'text-[#ffd88a]' : 'text-[#c8b88a]',
                      )}
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {config.name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 text-[10.5px] tracking-[0.15em] transition-colors',
                        active ? 'text-[#b89650]' : 'text-[#6a5a3a]/70',
                      )}
                    >
                      {config.nameEn}
                    </span>
                  </div>
                  {active && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#ffb347] shadow-[0_0_10px_#ffb347]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t border-[#d4af37]/10 pt-3">
          <p
            className="text-[11px] leading-relaxed text-[#8a7a5a]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {MOVEMENTS[movementType].description}
          </p>
        </div>
      </div>
    </div>
  );
}
