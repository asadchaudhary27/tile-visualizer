import { useState, useMemo, useEffect } from 'react';
import { BedDouble, Sofa, Utensils, Bath, LayoutTemplate, Plus, Trash2, Calculator, ArrowRight, Info } from 'lucide-react';
import { useDesignStore } from '../store/useDesignStore';
import { formatArea, feetToMeters, metersToFeet, cmToMeters, metersToCm, inchesToMeters, metersToInches } from '../lib/unitMath';
import type { UnitSystem } from '../lib/unitMath';

interface Dimension {
  id: string;
  w: string;
  h: string;
}

interface TileOption {
  label: string;
  w: number; // in meters
  h: number; // in meters
  tilesPerBox: number;
}

const TILE_OPTIONS: TileOption[] = [
  { label: '60 x 60 cm', w: 0.6, h: 0.6, tilesPerBox: 4 },
  { label: '120 x 60 cm', w: 1.2, h: 0.6, tilesPerBox: 2 },
  { label: '120 x 120 cm', w: 1.2, h: 1.2, tilesPerBox: 2 },
  { label: '150 x 75 cm', w: 1.5, h: 0.75, tilesPerBox: 2 },
  
  // Imperial Sizes (inches)
  { label: '12" x 24"', w: 0.3048, h: 0.6096, tilesPerBox: 8 },
  { label: '12" x 30"', w: 0.3048, h: 0.762, tilesPerBox: 6 },
  { label: '8" x 48"', w: 0.2032, h: 1.2192, tilesPerBox: 6 },
  { label: '12" x 48"', w: 0.3048, h: 1.2192, tilesPerBox: 4 },
  { label: '16" x 16"', w: 0.4064, h: 0.4064, tilesPerBox: 10 },
  { label: '18" x 36"', w: 0.4572, h: 0.9144, tilesPerBox: 4 },
  { label: '24" x 36"', w: 0.6096, h: 0.9144, tilesPerBox: 3 },
  { label: '24" x 48"', w: 0.6096, h: 1.2192, tilesPerBox: 2 },
  { label: '32" x 48"', w: 0.8128, h: 1.2192, tilesPerBox: 2 },
  { label: '30" x 60"', w: 0.762, h: 1.524, tilesPerBox: 2 },
  { label: '36" x 72"', w: 0.9144, h: 1.8288, tilesPerBox: 2 },
  { label: '48" x 96"', w: 1.2192, h: 2.4384, tilesPerBox: 1 },
];

const SHAPES = ['Rectangle', 'Square', 'Triangle', 'Circle', 'Semi Circle', 'Trapezoid', 'Parallelogram', 'Rhombus', 'Pentagon'] as const;
type FloorShape = typeof SHAPES[number];

type ShapeField = { key: 'p1' | 'p2' | 'p3'; label: string; symbol: string; hint: string; placeholder: string; };
type ShapeConfig = { fields: ShapeField[]; formula: string; tip: string; };

const SHAPE_CONFIG: Record<FloorShape, ShapeConfig> = {
  Rectangle: {
    fields: [
      { key: 'p1', label: 'Length (L)', symbol: 'L', hint: 'Measure the longer wall from corner to corner', placeholder: 'e.g. 5.00' },
      { key: 'p2', label: 'Width (W)', symbol: 'W', hint: 'Measure the shorter wall from corner to corner', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = L × W',
    tip: 'Use a tape measure along the floor skirting for most accurate reading.',
  },
  Square: {
    fields: [
      { key: 'p1', label: 'Side Length (S)', symbol: 'S', hint: 'All four walls are equal — measure any one side', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = S²',
    tip: 'A perfectly square room has all walls the same length.',
  },
  // Triangle: two modes handled dynamically in render
  Triangle: {
    fields: [
      { key: 'p1', label: 'Base (B)', symbol: 'B', hint: 'Measure the bottom/longest edge of the triangle', placeholder: 'e.g. 6.00' },
      { key: 'p2', label: 'Height (H)', symbol: 'H', hint: 'Perpendicular height from base to the opposite apex', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = ½ × B × H',
    tip: 'Height MUST be perpendicular (90°) to the base — not the slanted wall length.',
  },
  Circle: {
    fields: [
      { key: 'p1', label: 'Radius (r)', symbol: 'r', hint: 'Measure from the center point to any outer edge', placeholder: 'e.g. 3.00' },
    ],
    formula: 'Area = π × r²',
    tip: 'Radius = Diameter ÷ 2. Measure the widest span across the room and halve it.',
  },
  'Semi Circle': {
    fields: [
      { key: 'p1', label: 'Radius (r)', symbol: 'r', hint: 'Measure from the flat straight wall to the curved edge', placeholder: 'e.g. 3.00' },
    ],
    formula: 'Area = ½ × π × r²',
    tip: 'Common in bay windows and alcoves. Measure the flat wall width and divide by 2.',
  },
  Trapezoid: {
    fields: [
      { key: 'p1', label: 'Top Parallel Side (a)', symbol: 'a', hint: 'Length of the shorter parallel wall at the top', placeholder: 'e.g. 3.00' },
      { key: 'p2', label: 'Bottom Parallel Side (b)', symbol: 'b', hint: 'Length of the longer parallel wall at the bottom', placeholder: 'e.g. 5.00' },
      { key: 'p3', label: 'Perpendicular Height (h)', symbol: 'h', hint: 'Straight vertical gap between the two parallel sides — NOT the slanted leg', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = ½ × (a + b) × h',
    tip: 'The height must be measured at a right angle between the two parallel sides, not along the angled leg.',
  },
  // Parallelogram: 3 inputs — Base, Height, Skew Angle (angle defines shape; area = B × H)
  Parallelogram: {
    fields: [
      { key: 'p1', label: 'Base (B)', symbol: 'B', hint: 'Length of the bottom or top edge', placeholder: 'e.g. 6.00' },
      { key: 'p2', label: 'Perpendicular Height (H)', symbol: 'H', hint: 'Vertical distance between the two parallel sides — NOT the slanted side', placeholder: 'e.g. 4.00' },
      { key: 'p3', label: 'Skew Angle (θ°)', symbol: 'θ', hint: 'Angle of the leaning side walls (1°–89°). Typical rooms: 45°–75°', placeholder: 'e.g. 60' },
    ],
    formula: 'Area = B × H  (θ defines shape proportions)',
    tip: 'Skew angle determines how far the walls lean. Area is always Base × Perpendicular Height regardless of angle.',
  },
  // Rhombus: two modes handled dynamically in render
  Rhombus: {
    fields: [
      { key: 'p1', label: 'Diagonal 1 (d₁)', symbol: 'd₁', hint: 'Longer diagonal measured corner to corner', placeholder: 'e.g. 6.00' },
      { key: 'p2', label: 'Diagonal 2 (d₂)', symbol: 'd₂', hint: 'Shorter diagonal measured corner to corner', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = (d₁ × d₂) ÷ 2',
    tip: 'The two diagonals of a rhombus bisect each other at 90°. Measure both full corner-to-corner axes.',
  },
  Pentagon: {
    fields: [
      { key: 'p1', label: 'Side Length (S)', symbol: 'S', hint: 'Length of one side — all 5 sides must be equal for this formula', placeholder: 'e.g. 4.00' },
    ],
    formula: 'Area = ¼ × √(5(5+2√5)) × S²',
    tip: 'Only valid for a regular pentagon with all equal sides and fixed 108° interior angles.',
  },
};

function ShapeVisualizer({ shape }: { shape: FloorShape }) {
  const strokeColor = "#106135"; // Marhaba Green
  const strokeWidth = "2.5";
  const arrowColor = "#cca550"; // Marhaba Gold
  const arrowStyle = { stroke: arrowColor, strokeWidth: 1.5, fill: "none", markerEnd: "url(#arrowhead)", markerStart: "url(#arrowhead-start)" };
  const labelStyle = { fill: arrowColor, fontSize: "10px", textAnchor: "middle" as const, fontWeight: "bold", textTransform: "uppercase" as const, letterSpacing: "0.1em" };

  return (
    <svg width="100%" height="100%" viewBox="-10 -10 120 120" className="overflow-visible drop-shadow-[0_0_15px_rgba(16,97,53,0.3)]">
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill={arrowColor} />
        </marker>
        <marker id="arrowhead-start" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
          <polygon points="6 0, 0 3, 6 6" fill={arrowColor} />
        </marker>
      </defs>
      
      {shape === 'Rectangle' && (
        <g>
          <rect x="15" y="30" width="70" height="40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="15" y1="80" x2="85" y2="80" {...arrowStyle} />
          <text x="50" y="95" style={labelStyle}>Length</text>
          <line x1="5" y1="30" x2="5" y2="70" {...arrowStyle} />
          <text x="-5" y="50" style={labelStyle} transform="rotate(-90 -5,50)">Width</text>
        </g>
      )}

      {shape === 'Square' && (
        <g>
          <rect x="25" y="25" width="50" height="50" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="25" y1="85" x2="75" y2="85" {...arrowStyle} />
          <text x="50" y="100" style={labelStyle}>Side</text>
        </g>
      )}

      {shape === 'Triangle' && (
        <g>
          <polygon points="10,80 90,80 50,20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="10" y1="90" x2="90" y2="90" {...arrowStyle} />
          <text x="50" y="105" style={labelStyle}>Base</text>
          {/* Height indicated on the left, outside the shape */}
          <line x1="50" y1="20" x2="-2" y2="20" stroke={arrowColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="-2" y1="20" x2="-2" y2="80" {...arrowStyle} />
          <text x="-12" y="50" style={labelStyle} transform="rotate(-90 -12,50)">Height</text>
        </g>
      )}

      {shape === 'Circle' && (
        <g>
          <circle cx="50" cy="50" r="35" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="50" cy="50" r="2" fill={strokeColor} />
          <line x1="50" y1="50" x2="85" y2="50" stroke={arrowColor} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <text x="67" y="45" style={labelStyle}>Radius</text>
        </g>
      )}

      {shape === 'Semi Circle' && (
        <g>
          <path d="M 15 70 A 35 35 0 0 1 85 70 Z" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="50" cy="70" r="2" fill={strokeColor} />
          <line x1="50" y1="70" x2="85" y2="70" stroke={arrowColor} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <text x="67" y="65" style={labelStyle}>Radius</text>
        </g>
      )}

      {shape === 'Trapezoid' && (
        <g>
          <polygon points="30,30 70,30 90,70 10,70" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="30" y1="20" x2="70" y2="20" {...arrowStyle} />
          <text x="50" y="15" style={labelStyle}>Side A</text>
          <line x1="10" y1="80" x2="90" y2="80" {...arrowStyle} />
          <text x="50" y="95" style={labelStyle}>Side B</text>
          {/* Height indicated on the left */}
          <line x1="30" y1="30" x2="0" y2="30" stroke={arrowColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="30" x2="0" y2="70" {...arrowStyle} />
          <text x="-10" y="50" style={labelStyle} transform="rotate(-90 -10,50)">Height</text>
        </g>
      )}

      {shape === 'Parallelogram' && (
        <g>
          <polygon points="30,30 90,30 70,70 10,70" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="10" y1="80" x2="70" y2="80" {...arrowStyle} />
          <text x="40" y="95" style={labelStyle}>Base</text>
          {/* Height indicated on the left */}
          <line x1="30" y1="30" x2="-2" y2="30" stroke={arrowColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="-2" y1="30" x2="-2" y2="70" {...arrowStyle} />
          <text x="-12" y="50" style={labelStyle} transform="rotate(-90 -12,50)">Height</text>
        </g>
      )}

      {shape === 'Rhombus' && (
        <g>
          <polygon points="30,20 70,20 50,80 10,80" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="10" y1="90" x2="50" y2="90" {...arrowStyle} />
          <text x="30" y="105" style={labelStyle}>Base</text>
          {/* Height indicated on the left */}
          <line x1="30" y1="20" x2="-2" y2="20" stroke={arrowColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="-2" y1="20" x2="-2" y2="80" {...arrowStyle} />
          <text x="-12" y="50" style={labelStyle} transform="rotate(-90 -12,50)">Height</text>
        </g>
      )}

      {shape === 'Pentagon' && (
        <g>
          <polygon points="50,15 85,40 70,80 30,80 15,40" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="30" y1="90" x2="70" y2="90" {...arrowStyle} />
          <text x="50" y="105" style={labelStyle}>Side</text>
        </g>
      )}
    </svg>
  );
}

export default function TileCalculatorScreen() {
  const globalUnitSystem = useDesignStore(s => s.unitSystem);
  const [calcUnit, setCalcUnit] = useState<UnitSystem>(globalUnitSystem);
  const unit = calcUnit === 'meters' ? 'm' : calcUnit === 'feet' ? 'ft' : calcUnit === 'inches' ? 'in' : 'cm';
  const setRoomDimensions = useDesignStore(s => s.setRoomDimensions);
  const [lang] = useState<'en'|'ur'>('en');
  const [showGuide, setShowGuide] = useState(false);
  const [roomType, setRoomType] = useState('Living Room');
  const [surface, setSurface] = useState<'Floor' | 'Wall' | 'Both'>('Both');
  
  const [floorShape, setFloorShape] = useState<FloorShape>('Rectangle');
  const [floorDim, setFloorDim] = useState({ p1: '', p2: '', p3: '' });
  // Mode toggles for complex shapes
  const [triangleMode, setTriangleMode] = useState<'basic' | 'heron'>('basic');
  const [rhombusMode, setRhombusMode] = useState<'diagonals' | 'angle'>('diagonals');
  const [walls, setWalls] = useState<Dimension[]>([{ id: '1', w: '', h: '' }]);
  
  const [hasDeductions, setHasDeductions] = useState(false);
  const [deductions, setDeductions] = useState<Dimension[]>([{ id: 'd1', w: '', h: '' }]);
  
  const [hasWastage, setHasWastage] = useState(true);
  const [sameTileSize, setSameTileSize] = useState(false);
  const [selectedTileIndex, setSelectedTileIndex] = useState(1); // 120x60

  const roomDimensions = useDesignStore(s => s.roomDimensions);

  // Sync from store to local state on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (roomDimensions.width > 0 && roomDimensions.length > 0) {
      const toCalcUnit = (m: number) => {
        if (calcUnit === 'feet') return metersToFeet(m);
        if (calcUnit === 'cm') return metersToCm(m);
        if (calcUnit === 'inches') return metersToInches(m);
        return m;
      };
      const w = toCalcUnit(roomDimensions.width);
      const l = toCalcUnit(roomDimensions.length);
      const h = toCalcUnit(roomDimensions.height);
      setFloorDim(prev => ({ ...prev, p1: w.toFixed(2), p2: l.toFixed(2) }));
      setWalls([{ id: '1', w: w.toFixed(2), h: h.toFixed(2) }]);
    }
  }, []); // Only once on mount so we don't break manual edits here

  // Sync from local state back to store when floor or wall dimensions change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const parseDim = (val: string) => {
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      if (calcUnit === 'feet') return feetToMeters(num);
      if (calcUnit === 'cm') return cmToMeters(num);
      if (calcUnit === 'inches') return inchesToMeters(num);
      return num;
    };
    
    const w = parseDim(floorDim.p1) ?? roomDimensions.width;
    const l = parseDim(floorDim.p2) ?? roomDimensions.length;
    const h = walls[0] ? (parseDim(walls[0].h) ?? roomDimensions.height) : roomDimensions.height;
    
    // Only update if changed
    if (w !== roomDimensions.width || l !== roomDimensions.length || h !== roomDimensions.height) {
      setRoomDimensions({ width: w, length: l, height: h });
    }
  }, [floorDim.p1, floorDim.p2, walls, setRoomDimensions, calcUnit]);

  // Calculation Math
  const results = useMemo(() => {
    const parse = (val: string) => parseFloat(val) || 0;
    const toSqM = (val: number) => {
      if (calcUnit === 'feet') return feetToMeters(feetToMeters(val));
      if (calcUnit === 'cm') return cmToMeters(cmToMeters(val));
      if (calcUnit === 'inches') return inchesToMeters(inchesToMeters(val));
      return val;
    };

    let floorAreaRaw = 0;
    if (surface === 'Floor' || surface === 'Both') {
      const p1 = parse(floorDim.p1);
      const p2 = parse(floorDim.p2);
      const p3 = parse(floorDim.p3);

      switch (floorShape) {
        case 'Rectangle':
          floorAreaRaw = p1 * p2;
          break;
        case 'Parallelogram':
          // Area = Base × Perpendicular Height (skew angle in p3 defines shape, not area)
          floorAreaRaw = p1 * p2;
          break;
        case 'Rhombus':
          if (rhombusMode === 'diagonals') {
            // Area = (d₁ × d₂) ÷ 2
            floorAreaRaw = (p1 * p2) / 2;
          } else {
            // Area = S² × sin(θ), where p1=side, p2=angle in degrees
            const angleRad = (p2 * Math.PI) / 180;
            floorAreaRaw = p1 * p1 * Math.sin(angleRad);
          }
          break;
        case 'Square':
          floorAreaRaw = p1 * p1;
          break;
        case 'Triangle':
          if (triangleMode === 'basic') {
            // Area = ½ × Base × Height
            floorAreaRaw = 0.5 * p1 * p2;
          } else {
            // Heron's formula: Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2
            const s = (p1 + p2 + p3) / 2;
            const heronSq = s * (s - p1) * (s - p2) * (s - p3);
            floorAreaRaw = heronSq > 0 ? Math.sqrt(heronSq) : 0;
          }
          break;
        case 'Circle':
          floorAreaRaw = Math.PI * p1 * p1;
          break;
        case 'Semi Circle':
          floorAreaRaw = 0.5 * Math.PI * p1 * p1;
          break;
        case 'Trapezoid':
          floorAreaRaw = 0.5 * (p1 + p2) * p3;
          break;
        case 'Pentagon':
          floorAreaRaw = 0.25 * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * p1 * p1;
          break;
      }
    }

    let wallAreaRaw = 0;
    if (surface === 'Wall' || surface === 'Both') {
      wallAreaRaw = walls.reduce((acc, wall) => acc + (parse(wall.w) * parse(wall.h)), 0);
    }

    let deductionAreaRaw = 0;
    if (hasDeductions) {
      deductionAreaRaw = deductions.reduce((acc, ded) => acc + (parse(ded.w) * parse(ded.h)), 0);
    }

    const grossAreaM2 = toSqM(floorAreaRaw + wallAreaRaw);
    const deductionsM2 = toSqM(deductionAreaRaw);
    const netAreaM2 = Math.max(0, grossAreaM2 - deductionsM2);
    const wastageAreaM2 = netAreaM2 * (hasWastage ? 0.05 : 0);
    const finalAreaM2 = netAreaM2 + wastageAreaM2;

    const tile = TILE_OPTIONS[selectedTileIndex];
    const tileAreaM2 = tile.w * tile.h;

    // Per-surface calculations
    const floorM2 = Math.max(0, toSqM(floorAreaRaw) - (surface === 'Floor' ? deductionsM2 : 0));
    const wallM2  = Math.max(0, toSqM(wallAreaRaw)  - (surface === 'Wall'  ? deductionsM2 : 0));
    const floorFinalM2 = floorM2 * (hasWastage ? 1.05 : 1);
    const wallFinalM2  = wallM2  * (hasWastage ? 1.05 : 1);

    const totalTiles  = Math.ceil(finalAreaM2 / tileAreaM2);
    const floorTiles  = Math.ceil(floorFinalM2 / tileAreaM2);
    const wallTiles   = Math.ceil(wallFinalM2 / tileAreaM2);

    // Bond adhesive: 1 bag (25 kg) covers ~4.5 m²
    const bondBags      = Math.ceil(finalAreaM2 / 4.5);
    const floorBondBags = Math.ceil(floorFinalM2 / 4.5);
    const wallBondBags  = Math.ceil(wallFinalM2  / 4.5);

    // Grout: 1 bottle covers ~7 m²
    const groutBottles      = Math.ceil(finalAreaM2 / 7);
    const floorGroutBottles = Math.ceil(floorFinalM2 / 7);
    const wallGroutBottles  = Math.ceil(wallFinalM2  / 7);

    return {
      grossAreaM2, netAreaM2, finalAreaM2, wastageAreaM2, deductionsM2,
      totalTiles,
      floorM2, wallM2, floorFinalM2, wallFinalM2,
      floorTiles, wallTiles,
      bondBags, floorBondBags, wallBondBags,
      groutBottles, floorGroutBottles, wallGroutBottles,
      tile
    };
  }, [floorDim, floorShape, triangleMode, rhombusMode, walls, deductions, hasDeductions, hasWastage, surface, calcUnit, selectedTileIndex]);

  const [showDetails, setShowDetails] = useState(false);

  const handleAddWall = () => setWalls([...walls, { id: Math.random().toString(), w: '', h: '' }]);
  const handleRemoveWall = (id: string) => setWalls(walls.filter(w => w.id !== id));
  const updateWall = (id: string, field: 'w'|'h', val: string) => setWalls(walls.map(w => w.id === id ? { ...w, [field]: val } : w));

  const handleAddDed = () => setDeductions([...deductions, { id: Math.random().toString(), w: '', h: '' }]);
  const handleRemoveDed = (id: string) => setDeductions(deductions.filter(d => d.id !== id));
  const updateDed = (id: string, field: 'w'|'h', val: string) => setDeductions(deductions.map(d => d.id === id ? { ...d, [field]: val } : d));

  const getShapeDataDisplay = () => {
    if (!floorDim.p1) return '—';
    const u = calcUnit === 'meters' ? 'm' : calcUnit === 'feet' ? 'ft' : calcUnit === 'inches' ? 'in' : 'cm';
    switch (floorShape) {
      case 'Rectangle': return `${floorDim.p1} | ${floorDim.p2 || '0'} (${u})`;
      case 'Square': return `${floorDim.p1} (${u})`;
      case 'Triangle': return `B: ${floorDim.p1} | H: ${floorDim.p2 || '0'} (${u})`;
      case 'Circle': return `r: ${floorDim.p1} (${u})`;
      case 'Semi Circle': return `r: ${floorDim.p1} (${u})`;
      case 'Trapezoid': return `${floorDim.p1} | ${floorDim.p2 || '0'} | h:${floorDim.p3 || '0'} (${u})`;
      case 'Parallelogram': return `B:${floorDim.p1} | H:${floorDim.p2 || '0'} (${u})`;
      case 'Rhombus': return rhombusMode === 'diagonals' ? `d₁:${floorDim.p1} | d₂:${floorDim.p2 || '0'} (${u})` : `S:${floorDim.p1} | θ:${floorDim.p2 || '0'}°`;
      case 'Pentagon': return `Side: ${floorDim.p1} (${u})`;
    }
    return '';
  };

  const getWallDisplay = () => {
    if (!walls[0]?.w) return '—';
    const u = calcUnit === 'meters' ? 'm' : calcUnit === 'feet' ? 'ft' : calcUnit === 'inches' ? 'in' : 'cm';
    if (walls.length === 1) return `${walls[0].w} (${u})`;
    return `${walls.length} walls (${u})`;
  };

  const handleExportPDF = () => {
    const r = results;
    const tileSizeLabel = r.tile.label;
    const bothSurface = surface === 'Both';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Marhaba Home — Tile Calculation</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
      body{background:#fff;color:#111;padding:40px;font-size:13px}
      .header{text-align:center;border-bottom:2px solid #106135;padding-bottom:20px;margin-bottom:28px}
      .logo-text{font-size:22px;font-weight:900;color:#106135;letter-spacing:2px}
      .sub{font-size:11px;color:#888;margin-top:4px;text-transform:uppercase;letter-spacing:1px}
      .section-title{font-size:15px;font-weight:700;color:#106135;text-align:center;margin:28px 0 10px;text-transform:uppercase;letter-spacing:2px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      td{padding:8px 12px;border-bottom:1px solid #eee;font-size:12px}
      td:last-child{text-align:right;font-weight:600}
      tr:nth-child(even){background:#f7f7f7}
      .bold td{font-weight:700;font-size:13px}
      .thead td{background:#106135;color:#fff;font-weight:700;text-align:center!important;font-size:12px;letter-spacing:1px}
      .split td:not(:first-child){text-align:center}
      .footer{text-align:center;margin-top:32px;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:14px}
      .gold{color:#cca550}
    </style></head><body>
    <div class="header">
      <div class="logo-text">MARHABA HOME</div>
      <div class="sub">Precision Tile Calculation Report · ${new Date().toLocaleDateString('en-PK',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <div class="section-title">Project Summary</div>
    <table>
      <tr><td>{lang === 'ur' ? 'کمرے کی قسم' : 'Room Type'}</td><td>${roomType}</td></tr>
      <tr><td>Room Shape</td><td>${floorShape}</td></tr>
      <tr><td>Measuring Units</td><td>${calcUnit === 'meters' ? 'Meter' : calcUnit === 'cm' ? 'Centimeter' : calcUnit === 'feet' ? 'Feet' : 'Inches'}</td></tr>
      <tr><td>Surface Type</td><td>${surface === 'Both' ? 'Both: Floor & Wall' : surface}</td></tr>
      <tr><td>Floor Input</td><td>${getShapeDataDisplay()}</td></tr>
      ${surface !== 'Floor' ? `<tr><td>Wall Input</td><td>${getWallDisplay()}</td></tr>` : ''}
      <tr><td>Tile Size</td><td>${tileSizeLabel}</td></tr>
    </table>
    <div class="section-title">Results — Total (${surface === 'Both' ? 'Floor & Wall' : surface})</div>
    <table>
      <tr class="bold"><td>{lang === 'ur' ? 'کل رقبہ' : 'Total Area'}</td><td>${formatArea(r.grossAreaM2, calcUnit)}</td></tr>
      ${hasWastage ? `<tr><td>Wastage (5%)</td><td>+${formatArea(r.wastageAreaM2, calcUnit)}</td></tr>` : ''}
      ${hasDeductions ? `<tr><td>Deduction</td><td>-${formatArea(r.deductionsM2, calcUnit)}</td></tr>` : ''}
      <tr><td>Skirting</td><td>N/A</td></tr>
      <tr class="bold"><td>Net Tile Area</td><td>${formatArea(r.finalAreaM2, calcUnit)}</td></tr>
      <tr><td>Bond Quantity</td><td>${r.bondBags} Bag(s)</td></tr>
      <tr><td>Grout Quantity</td><td>${r.groutBottles} Bottle(s)</td></tr>
    </table>
    ${bothSurface ? `
    <div class="section-title">Breakdown by Surface</div>
    <table>
      <tr class="thead"><td>Item</td><td>{lang === 'ur' ? 'فرش' : 'Floor'}</td><td>{lang === 'ur' ? 'دیوار' : 'Wall'}</td></tr>
      <tr class="split"><td>{lang === 'ur' ? 'کل رقبہ' : 'Total Area'}</td><td>${formatArea(r.floorM2, calcUnit)}</td><td>${formatArea(r.wallM2, calcUnit)}</td></tr>
      ${hasWastage ? `<tr class="split"><td>Wastage (5%)</td><td>${formatArea(r.floorFinalM2-r.floorM2, calcUnit)}</td><td>${formatArea(r.wallFinalM2-r.wallM2, calcUnit)}</td></tr>` : ''}
      <tr class="split"><td>Deduction</td><td>${formatArea(0, calcUnit)}</td><td>${formatArea(0, calcUnit)}</td></tr>
      <tr class="split"><td>Tile Area</td><td>${formatArea(r.floorFinalM2, calcUnit)}</td><td>${formatArea(r.wallFinalM2, calcUnit)}</td></tr>
      <tr class="split"><td>Tile Size</td><td>${tileSizeLabel}</td><td>${tileSizeLabel}</td></tr>
      <tr class="split"><td>Bond Quantity</td><td>${r.floorBondBags} Bag(s)</td><td>${r.wallBondBags} Bag(s)</td></tr>
      <tr class="split"><td>Grout Quantity</td><td>${r.floorGroutBottles} Bottle(s)</td><td>${r.wallGroutBottles} Bottle(s)</td></tr>
    </table>` : ''}
    <div class="footer">Generated by Marhaba Home Tile Calculator · marhabahome.pk · This is an estimate. Actual quantities may vary.</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] text-white/90">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-start">

        {/* LEFT COLUMN: Inputs */}
        <div className="w-full lg:flex-1 space-y-12 animate-fade-up">
          
          {/* Header */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4">Precision Tile Calculator</h2>
              <p className="text-white/50 font-light tracking-wide max-w-xl">
                Determine the exact material requirements for your luxury architectural project with our algorithmic estimator.
              </p>
            </div>
            <button onClick={() => setShowGuide(true)} className="flex items-center gap-2 px-4 py-2.5 border border-[#cca550]/30 text-[#cca550] rounded-full hover:bg-[#cca550]/10 transition-colors text-xs font-bold uppercase tracking-widest flex-shrink-0">
              <Info size={14} />
              How to Use / رہنمائی
            </button>
          </div>

          {/* Core Settings */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 backdrop-blur-md">
            <div className="flex flex-wrap gap-6 sm:gap-8 items-center justify-between mb-8 pb-8 border-b border-white/10">
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">{lang === 'ur' ? 'پیمائش کی اکائی' : 'Measurement Unit'}</label>
                <div className="flex bg-black/40 p-1 rounded-full border border-white/5 w-fit">
                  <button onClick={() => setCalcUnit('meters')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${calcUnit === 'meters' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Meters</button>
                  <button onClick={() => setCalcUnit('cm')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${calcUnit === 'cm' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>CM</button>
                  <button onClick={() => setCalcUnit('feet')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${calcUnit === 'feet' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Feet</button>
                  <button onClick={() => setCalcUnit('inches')} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${calcUnit === 'inches' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Inches</button>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Surface Type</label>
                <div className="flex bg-black/40 p-1 rounded-full border border-white/5 w-fit">
                  {['Floor', 'Wall', 'Both'].map(type => (
                    <button key={type} onClick={() => setSurface(type as any)} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${surface === type ? 'bg-[#106135] text-white' : 'text-white/40 hover:text-white'}`}>{type}</button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">{lang === 'ur' ? 'کمرے کی قسم' : 'Room Type'}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {[
                { name: 'Living Room', icon: Sofa },
                { name: 'Bedroom', icon: BedDouble },
                { name: 'Kitchen', icon: Utensils },
                { name: 'Bathroom', icon: Bath },
                { name: 'Other', icon: LayoutTemplate },
              ].map(rt => {
                const Icon = rt.icon;
                const active = roomType === rt.name;
                return (
                  <button 
                    key={rt.name}
                    onClick={() => setRoomType(rt.name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${active ? 'bg-[#106135]/20 border-[#cca550] text-[#cca550]' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
                  >
                    <Icon size={24} className="mb-3" strokeWidth={active ? 2 : 1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{rt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
              <Calculator size={20} className="text-[#cca550]" />
              <h3 className="text-xl font-serif text-white">Room Dimensions</h3>
            </div>

            {(surface === 'Floor' || surface === 'Both') && (
              <div className="mb-10">
                {/* Shape selector + Mode toggle row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <h4 className="text-[10px] font-bold text-[#cca550] uppercase tracking-[0.2em]">Floor Area</h4>
                  <div className="flex items-center gap-3">
                    {/* Mode toggles for complex shapes */}
                    {floorShape === 'Triangle' && (
                      <div className="flex bg-black/40 p-0.5 rounded-full border border-white/10">
                        <button onClick={() => { setTriangleMode('basic'); setFloorDim({p1:'',p2:'',p3:''}); }} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${triangleMode==='basic' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white'}`}>Base + Height</button>
                        <button onClick={() => { setTriangleMode('heron'); setFloorDim({p1:'',p2:'',p3:''}); }} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${triangleMode==='heron' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white'}`}>3 Sides (Heron)</button>
                      </div>
                    )}
                    {floorShape === 'Rhombus' && (
                      <div className="flex bg-black/40 p-0.5 rounded-full border border-white/10">
                        <button onClick={() => { setRhombusMode('diagonals'); setFloorDim({p1:'',p2:'',p3:''}); }} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${rhombusMode==='diagonals' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white'}`}>Diagonals</button>
                        <button onClick={() => { setRhombusMode('angle'); setFloorDim({p1:'',p2:'',p3:''}); }} className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${rhombusMode==='angle' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white'}`}>Side + Angle</button>
                      </div>
                    )}
                    <div className="relative w-44">
                      <select
                        value={floorShape}
                        onChange={e => {
                          setFloorShape(e.target.value as FloorShape);
                          setFloorDim({ p1: '', p2: '', p3: '' });
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                      >
                        {SHAPES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                    </div>
                  </div>
                </div>

                {/* Formula Bar — dynamic per mode */}
                <div className="mb-5 flex items-center gap-3 bg-[#106135]/10 border border-[#106135]/30 rounded-xl px-5 py-3">
                  <span className="text-[9px] font-bold text-[#cca550] uppercase tracking-widest flex-shrink-0">Formula</span>
                  <span className="text-sm font-mono text-white/80 tracking-wide">
                    {floorShape === 'Triangle' && triangleMode === 'heron'
                      ? 'Area = √(s(s-a)(s-b)(s-c)),  s = (a+b+c)÷2'
                      : floorShape === 'Rhombus' && rhombusMode === 'angle'
                      ? 'Area = S² × sin(θ)'
                      : SHAPE_CONFIG[floorShape].formula}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Shape Visualization */}
                  <div className="w-full md:w-1/3 aspect-square bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center p-6 relative shadow-inner flex-shrink-0">
                    <ShapeVisualizer shape={floorShape} />
                  </div>

                  {/* Right: Smart Inputs — mode-aware */}
                  <div className="flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-5">
                      {/* Triangle: Basic (B+H) or Heron's (a,b,c) */}
                      {floorShape === 'Triangle' && triangleMode === 'basic' && [
                        { key: 'p1' as const, label: 'Base (B)', hint: 'Measure the longest bottom edge', placeholder: 'e.g. 6.00' },
                        { key: 'p2' as const, label: 'Perpendicular Height (H)', hint: 'Height at 90° from base to apex — NOT the slanted side', placeholder: 'e.g. 4.00' },
                      ].map(f => (
                        <div key={f.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{f.label} <span className="text-white/30">({unit})</span></label>
                            <span className="text-[9px] text-[#cca550]/60 italic">{f.hint}</span>
                          </div>
                          <input type="number" min="0" value={floorDim[f.key]} onChange={e => setFloorDim({...floorDim,[f.key]:e.target.value.replace('-','')})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-light focus:border-[#cca550] focus:bg-black/70 outline-none transition-all placeholder:text-white/15" placeholder={f.placeholder} />
                        </div>
                      ))}
                      {floorShape === 'Triangle' && triangleMode === 'heron' && [
                        { key: 'p1' as const, label: 'Side A (a)', hint: 'Length of the first wall', placeholder: 'e.g. 5.00' },
                        { key: 'p2' as const, label: 'Side B (b)', hint: 'Length of the second wall', placeholder: 'e.g. 6.00' },
                        { key: 'p3' as const, label: 'Side C (c)', hint: 'Length of the third wall — must form a valid triangle', placeholder: 'e.g. 7.00' },
                      ].map(f => (
                        <div key={f.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{f.label} <span className="text-white/30">({unit})</span></label>
                            <span className="text-[9px] text-[#cca550]/60 italic">{f.hint}</span>
                          </div>
                          <input type="number" min="0" value={floorDim[f.key]} onChange={e => setFloorDim({...floorDim,[f.key]:e.target.value.replace('-','')})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-light focus:border-[#cca550] focus:bg-black/70 outline-none transition-all placeholder:text-white/15" placeholder={f.placeholder} />
                        </div>
                      ))}
                      {/* Rhombus: Diagonals or Side+Angle */}
                      {floorShape === 'Rhombus' && rhombusMode === 'diagonals' && [
                        { key: 'p1' as const, label: 'Diagonal 1 (d₁)', hint: 'Longer corner-to-corner diagonal', placeholder: 'e.g. 6.00' },
                        { key: 'p2' as const, label: 'Diagonal 2 (d₂)', hint: 'Shorter corner-to-corner diagonal', placeholder: 'e.g. 4.00' },
                      ].map(f => (
                        <div key={f.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{f.label} <span className="text-white/30">({unit})</span></label>
                            <span className="text-[9px] text-[#cca550]/60 italic">{f.hint}</span>
                          </div>
                          <input type="number" min="0" value={floorDim[f.key]} onChange={e => setFloorDim({...floorDim,[f.key]:e.target.value.replace('-','')})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-light focus:border-[#cca550] focus:bg-black/70 outline-none transition-all placeholder:text-white/15" placeholder={f.placeholder} />
                        </div>
                      ))}
                      {floorShape === 'Rhombus' && rhombusMode === 'angle' && [
                        { key: 'p1' as const, label: 'Side Length (S)', hint: 'All four sides are equal — measure any one', placeholder: 'e.g. 5.00', unit: unit },
                        { key: 'p2' as const, label: 'Interior Angle (θ)', hint: 'One of the two distinct interior angles (must be 1°–179°)', placeholder: 'e.g. 60', unit: '°' },
                      ].map(f => (
                        <div key={f.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{f.label} <span className="text-white/30">({f.unit})</span></label>
                            <span className="text-[9px] text-[#cca550]/60 italic">{f.hint}</span>
                          </div>
                          <input type="number" min="0" max={f.key === 'p2' ? '179' : undefined} value={floorDim[f.key]} onChange={e => setFloorDim({...floorDim,[f.key]:e.target.value.replace('-','')})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-light focus:border-[#cca550] focus:bg-black/70 outline-none transition-all placeholder:text-white/15" placeholder={f.placeholder} />
                        </div>
                      ))}
                      {/* All other shapes: data-driven from SHAPE_CONFIG */}
                      {floorShape !== 'Triangle' && floorShape !== 'Rhombus' &&
                        SHAPE_CONFIG[floorShape].fields.map((field) => (
                          <div key={field.key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                {field.label} <span className="text-white/30">({field.key === 'p3' && floorShape === 'Parallelogram' ? '°' : unit})</span>
                              </label>
                              <span className="text-[9px] text-[#cca550]/60 italic">{field.hint}</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              max={field.key === 'p3' && floorShape === 'Parallelogram' ? '89' : undefined}
                              value={floorDim[field.key]}
                              onChange={e => setFloorDim({ ...floorDim, [field.key]: e.target.value.replace('-', '') })}
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-base font-light focus:border-[#cca550] focus:bg-black/70 outline-none transition-all placeholder:text-white/15"
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))
                      }
                      {/* Heron validation warning */}
                      {floorShape === 'Triangle' && triangleMode === 'heron' && floorDim.p1 && floorDim.p2 && floorDim.p3 && (() => {
                        const a = parseFloat(floorDim.p1)||0, b = parseFloat(floorDim.p2)||0, c = parseFloat(floorDim.p3)||0;
                        const valid = a+b>c && a+c>b && b+c>a;
                        return !valid ? (
                          <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <span className="text-red-400 text-sm flex-shrink-0">⚠</span>
                            <p className="text-[10px] text-red-400 leading-relaxed">Invalid triangle: the sum of any two sides must be greater than the third side.</p>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Measurement Tip */}
                    <div className="flex gap-2 items-start bg-white/3 border border-white/5 rounded-xl p-4">
                      <span className="text-[#cca550] text-sm flex-shrink-0 mt-0.5">📐</span>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        {floorShape === 'Triangle' && triangleMode === 'heron'
                          ? 'Heron\'s Formula works with any 3 side lengths. Ensure all three walls are accurately measured. The calculator validates the triangle inequality before computing.'
                          : floorShape === 'Rhombus' && rhombusMode === 'angle'
                          ? 'Area = S² × sin(θ). Use an angle-finder tool or protractor to measure the interior angle of the rhombus precisely.'
                          : SHAPE_CONFIG[floorShape].tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(surface === 'Wall' || surface === 'Both') && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-bold text-[#cca550] uppercase tracking-[0.2em]">Wall Areas</h4>
                  <button onClick={handleAddWall} className="text-[10px] font-bold text-white hover:text-[#cca550] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={14} /> Add Wall</button>
                </div>
                <div className="space-y-4">
                  {walls.map((wall, idx) => (
                    <div key={wall.id} className="flex gap-4 items-end bg-black/20 p-4 rounded-lg border border-white/5">
                      <div className="flex-1">
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Wall {idx + 1} Width ({unit})</label>
                        <input type="number" min="0" value={wall.w} onChange={e => updateWall(wall.id, 'w', e.target.value.replace('-', ''))} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#cca550] outline-none transition-colors" placeholder="0.00" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Wall {idx + 1} Height ({unit})</label>
                        <input type="number" min="0" value={wall.h} onChange={e => updateWall(wall.id, 'h', e.target.value.replace('-', ''))} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#cca550] outline-none transition-colors" placeholder="0.00" />
                      </div>
                      {walls.length > 1 && (
                        <button onClick={() => handleRemoveWall(wall.id)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"><Trash2 size={18} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Deductions & Settings */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Deductions</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Doors, Windows, etc.</p>
                </div>
                <button onClick={() => setHasDeductions(!hasDeductions)} className={`w-12 h-6 rounded-full transition-colors relative ${hasDeductions ? 'bg-[#106135]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${hasDeductions ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              
              {hasDeductions && (
                <div className="space-y-4 mt-6 border-t border-white/10 pt-6">
                  {deductions.map((ded) => (
                    <div key={ded.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <input type="number" min="0" value={ded.w} onChange={e => updateDed(ded.id, 'w', e.target.value.replace('-', ''))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#cca550] outline-none" placeholder="W" />
                      </div>
                      <div className="flex-1">
                        <input type="number" min="0" value={ded.h} onChange={e => updateDed(ded.id, 'h', e.target.value.replace('-', ''))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#cca550] outline-none" placeholder="H" />
                      </div>
                      <button onClick={() => handleRemoveDed(ded.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={handleAddDed} className="text-[10px] font-bold text-[#cca550] hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={14} /> Add Area</button>
                </div>
              )}
            </div>

            {/* Same Tile Size Toggle */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Same Tile Size</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Do you want same tile size for each surface?</p>
                </div>
                <button
                  onClick={() => setSameTileSize(!sameTileSize)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 mt-1 ${sameTileSize ? 'bg-[#106135]' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${sameTileSize ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              {sameTileSize && (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs text-[#cca550]/80 font-light leading-relaxed">
                    ✓ One tile size will be applied uniformly across all surfaces — floor, walls, and any additional areas.
                  </p>
                </div>
              )}

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">5% Wastage</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">For cuts and damage</p>
                </div>
                <button onClick={() => setHasWastage(!hasWastage)} className={`w-12 h-6 rounded-full transition-colors relative ${hasWastage ? 'bg-[#106135]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${hasWastage ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Target Tile Size</label>
                <div className="relative">
                  <select 
                    value={selectedTileIndex} 
                    onChange={e => setSelectedTileIndex(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                  >
                    {TILE_OPTIONS.map((t, i) => (
                      <option key={i} value={i} className="bg-[#111]">{t.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Results Table Panel */}
        <div className="w-full xl:w-[420px] flex-shrink-0">
          <div className="animate-fade-up delay-200 space-y-4">

            {/* RESULTS header */}
            <div className="text-center py-3 border-b border-white/10">
              <h3 className="text-[11px] font-black text-[#cca550] uppercase tracking-[0.35em]">Results</h3>
            </div>

            {/* Two-column summary + results table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">

              {/* Column headers */}
              <div className="grid grid-cols-2 border-b border-white/10">
                <div className="px-4 py-3 border-r border-white/10" />
                <div className="px-4 py-3 text-right">
                  <span className="text-[9px] text-white/30 uppercase tracking-widest">
                    Total ({surface === 'Both' ? 'Floor & Wall' : surface})
                  </span>
                </div>
              </div>

              {/* Summary rows — left col info */}
              {[
                { label: 'Room Type',      value: roomType },
                { label: 'Room Shape',     value: floorShape, swatch: '#106135' },
                { label: 'Measuring Units',value: unit === 'm' ? 'Meter' : unit === 'cm' ? 'Centimeter' : unit === 'ft' ? 'Feet' : 'Inches' },
                { label: 'Surface Type',   value: surface === 'Both' ? 'Both: Floor & Wall' : surface },
                ...(surface !== 'Wall' ? [{ label: 'Floor Input', value: getShapeDataDisplay() }] : []),
                ...(surface !== 'Floor' ? [{ label: 'Wall Input', value: getWallDisplay() }] : []),
                { label: 'Tile Size',      value: results.tile.label },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-2 border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <div className="px-4 py-3 border-r border-white/5 text-sm text-white/40 font-medium">{row.label}</div>
                  <div className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    {'swatch' in row && <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{background: row.swatch}} />}
                    <span className="text-base text-white/80 font-semibold">{row.value}</span>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="border-b border-[#cca550]/20 bg-[#cca550]/5 px-4 py-2">
                <span className="text-xs text-[#cca550]/60 uppercase tracking-widest font-bold">Calculation</span>
              </div>

              {/* Calculation rows */}
              {[
                { label: 'Total Area',     value: formatArea(results.grossAreaM2, calcUnit), bold: true },
                { label: `Wastage (${hasWastage ? '5%' : '0%'})`, value: hasWastage ? formatArea(results.wastageAreaM2, calcUnit) : formatArea(0, calcUnit) },
                { label: 'Deduction',      value: hasDeductions ? formatArea(results.deductionsM2, calcUnit) : formatArea(0, calcUnit) },
                { label: 'Skirting',       value: 'N/A' },
                { label: 'Tile Area (with wastage, deduction)', value: formatArea(results.finalAreaM2, calcUnit), bold: true },
                { label: 'Bond Quantity',  value: `${results.bondBags} Bag(s)` },
                { label: 'Grout Quantity', value: `${results.groutBottles} Bottle(s)` },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-2 border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <div className={`px-4 py-3 border-r border-white/5 text-sm ${row.bold ? 'text-white font-bold' : 'text-white/40 font-medium'}`}>{row.label}</div>
                  <div className={`px-4 py-3 text-right text-base font-bold ${(row as any).gold ? 'text-[#cca550]' : row.bold ? 'text-white' : 'text-white/70'}`}>{row.value}</div>
                </div>
              ))}
            </div>

            {/* VIEW DETAILS expandable — only for Both surfaces */}
            {surface === 'Both' && (
              <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-center gap-2 py-4 text-sm font-black text-[#106135] uppercase tracking-[0.3em] hover:bg-white/3 transition-colors"
                >
                  View Details
                  <span className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showDetails && (
                  <div className="border-t border-white/10">
                    {/* Per-surface column headers */}
                    <div className="grid grid-cols-3 border-b border-white/10 bg-[#106135]/10">
                      <div className="px-3 py-3 border-r border-white/10" />
                      <div className="px-3 py-3 text-center border-r border-white/10">
                        <span className="text-xs font-bold text-[#cca550] uppercase tracking-widest">{lang === 'ur' ? 'فرش' : 'Floor'}</span>
                      </div>
                      <div className="px-3 py-3 text-center">
                        <span className="text-xs font-bold text-[#cca550] uppercase tracking-widest">
                          Wall {walls.length > 1 ? `(${walls.length})` : walls[0]?.w ? `(${walls[0].w} ${unit})` : ''}
                        </span>
                      </div>
                    </div>

                    {[
                      { label: 'Total Area',     floor: formatArea(results.floorM2, calcUnit),      wall: formatArea(results.wallM2, calcUnit),      bold: true },
                      { label: 'Wastage (5%)',   floor: formatArea(results.floorFinalM2-results.floorM2, calcUnit), wall: formatArea(results.wallFinalM2-results.wallM2, calcUnit) },
                      { label: 'Deduction',      floor: formatArea(0, calcUnit),                                  wall: formatArea(0, calcUnit) },
                      { label: 'Skirting',       floor: 'N/A',                                      wall: 'N/A' },
                      { label: 'Tile Area',      floor: formatArea(results.floorFinalM2, calcUnit), wall: formatArea(results.wallFinalM2, calcUnit), bold: true },
                      { label: 'Tile Size',      floor: results.tile.label,                         wall: results.tile.label },
                      { label: 'Bond Quantity',  floor: `${results.floorBondBags} Bag(s)`,          wall: `${results.wallBondBags} Bag(s)` },
                      { label: 'Grout Quantity', floor: `${results.floorGroutBottles} Bottle(s)`,  wall: `${results.wallGroutBottles} Bottle(s)` },
                    ].map((row, i) => (
                      <div key={i} className={`grid grid-cols-3 border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                        <div className={`px-4 py-3 border-r border-white/5 text-sm ${row.bold ? 'text-white font-bold' : 'text-white/40 font-medium'}`}>{row.label}</div>
                        <div className={`px-4 py-3 text-center border-r border-white/5 text-sm font-semibold ${(row as any).gold ? 'text-[#cca550]' : row.bold ? 'text-white' : 'text-white/60'}`}>{row.floor}</div>
                        <div className={`px-4 py-3 text-center text-sm font-semibold ${(row as any).gold ? 'text-[#cca550]' : row.bold ? 'text-white' : 'text-white/60'}`}>{row.wall}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Export PDF */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#cca550] to-[#e8c060] rounded-lg opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300" />
                <button
                  onClick={handleExportPDF}
                  className="relative w-full flex items-center justify-center gap-2 py-4 bg-[#0a0a0a] border border-[#cca550]/40 rounded-lg text-sm font-bold text-[#cca550] uppercase tracking-[0.2em] hover:bg-[#cca550]/8 transition-colors overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <ArrowRight size={14} className="rotate-90 flex-shrink-0" strokeWidth={2.5} />
                  Export PDF
                </button>
              </div>

              {/* Request Quote */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#106135] to-[#158045] rounded-lg opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300" />
                <button className="relative w-full flex items-center justify-center gap-2 py-4 bg-[#106135] rounded-lg text-sm font-bold text-white uppercase tracking-[0.2em] hover:bg-[#158045] transition-colors overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <ArrowRight size={14} className="flex-shrink-0" strokeWidth={2.5} />
                  Get Quote
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-white/20 tracking-widest uppercase pb-2 mt-2">
              Estimate only · Actual quantities may vary
            </p>

          </div>
        </div>

        </div>{/* end flex row */}
      </div>

      {/* HOW TO USE GUIDE MODAL */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#060606] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-up shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-3xl font-serif text-white">How to Use the Calculator / استعمال کا طریقہ</h3>
              <button onClick={() => setShowGuide(false)} className="text-white/40 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10">
              
              <div>
                <h4 className="text-[#cca550] font-bold uppercase tracking-widest text-base mb-3">1. Measurement Unit (پیمائش کی اکائی)</h4>
                <p className="text-lg text-white/80 font-light mb-2">Select Meters, Centimeters, Feet, or Inches based on your measuring tape.</p>
                <p className="text-lg text-white/50 text-right leading-relaxed" dir="rtl">اپنے انچی ٹیپ کے مطابق میٹر، سینٹی میٹر، فٹ، یا انچ کا انتخاب کریں۔</p>
              </div>

              <div>
                <h4 className="text-[#cca550] font-bold uppercase tracking-widest text-base mb-3">2. Surface & Room Shape (سطح اور کمرے کی شکل)</h4>
                <p className="text-lg text-white/80 font-light mb-2">You can calculate any area! Choose 'Floor', 'Wall', or 'Both'. For floors, you can select standard shapes like Rectangle or complex ones like Triangle or Circle.</p>
                <p className="text-lg text-white/50 text-right leading-relaxed" dir="rtl">آپ کسی بھی رقبے کا حساب لگا سکتے ہیں! 'فرش'، 'دیوار'، یا 'دونوں' کا انتخاب کریں۔ فرش کے لیے آپ مختلف شکلیں (جیسے مستطیل، گول، یا تکون) منتخب کر سکتے ہیں۔</p>
              </div>

              <div>
                <h4 className="text-[#cca550] font-bold uppercase tracking-widest text-base mb-3">3. Enter Dimensions (پیمائش درج کریں)</h4>
                <p className="text-lg text-white/80 font-light mb-2">Enter the length and width of your space. Add multiple walls if needed.</p>
                <p className="text-lg text-white/50 text-right leading-relaxed" dir="rtl">اپنی جگہ کی لمبائی اور چوڑائی درج کریں۔ اگر ضرورت ہو تو ایک سے زیادہ دیواریں بھی شامل کریں۔</p>
              </div>

              <div>
                <h4 className="text-[#cca550] font-bold uppercase tracking-widest text-base mb-3">4. Deductions (کٹوتی)</h4>
                <p className="text-lg text-white/80 font-light mb-2">Toggle 'Subtract Doors/Windows' to remove empty spaces from the calculation so you don't over-order tiles.</p>
                <p className="text-lg text-white/50 text-right leading-relaxed" dir="rtl">اگر دروازے یا کھڑکیاں ہیں تو ان کی پیمائش کو مائنس کرنے کے لیے 'کٹوتی' کا آپشن استعمال کریں تاکہ اضافی ٹائلز کا آرڈر نہ ہو۔</p>
              </div>

              <div>
                <h4 className="text-[#cca550] font-bold uppercase tracking-widest text-base mb-3">5. Wastage (ضائع شدہ ٹائلز)</h4>
                <p className="text-lg text-white/80 font-light mb-2">We recommend keeping the 5% wastage toggle ON. This covers cutting, breakages, and future repairs.</p>
                <p className="text-lg text-white/50 text-right leading-relaxed" dir="rtl">ہم تجویز کرتے ہیں کہ 5٪ کٹوتی کا آپشن آن رکھیں۔ یہ کٹائی، ٹوٹ پھوٹ اور مستقبل کی مرمت کے کام آئے گا۔</p>
              </div>

            </div>
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button onClick={() => setShowGuide(false)} className="px-8 py-4 bg-[#106135] hover:bg-[#158045] text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all">Close / بند کریں</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
