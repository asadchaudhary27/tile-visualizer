import os

path = "src/components/ThreeDVisualizer.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
if "Html, useProgress" not in content:
    content = content.replace(
        "import { OrbitControls, Environment, Lightformer } from '@react-three/drei';",
        "import { OrbitControls, Environment, Lightformer, Html, useProgress } from '@react-three/drei';"
    )

# 2. Add ModelLoader component
loader_code = """
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center p-6 bg-[#0F172A]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl min-w-[200px]">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4" />
        <div className="text-white font-bold tracking-wider text-sm mb-1">LOADING ASSETS</div>
        <div className="text-teal-400 font-mono text-lg font-bold">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}
"""
if "function ModelLoader" not in content:
    content = content.replace("function CameraController", loader_code + "\nfunction CameraController")

# 3. Update Suspense fallback
content = content.replace("<Suspense fallback={null}>", "<Suspense fallback={<ModelLoader />}>")

# 4. Add near/far and update Canvas FOV just in case (already did FOV but to be safe)
content = content.replace("<Canvas shadows camera={{ position: [-8, 8, 15], fov: 50 }}>", "<Canvas shadows camera={{ position: [-8, 8, 15], fov: 50, near: 0.1, far: 1000 }}>")

# 5. Add Environment preset="city"
env_code = """          {/* Base ambient lighting */}
          <Environment preset="city" />"""
content = content.replace("{/* Base ambient lighting */}", env_code)


with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ThreeDVisualizer.tsx")
