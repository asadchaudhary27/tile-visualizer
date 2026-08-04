/**
 * LuxuryFurniture — Detailed SVG furniture for the modern living room.
 * Uses 1-point perspective consistent with the room polygon coordinates:
 *   Back wall: x=28–72%, y=10–62%
 *   Horizon line at y=62%
 */
interface Props { W: number; H: number; }

export default function LuxuryFurniture({ W, H }: Props) {
  const x = (p: number) => p / 100 * W;
  const y = (p: number) => p / 100 * H;
  const pt = (pairs: [number, number][]) =>
    pairs.map(([px, py]) => `${x(px)},${y(py)}`).join(' ');

  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        {/* Blur for drop shadows */}
        <filter id="blur3" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="blur6" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>
        <filter id="blur10" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10"/>
        </filter>

        {/* Sofa gradient */}
        <linearGradient id="furn-sofa-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3245"/>
          <stop offset="100%" stopColor="#14202d"/>
        </linearGradient>
        <linearGradient id="furn-sofa-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a445c"/>
          <stop offset="100%" stopColor="#1e3245"/>
        </linearGradient>
        <linearGradient id="furn-sofa-seat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2e3e"/>
          <stop offset="100%" stopColor="#121e28"/>
        </linearGradient>

        {/* Marble gradient for coffee table */}
        <linearGradient id="furn-marble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f0e8"/>
          <stop offset="40%" stopColor="#ede8e0"/>
          <stop offset="70%" stopColor="#f0ebe3"/>
          <stop offset="100%" stopColor="#e8e0d5"/>
        </linearGradient>

        {/* Walnut wood */}
        <linearGradient id="furn-walnut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5230"/>
          <stop offset="100%" stopColor="#5a3a1e"/>
        </linearGradient>

        {/* Rug gradient */}
        <linearGradient id="furn-rug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2540"/>
          <stop offset="100%" stopColor="#111830"/>
        </linearGradient>

        {/* Lamp shade */}
        <linearGradient id="furn-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e8c0"/>
          <stop offset="100%" stopColor="#d4b870"/>
        </linearGradient>

        {/* Pillow gradient */}
        <linearGradient id="furn-pillow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b7355"/>
          <stop offset="100%" stopColor="#6b5035"/>
        </linearGradient>

        {/* Plant pot */}
        <linearGradient id="furn-pot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8e0d8"/>
          <stop offset="100%" stopColor="#c8c0b8"/>
        </linearGradient>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          AREA RUG
      ═══════════════════════════════════════════════════════ */}
      {/* Rug shadow */}
      <ellipse cx={x(50)} cy={y(84)} rx={x(32)} ry={y(3)} fill="rgba(0,0,0,0.25)" filter="url(#blur6)"/>
      {/* Rug base */}
      <polygon points={pt([[21,96],[79,96],[62,70],[38,70]])} fill="url(#furn-rug)"/>
      {/* Outer border */}
      <polygon points={pt([[23,95],[77,95],[61,71],[39,71]])} fill="none" stroke="rgba(180,150,100,0.35)" strokeWidth={1.5}/>
      {/* Inner border */}
      <polygon points={pt([[26,93],[74,93],[59,72.5],[41,72.5]])} fill="none" stroke="rgba(180,150,100,0.2)" strokeWidth={0.8}/>
      {/* Rug horizontal lines */}
      {[74, 78, 82, 86, 90, 94].map((yv, i) => {
        const t = (100 - yv) / (100 - 70);
        const lx = 21 + (62 - 21) * (1 - t);
        const rx = 79 - (79 - 62) * (1 - t) + (79 - 21) * t * (1 - (62 / 79));
        const lx2 = 21 + (38 - 21) * (1 - t);
        const rx2 = 79 - (79 - 62) * (1 - t);
        // interpolate
        const ly = 70 + (96 - 70) * (1 - t);
        const ry2 = ly;
        // Actually let me just draw horizontals
        const pct = (yv - 70) / (96 - 70);
        const xl = 21 + (79 - 21) * (1 - pct) * (38 - 21) / (79 - 21) + (21 * (1 - pct));
        return (
          <line key={i}
            x1={x(22 + (38 - 22) * pct)} y1={y(yv)}
            x2={x(78 - (78 - 62) * pct)} y2={y(yv)}
            stroke="rgba(150,120,70,0.15)" strokeWidth={0.6}
          />
        );
      })}

      {/* ═══════════════════════════════════════════════════════
          SOFA
      ═══════════════════════════════════════════════════════ */}
      {/* Sofa floor shadow */}
      <ellipse cx={x(50)} cy={y(74)} rx={x(22)} ry={y(2)} fill="rgba(0,0,0,0.4)" filter="url(#blur6)"/>

      {/* Sofa back — top face (lit from above, lighter) */}
      <polygon points={pt([[31,62],[69,62],[68.5,64.5],[31.5,64.5]])} fill="url(#furn-sofa-top)"/>
      {/* Sofa back — front cushion face */}
      <polygon points={pt([[31.5,64.5],[68.5,64.5],[68.2,68],[31.8,68]])} fill="url(#furn-sofa-front)"/>
      {/* Sofa seat cushions */}
      <polygon points={pt([[31.8,68],[68.2,68],[67.8,73.5],[32.2,73.5]])} fill="url(#furn-sofa-seat)"/>
      {/* Seat front ledge */}
      <polygon points={pt([[32.2,73.5],[67.8,73.5],[67.5,74.5],[32.5,74.5]])} fill="#0f1920"/>

      {/* Left arm */}
      <polygon points={pt([[30,62],[32,62],[32,64.5],[30,64.5]])} fill="#2a445c"/>
      <polygon points={pt([[30,64.5],[32,64.5],[32,74.5],[30,74.5]])} fill="#1a2d3e"/>
      {/* Right arm */}
      <polygon points={pt([[68,62],[70,62],[70,64.5],[68,64.5]])} fill="#2a445c"/>
      <polygon points={pt([[68,64.5],[70,64.5],[70,74.5],[68,74.5]])} fill="#1a2d3e"/>

      {/* Cushion divider lines */}
      <line x1={x(43.5)} y1={y(64.5)} x2={x(43.2)} y2={y(73.5)} stroke="rgba(0,0,0,0.25)" strokeWidth={1.2}/>
      <line x1={x(56.5)} y1={y(64.5)} x2={x(56.8)} y2={y(73.5)} stroke="rgba(0,0,0,0.25)" strokeWidth={1.2}/>

      {/* Cushion top highlight lines */}
      <line x1={x(32)} y1={y(64.5)} x2={x(43.2)} y2={y(64.5)} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
      <line x1={x(43.5)} y1={y(64.5)} x2={x(56.5)} y2={y(64.5)} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>
      <line x1={x(56.8)} y1={y(64.5)} x2={x(68.2)} y2={y(64.5)} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>

      {/* Legs */}
      {([[32,73.5],[38,73.5],[62,73.5],[68,73.5]] as [number,number][]).map(([lx,ly],i) => (
        <rect key={i} x={x(lx)-1.5} y={y(ly)} width={3} height={y(2)} fill="#2a1a0a" rx={0.5}/>
      ))}

      {/* ── Throw pillows ── */}
      {/* Pillow left */}
      <polygon points={pt([[32.5,64.5],[42,64.5],[41.5,68],[32,68]])} fill="url(#furn-pillow)" opacity={0.9}/>
      <line x1={x(37)} y1={y(64.5)} x2={x(36.8)} y2={y(68)} stroke="rgba(0,0,0,0.15)" strokeWidth={0.6}/>
      {/* Pillow right */}
      <polygon points={pt([[58,64.5],[67.5,64.5],[68,68],[58.5,68]])} fill="url(#furn-pillow)" opacity={0.9}/>
      <line x1={x(63)} y1={y(64.5)} x2={x(63.2)} y2={y(68)} stroke="rgba(0,0,0,0.15)" strokeWidth={0.6}/>

      {/* ═══════════════════════════════════════════════════════
          COFFEE TABLE (round marble top, brass legs)
      ═══════════════════════════════════════════════════════ */}
      {/* Shadow */}
      <ellipse cx={x(50)} cy={y(82)} rx={x(11)} ry={y(2)} fill="rgba(0,0,0,0.35)" filter="url(#blur6)"/>
      {/* Marble top */}
      <ellipse cx={x(50)} cy={y(80)} rx={x(10.5)} ry={y(3)} fill="url(#furn-marble)"/>
      {/* Gold rim */}
      <ellipse cx={x(50)} cy={y(80)} rx={x(10.5)} ry={y(3)} fill="none" stroke="#c8a86c" strokeWidth={1.5}/>
      {/* Marble vein lines */}
      <line x1={x(42)} y1={y(80)} x2={x(55)} y2={y(78)} stroke="rgba(180,170,155,0.5)" strokeWidth={0.5}/>
      <line x1={x(48)} y1={y(82)} x2={x(58)} y2={y(79)} stroke="rgba(180,170,155,0.35)" strokeWidth={0.4}/>
      {/* Reflection highlight */}
      <ellipse cx={x(46)} cy={y(79.2)} rx={x(3)} ry={y(0.8)} fill="rgba(255,255,255,0.22)"/>
      {/* Brass legs */}
      {([[44,82],[56,82]] as [number,number][]).map(([lx,ly],i) => (
        <g key={i}>
          <line x1={x(lx)} y1={y(ly+0.5)} x2={x(lx - (lx-50)*0.3)} y2={y(ly+2.5)} stroke="#c8a86c" strokeWidth={1.5}/>
        </g>
      ))}
      {/* Decorative tray on table */}
      <ellipse cx={x(50)} cy={y(79.5)} rx={x(3.5)} ry={y(1)} fill="rgba(200,168,108,0.25)" stroke="#c8a86c" strokeWidth={0.7}/>
      {/* Book stacked */}
      <polygon points={pt([[47.5,79.5],[51.5,79.5],[51.5,80],[47.5,80]])} fill="#8b4040" opacity={0.7}/>
      <polygon points={pt([[47.5,80],[52,80],[52,80.4],[47.5,80.4]])} fill="#406040" opacity={0.7}/>

      {/* ═══════════════════════════════════════════════════════
          TV WALL SETUP
      ═══════════════════════════════════════════════════════ */}
      {/* ARTWORK - large framed piece above TV */}
      {/* Frame shadow */}
      <polygon points={pt([[40.5,14.5],[59.5,14.5],[59.5,38.5],[40.5,38.5]])} fill="rgba(0,0,0,0.3)" filter="url(#blur3)"/>
      {/* Frame */}
      <polygon points={pt([[40,14],[59,14],[59,38],[40,38]])} fill="#1a150e"/>
      <polygon points={pt([[40.5,14.5],[58.5,14.5],[58.5,37.5],[40.5,37.5]])} fill="#1a150e"/>
      {/* Matte inner */}
      <polygon points={pt([[41,15],[58,15],[58,37],[41,37]])} fill="#f4efe7"/>
      {/* Art content area */}
      <polygon points={pt([[42.5,16.5],[56.5,16.5],[56.5,35.5],[42.5,35.5]])} fill="#ede8e0"/>
      {/* Abstract art — arcs and lines */}
      <ellipse cx={x(49.5)} cy={y(26)} rx={x(4.5)} ry={y(6)} fill="none" stroke="#c8b8a0" strokeWidth={0.8}/>
      <line x1={x(43)} y1={y(17)} x2={x(56)} y2={y(35)} stroke="rgba(80,60,40,0.15)" strokeWidth={0.5}/>
      <line x1={x(56)} y1={y(17)} x2={x(43)} y2={y(35)} stroke="rgba(80,60,40,0.12)" strokeWidth={0.4}/>
      <ellipse cx={x(49.5)} cy={y(26)} rx={x(1.5)} ry={y(2)} fill="#2a1a0e" opacity={0.6}/>
      {/* Frame rim highlight */}
      <line x1={x(40)} y1={y(14)} x2={x(59)} y2={y(14)} stroke="rgba(255,255,255,0.12)" strokeWidth={0.7}/>
      <line x1={x(40)} y1={y(14)} x2={x(40)} y2={y(38)} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}/>

      {/* TV (ultra-thin OLED) */}
      {/* TV shadow on wall */}
      <polygon points={pt([[38,38.5],[61,38.5],[61,47.5],[38,47.5]])} fill="rgba(0,0,0,0.25)" filter="url(#blur3)"/>
      {/* TV bezel */}
      <polygon points={pt([[38,38],[61,38],[61,47],[38,47]])} fill="#0d0d0e"/>
      {/* Screen */}
      <polygon points={pt([[38.5,38.5],[60.5,38.5],[60.5,46.5],[38.5,46.5]])} fill="#0a0f1a"/>
      {/* Screen ambient glow */}
      <polygon points={pt([[38.5,38.5],[60.5,38.5],[60.5,46.5],[38.5,46.5]])} fill="none" stroke="rgba(30,60,120,0.2)" strokeWidth={2}/>
      {/* Very subtle content on screen */}
      <polygon points={pt([[39,39],[60,39],[60,46],[39,46]])} fill="#060c14" opacity={0.9}/>
      <line x1={x(39)} y1={y(42)} x2={x(60)} y2={y(42)} stroke="rgba(50,80,130,0.1)" strokeWidth={0.4}/>
      {/* TV mount */}
      <rect x={x(49)-1.5} y={y(47)} width={3} height={y(1)} fill="#1a1a1a"/>

      {/* TV CONSOLE (floating shelf) */}
      {/* Console shadow */}
      <polygon points={pt([[36,58],[64,58],[64.5,58.5],[35.5,58.5]])} fill="rgba(0,0,0,0.3)" filter="url(#blur3)"/>
      {/* Console body */}
      <polygon points={pt([[36,48],[64,48],[64,57],[36,57]])} fill="url(#furn-walnut)"/>
      {/* Console top face (seen from above) */}
      <polygon points={pt([[36,47.5],[64,47.5],[64,48],[36,48]])} fill="#8a6040"/>
      {/* Console door lines */}
      <line x1={x(50)} y1={y(48)} x2={x(50)} y2={y(57)} stroke="rgba(0,0,0,0.2)" strokeWidth={1}/>
      <line x1={x(43)} y1={y(48)} x2={x(43)} y2={y(57)} stroke="rgba(0,0,0,0.12)" strokeWidth={0.6}/>
      <line x1={x(57)} y1={y(48)} x2={x(57)} y2={y(57)} stroke="rgba(0,0,0,0.12)" strokeWidth={0.6}/>
      {/* Console handle dots */}
      {[44.5, 51, 58].map((hx, i) => (
        <circle key={i} cx={x(hx)} cy={y(52.5)} r={1} fill="rgba(200,168,108,0.7)"/>
      ))}
      {/* Console legs */}
      {([[38,57],[47,57],[53,57],[62,57]] as [number,number][]).map(([lx,ly],i) => (
        <rect key={i} x={x(lx)-1} y={y(ly)} width={2} height={y(2)} fill="#3a2010" rx={0.5}/>
      ))}
      {/* Objects on console */}
      {/* Vase */}
      <ellipse cx={x(38)} cy={y(46.5)} rx={x(1.2)} ry={y(1)} fill="#4a7a60" opacity={0.8}/>
      <line x1={x(38)} y1={y(45.5)} x2={x(38)} y2={y(44)} stroke="#3a6a50" strokeWidth={2}/>
      {/* Small sculpture */}
      <rect x={x(61)-3} y={y(44.5)} width={6} height={y(3)} fill="#8a8070" opacity={0.6} rx={1}/>

      {/* ═══════════════════════════════════════════════════════
          FLOOR LAMP (arc lamp, brass)
      ═══════════════════════════════════════════════════════ */}
      {/* Base shadow */}
      <ellipse cx={x(26)} cy={y(73.5)} rx={x(2.5)} ry={y(0.8)} fill="rgba(0,0,0,0.4)" filter="url(#blur3)"/>
      {/* Base */}
      <ellipse cx={x(26)} cy={y(73.2)} rx={x(2)} ry={y(0.6)} fill="#c8a86c"/>
      {/* Arc pole */}
      <path
        d={`M ${x(26)},${y(73)} Q ${x(22)},${y(60)} ${x(32)},${y(58)}`}
        fill="none" stroke="#c8a86c" strokeWidth={2.5} strokeLinecap="round"
      />
      {/* Shade outer */}
      <polygon points={`${x(29)},${y(58)} ${x(35.5)},${y(58)} ${x(34)},${y(61.5)} ${x(30.5)},${y(61.5)}`}
        fill="url(#furn-lamp)" opacity={0.95}/>
      {/* Shade inner shadow */}
      <polygon points={`${x(30)},${y(61.5)} ${x(34)},${y(61.5)} ${x(33)},${y(61)} ${x(31)},${y(61)}`}
        fill="rgba(0,0,0,0.2)"/>
      {/* Warm glow on floor */}
      <ellipse cx={x(26)} cy={y(73)} rx={x(10)} ry={y(5)} fill="rgba(255,200,80,0.04)"/>
      <ellipse cx={x(32)} cy={y(62)} rx={x(8)} ry={y(4)} fill="rgba(255,200,80,0.05)"/>

      {/* ═══════════════════════════════════════════════════════
          FIDDLE LEAF FIG PLANT (right corner)
      ═══════════════════════════════════════════════════════ */}
      {/* Pot shadow */}
      <ellipse cx={x(71)} cy={y(74)} rx={x(3)} ry={y(0.8)} fill="rgba(0,0,0,0.35)" filter="url(#blur3)"/>
      {/* Ceramic pot */}
      <polygon points={pt([[68.5,70],[73.5,70],[72.8,73.5],[69.2,73.5]])} fill="url(#furn-pot)"/>
      {/* Pot rim */}
      <ellipse cx={x(71)} cy={y(70)} rx={x(2.5)} ry={y(0.7)} fill="#ddd8d0"/>
      {/* Soil */}
      <ellipse cx={x(71)} cy={y(70)} rx={x(2)} ry={y(0.5)} fill="#3a2c1e"/>
      {/* Stem */}
      <line x1={x(71)} y1={y(70)} x2={x(71)} y2={y(63)} stroke="#4a6a2a" strokeWidth={2.5}/>
      {/* Leaves — large fiddle-leaf shapes */}
      {[
        { cx: 71, cy: 64.5, rx: 3, ry: 4.5, rot: -15, color: '#2d5a20' },
        { cx: 68.5, cy: 65.5, rx: 2.5, ry: 3.8, rot: 25, color: '#356a28' },
        { cx: 73.5, cy: 65, rx: 2.5, ry: 3.5, rot: -30, color: '#285220' },
        { cx: 69.5, cy: 62.5, rx: 2, ry: 3.2, rot: 10, color: '#3a7030' },
        { cx: 71, cy: 61, rx: 2.2, ry: 3.0, rot: -5, color: '#305828' },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={x(leaf.cx)} cy={y(leaf.cy)}
          rx={x(leaf.rx)} ry={y(leaf.ry)}
          fill={leaf.color}
          transform={`rotate(${leaf.rot},${x(leaf.cx)},${y(leaf.cy)})`}
          opacity={0.9 - i * 0.04}
        />
      ))}
      {/* Leaf veins */}
      <line x1={x(71)} y1={y(67)} x2={x(71)} y2={y(62)} stroke="rgba(80,160,60,0.25)" strokeWidth={0.7}/>

      {/* ═══════════════════════════════════════════════════════
          SIDE TABLE (marble top, brass cross legs)
      ═══════════════════════════════════════════════════════ */}
      {/* Shadow */}
      <ellipse cx={x(71)} cy={y(68.5)} rx={x(2.8)} ry={y(0.7)} fill="rgba(0,0,0,0.3)" filter="url(#blur3)"/>
      {/* Marble top */}
      <ellipse cx={x(71)} cy={y(67)} rx={x(2.5)} ry={y(0.7)} fill="url(#furn-marble)"/>
      <ellipse cx={x(71)} cy={y(67)} rx={x(2.5)} ry={y(0.7)} fill="none" stroke="#c8a86c" strokeWidth={0.8}/>
      {/* Legs (X cross) */}
      <line x1={x(68.8)} y1={y(67.5)} x2={x(69.5)} y2={y(69.5)} stroke="#c8a86c" strokeWidth={1.5}/>
      <line x1={x(73.2)} y1={y(67.5)} x2={x(72.5)} y2={y(69.5)} stroke="#c8a86c" strokeWidth={1.5}/>
      <line x1={x(69.5)} y1={y(69.5)} x2={x(72.5)} y2={y(69.5)} stroke="#c8a86c" strokeWidth={1}/>
      {/* Object on table */}
      <rect x={x(70)} y={y(65.5)} width={2} height={y(1.5)} fill="#8b6040" rx={0.5} opacity={0.7}/>

      {/* ═══════════════════════════════════════════════════════
          CEILING LIGHT FIXTURE
      ═══════════════════════════════════════════════════════ */}
      {/* Pendant body */}
      <ellipse cx={x(50)} cy={y(5.5)} rx={x(2.5)} ry={y(1.2)} fill="#c8a86c"/>
      <ellipse cx={x(50)} cy={y(5.5)} rx={x(2)} ry={y(0.8)} fill="#d4b878"/>
      {/* Wire */}
      <line x1={x(50)} y1={y(0)} x2={x(50)} y2={y(4.5)} stroke="#c8a86c" strokeWidth={1}/>
      {/* Glow ring */}
      <ellipse cx={x(50)} cy={y(5.5)} rx={x(12)} ry={y(5)} fill="rgba(255,220,120,0.04)"/>
      <ellipse cx={x(50)} cy={y(5.5)} rx={x(6)} ry={y(2.5)} fill="rgba(255,220,120,0.06)"/>
    </g>
  );
}
