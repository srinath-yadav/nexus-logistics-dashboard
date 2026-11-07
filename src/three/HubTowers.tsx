import { Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Color, Object3D, type InstancedMesh } from "three";
import { HUBS } from "../data/hubs";
import { isHighLoad } from "../lib/hubLoad";

const SPACING = 1.4; // distance between towers
const TOWER_WIDTH = 0.8;
const MIN_HEIGHT = 0.3; // so an empty hub is still visible
const MAX_HEIGHT = 4; // height of a 100% full hub
const GROW_SECONDS = 3;

const COLOR_NORMAL = "#38bdf8"; // transit blue
const COLOR_HIGH = "#fbbf24"; // delayed amber
const COLOR_HOVER = "#e6edf7"; // ink

const HubTowers = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const grow = useRef(0); // 0 → 1

  // Where each tower stands and how tall it will be (calculated once)
  const towers = useMemo(
    () =>
      HUBS.map((hub, i) => ({
        hub,
        x: (i - (HUBS.length - 1) / 2) * SPACING, // centred around x = 0
        height: MIN_HEIGHT + hub.capacityUsed * MAX_HEIGHT,
      })),
    [],
  );

  // Write every tower's position + size for a given growth amount (0 → 1)
  const writeMatrices = (amount: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    towers.forEach(({ x, height }, i) => {
      const h = Math.max(0.001, height * amount); // never exactly 0
      dummy.position.set(x, h / 2, 0); // bottom on the floor
      dummy.scale.set(TOWER_WIDTH, h, TOWER_WIDTH);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  // Before the first frame: start flat — or fully grown if the user prefers less motion
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grow.current = 1;
      writeMatrices(1);
      meshRef.current?.computeBoundingSphere();
    } else {
      writeMatrices(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Colours: amber when busy, white when hovered
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const color = new Color();
    towers.forEach(({ hub }, i) => {
      const value =
        i === hovered ? COLOR_HOVER
        : isHighLoad(hub) ? COLOR_HIGH
        : COLOR_NORMAL;
      mesh.setColorAt(i, color.set(value));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [hovered, towers]);

  // Grow animation — stops doing work once finished
  useFrame((_, delta) => {
    if (grow.current >= 1) return;
    grow.current = Math.min(1, grow.current + delta / GROW_SECONDS);
    const eased = 1 - Math.pow(1 - grow.current, 3); // ease-out cubic
    writeMatrices(eased);
    // Growth finished: recalculate the hover area so it matches the full towers
    if (grow.current === 1) meshRef.current?.computeBoundingSphere();
  });

  const onMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(event.instanceId ?? null);
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    setHovered(null);
    document.body.style.cursor = "auto";
  };

  const active = hovered !== null ? towers[hovered] : null;

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, towers.length]}
        onPointerMove={onMove}
        onPointerOut={onOut}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.1} />
      </instancedMesh>

      {/* Hub code under each tower */}
      {towers.map(({ hub, x }) => (
        <Html
          key={hub.code}
          position={[x, 0, TOWER_WIDTH]}
          center
          style={{ pointerEvents: "none" }}>
          <span className="font-mono text-[11px] text-muted">{hub.code}</span>
        </Html>
      ))}

      {/* Tooltip above the hovered tower */}
      {active && (
        <Html
          position={[active.x, active.height + 0.5, 0]}
          center
          style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md border border-line-strong bg-panel px-3 py-2 text-xs">
            <p className="font-semibold text-ink">{active.hub.city}</p>
            <p className="text-muted">
              {Math.round(active.hub.capacityUsed * 100)}% capacity ·{" "}
              {active.hub.vehicles} vehicles
            </p>
          </div>
        </Html>
      )}
    </>
  );
};

export default HubTowers;
