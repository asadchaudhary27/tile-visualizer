import json
import re

panel_path = 'src/components/AssetLibraryPanel.tsx'

with open(panel_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract all the assets from the imported-models block
imported_block_match = re.search(r"\{\s*id:\s*'imported-models'[\s\S]*?(?=\{\s*id:\s*'bedroom')", content)
if not imported_block_match:
    print("Could not find imported models block")
    exit(1)

imported_block = imported_block_match.group(0)

# Extract assets by parsing the regex
# asset looks like: { id: 'glb:BED/1 (13)', label: 'Single Bed', type: 'glb:BED/1 (13)', icon: Box }
assets = re.findall(r"\{\s*id:\s*'glb:([^']*)',\s*label:\s*'([^']*)',\s*type:\s*'([^']*)',\s*icon:\s*Box\s*\}", imported_block)

beds = []
chairs = []
kitchens = []
rooms = []
sofas = []
tables = []
vanities = []
all_other = []

for asset_id, label, asset_type in assets:
    obj = f"{{ id: 'glb:{asset_id}', label: '{label}', type: 'glb:{asset_type}', icon: Box }}"
    if asset_id.startswith('BED/'): beds.append(obj)
    elif asset_id.startswith('CHAIR/'): chairs.append(obj)
    elif asset_id.startswith('KITCHEN/'): kitchens.append(obj)
    elif asset_id.startswith('ROOM/'): rooms.append(obj)
    elif asset_id.startswith('SOFA/'): sofas.append(obj)
    elif asset_id.startswith('TABLE/'): 
        # EXCEPT SIDE TABLE
        if "Side Table" not in label:
            tables.append(obj)
    elif asset_id.startswith('VANITY/'):
        # EXCEPT MODERN VANITY DESIGN
        if "Modern_vanity_Design" not in asset_id:
            vanities.append(obj)
    else:
        all_other.append(obj)

# 2. Delete the imported models block
content = content.replace(imported_block, "")

# 3. Inject them into the appropriate existing categories.
# Bedroom -> Beds
content = re.sub(r"(id:\s*'beds',\s*label:\s*'Beds',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(beds) + ",", content)

# Bedroom -> Storage & Tables
content = re.sub(r"(id:\s*'bedroom-storage',\s*label:\s*'Storage & Tables',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(tables) + ",", content)

# Living Room -> Seating
content = re.sub(r"(id:\s*'seating',\s*label:\s*'Seating',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(sofas + chairs) + ",", content)

# Living Room -> Tables & Storage
content = re.sub(r"(id:\s*'living-tables',\s*label:\s*'Tables & Storage',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(tables) + ",", content)

# Kitchen -> Appliances
content = re.sub(r"(id:\s*'appliances',\s*label:\s*'Stove/Oven & Range Hood',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(kitchens) + ",", content)

# Bathroom -> Vanities
content = re.sub(r"(id:\s*'vanities',\s*label:\s*'Vanities',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(vanities) + ",", content)

# Bathroom -> Accessories
content = re.sub(r"(id:\s*'accessories',\s*label:\s*'Accessories',\s*assets:\s*\[)", r"\1\n          " + ",\n          ".join(rooms + all_other) + ",", content)


with open(panel_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully moved models into native categories!")
