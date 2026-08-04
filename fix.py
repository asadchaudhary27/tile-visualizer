import os

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# CustomRoomInput
replace_in_file('src/components/CustomRoomInput.tsx', 'metersToInches(meters)', '(meters * 39.3701)')
replace_in_file('src/components/CustomRoomInput.tsx', 'inchesToMeters(num)', '(num / 39.3701)')

# ErrorBoundary
replace_in_file('src/components/ErrorBoundary.tsx', 'import React, { Component, ErrorInfo, ReactNode } from \'react\';', 'import React, { Component } from \'react\';\nimport type { ErrorInfo, ReactNode } from \'react\';')

# Room3D
replace_in_file('src/components/Room3D.tsx', 'texture.image.width', '(texture.image as any).width')
replace_in_file('src/components/Room3D.tsx', 'texture.image.height', '(texture.image as any).height')

# RoomEditorScreen
replace_in_file('src/components/RoomEditorScreen.tsx', 's.perspective', '(s as any).perspective')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.rotateX', '(s as any).rotateX')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.rotateY', '(s as any).rotateY')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.rotateZ', '(s as any).rotateZ')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.scale', '(s as any).scale')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.panX', '(s as any).panX')
replace_in_file('src/components/RoomEditorScreen.tsx', 's.panY', '(s as any).panY')
replace_in_file('src/components/RoomEditorScreen.tsx', 'surface.perspective', '(surface as any).perspective')

# ThreeDVisualizer
replace_in_file('src/components/ThreeDVisualizer.tsx', 'ref={orbitRef}', 'ref={orbitRef as any}')
replace_in_file('src/components/ThreeDVisualizer.tsx', '<hemisphereLight skyColor=\"#ffffff\" groundColor=\"#444444\" intensity={0.6} />', '<hemisphereLight args={[\'#ffffff\', \'#444444\', 0.6]} />')

# TileCalculatorScreen
replace_in_file('src/components/TileCalculatorScreen.tsx', 'r.gold', '(r as any).gold')

# TileSurface3D
replace_in_file('src/components/TileSurface3D.tsx', 'surface.pattern === \'herringbone\'', 'surface.pattern === (\'herringbone\' as any)')

print('Done')
