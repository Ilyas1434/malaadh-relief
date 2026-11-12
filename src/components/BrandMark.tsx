import fs from "node:fs";
import path from "node:path";

export type LayerBox = { x: number; y: number; w: number; h: number };
export type BrandLayers = {
  original: { w: number; h: number };
  layers: { calligraphy: LayerBox; "hand-left": LayerBox; "hand-right": LayerBox };
};

const dir = path.join(process.cwd(), "public", "brand");
const read = (f: string) => fs.readFileSync(path.join(dir, f), "utf8").trim();

export function loadBrand() {
  return {
    layers: JSON.parse(read("layers.json")) as BrandLayers,
    svgs: {
      calligraphy: read("calligraphy.svg"),
      handLeft: read("hand-left.svg"),
      handRight: read("hand-right.svg"),
    },
  };
}

/** Small inline calligraphy mark for nav/footer. Server-only. */
export function CalligraphyMark({ className = "" }: { className?: string }) {
  const svg = read("calligraphy.svg").replace("<svg", `<svg class="h-full w-auto" aria-hidden="true"`);
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
