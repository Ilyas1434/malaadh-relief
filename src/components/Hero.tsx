import { loadBrand } from "./BrandMark";
import { HeroClient } from "./HeroClient";

export function Hero() {
  const brand = loadBrand();
  return <HeroClient layers={brand.layers} svgs={brand.svgs} />;
}
