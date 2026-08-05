import re

with open("scripts/update_assets.py", "r", encoding="utf-8") as f:
    content = f.read()

# Fix icon missing bug in imported-models category
content = content.replace("label: 'Imported 3D Models',", "label: 'Imported 3D Models',\n        icon: Box,")

# Improve label generation logic: '1 (1)' -> 'Custom Model 1'
content = content.replace("label = name", "label = name.replace('1 (', 'Model ').replace(')', '')")
content = content.replace("type: f'glb:{name}'", "type: f'glb:{name}'")

with open("scripts/update_assets.py", "w", encoding="utf-8") as f:
    f.write(content)
