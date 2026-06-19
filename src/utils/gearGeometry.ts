import * as THREE from 'three';

export interface GearGeometryParams {
  teeth: number;
  radius: number;
  thickness: number;
  pressureAngle?: number;
  holeRadius?: number;
  spokes?: number;
}

export function createGearGeometry(params: GearGeometryParams): THREE.BufferGeometry {
  const {
    teeth,
    radius,
    thickness,
    pressureAngle = 20,
    holeRadius = 0.12,
    spokes = 0,
  } = params;

  const module = (2 * radius) / teeth;
  const addendum = module;
  const dedendum = 1.25 * module;
  const rootRadius = radius - dedendum;
  const outerRadius = radius + addendum;
  const baseRadius = radius * Math.cos((pressureAngle * Math.PI) / 180);

  const shape = new THREE.Shape();
  const toothAngle = (Math.PI * 2) / teeth;
  const halfToothAngle = toothAngle / 2;
  const toothThicknessAngle = toothAngle * 0.42;
  const stepsPerFlank = 4;

  for (let i = 0; i < teeth; i++) {
    const centerAngle = i * toothAngle;

    const rootStartAngle = centerAngle - halfToothAngle;
    const rootEndAngle = centerAngle - toothThicknessAngle / 2;

    if (i === 0) {
      const x0 = rootRadius * Math.cos(rootStartAngle);
      const y0 = rootRadius * Math.sin(rootStartAngle);
      shape.moveTo(x0, y0);
    }

    shape.absarc(0, 0, rootRadius, rootStartAngle, rootEndAngle, false);

    for (let s = 0; s <= stepsPerFlank; s++) {
      const t = s / stepsPerFlank;
      const r = rootRadius + t * (outerRadius - rootRadius);
      const involuteOffset = involute(r, baseRadius, radius);
      const angle = rootEndAngle + involuteOffset;
      shape.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }

    const tipStartAngle =
      centerAngle +
      toothThicknessAngle / 2 -
      involute(outerRadius, baseRadius, radius);
    const tipEndAngle = centerAngle + toothThicknessAngle / 2;

    shape.absarc(0, 0, outerRadius, tipStartAngle + involute(outerRadius, baseRadius, radius), centerAngle + halfToothAngle - toothThicknessAngle / 2 + Math.PI * 0.01, false);

    for (let s = 0; s <= stepsPerFlank; s++) {
      const t = 1 - s / stepsPerFlank;
      const r = rootRadius + t * (outerRadius - rootRadius);
      const involuteOffset = involute(r, baseRadius, radius);
      const angle = -involuteOffset + (centerAngle + halfToothAngle - toothThicknessAngle / 2 + Math.PI * 0.01);
      shape.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
  }

  shape.closePath();

  if (holeRadius > 0 && spokes > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const webInner = holeRadius * 1.6;
    const webOuter = rootRadius * 0.75;

    for (let i = 0; i < spokes; i++) {
      const angle0 = (i * Math.PI * 2) / spokes - Math.PI * 0.08;
      const angle1 = (i * Math.PI * 2) / spokes + Math.PI * 0.08;

      const spokeHole = new THREE.Path();
      spokeHole.moveTo(webInner * Math.cos(angle0), webInner * Math.sin(angle0));
      spokeHole.absarc(0, 0, webInner, angle0, angle1, false);
      spokeHole.lineTo(webOuter * Math.cos(angle1), webOuter * Math.sin(angle1));
      spokeHole.absarc(0, 0, webOuter, angle1, angle0, true);
      spokeHole.closePath();
      shape.holes.push(spokeHole);
    }
  } else if (holeRadius > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.08,
    bevelSize: thickness * 0.08,
    bevelSegments: 2,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  return geometry;
}

function involute(r: number, baseR: number, pitchR: number): number {
  if (r <= baseR) return 0;
  const alpha = Math.acos(baseR / r);
  const alpha0 = Math.acos(baseR / pitchR);
  return Math.tan(alpha) - alpha - (Math.tan(alpha0) - alpha0);
}

export function createHairspringGeometry(
  turns: number = 10,
  outerRadius: number = 0.45,
  innerRadius: number = 0.08,
  thickness: number = 0.008,
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const totalPoints = turns * 120;

  for (let i = 0; i <= totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * turns * Math.PI * 2;
    const r = innerRadius + (outerRadius - innerRadius) * t;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, 0));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, totalPoints, thickness / 2, 6, false);
  return tubeGeometry;
}

export function createBalanceWheelGeometry(
  radius: number = 0.5,
  thickness: number = 0.08,
  rimWidth: number = 0.06,
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, radius - rimWidth, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.1,
    bevelSize: thickness * 0.1,
    bevelSegments: 2,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  return geometry;
}
