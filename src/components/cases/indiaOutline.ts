/**
 * A deliberately simplified India silhouette for the "Geographic Focus"
 * panel — a stylised outline (not a survey-accurate map) built from a
 * coarse boundary polygon in real (lng, lat) space, projected into a 0-1
 * panel box. Good enough to read as "India" at small size without pulling
 * in a geo/topojson dependency for one decorative panel.
 */

const LNG_RANGE: [number, number] = [68, 98];
const LAT_RANGE: [number, number] = [7, 36];

/** Coarse clockwise boundary, (lng, lat) pairs from the Kashmir tip down
 *  the west coast, around the southern point, up the east coast, and back
 *  across the northern border. */
const BOUNDARY_LNG_LAT: [number, number][] = [
  [74, 35], [77, 33], [75, 29], [70, 28], [68.5, 24], [70, 22.5],
  [72.8, 19], [73.5, 16], [74.5, 13], [76, 10], [77.3, 8], [79.5, 10],
  [80.2, 13], [80.3, 16], [85, 19.5], [87, 21.5], [89, 22], [92, 24],
  [97, 28.5], [94, 27], [88, 27], [83, 29], [80, 30], [77, 31], [75, 33],
];

export interface Point {
  x: number;
  y: number;
}

/** Projects a real (lat, lng) into the panel's 0-1 coordinate space
 *  (x: 0=west, y: 0=north). */
export function projectIndia(lat: number, lng: number): Point {
  const x = (lng - LNG_RANGE[0]) / (LNG_RANGE[1] - LNG_RANGE[0]);
  const y = 1 - (lat - LAT_RANGE[0]) / (LAT_RANGE[1] - LAT_RANGE[0]);
  return { x, y };
}

export const INDIA_OUTLINE: Point[] = BOUNDARY_LNG_LAT.map(([lng, lat]) => projectIndia(lat, lng));

export function indiaOutlinePath(width: number, height: number): string {
  return INDIA_OUTLINE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x * width).toFixed(1)} ${(p.y * height).toFixed(1)}`).join(' ') + ' Z';
}

function pointInPolygon(x: number, y: number, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Generates a dot-matrix fill for the silhouette: an evenly spaced grid
 *  of points, kept only where they fall inside the boundary polygon. */
export function indiaDotGrid(cols: number, rows: number): Point[] {
  const dots: Point[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) / cols;
      const y = (r + 0.5) / rows;
      if (pointInPolygon(x, y, INDIA_OUTLINE)) dots.push({ x, y });
    }
  }
  return dots;
}
