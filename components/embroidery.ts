import * as THREE from "three";

function shade(hex: string, dl: number) {
  const hsl = { h: 0, s: 0, l: 0 };
  new THREE.Color(hex).getHSL(hsl);
  const l = Math.min(95, Math.max(5, hsl.l * 100 + dl));
  return `hsl(${hsl.h * 360} ${hsl.s * 100}% ${l}%)`;
}

// Pseudo-random determinista para que la textura no parpadee al regenerarse
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Layer = { draw: (c: CanvasRenderingContext2D) => void; angle: number; dl: number };

function layers(size: number): Layer[] {
  const cx = size / 2;
  return [
    {
      // sol
      angle: 40,
      dl: 14,
      draw: (c) => {
        c.beginPath();
        c.arc(cx, size * 0.36, size * 0.15, 0, Math.PI * 2);
        c.fill();
      },
    },
    {
      // rayos
      angle: 90,
      dl: 6,
      draw: (c) => {
        for (let i = 0; i < 12; i++) {
          c.save();
          c.translate(cx, size * 0.36);
          c.rotate((i / 12) * Math.PI * 2);
          c.fillRect(size * 0.2, -size * 0.012, size * 0.075, size * 0.024);
          c.restore();
        }
      },
    },
    {
      // montañas
      angle: -50,
      dl: -6,
      draw: (c) => {
        c.beginPath();
        c.moveTo(size * 0.12, size * 0.68);
        c.lineTo(size * 0.38, size * 0.44);
        c.lineTo(size * 0.52, size * 0.58);
        c.lineTo(size * 0.66, size * 0.4);
        c.lineTo(size * 0.88, size * 0.68);
        c.closePath();
        c.fill();
      },
    },
    {
      // texto
      angle: 0,
      dl: 0,
      draw: (c) => {
        c.font = `900 ${size * 0.17}px Arial Black, Arial, sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "alphabetic";
        c.fillText("DTG", cx, size * 0.88);
      },
    },
  ];
}

/** Dibuja el bordado. mode "color" = hilos; "bump" = mapa de relieve. */
export function paintEmbroidery(
  canvas: HTMLCanvasElement,
  thread: string,
  mode: "color" | "bump"
) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d")!;
  const rand = rng(1337);
  ctx.clearRect(0, 0, size, size);
  if (mode === "bump") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
  }

  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = size;
  const t = tmp.getContext("2d")!;

  for (const layer of layers(size)) {
    t.globalCompositeOperation = "source-over";
    t.clearRect(0, 0, size, size);
    t.fillStyle = "#000";
    layer.draw(t);

    // rellenar sólo dentro de la forma
    t.globalCompositeOperation = "source-in";
    t.fillStyle = shade(thread, layer.dl);
    t.fillRect(0, 0, size, size);

    // puntadas satinadas (sólo sobre la forma ya rellena)
    t.globalCompositeOperation = "source-atop";
    t.save();
    t.translate(size / 2, size / 2);
    t.rotate((layer.angle * Math.PI) / 180);
    t.lineCap = "round";
    for (let y = -size; y < size; y += 4.2) {
      const v = (rand() - 0.5) * 22;
      t.strokeStyle =
        mode === "bump" ? `hsl(0 0% ${70 + v}%)` : shade(thread, layer.dl + v * 0.9);
      t.lineWidth = 3.4;
      t.beginPath();
      t.moveTo(-size, y);
      t.lineTo(size, y);
      t.stroke();
      // brillo del hilo
      t.strokeStyle = mode === "bump" ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.16)";
      t.lineWidth = 1;
      t.beginPath();
      t.moveTo(-size, y - 1);
      t.lineTo(size, y - 1);
      t.stroke();
    }
    t.restore();

    ctx.drawImage(tmp, 0, 0);
  }
}
