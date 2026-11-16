import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/content";

export const alt = "Malaadh Relief. Refuge, delivered by hand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card: the calligraphy mark beside the name, in the site's sand and espresso.
export default async function Image() {
  const svg = (await readFile(join(process.cwd(), "public/brand/calligraphy.svg"), "utf8")).replace(/currentColor/g, "#2b1d14");
  const mark = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#efdcc4", color: "#2b1d14", padding: "0 90px" }}>
        <img src={mark} alt="" width={330} height={361} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 80 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6, color: "#b98a5e" }}>SUDAN AID · STUDENT-RUN</div>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, marginTop: 18, letterSpacing: -2 }}>MALAADH</div>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>RELIEF</div>
          <div style={{ fontSize: 38, marginTop: 28, color: "#5a3e2b" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
