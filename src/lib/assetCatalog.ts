import { Bed, Bath, ChefHat, Sofa, Box, Armchair } from 'lucide-react';

export const ASSET_CATEGORIES = [
  {
    id: 'bedroom',
    label: 'Bedroom',
    icon: Bed,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    subcategories: [
      {
        id: 'beds', 
        label: 'Beds', 
        assets: [
          { id: 'glb:BED/1 (13)', label: 'King Size Bed', type: 'glb:BED/1 (13)', icon: Box },
          { id: 'glb:BED/1 (14)', label: 'Queen Bed', type: 'glb:BED/1 (14)', icon: Box },
          { id: 'glb:BED/1 (17)', label: 'Single Bed', type: 'glb:BED/1 (17)', icon: Box },
          { id: 'glb:BED/1 (18)', label: 'Double Bed', type: 'glb:BED/1 (18)', icon: Box },
          { id: 'glb:BED/1 (42)', label: 'Modern Storage Bed', type: 'glb:BED/1 (42)', icon: Box },
          { id: 'glb:BED/1 (43)', label: 'Platform Bed', type: 'glb:BED/1 (43)', icon: Box },
          { id: 'glb:BED/1 (5)', label: 'Tufted Headboard Bed', type: 'glb:BED/1 (5)', icon: Box },
          { id: 'glb:BED/1 (55)', label: 'Minimalist Bed', type: 'glb:BED/1 (55)', icon: Box },
          { id: 'glb:BED/1 (58)', label: 'Classic Wood Bed', type: 'glb:BED/1 (58)', icon: Box },
          { id: 'glb:BED/1 (62)', label: 'Bunk Bed', type: 'glb:BED/1 (62)', icon: Box },
          { id: 'glb:BED/1 (8)', label: 'Round Bed', type: 'glb:BED/1 (8)', icon: Box },
          { id: 'glb:BED/1 (9)', label: 'Luxury Canopy Bed', type: 'glb:BED/1 (9)', icon: Box },

        ]
      },
      {
        id: 'storage-tables', 
        label: 'Storage & Tables', 
        assets: [
          { id: 'glb:TABLE/1 (25)', label: 'Study Desk', type: 'glb:TABLE/1 (25)', icon: Box },
          { id: 'glb:TABLE/1 (49)', label: 'Nightstand', type: 'glb:TABLE/1 (49)', icon: Box },
          { id: 'glb:TABLE/1 (52)', label: 'Dressing Table', type: 'glb:TABLE/1 (52)', icon: Box },
          { id: 'glb:TABLE/1 (56)', label: 'End Table', type: 'glb:TABLE/1 (56)', icon: Box },

        ]
      }
    ]
  },
  {
    id: 'living',
    label: 'Living Room',
    icon: Sofa,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    subcategories: [
      {
        id: 'seating', 
        label: 'Seating', 
        assets: [
          { id: 'glb:SOFA/1 (23)', label: 'L-Shaped Sectional Sofa', type: 'glb:SOFA/1 (23)', icon: Box },
          { id: 'glb:SOFA/1 (26)', label: 'Velvet 3-Seater Sofa', type: 'glb:SOFA/1 (26)', icon: Box },
          { id: 'glb:SOFA/1 (27)', label: 'Leather 2-Seater Sofa', type: 'glb:SOFA/1 (27)', icon: Box },
          { id: 'glb:SOFA/1 (3)', label: 'Minimalist Fabric Sofa', type: 'glb:SOFA/1 (3)', icon: Box },
          { id: 'glb:SOFA/1 (31)', label: 'Sleeper Sofa', type: 'glb:SOFA/1 (31)', icon: Box },
          { id: 'glb:SOFA/1 (38)', label: 'Tufted Chesterfield', type: 'glb:SOFA/1 (38)', icon: Box },
          { id: 'glb:SOFA/1 (46)', label: 'Futon', type: 'glb:SOFA/1 (46)', icon: Box },
          { id: 'glb:SOFA/1 (51)', label: 'Corner Sofa', type: 'glb:SOFA/1 (51)', icon: Box },
          { id: 'glb:SOFA/1 (63)', label: 'Modern Loveseat', type: 'glb:SOFA/1 (63)', icon: Box },
          { id: 'glb:SOFA/1 (68)', label: 'Modular Sofa', type: 'glb:SOFA/1 (68)', icon: Box },
          { id: 'glb:SOFA/1 (69)', label: 'L-Shaped Sectional Sofa', type: 'glb:SOFA/1 (69)', icon: Box },
          { id: 'glb:SOFA/Full set', label: 'Full Sofa Set', type: 'glb:SOFA/Full set', icon: Box },
          { id: 'glb:SOFA/Single sofa', label: 'Single Seater', type: 'glb:SOFA/Single sofa', icon: Box },
          { id: 'glb:CHAIR/1 (12)', label: 'Ergonomic Office Chair', type: 'glb:CHAIR/1 (12)', icon: Box },
          { id: 'glb:CHAIR/1 (21)', label: 'Accent Armchair', type: 'glb:CHAIR/1 (21)', icon: Box },
          { id: 'glb:CHAIR/1 (48)', label: 'Lounge Chair', type: 'glb:CHAIR/1 (48)', icon: Box },
          { id: 'glb:CHAIR/1 (53)', label: 'Velvet Tub Chair', type: 'glb:CHAIR/1 (53)', icon: Box },
          { id: 'glb:CHAIR/1 (57)', label: 'Wooden Rocking Chair', type: 'glb:CHAIR/1 (57)', icon: Box },
          { id: 'glb:CHAIR/1 (60)', label: 'Modern Gaming Chair', type: 'glb:CHAIR/1 (60)', icon: Box },
          { id: 'glb:CHAIR/1 (7)', label: 'Minimalist Stool', type: 'glb:CHAIR/1 (7)', icon: Box },

        ]
      },
      {
        id: 'living-tables', 
        label: 'Tables & Storage', 
        assets: [
          // Excluded "Side Table" as requested
          { id: 'glb:TABLE/1 (20)', label: 'Glass Coffee Table', type: 'glb:TABLE/1 (20)', icon: Box },
          { id: 'glb:TABLE/1 (29)', label: 'Console Table', type: 'glb:TABLE/1 (29)', icon: Box },

        ]
      }
    ]
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    icon: ChefHat,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    subcategories: [
      {
        id: 'stove-oven',
        label: 'Stove & Oven',
        assets: [
          { id: 'stove', label: 'Electric Stove', type: 'Stove', icon: Box },
          { id: 'detailed-oven', label: 'Detailed Oven', type: 'DetailedOven', icon: Box },
        ]
      },
      {
        id: 'range-hood',
        label: 'Range Hood',
        assets: [
          { id: 'range-hood', label: 'Range Hood', type: 'RangeHood', icon: Box },
        ]
      },
      {
        id: 'cabinets-surfaces',
        label: 'Cabinets & Surfaces',
        assets: [
          { id: 'glb:KITCHEN/1 (11)', label: 'Modern Kitchen Island', type: 'glb:KITCHEN/1 (11)', icon: Box },
          { id: 'glb:KITCHEN/1 (15)', label: 'L-Shaped Counter', type: 'glb:KITCHEN/1 (15)', icon: Box },
          { id: 'glb:KITCHEN/1 (16)', label: 'U-Shaped Counter', type: 'glb:KITCHEN/1 (16)', icon: Box },
          { id: 'glb:KITCHEN/1 (22)', label: 'Marble Countertop', type: 'glb:KITCHEN/1 (22)', icon: Box },
          { id: 'glb:KITCHEN/1 (33)', label: 'Wooden Kitchen Cabinets', type: 'glb:KITCHEN/1 (33)', icon: Box },
          { id: 'glb:KITCHEN/1 (41)', label: 'Glossy White Cabinets', type: 'glb:KITCHEN/1 (41)', icon: Box },
          { id: 'glb:KITCHEN/1 (45)', label: 'Matte Black Cabinets', type: 'glb:KITCHEN/1 (45)', icon: Box },
          { id: 'glb:KITCHEN/1 (50)', label: 'Farmhouse Sink Cabinet', type: 'glb:KITCHEN/1 (50)', icon: Box },
          { id: 'glb:KITCHEN/1 (54)', label: 'Pantry Cabinet', type: 'glb:KITCHEN/1 (54)', icon: Box },
          { id: 'glb:KITCHEN/1 (66)', label: 'Glass Door Cabinets', type: 'glb:KITCHEN/1 (66)', icon: Box },

          { id: 'detailed-upper-cab', label: 'Detailed Upper Cab', type: 'DetailedUpperCab', icon: Box },
          { id: 'fridge', label: 'Fridge', type: 'Fridge', icon: Box },
          { id: 'detailed-fridge', label: 'Detailed Fridge', type: 'DetailedFridge', icon: Box },
        ]
      },
      {
        id: 'dining',
        label: 'Dining',
        assets: [
          { id: 'glb:TABLE/1 (10)', label: 'Wooden Dining Table', type: 'glb:TABLE/1 (10)', icon: Box },
          { id: 'glb:TABLE/1 (32)', label: 'Round Dining Table', type: 'glb:TABLE/1 (32)', icon: Box },
          { id: 'glb:TABLE/1 (67)', label: 'Large Dining Table', type: 'glb:TABLE/1 (67)', icon: Box },
          { id: 'glb:CHAIR/1 (30)', label: 'Dining Chair', type: 'glb:CHAIR/1 (30)', icon: Box },

        ]
      }
    ]
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    icon: Bath,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    subcategories: [
      {
        id: 'bidet',
        label: 'Bidet Spray',
        assets: [
          { id: 'glb:VANITY/1 (28)', label: 'Bidet System', type: 'glb:VANITY/1 (28)', icon: Box },
          { id: 'bidet-sprayer', label: 'Bidet Sprayer', type: 'BidetSprayer', icon: Box },
        ]
      },
      {
        id: 'vanities',
        label: 'Vanities',
        assets: [
          // EXCLUDED "Modern_vanity_Design" as requested
          { id: 'glb:VANITY/1 (35)', label: 'Classic Vanity', type: 'glb:VANITY/1 (35)', icon: Box },
          { id: 'glb:VANITY/1 (37)', label: 'Floating Vanity', type: 'glb:VANITY/1 (37)', icon: Box },
          { id: 'glb:VANITY/1 (70)', label: 'Double Sink Vanity', type: 'glb:VANITY/1 (70)', icon: Box },
          { id: 'vanity', label: 'Basic Vanity', type: 'Vanity', icon: Box },
          { id: 'double-vanity', label: 'Double Vanity', type: 'DoubleVanity', icon: Box },
          { id: 'detailed-vanity', label: 'Detailed Vanity', type: 'DetailedVanity', icon: Box },
        ]
      },
      {
        id: 'accessories',
        label: 'Accessories',
        assets: [
          { id: 'toilet', label: 'Basic Toilet', type: 'Toilet', icon: Box },
          { id: 'detailed-toilet', label: 'Detailed Toilet', type: 'DetailedToilet', icon: Box },
          { id: 'shower', label: 'Shower Cabin', type: 'Shower', icon: Box },
          { id: 'bathtub', label: 'Basic Bathtub', type: 'Bathtub', icon: Box },
          { id: 'detailed-bathtub', label: 'Detailed Bathtub', type: 'DetailedBathtub', icon: Box },

        ]
      }
    ]
  }
];
