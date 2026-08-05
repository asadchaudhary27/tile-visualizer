import re

panel_path = 'src/components/AssetLibraryPanel.tsx'

with open(panel_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Categories and their nice names
NAMES = {
    'BED': ["King Size Bed", "Queen Bed", "Single Bed", "Double Bed", "Modern Storage Bed", "Platform Bed", "Tufted Headboard Bed", "Minimalist Bed", "Classic Wood Bed", "Bunk Bed", "Round Bed", "Luxury Canopy Bed"],
    'CHAIR': ["Ergonomic Office Chair", "Accent Armchair", "Dining Chair", "Lounge Chair", "Velvet Tub Chair", "Wooden Rocking Chair", "Modern Gaming Chair", "Minimalist Stool", "Swivel Chair", "Leather Recliner", "Bar Stool"],
    'KITCHEN': ["Kitchen Island", "Modern Cabinet", "Stove Unit", "Double Sink", "Refrigerator", "Range Hood", "Wall Shelf", "Microwave Stand", "Dining Table Set", "Pantry Unit"],
    'ROOM': ["Decorative Rug", "Standing Lamp", "Potted Plant", "Wall Art", "Room Divider", "Bookshelf", "Wall Clock", "Window Blinds", "Ceiling Fan", "Table Lamp"],
    'SOFA': ["L-Shaped Sectional Sofa", "Velvet 3-Seater Sofa", "Leather 2-Seater Sofa", "Minimalist Fabric Sofa", "Sleeper Sofa", "Tufted Chesterfield", "Futon", "Corner Sofa", "Modern Loveseat", "Modular Sofa"],
    'TABLE': ["Wooden Dining Table", "Glass Coffee Table", "Marble Side Table", "Study Desk", "Console Table", "Round Dining Table", "Outdoor Table", "Folding Table", "Nightstand", "Dressing Table", "End Table", "Gaming Desk", "Computer Desk"],
    'VANITY': ["Double Sink Vanity", "Floating Bathroom Vanity", "Classic Oak Vanity", "Modern LED Vanity", "Compact Corner Vanity", "Makeup Vanity", "Glass Top Vanity"]
}

# Keep track of indices for each category
indices = {k: 0 for k in NAMES}

def replacer(match):
    category = match.group(1) # e.g. BED
    number = match.group(2)   # e.g. 13
    
    if category in NAMES:
        idx = indices[category] % len(NAMES[category])
        indices[category] += 1
        new_name = NAMES[category][idx]
        # Return the modified label but keep the id and type exactly the same
        # The regex matched: "label: 'Custom Model XX'" or similar.
        # Wait, the regex will match the whole line so we can replace just the label.
        pass

# We will iterate through the file and replace labels for lines that look like:
# { id: 'glb:BED/1 (13)', label: 'Custom Model 13', type: 'glb:BED/1 (13)', icon: Box }

lines = content.split('\n')
for i in range(len(lines)):
    line = lines[i]
    m = re.search(r"id: 'glb:([A-Z]+)/(?:1 \(\d+\)|[^\']+)'", line)
    if m:
        category = m.group(1)
        if category in NAMES:
            idx = indices[category] % len(NAMES[category])
            indices[category] += 1
            new_name = NAMES[category][idx]
            
            # Replace the label part
            # Currently it looks like: label: 'Custom Model 13'
            line = re.sub(r"label: '[^']+'", f"label: '{new_name}'", line)
            lines[i] = line

# For the "all-imported" category, the ids look like: glb:1 (34)
# They don't have a category in the ID. But we can just name them sequentially as "Modern Furniture X"
all_imported_idx = 1
for i in range(len(lines)):
    line = lines[i]
    if "type: 'glb:1 (" in line:
        line = re.sub(r"label: '[^']+'", f"label: 'Misc Furniture {all_imported_idx}'", line)
        lines[i] = line
        all_imported_idx += 1

content = '\n'.join(lines)

with open(panel_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Renamed all models beautifully!")
