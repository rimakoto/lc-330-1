import { Mouse, MousePointerClick, ZoomIn } from 'lucide-react';

const TIPS = [
  { icon: Mouse, text: '拖拽旋转视角', en: 'DRAG TO ROTATE' },
  { icon: ZoomIn, text: '滚轮缩放观察', en: 'SCROLL TO ZOOM' },
  { icon: MousePointerClick, text: '点击齿轮查看信息', en: 'CLICK GEAR FOR INFO' },
];

export function HintTips() {
  return (
    <div className="pointer-events-none absolute bottom-7 left-5 z-10">
      <div className="flex flex-col gap-1.5">
        {TIPS.map(({ icon: Icon, text, en }, i) => (
          <div
            key={en}
            className="flex items-center gap-2 rounded-full border border-[#d4af37]/12 bg-black/20 px-3 py-1.5 backdrop-blur-md"
            style={{
              animation: `fadeInUp 0.6s ease-out ${0.3 + i * 0.12}s both`,
            }}
          >
            <Icon size={12} strokeWidth={1.6} className="text-[#b89650]" />
            <span
              className="text-[11px] tracking-wider text-[#a08a5a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {text}
            </span>
            <span className="text-[9px] tracking-[0.2em] text-[#5a4a2a]">
              {en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
