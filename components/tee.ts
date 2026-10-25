import * as THREE from "three";

/* Perfil del torso: semiancho a(y). Se muestrea una vez. */
const PROFILE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.04, -1.7, 0),
  new THREE.Vector3(1.0, -0.9, 0),
  new THREE.Vector3(1.05, 0.2, 0),
  new THREE.Vector3(1.1, 0.85, 0),
  new THREE.Vector3(1.02, 1.22, 0),
  new THREE.Vector3(0.76, 1.42, 0),
  new THREE.Vector3(0.5, 1.5, 0),
]).getPoints(160);

const DEPTH = 0.56; // b = DEPTH * a
const NECK_DIP = 0.3;

export function halfWidth(y: number) {
  const P = PROFILE;
  if (y <= P[0].y) return P[0].x;
  for (let i = 1; i < P.length; i++) {
    if (y <= P[i].y) {
      const t = (y - P[i - 1].y) / (P[i].y - P[i - 1].y || 1);
      return P[i - 1].x + (P[i].x - P[i - 1].x) * t;
    }
  }
  return P[P.length - 1].x;
}

/** z de la superficie frontal del torso en (x, y), sin arrugas */
export function frontZ(x: number, y: number) {
  const a = halfWidth(y);
  return DEPTH * a * Math.sqrt(Math.max(0, 1 - (x / a) ** 2));
}

function wrinkle(x: number, y: number, phi: number) {
  return (
    0.011 * Math.sin(7 * y + 2.2 * phi) * Math.cos(3 * phi) +
    0.006 * Math.sin(15 * x + 4 * y) +
    0.009 * Math.sin(3.2 * y - 5 * phi)
  );
}

/** cuerpo de la camiseta */
export function buildTorso() {
  const N = 120;
  const M = PROFILE.length;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const ring: THREE.Vector3[] = [];

  for (let j = 0; j < M; j++) {
    const v = j / (M - 1);
    const a = PROFILE[j].x;
    const b = a * DEPTH;
    const dipK = THREE.MathUtils.smoothstep(v, 0.82, 1);
    for (let i = 0; i <= N; i++) {
      const phi = (i / N) * Math.PI * 2;
      const c = Math.cos(phi);
      const s = Math.sin(phi);
      let y = PROFILE[j].y;
      // escote más bajo adelante
      y -= NECK_DIP * dipK * Math.pow(Math.max(0, s), 1.6);
      const w = j === M - 1 ? 0 : wrinkle(a * c, y, phi) * (0.5 + v);
      const x = a * c * (1 + w);
      const z = b * s * (1 + w * 1.4);
      pos.push(x, y, z);
      uv.push(i / N, v);
      if (j === M - 1 && i < N) ring.push(new THREE.Vector3(x, y, z));
    }
  }
  for (let j = 0; j < M - 1; j++) {
    for (let i = 0; i < N; i++) {
      const p = j * (N + 1) + i;
      idx.push(p, p + 1, p + N + 1, p + 1, p + N + 2, p + N + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return { geometry: g, neckRing: ring };
}

/** cuello acanalado siguiendo el borde del escote */
export function buildCollar(ring: THREE.Vector3[]) {
  const curve = new THREE.CatmullRomCurve3(ring, true);
  return new THREE.TubeGeometry(curve, 120, 0.055, 12, true);
}

/** manga (lado = 1 derecha, -1 izquierda) */
export function sleeveTransform(side: 1 | -1) {
  const start = new THREE.Vector3(side * 0.9, 1.08, -0.02);
  const dir = new THREE.Vector3(side * Math.sin(0.62), -Math.cos(0.62), 0.06).normalize();
  const len = 0.95;
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().negate()
  );
  const center = start.clone().addScaledVector(dir, len / 2);
  return { start, center, quat, len };
}

/** textura de punto de la tela (para bump) */
export function fabricTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(128, 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const k = (y * 128 + x) * 4;
      const weave = 0.5 + 0.25 * Math.sin(x * Math.PI / 2) * Math.sin(y * Math.PI / 2);
      const v = (weave + Math.random() * 0.35) * 255;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(36, 18);
  return t;
}

/** parche curvo del bordado pegado a la superficie del pecho */
export function buildDecal(cx: number, cy: number, size: number) {
  const g = new THREE.PlaneGeometry(size, size, 48, 48);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = cx + p.getX(i);
    const y = cy + p.getY(i);
    p.setXYZ(i, x, y, frontZ(x, y) + 0.075);
  }
  g.computeVertexNormals();
  return g;
}
