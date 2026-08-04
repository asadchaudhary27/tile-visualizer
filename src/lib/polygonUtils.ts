export function convertPercentageToPixels(
  percentageCoords: [number, number][],
  imageWidth: number,
  imageHeight: number
): number[] {
  // react-konva Line expects a flat array: [x1, y1, x2, y2, ...]
  const flatPoints: number[] = [];
  for (const [pctX, pctY] of percentageCoords) {
    flatPoints.push((pctX / 100) * imageWidth);
    flatPoints.push((pctY / 100) * imageHeight);
  }
  return flatPoints;
}

export function getCentroid(flatPoints: number[]): { x: number, y: number } {
  let cx = 0;
  let cy = 0;
  const numPoints = flatPoints.length / 2;
  
  for (let i = 0; i < flatPoints.length; i += 2) {
    cx += flatPoints[i];
    cy += flatPoints[i + 1];
  }
  
  return {
    x: cx / numPoints,
    y: cy / numPoints
  };
}
