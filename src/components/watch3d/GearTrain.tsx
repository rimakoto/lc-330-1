import { useWatchStore } from '../../store/useWatchStore';
import { Gear } from './Gear';

export function GearTrain() {
  const movement = useWatchStore((s) => s.getCurrentMovement());

  return (
    <group>
      {movement.gears.map((gear, idx) => (
        <Gear
          key={`${movement.id}-${gear.id}`}
          config={gear}
          animationOffset={idx * 0.17}
        />
      ))}
    </group>
  );
}
