"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { paintEmbroidery } from "./embroidery";
import { buildCollar, buildDecal, buildTorso, fabricTexture, sleeveTransform } from "./tee";

type Props = {
  shirtColor: string;
  threadColor: string;
  /** muestra la aguja bordando */
  needle?: boolean;
};

const CHEST_Y = 0.35;

function Sleeve({ side, material }: { side: 1 | -1; material: THREE.Material }) {
  const { start, center, quat, len } = useMemo(() => sleeveTransform(side), [side]);
  return (
    <group>
      <mesh position={center} quaternion={quat} material={material}>
        <cylinderGeometry args={[0.4, 0.37, len, 64, 16, true]} />
      </mesh>
      {/* hombro redondeado que cierra la manga */}
      <mesh position={start} material={material} scale={[1, 1, 1]}>
        <sphereGeometry args={[0.4, 32, 24]} />
      </mesh>
    </group>
  );
}

function Shirt({ shirtColor, threadColor, needle: showNeedle }: Props) {
  const needle = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);

  const { torso, collar, decal, bump } = useMemo(() => {
    const { geometry, neckRing } = buildTorso();
    return {
      torso: geometry,
      collar: buildCollar(neckRing),
      decal: buildDecal(0, CHEST_Y, 1.0),
      bump: fabricTexture(),
    };
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: shirtColor,
        roughness: 0.92,
        sheen: 0.25,
        envMapIntensity: 0.55,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color("#ffffff"),
        bumpMap: bump,
        bumpScale: 0.6,
        side: THREE.DoubleSide,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bump]
  );

  const { colorTex, bumpTex } = useMemo(() => {
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 1024;
      return c;
    };
    const colorTex = new THREE.CanvasTexture(mk());
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = 8;
    const bumpTex = new THREE.CanvasTexture(mk());
    bumpTex.anisotropy = 8;
    return { colorTex, bumpTex };
  }, []);

  useEffect(() => {
    paintEmbroidery(colorTex.image as HTMLCanvasElement, threadColor, "color");
    paintEmbroidery(bumpTex.image as HTMLCanvasElement, threadColor, "bump");
    colorTex.needsUpdate = true;
    bumpTex.needsUpdate = true;
  }, [threadColor, colorTex, bumpTex]);

  const target = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const n = needle.current;
    const g = group.current;
    if (!n || !g) return;
    const t = state.clock.elapsedTime;

    // vaivén suave de 3/4, como una pieza de catálogo
    g.rotation.y = Math.sin(t * 0.5) * 0.55 + 0.2;
    g.position.y = -0.15 + Math.sin(t * 0.8) * 0.04;
    material.color.lerp(target.set(shirtColor), 1 - Math.exp(-6 * dt));

    n.visible = !!showNeedle;
    n.position.set(Math.sin(t * 0.9) * 0.3, CHEST_Y + 0.12 + Math.abs(Math.sin(t * 9)) * 0.5, 0.85);
  });

  return (
    <group ref={group}>
      <mesh geometry={torso} material={material} />
      <mesh geometry={collar} material={material} />
      <Sleeve side={1} material={material} />
      <Sleeve side={-1} material={material} />

      {/* bordado pegado a la curvatura del pecho */}
      <mesh geometry={decal}>
        <meshStandardMaterial
          map={colorTex}
          bumpMap={bumpTex}
          bumpScale={4}
          roughness={0.35}
          metalness={0.15}
          transparent
          polygonOffset
          polygonOffsetFactor={-2}
          depthWrite={false}
        />
      </mesh>

      {/* aguja */}
      <group ref={needle} rotation={[0, 0, 0.12]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1, 12]} />
          <meshStandardMaterial color="#d8dde6" metalness={1} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.012, 0.1, 12]} />
          <meshStandardMaterial color="#d8dde6" metalness={1} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.025, 0.006, 8, 16]} />
          <meshStandardMaterial color="#d8dde6" metalness={1} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

export default function Scene(props: Props) {
  return (
    <Canvas camera={{ position: [0, 0.1, 7.6], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5, 5]} intensity={1.8} color="#fff4e6" />
      <directionalLight position={[-4, 1, 3]} intensity={0.8} color="#cfe0ff" />

      {/* entorno propio, sin descargas externas */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, 0, 2]} scale={[2, 6, 1]} />
      </Environment>

      <Shirt {...props} />
      <ContactShadows position={[0, -2.05, 0]} opacity={0.35} scale={8} blur={3} far={4} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 1.9}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
      />
    </Canvas>
  );
}
