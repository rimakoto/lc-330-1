import { X, Cog, Activity, ArrowRightLeft, Ruler } from 'lucide-react';
import { useWatchStore } from '../../store/useWatchStore';
import { cn } from '../../lib/utils';

export function GearInfoPanel() {
  const selectedGearId = useWatchStore((s) => s.selectedGearId);
  const setSelectedGearId = useWatchStore((s) => s.setSelectedGearId);
  const getGearConfig = useWatchStore((s) => s.getGearConfig);
  const timeScale = useWatchStore((s) => s.timeScale);
  const movement = useWatchStore((s) => s.getCurrentMovement());

  const gear = selectedGearId ? getGearConfig(selectedGearId) : undefined;

  const rpm = gear
    ? Math.abs(gear.baseSpeed * timeScale * (60 / (2 * Math.PI)))
    : 0;

  const gearIndex = movement.gears.findIndex((g) => g.id === selectedGearId);
  const prevGear = gearIndex > 0 ? movement.gears[gearIndex - 1] : undefined;
  const ratio =
    prevGear && gear && Math.abs(prevGear.baseSpeed) > 0.0001
      ? Math.abs(gear.baseSpeed / prevGear.baseSpeed)
      : null;

  return (
    <div
      className={cn(
        'absolute right-5 top-28 z-10 w-[280px] transition-all duration-500',
        selectedGearId && gear
          ? 'translate-x-0 opacity-100'
          : 'translate-x-[110%] opacity-0 pointer-events-none',
      )}
    >
      <div
        className="rounded-2xl border border-[#d4af37]/25 overflow-hidden backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(145deg, rgba(22,16,6,0.9), rgba(6,10,22,0.82))',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.1)',
        }}
      >
        <div
          className="relative border-b border-[#d4af37]/15 px-5 py-3.5"
          style={{
            background:
              'linear-gradient(90deg, rgba(212,175,55,0.12), transparent)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg shadow-[0_0_14px_rgba(255,179,71,0.3)]"
              style={{
                background: `radial-gradient(circle, ${gear?.color || '#d4af37'}55, transparent 70%)`,
              }}
            >
              <Cog size={18} strokeWidth={1.6} className="text-[#ffb347] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex-1">
              <div
                className="text-[15px] tracking-wider text-[#ffd88a]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {gear?.name}
              </div>
              <div className="mt-0.5 text-[10.5px] tracking-[0.18em] text-[#b89650]">
                {gear?.nameEn}
              </div>
            </div>
            <button
              onClick={() => setSelectedGearId(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[#6a5a3a] transition-all hover:border-[#ff6b6b]/40 hover:bg-[#ff6b6b]/10 hover:text-[#ff8a8a]"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <InfoRow
            icon={Activity}
            label="转速"
            labelEn="RPM"
            value={
              <span>
                {rpm.toFixed(2)}
                <span className="ml-1 text-[11px] text-[#8a7a5a]">
                  r/min
                </span>
              </span>
            }
            highlight
          />

          <InfoRow
            icon={Ruler}
            label="齿数"
            labelEn="Teeth"
            value={
              <span className="text-[#f0d89a]">
                {gear?.teeth}
                <span className="ml-1 text-[11px] text-[#8a7a5a]">T</span>
              </span>
            }
          />

          <InfoRow
            icon={Ruler}
            label="节圆直径"
            labelEn="Pitch Ø"
            value={
              <span>
                {(gear ? (gear.radius * 2 * 15).toFixed(1) : '—')}
                <span className="ml-1 text-[11px] text-[#8a7a5a]">mm</span>
              </span>
            }
          />

          <InfoRow
            icon={Cog}
            label="厚度"
            labelEn="Thickness"
            value={
              <span>
                {(gear ? (gear.thickness * 15).toFixed(2) : '—')}
                <span className="ml-1 text-[11px] text-[#8a7a5a]">mm</span>
              </span>
            }
          />

          {ratio !== null && (
            <InfoRow
              icon={ArrowRightLeft}
              label={`传动比 (${prevGear?.name.split(' ')[0]})`}
              labelEn="Gear Ratio"
              value={
                <span className="text-[#f0d89a]">
                  1 : {ratio.toFixed(2)}
                </span>
              }
              highlight
            />
          )}

          {gear?.connectsTo && gear.connectsTo.length > 0 && (
            <div className="mt-3 border-t border-[#d4af37]/10 pt-3">
              <div className="mb-2 flex items-center gap-1.5 text-[10.5px] tracking-[0.2em] text-[#8a7a5a]">
                <ArrowRightLeft size={11} strokeWidth={1.5} />
                MESHES WITH
              </div>
              <div className="flex flex-wrap gap-1.5">
                {gear.connectsTo.map((cid) => {
                  const c = movement.gears.find((g) => g.id === cid);
                  if (!c) return null;
                  return (
                    <button
                      key={cid}
                      onClick={() => setSelectedGearId(cid)}
                      className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/8 px-3 py-1 text-[11px] tracking-wider text-[#c8b88a] transition-all hover:border-[#d4af37]/60 hover:bg-[#d4af37]/18 hover:text-[#ffd88a]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: any;
  label: string;
  labelEn: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoRow({ icon: Icon, label, labelEn, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon
          size={13}
          strokeWidth={1.5}
          className={highlight ? 'text-[#ffb347]' : 'text-[#6a5a3a]'}
        />
        <div className="flex flex-col">
          <span
            className={`text-[12px] ${
              highlight ? 'text-[#d8b870]' : 'text-[#a0906a]'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {label}
          </span>
          <span className="text-[9px] tracking-[0.22em] text-[#5a4a2a]">
            {labelEn}
          </span>
        </div>
      </div>
      <div
        className="text-[14px] font-light tracking-wider text-[#e8d49a]"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {value}
      </div>
    </div>
  );
}
