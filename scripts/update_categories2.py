import re

def update_categories():
    path = "src/components/AssetLibraryPanel.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract the imported models block to preserve it
    imported_models_match = re.search(r"(\{[\s\S]*?id: 'imported-models'[\s\S]*?\}\s*\n\s*      \})", content)
    imported_models_block = imported_models_match.group(1) if imported_models_match else ""

    # Generate the new ASSET_CATEGORIES array
    new_categories = f"""const ASSET_CATEGORIES = [
{imported_models_block},
  {{
    id: 'bedroom',
    label: 'Bedroom',
    icon: Bed,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    subcategories: [
      {{
        id: 'beds', label: 'Beds', assets: [
          {{ id: 'bed-queen', label: 'Queen Bed', type: 'BedQueen', icon: Bed }},
          {{ id: 'bed-king', label: 'King Bed', type: 'KingBed', icon: Bed }},
          {{ id: 'bed-single', label: 'Single Bed', type: 'SingleBed', icon: Bed }},
          {{ id: 'bed-bunk', label: 'Bunk Bed', type: 'BunkBed', icon: Bed }},
          {{ id: 'detailed-bed', label: 'Detailed Bed', type: 'DetailedBed', icon: Bed }},
        ]
      }},
      {{
        id: 'bedroom-storage', label: 'Storage & Tables', assets: [
          {{ id: 'wardrobe', label: 'Wardrobe', type: 'Wardrobe', icon: Box }},
          {{ id: 'nightstand', label: 'Nightstand', type: 'Nightstand', icon: Box }},
          {{ id: 'dressing-table', label: 'Dressing Table', type: 'DressingTable', icon: Box }},
          {{ id: 'modern-bench', label: 'Modern Bench', type: 'ModernBench', icon: Box }},
          {{ id: 'dressing-stool', label: 'Stool', type: 'DressingStool', icon: Box }},
        ]
      }}
    ]
  }},
  {{
    id: 'living',
    label: 'Living Room',
    icon: Sofa,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    subcategories: [
      {{
        id: 'seating', label: 'Seating', assets: [
          {{ id: 'luxury-sofa', label: 'Luxury Sofa', type: 'LuxurySofa', icon: Sofa }},
          {{ id: 'sofa', label: 'Basic Sofa', type: 'Sofa', icon: Sofa }},
          {{ id: 'armchair', label: 'Armchair', type: 'Armchair', icon: Armchair }},
        ]
      }},
      {{
        id: 'living-tables', label: 'Tables & Storage', assets: [
          {{ id: 'coffee-table', label: 'Coffee Table', type: 'CoffeeTable', icon: Box }},
          {{ id: 'tv-wall', label: 'TV Wall Setup', type: 'TVWall', icon: Monitor }},
          {{ id: 'tv-stand', label: 'TV Stand', type: 'TVStand', icon: Monitor }},
        ]
      }}
    ]
  }},
  {{
    id: 'kitchen',
    label: 'Kitchen & Dining',
    icon: ChefHat,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    subcategories: [
      {{
        id: 'appliances', label: 'Stove/Oven & Range Hood', assets: [
          {{ id: 'stove', label: 'Stove / Oven', type: 'Stove', icon: Box }},
          {{ id: 'range-hood', label: 'Range Hood', type: 'RangeHood', icon: Box }},
          {{ id: 'detailed-oven', label: 'Built-in Oven', type: 'DetailedOven', icon: Box }},
        ]
      }},
      {{
        id: 'cabinets', label: 'Cabinets & Surfaces', assets: [
          {{ id: 'kitchen-island', label: 'Kitchen Island', type: 'KitchenIsland', icon: ChefHat }},
          {{ id: 'kitchen-cabinets', label: 'Cabinets & Counters', type: 'KitchenCabinets', icon: Box }},
          {{ id: 'detailed-island', label: 'Detailed Island', type: 'DetailedIsland', icon: ChefHat }},
          {{ id: 'detailed-lower', label: 'Detailed Lower Cab', type: 'DetailedLowerCab', icon: Box }},
          {{ id: 'detailed-upper', label: 'Detailed Upper Cab', type: 'DetailedUpperCab', icon: Box }},
          {{ id: 'detailed-sink', label: 'Detailed Sink', type: 'DetailedSink', icon: Box }},
        ]
      }},
      {{
        id: 'dining', label: 'Dining', assets: [
          {{ id: 'dining-table', label: 'Dining Table', type: 'DiningTable', icon: Box }},
          {{ id: 'dining-chair', label: 'Dining Chair', type: 'DiningChair', icon: Box }},
          {{ id: 'bar-stool', label: 'Bar Stool', type: 'BarStool', icon: Box }},
        ]
      }}
    ]
  }},
  {{
    id: 'bathroom',
    label: 'Bathroom',
    icon: Bath,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    subcategories: [
      {{
        id: 'fixtures', label: 'Bidet Spray & Fixtures', assets: [
          {{ id: 'bidet', label: 'Bidet Sprayer', type: 'BidetSprayer', icon: Droplets }},
          {{ id: 'toilet', label: 'Toilet', type: 'Toilet', icon: Toilet }},
          {{ id: 'detailed-toilet', label: 'Egg Toilet', type: 'DetailedToilet', icon: Toilet }},
          {{ id: 'bathtub', label: 'Freestanding Bathtub', type: 'Bathtub', icon: Bath }},
          {{ id: 'detailed-bathtub', label: 'Bowl Bathtub', type: 'DetailedBathtub', icon: Bath }},
          {{ id: 'shower', label: 'Glass Shower', type: 'Shower', icon: Droplets }},
        ]
      }},
      {{
        id: 'vanities', label: 'Vanities', assets: [
          {{ id: 'double-vanity', label: 'Double Vanity', type: 'DoubleVanity', icon: Bath }},
          {{ id: 'detailed-vanity', label: 'Floating Vanity', type: 'DetailedVanity', icon: Bath }},
          {{ id: 'vanity', label: 'Single Vanity', type: 'Vanity', icon: Bath }},
        ]
      }},
      {{
        id: 'accessories', label: 'Accessories', assets: [
          {{ id: 'towel-rail', label: 'Towel Rail', type: 'TowelRail', icon: Box }},
          {{ id: 'detailed-towel', label: 'Sleek Towel Rack', type: 'DetailedTowelRack', icon: Box }},
        ]
      }}
    ]
  }}
];"""

    # Replace the old array using regex
    content = re.sub(r"const ASSET_CATEGORIES = \[[\s\S]*?\];\n\ninterface Props", new_categories + "\n\ninterface Props", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("Done updating categories.")

if __name__ == "__main__":
    update_categories()
