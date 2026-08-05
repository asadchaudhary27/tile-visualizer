import os

path = "src/utils/autoLayout.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Restore clampPositionToRoom to its exact former signature just in case
new_clamp = """export function clampPositionToRoom(
  position: [number, number, number], 
  dimensions: RoomDimensions, 
  objectSize: [number, number, number] = [0, 0, 0]
): [number, number, number] {
  const minX = -dimensions.width / 2 + objectSize[0] / 2;
  const maxX = dimensions.width / 2 - objectSize[0] / 2;
  const minZ = -dimensions.length / 2 + objectSize[2] / 2;
  const maxZ = dimensions.length / 2 - objectSize[2] / 2;

  const effMinX = Math.min(minX, maxX);
  const effMaxX = Math.max(minX, maxX);
  const effMinZ = Math.min(minZ, maxZ);
  const effMaxZ = Math.max(minZ, maxZ);

  const clampedX = Math.max(effMinX, Math.min(effMaxX, position[0]));
  const clampedZ = Math.max(effMinZ, Math.min(effMaxZ, position[2]));

  return [clampedX, position[1], clampedZ];
}"""

content = content.replace("export function clampPositionToRoom(", "/* replaced clamp */ function oldClamp(")
content += "\n\n" + new_clamp

new_snap = """

export function calculateWallSnap(
  position: [number, number, number], 
  dimensions: RoomDimensions,
  objectSize: [number, number, number] = [0, 0, 0]
): { position: [number, number, number], rotation: [number, number, number] } {
  const minX = -dimensions.width / 2 + objectSize[0] / 2;
  const maxX = dimensions.width / 2 - objectSize[0] / 2;
  const minZ = -dimensions.length / 2 + objectSize[2] / 2;
  const maxZ = dimensions.length / 2 - objectSize[2] / 2;

  const distToLeft = Math.abs(position[0] - minX);
  const distToRight = Math.abs(position[0] - maxX);
  const distToFront = Math.abs(position[2] - maxZ);
  const distToBack = Math.abs(position[2] - minZ);

  const minDist = Math.min(distToLeft, distToRight, distToFront, distToBack);

  let newPos: [number, number, number] = [...position];
  let newRot: [number, number, number] = [0, 0, 0];

  if (minDist === distToLeft) {
    newPos[0] = minX;
    newRot = [0, Math.PI / 2, 0];
  } else if (minDist === distToRight) {
    newPos[0] = maxX;
    newRot = [0, -Math.PI / 2, 0];
  } else if (minDist === distToFront) {
    newPos[2] = maxZ;
    newRot = [0, Math.PI, 0];
  } else {
    newPos[2] = minZ;
    newRot = [0, 0, 0];
  }

  if (minDist === distToLeft || minDist === distToRight) {
    newPos[2] = Math.max(minZ, Math.min(maxZ, newPos[2]));
  } else {
    newPos[0] = Math.max(minX, Math.min(maxX, newPos[0]));
  }

  return { position: newPos, rotation: newRot };
}
"""

content += new_snap

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Restored calculateWallSnap in autoLayout.ts")
