export type MovementType = 'swiss-lever' | 'co-axial' | 'tourbillon';

export interface GearConfig {
  id: string;
  name: string;
  nameEn: string;
  teeth: number;
  position: [number, number, number];
  radius: number;
  thickness: number;
  rotationAxis: 'x' | 'y' | 'z';
  baseSpeed: number;
  color: string;
  connectsTo?: string[];
  rotationOffset?: number;
  spokes?: number;
}

export interface MovementConfig {
  id: MovementType;
  name: string;
  nameEn: string;
  description: string;
  gears: GearConfig[];
  hasTourbillon?: boolean;
  escapementOffset?: [number, number, number];
}
