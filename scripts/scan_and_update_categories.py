import os
import re

models_dir = 'public/models'
panel_path = 'src/components/AssetLibraryPanel.tsx'

# Collect files and folders
root_files = [f for f in os.listdir(models_dir) if os.path.isfile(os.path.join(models_dir, f)) and f.endswith('.glb')]
folders = [d for d in os.listdir(models_dir) if os.path.isdir(os.path.join(models_dir, d))]

subcategories_code = []

# Process root files (All Models)
if root_files:
    assets_code = []
    for f in sorted(root_files):
        name = f.replace('.glb', '')
        # nice label
        label = name.replace('1 (', 'Custom Model ').replace(')', '')
        assets_code.append(f"          {{ id: 'glb:{name}', label: '{label}', type: 'glb:{name}', icon: Box }},")
    
    subcategories_code.append(f"""          {{
            id: 'all-imported',
            label: 'All Models',
            assets: [
{chr(10).join(assets_code)}
            ]
          }}""")

# Process folder files
for folder in sorted(folders):
    folder_path = os.path.join(models_dir, folder)
    files = [f for f in os.listdir(folder_path) if f.endswith('.glb')]
    if not files: continue
    
    assets_code = []
    for f in sorted(files):
        name = f.replace('.glb', '')
        asset_id = f"{folder}/{name}"
        label = name.replace('1 (', 'Custom Model ').replace(')', '')
        assets_code.append(f"          {{ id: 'glb:{asset_id}', label: '{label}', type: 'glb:{asset_id}', icon: Box }},")
        
    subcategories_code.append(f"""          {{
            id: '{folder.lower()}',
            label: '{folder}',
            assets: [
{chr(10).join(assets_code)}
            ]
          }}""")

new_imported_models_block = f"""      {{
        id: 'imported-models',
        label: 'Imported 3D Models',
        icon: Box,
        color: 'text-purple-400',
        subcategories: [
{(',' + chr(10)).join(subcategories_code)}
        ]
      }}"""

with open(panel_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the existing imported-models block
content = re.sub(r"      \{\s*id: 'imported-models'[\s\S]*?\}\s*\]\s*\},", new_imported_models_block + ",", content)

with open(panel_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated AssetLibraryPanel.tsx with categorized folders!")
