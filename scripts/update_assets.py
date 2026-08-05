import os
import re

def update_asset_library():
    path = "src/components/AssetLibraryPanel.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Generate the list of new models
    models_dir = "public/models"
    glb_files = [f for f in os.listdir(models_dir) if f.endswith(".glb")]
    
    asset_entries = []
    for f in sorted(glb_files):
        # f is like '1 (1).glb' or 'Modern_vanity_Design.glb'
        base_name = f.replace(".glb", "")
        asset_id = "glb:" + base_name
        label = base_name.replace("_", " ").title()
        asset_entries.append(f"          {{ id: '{asset_id}', label: '{label}', type: '{asset_id}', icon: Box }},")

    assets_str = "\n".join(asset_entries)

    new_category = f"""
      {{
        id: 'imported-models',
        label: 'Imported 3D Models',
        icon: Box,
        color: 'text-purple-400',
        subcategories: [
          {{
            id: 'all-imported',
            label: 'All Models',
            assets: [
{assets_str}
            ]
          }}
        ]
      }},
"""
    # Insert new category before the last bracket of ASSET_CATEGORIES
    if "id: 'imported-models'" not in content:
        content = re.sub(
            r"(const ASSET_CATEGORIES = \[)",
            r"\1\n" + new_category,
            content
        )
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated AssetLibraryPanel.tsx")

def update_real_fixture():
    path = "src/components/RealFixture.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add GenericGLBModel if it doesn't exist
    if "GenericGLBModel" not in content:
        generic_component = """
function GenericGLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => { m.side = THREE.DoubleSide; m.needsUpdate = true; });
          } else {
            (mesh.material as THREE.Material).side = THREE.DoubleSide;
            (mesh.material as THREE.Material).needsUpdate = true;
          }
        }
      }
    });
    return clone;
  }, [scene]);
  
  // Try to center the geometry so it doesn't spawn off-center
  useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    clonedScene.position.x = -center.x;
    clonedScene.position.z = -center.z;
    clonedScene.position.y = -box.min.y; // base on floor
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
}
"""
        content = content.replace("export default function RealFixture(", generic_component + "\nexport default function RealFixture(")

    # Add router for glb:
    if "assetType.startsWith('glb:')" not in content:
        router_logic = """
  if (assetType.startsWith('glb:')) {
    const url = `/models/${assetType.replace('glb:', '')}.glb`;
    return (
      <group position={[0, 0, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <GenericGLBModel url={url} />
      </group>
    );
  }
"""
        content = content.replace("if (assetType === 'ModernVanity') {", router_logic + "\n  if (assetType === 'ModernVanity') {")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated RealFixture.tsx")


if __name__ == "__main__":
    update_asset_library()
    update_real_fixture()
