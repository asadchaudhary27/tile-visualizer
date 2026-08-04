/**
 * BathroomFurniture — Luxury bathroom SVG objects.
 * Room: back wall x=28–72%, y=10–62%. Horizon at y=62%.
 */
interface Props { W: number; H: number; }

export default function BathroomFurniture({ W, H }: Props) {
  const x = (p: number) => p / 100 * W;
  const y = (p: number) => p / 100 * H;
  const pt = (pairs: [number, number][]) => pairs.map(([px, py]) => `${x(px)},${y(py)}`).join(' ');

  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <filter id="bath-blur4" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="bath-blur8" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8"/>
        </filter>

        {/* Bathtub white gradient */}
        <linearGradient id="bath-tub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8f7f5"/>
          <stop offset="100%" stopColor="#e8e6e2"/>
        </linearGradient>
        {/* Marble counter */}
        <linearGradient id="bath-marble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f2ec"/>
          <stop offset="50%" stopColor="#eeeae4"/>
          <stop offset="100%" stopColor="#f0ece6"/>
        </linearGradient>
        {/* Vanity cabinet */}
        <linearGradient id="bath-cabinet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2ede6"/>
          <stop offset="100%" stopColor="#ddd8d0"/>
        </linearGradient>
        {/* Tub interior */}
        <radialGradient id="bath-tub-inner" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#e8f2f8"/>
          <stop offset="100%" stopColor="#c8dce8"/>
        </radialGradient>
        {/* Mirror */}
        <radialGradient id="bath-mirror" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8f0f5"/>
          <stop offset="70%" stopColor="#c8d8e8"/>
          <stop offset="100%" stopColor="#a8c0d0"/>
        </radialGradient>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          SHOWER AREA — back-right corner, floor + glass partition
      ═══════════════════════════════════════════════════════ */}
      {/* Shower floor (slightly blue-gray tile tone) */}
      <polygon points={pt([[58,62],[72,62],[80,76],[60,77]])}
        fill="rgba(180,200,215,0.25)" stroke="rgba(180,200,215,0.4)" strokeWidth={0.8}/>
      {/* Glass partition line */}
      <line x1={x(58)} y1={y(62)} x2={x(60)} y2={y(77)}
        stroke="rgba(200,225,240,0.7)" strokeWidth={1.8} strokeDasharray="none"/>
      <line x1={x(58)} y1={y(62)} x2={x(58)} y2={y(62)}
        stroke="rgba(200,225,240,0.5)" strokeWidth={1}/>
      {/* Shower drain */}
      <ellipse cx={x(66)} cy={y(68)} rx={x(1.2)} ry={y(0.5)} fill="rgba(120,140,155,0.5)"/>
      {/* Rainfall shower head on right wall (line) */}
      <rect x={x(74)} y={y(28)} width={x(3)} height={y(0.8)} rx={2} fill="#b8c8d0" opacity={0.8}/>
      <line x1={x(75.5)} y1={y(28.8)} x2={x(75.5)} y2={y(36)} stroke="#b0c0cc" strokeWidth={1.2}/>
      {/* Water drops */}
      {[73.5, 75, 76.5].map((dx, i) => (
        <line key={i} x1={x(dx)} y1={y(37)} x2={x(dx)} y2={y(39)} stroke="rgba(200,230,245,0.4)" strokeWidth={0.8}/>
      ))}

      {/* ═══════════════════════════════════════════════════════
          DOUBLE VANITY — back wall, left-center
      ═══════════════════════════════════════════════════════ */}
      {/* Vanity cabinet body */}
      <polygon points={pt([[28,48],[60,48],[60,62],[28,62]])} fill="url(#bath-cabinet)"/>
      {/* Cabinet door lines */}
      <line x1={x(44)} y1={y(48)} x2={x(44)} y2={y(62)} stroke="rgba(0,0,0,0.08)" strokeWidth={1}/>
      <line x1={x(36)} y1={y(48)} x2={x(36)} y2={y(62)} stroke="rgba(0,0,0,0.06)" strokeWidth={0.7}/>
      <line x1={x(52)} y1={y(48)} x2={x(52)} y2={y(62)} stroke="rgba(0,0,0,0.06)" strokeWidth={0.7}/>
      <line x1={x(28)} y1={y(55)} x2={x(60)} y2={y(55)} stroke="rgba(0,0,0,0.05)" strokeWidth={0.6}/>
      {/* Vanity handles */}
      {[34, 40.5, 47.5, 54].map((hx, i) => (
        <ellipse key={i} cx={x(hx)} cy={y(52)} rx={x(0.7)} ry={y(0.3)} fill="rgba(200,168,108,0.7)"/>
      ))}
      {/* Marble counter top */}
      <polygon points={pt([[27.5,47],[60.5,47],[60.5,48.5],[27.5,48.5]])} fill="url(#bath-marble)"/>
      {/* Marble veins */}
      <line x1={x(32)} y1={y(47)} x2={x(44)} y2={y(48)} stroke="rgba(180,170,155,0.5)" strokeWidth={0.4}/>
      <line x1={x(48)} y1={y(47)} x2={x(58)} y2={y(48)} stroke="rgba(180,170,155,0.4)" strokeWidth={0.3}/>
      {/* Counter top face (3D) */}
      <polygon points={pt([[27.5,47],[60.5,47],[60.5,47.5],[27.5,47.5]])} fill="rgba(255,255,255,0.3)"/>

      {/* Two sinks in counter */}
      {[36, 52].map((sx, i) => (
        <g key={i}>
          {/* Sink basin */}
          <ellipse cx={x(sx)} cy={y(47.7)} rx={x(4.5)} ry={y(1.2)} fill="#d8e8f0" stroke="rgba(180,200,215,0.6)" strokeWidth={0.8}/>
          {/* Sink drain */}
          <ellipse cx={x(sx)} cy={y(47.8)} rx={x(0.8)} ry={y(0.3)} fill="rgba(150,160,170,0.6)"/>
          {/* Faucet */}
          <rect x={x(sx)-1} y={y(45)} width={2} height={y(2)} fill="#c8a86c" rx={1}/>
          <ellipse cx={x(sx)} cy={y(45)} rx={x(1.5)} ry={y(0.5)} fill="#c8a86c"/>
        </g>
      ))}

      {/* ═══════════════════════════════════════════════════════
          MIRROR — back wall, above vanity
      ═══════════════════════════════════════════════════════ */}
      {/* Mirror glow on wall */}
      <ellipse cx={x(44)} cy={y(28)} rx={x(11)} ry={y(14)} fill="rgba(220,235,245,0.15)"/>
      {/* Mirror frame outer */}
      <ellipse cx={x(44)} cy={y(28)} rx={x(10)} ry={y(13)} fill="none" stroke="#c8a86c" strokeWidth={2.5}/>
      {/* Mirror surface */}
      <ellipse cx={x(44)} cy={y(28)} rx={x(9.5)} ry={y(12.5)} fill="url(#bath-mirror)"/>
      {/* Mirror reflection highlight */}
      <ellipse cx={x(40)} cy={y(22)} rx={x(2.5)} ry={y(3)} fill="rgba(255,255,255,0.2)"/>
      {/* Inner frame detail */}
      <ellipse cx={x(44)} cy={y(28)} rx={x(9.5)} ry={y(12.5)} fill="none" stroke="rgba(200,168,108,0.3)" strokeWidth={1}/>

      {/* Mirror light strip above */}
      <rect x={x(34)} y={y(13.5)} width={x(20)} height={y(1)} rx={2} fill="#fffbe8" opacity={0.9}/>
      <rect x={x(34)} y={y(13.5)} width={x(20)} height={y(2)} rx={2} fill="rgba(255,245,200,0.12)"/>

      {/* ═══════════════════════════════════════════════════════
          TOILET — back wall, right side
      ═══════════════════════════════════════════════════════ */}
      {/* Tank shadow */}
      <rect x={x(62)} y={y(47)} width={x(9)} height={y(10)} rx={2} fill="rgba(0,0,0,0.1)" filter="url(#bath-blur4)"/>
      {/* Tank */}
      <rect x={x(62)} y={y(46)} width={x(9)} height={y(10)} rx={2} fill="#f0ede8"/>
      <rect x={x(62)} y={y(46)} width={x(9)} height={y(1)} rx={1} fill="rgba(255,255,255,0.4)"/>
      {/* Tank lid detail */}
      <rect x={x(62.5)} y={y(46.2)} width={x(8)} height={y(0.8)} rx={1} fill="#e8e5e0"/>
      {/* Bowl (on floor just below wall) */}
      <ellipse cx={x(66.5)} cy={y(62)} rx={x(4.5)} ry={y(2)} fill="#f0ede8"/>
      <ellipse cx={x(66.5)} cy={y(62)} rx={x(3.5)} ry={y(1.5)} fill="#e8ecf0"/>
      {/* Toilet seat */}
      <ellipse cx={x(66.5)} cy={y(61.5)} rx={x(4)} ry={y(1.8)} fill="none" stroke="#ddd8d0" strokeWidth={1.5}/>
      {/* Flush button */}
      <ellipse cx={x(66.5)} cy={y(46.8)} rx={x(1)} ry={y(0.4)} fill="#c8a86c" opacity={0.7}/>

      {/* ═══════════════════════════════════════════════════════
          FREESTANDING BATHTUB — center-left of floor
      ═══════════════════════════════════════════════════════ */}
      {/* Tub floor shadow */}
      <ellipse cx={x(42)} cy={y(80)} rx={x(16)} ry={y(4)} fill="rgba(0,0,0,0.25)" filter="url(#bath-blur8)"/>

      {/* Tub outer body (perspective trapezoid with rounded ends) */}
      <path
        d={`
          M ${x(29)},${y(70)}
          Q ${x(29)},${y(67)} ${x(32)},${y(67)}
          L ${x(52)},${y(67)}
          Q ${x(56)},${y(67)} ${x(56)},${y(70)}
          L ${x(58)},${y(83)}
          Q ${x(58)},${y(87)} ${x(54)},${y(87)}
          L ${x(28)},${y(87)}
          Q ${x(24)},${y(87)} ${x(24)},${y(83)}
          Z
        `}
        fill="url(#bath-tub)"
        stroke="rgba(200,195,188,0.5)"
        strokeWidth={1}
      />

      {/* Tub interior (water/empty basin view from above-angle) */}
      <path
        d={`
          M ${x(31)},${y(71.5)}
          Q ${x(31)},${y(69.5)} ${x(33.5)},${y(69.5)}
          L ${x(51)},${y(69.5)}
          Q ${x(54.5)},${y(69.5)} ${x(54.5)},${y(71.5)}
          L ${x(56)},${y(82)}
          Q ${x(56)},${y(85)} ${x(52.5)},${y(85)}
          L ${x(28.5)},${y(85)}
          Q ${x(25.5)},${y(85)} ${x(25.5)},${y(82)}
          Z
        `}
        fill="url(#bath-tub-inner)"
      />

      {/* Tub rim highlight (top edge) */}
      <path
        d={`M ${x(32)},${y(67)} L ${x(52)},${y(67)}`}
        fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}
      />

      {/* Tub faucet/spout (at the back end, y=67%) */}
      <rect x={x(42)-2} y={y(64.5)} width={4} height={y(2.5)} fill="#c8a86c" rx={1}/>
      <rect x={x(40)} y={y(64)} width={x(4)} height={y(1)} rx={2} fill="#d4b878"/>
      {/* Hot/cold knobs */}
      <ellipse cx={x(39.5)} cy={y(65.5)} rx={x(0.8)} ry={y(0.4)} fill="#c8a86c"/>
      <ellipse cx={x(44.5)} cy={y(65.5)} rx={x(0.8)} ry={y(0.4)} fill="#c8a86c"/>

      {/* Tub floor mat in front */}
      <polygon points={pt([[30,88],[58,88],[54,95],[26,95]])}
        fill="rgba(180,165,140,0.4)" stroke="rgba(150,135,115,0.4)" strokeWidth={1}/>

      {/* ═══════════════════════════════════════════════════════
          TOWEL HOOKS / RAIL — right wall
      ═══════════════════════════════════════════════════════ */}
      {/* Towel rail bar */}
      <line x1={x(73)} y1={y(38)} x2={x(90)} y2={y(34)} stroke="#c8a86c" strokeWidth={2}/>
      {/* Rail wall mounts */}
      <ellipse cx={x(73.5)} cy={y(38)} rx={x(0.8)} ry={y(0.4)} fill="#c8a86c"/>
      <ellipse cx={x(89.5)} cy={y(34.2)} rx={x(0.8)} ry={y(0.4)} fill="#c8a86c"/>
      {/* Hanging towel */}
      <polygon points={`${x(78)},${y(36)} ${x(83)},${y(35)} ${x(83)},${y(50)} ${x(78)},${y(51)}`}
        fill="#e8d0c0" opacity={0.85}/>
      <line x1={x(80.5)} y1={y(35.5)} x2={x(80.5)} y2={y(50.5)} stroke="rgba(210,190,170,0.5)" strokeWidth={0.5}/>

      {/* ═══════════════════════════════════════════════════════
          PLANTS — left corner
      ═══════════════════════════════════════════════════════ */}
      {/* Small succulent on vanity counter */}
      <ellipse cx={x(57.5)} cy={y(46.2)} rx={x(1.2)} ry={y(0.9)} fill="#3a6a28"/>
      <ellipse cx={x(57.5)} cy={y(45.2)} rx={x(0.8)} ry={y(0.7)} fill="#4a8030"/>

      {/* Floor plant, left side */}
      <polygon points={pt([[0,92],[8,92],[7,95],[0,96]])} fill="#c8a870" opacity={0.8}/>
      {[
        [3.5, 88, 2.5, 4.5], [1.5, 89.5, 2, 3.8], [5.5, 89, 2, 3.5],
        [3.5, 86, 2, 3.2], [2, 84.5, 1.5, 2.8]
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={x(cx)} cy={y(cy)} rx={x(rx)} ry={y(ry)}
          fill={i % 2 === 0 ? '#2a5020' : '#356828'}
          transform={`rotate(${i*15 - 20},${x(cx)},${y(cy)})`}
          opacity={0.9}/>
      ))}
      <line x1={x(3.5)} y1={y(92)} x2={x(3.5)} y2={y(86)} stroke="#3a6028" strokeWidth={1.5}/>

      {/* ═══════════════════════════════════════════════════════
          CEILING — recessed lights
      ═══════════════════════════════════════════════════════ */}
      {[35, 50, 65].map((lx, i) => (
        <g key={i}>
          <ellipse cx={x(lx)} cy={y(5)} rx={x(2)} ry={y(0.8)} fill="#fff8e8" opacity={0.8}/>
          <ellipse cx={x(lx)} cy={y(5)} rx={x(4)} ry={y(2)} fill="rgba(255,245,200,0.08)"/>
        </g>
      ))}
    </g>
  );
}
