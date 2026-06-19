import { WatchScene } from '@/components/watch3d/WatchScene';
import { Header } from '@/components/ui/Header';
import { MovementSelector } from '@/components/ui/MovementSelector';
import { TimeControl } from '@/components/ui/TimeControl';
import { GearInfoPanel } from '@/components/ui/GearInfoPanel';
import { HintTips } from '@/components/ui/HintTips';

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050810]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.08) 0%, rgba(10,14,26,0.9) 55%, #03050c 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(212,175,55,0.4) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="absolute inset-0 z-0">
        <WatchScene />
      </div>

      <Header />
      <MovementSelector />
      <GearInfoPanel />
      <TimeControl />
      <HintTips />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[200px]"
        style={{
          background:
            'linear-gradient(to top, #03050c 20%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[180px]"
        style={{
          background:
            'linear-gradient(to bottom, #03050c 25%, transparent 100%)',
        }}
      />
    </div>
  );
}
