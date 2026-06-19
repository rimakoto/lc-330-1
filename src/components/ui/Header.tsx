import { Watch } from 'lucide-react';

export function Header() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center pt-6">
      <div className="flex items-center gap-3 text-[#d4af37] drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]">
        <Watch size={30} strokeWidth={1.5} />
        <h1
          className="text-[28px] font-light tracking-[0.35em]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          HOROLOGIUM
        </h1>
        <Watch size={30} strokeWidth={1.5} className="scale-x-[-1]" />
      </div>
      <p
        className="mt-2 text-[13px] font-light tracking-[0.4em] text-[#b89650]/80"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        机 械 钟 表 解 构 · 齿 轮 传 动 可 视 化
      </p>
    </div>
  );
}
