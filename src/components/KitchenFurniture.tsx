/**
 * KitchenFurniture — Modern luxury kitchen SVG objects.
 * Room: back wall x=28–72%, y=10–62%. Horizon at y=62%.
 */
interface Props { W: number; H: number; }

export default function KitchenFurniture({ W, H }: Props) {
  const x = (p: number) => p / 100 * W;
  const y = (p: number) => p / 100 * H;
  const pt = (pairs: [number, number][]) => pairs.map(([px, py]) => `${x(px)},${y(py)}`).join(' ');

  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <filter id="kit-blur4" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="kit-blur7" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7"/>
        </filter>

        {/* White shaker cabinet */}
        <linearGradient id="kit-cabinet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f4f2"/>
          <stop offset="100%" stopColor="#e8e5e0"/>
        </linearGradient>
        {/* Marble counter */}
        <linearGradient id="kit-counter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0ece4"/>
          <stop offset="50%" stopColor="#e8e3db"/>
          <stop offset="100%" stopColor="#ece8e0"/>
        </linearGradient>
        {/* Black island */}
        <linearGradient id="kit-island" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252525"/>
          <stop offset="100%" stopColor="#181818"/>
        </linearGradient>
        {/* Island counter (marble) */}
        <linearGradient id="kit-island-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8e0d0"/>
          <stop offset="100%" stopColor="#d8d0c0"/>
        </linearGradient>
        {/* Stainless */}
        <linearGradient id="kit-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8b8b8"/>
          <stop offset="40%" stopColor="#d0d0d0"/>
          <stop offset="100%" stopColor="#b0b0b0"/>
        </linearGradient>
        {/* Fridge */}
        <linearGradient id="kit-fridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8c8c6"/>
          <stop offset="50%" stopColor="#e0e0de"/>
          <stop offset="100%" stopColor="#c0c0be"/>
        </linearGradient>
        {/* Range hood */}
        <linearGradient id="kit-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0b0ae"/>
          <stop offset="100%" stopColor="#909090"/>
        </linearGradient>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          REFRIGERATOR — right side of back wall (full height)
      ═══════════════════════════════════════════════════════ */}
      {/* Fridge body */}
      <polygon points={pt([[63,11],[72,11],[72,62],[63,62]])} fill="url(#kit-fridge)"/>
      {/* Fridge door line (French door) */}
      <line x1={x(67.5)} y1={y(11)} x2={x(67.5)} y2={y(62)} stroke="rgba(0,0,0,0.12)" strokeWidth={1}/>
      <line x1={x(63)} y1={y(36)} x2={x(72)} y2={y(36)} stroke="rgba(0,0,0,0.1)" strokeWidth={0.8}/>
      {/* Handles */}
      <line x1={x(64.5)} y1={y(20)} x2={x(64.5)} y2={y(28)} stroke="rgba(180,168,150,0.9)" strokeWidth={2} strokeLinecap="round"/>
      <line x1={x(64.5)} y1={y(40)} x2={x(64.5)} y2={y(48)} stroke="rgba(180,168,150,0.9)" strokeWidth={2} strokeLinecap="round"/>
      {/* Fridge reflection highlight */}
      <polygon points={pt([[63.5,12],[65.5,12],[65.5,61],[63.5,61]])} fill="rgba(255,255,255,0.08)"/>
      {/* Ice maker line */}
      <line x1={x(67.8)} y1={y(37)} x2={x(71.8)} y2={y(37)} stroke="rgba(0,0,0,0.07)" strokeWidth={0.5}/>

      {/* ═══════════════════════════════════════════════════════
          UPPER CABINETS — back wall, spanning left to fridge
      ═══════════════════════════════════════════════════════ */}
      {/* Cabinet row body */}
      <polygon points={pt([[28,12],[63,12],[63,32],[28,32]])} fill="url(#kit-cabinet)"/>
      {/* Cabinet doors (5 doors) */}
      {[28, 35, 42, 49, 56].map((cx, i) => (
        <g key={i}>
          {/* Door panel */}
          <polygon points={pt([[cx+0.4,12.5],[cx+6.6,12.5],[cx+6.6,31.5],[cx+0.4,31.5]])}
            fill="url(#kit-cabinet)"/>
          {/* Inner panel inset */}
          <polygon points={pt([[cx+1.2,14],[cx+5.8,14],[cx+5.8,30],[cx+1.2,30]])}
            fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={0.8}/>
          {/* Handle */}
          <line x1={x(cx+3)} y1={y(21)} x2={x(cx+4)} y2={y(21)} stroke="rgba(180,168,140,0.8)" strokeWidth={1.5} strokeLinecap="round"/>
        </g>
      ))}
      {/* Cabinet bottom edge shadow */}
      <line x1={x(28)} y1={y(32)} x2={x(63)} y2={y(32)} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5}/>

      {/* ═══════════════════════════════════════════════════════
          BACKSPLASH — between upper and lower cabinets
      ═══════════════════════════════════════════════════════ */}
      <polygon points={pt([[28,32],[63,32],[63,44],[28,44]])} fill="#e8e4de"/>
      {/* Subway tile grid lines on backsplash */}
      {[32.5, 33.5, 34.5, 35.5, 36.5, 37.5, 38.5, 39.5, 40.5, 41.5, 42.5, 43.5].map((yl, i) => (
        <line key={i} x1={x(28)} y1={y(yl)} x2={x(63)} y2={y(yl)} stroke="rgba(200,195,188,0.4)" strokeWidth={0.4}/>
      ))}
      {[30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62].map((xl, i) => (
        <line key={i} x1={x(xl)} y1={y(32)} x2={x(xl)} y2={y(44)} stroke="rgba(200,195,188,0.3)" strokeWidth={0.3}/>
      ))}

      {/* ═══════════════════════════════════════════════════════
          RANGE HOOD — center of back wall
      ═══════════════════════════════════════════════════════ */}
      {/* Hood body (tapered) */}
      <polygon points={pt([[38,28],[55,28],[57,44],[36,44]])} fill="url(#kit-hood)"/>
      {/* Hood top */}
      <polygon points={pt([[38,28],[55,28],[54.5,32],[38.5,32]])} fill="rgba(180,180,178,0.5)"/>
      {/* Hood bottom edge with vent */}
      <polygon points={pt([[36,44],[57,44],[57,45],[36,45]])} fill="rgba(80,80,80,0.4)"/>
      {/* Hood vent slits */}
      {[37.5, 40, 42.5, 45, 47.5, 50, 52.5].map((lx, i) => (
        <line key={i} x1={x(lx)} y1={y(44)} x2={x(lx+1.5)} y2={y(45)} stroke="rgba(0,0,0,0.2)" strokeWidth={0.5}/>
      ))}
      {/* Range light underneath */}
      <polygon points={pt([[37,44.5],[56,44.5],[56,45],[37,45]])} fill="rgba(255,248,200,0.3)"/>
      {/* Hood duct going to ceiling */}
      <polygon points={pt([[44,12],[49,12],[49,28],[44,28]])} fill="url(#kit-steel)"/>

      {/* ═══════════════════════════════════════════════════════
          LOWER CABINETS + COUNTER — along back wall
      ═══════════════════════════════════════════════════════ */}
      {/* Lower cabinet body */}
      <polygon points={pt([[28,45],[63,45],[63,62],[28,62]])} fill="url(#kit-cabinet)"/>
      {/* Cabinet doors (5) */}
      {[28, 35, 42, 49, 56].map((cx, i) => (
        <g key={i}>
          <polygon points={pt([[cx+0.4,45.5],[cx+6.6,45.5],[cx+6.6,61.5],[cx+0.4,61.5]])}
            fill="url(#kit-cabinet)"/>
          <polygon points={pt([[cx+1.2,47],[cx+5.8,47],[cx+5.8,60.5],[cx+1.2,60.5]])}
            fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={0.8}/>
          <line x1={x(cx+3)} y1={y(54)} x2={x(cx+4)} y2={y(54)} stroke="rgba(180,168,140,0.8)" strokeWidth={1.5} strokeLinecap="round"/>
        </g>
      ))}
      {/* Counter top (marble) */}
      <polygon points={pt([[27.5,44],[63.5,44],[63.5,45.5],[27.5,45.5]])} fill="url(#kit-counter)"/>
      {/* Counter edge highlight */}
      <polygon points={pt([[27.5,44],[63.5,44],[63.5,44.5],[27.5,44.5]])} fill="rgba(255,255,255,0.4)"/>

      {/* ═══════════════════════════════════════════════════════
          COOKTOP — on counter surface
      ═══════════════════════════════════════════════════════ */}
      <polygon points={pt([[36,44],[60,44],[60,45.5],[36,45.5]])} fill="#2a2a2a"/>
      {/* 4 burners */}
      {[[39,44.7],[43,44.7],[52,44.7],[56,44.7]].map(([bx,by],i) => (
        <g key={i}>
          <ellipse cx={x(bx)} cy={y(by)} rx={x(1.5)} ry={y(0.5)} fill="rgba(60,60,60,0.8)"/>
          <ellipse cx={x(bx)} cy={y(by)} rx={x(1)} ry={y(0.33)} fill="rgba(40,40,40,0.9)"/>
          <ellipse cx={x(bx)} cy={y(by)} rx={x(0.4)} ry={y(0.15)} fill="#505050"/>
        </g>
      ))}
      {/* Sink on counter (right side) */}
      <polygon points={pt([[37,44.1],[44.5,44.1],[44.5,45.4],[37,45.4]])} fill="#c0d8e8"/>
      <ellipse cx={x(40.75)} cy={y(44.6)} rx={x(0.6)} ry={y(0.2)} fill="rgba(100,130,150,0.6)"/>
      {/* Sink faucet */}
      <rect x={x(40.25)} y={y(42.5)} width={x(1)} height={y(1.5)} fill="#c8a86c" rx={0.5}/>

      {/* ═══════════════════════════════════════════════════════
          KITCHEN ISLAND — center of floor
      ═══════════════════════════════════════════════════════ */}
      {/* Island floor shadow */}
      <ellipse cx={x(50)} cy={y(81)} rx={x(21)} ry={y(3)} fill="rgba(0,0,0,0.25)" filter="url(#kit-blur7)"/>

      {/* Island body (dark matte black) */}
      <polygon points={pt([[32,69],[68,69],[66,81],[34,81]])} fill="url(#kit-island)"/>
      {/* Island front face (viewer-facing) */}
      <polygon points={pt([[34,81],[66,81],[65,85],[35,85]])} fill="#1e1e1e"/>
      {/* Island top (marble) */}
      <polygon points={pt([[31.5,68],[68.5,68],[68,69],[32,69]])} fill="url(#kit-island-top)"/>
      {/* Counter top edge highlight */}
      <polygon points={pt([[31.5,68],[68.5,68],[68.5,68.5],[31.5,68.5]])} fill="rgba(255,255,255,0.25)"/>
      {/* Island top marble veins */}
      <line x1={x(36)} y1={y(68.2)} x2={x(50)} y2={y(68.8)} stroke="rgba(160,148,130,0.4)" strokeWidth={0.5}/>
      <line x1={x(54)} y1={y(68.1)} x2={x(65)} y2={y(68.7)} stroke="rgba(160,148,130,0.3)" strokeWidth={0.4}/>
      {/* Island front panel lines */}
      <line x1={x(48)} y1={y(81)} x2={x(48.5)} y2={y(85)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.8}/>
      {/* Island handle on front */}
      <line x1={x(40)} y1={y(83)} x2={x(46)} y2={y(83)} stroke="rgba(200,180,140,0.6)" strokeWidth={1.5} strokeLinecap="round"/>
      <line x1={x(54)} y1={y(83)} x2={x(60)} y2={y(83)} stroke="rgba(200,180,140,0.6)" strokeWidth={1.5} strokeLinecap="round"/>
      {/* Island legs */}
      {([[34,85],[47,85],[53,85],[66,85]] as [number,number][]).map(([lx,ly],i) => (
        <rect key={i} x={x(lx)-1.5} y={y(ly)} width={3} height={y(3)} fill="#141414" rx={0.5}/>
      ))}
      {/* Objects on island */}
      {/* Cutting board */}
      <polygon points={pt([[46,68.2],[56,68.2],[55.8,68.8],[46.2,68.8]])} fill="#8b6040" opacity={0.7} rx={1}/>
      {/* Knife block */}
      <rect x={x(60)} y={y(66.5)} width={x(3)} height={y(1.5)} fill="#4a3a28" rx={1} opacity={0.8}/>
      {/* Bowl/fruit */}
      <ellipse cx={x(41)} cy={y(68.5)} rx={x(2)} ry={y(0.8)} fill="#c8a86c" opacity={0.6}/>

      {/* ═══════════════════════════════════════════════════════
          BAR STOOLS — in front of island
      ═══════════════════════════════════════════════════════ */}
      {[37, 50, 63].map((sx, i) => {
        const seatY = 85.5;
        return (
          <g key={i}>
            {/* Stool shadow */}
            <ellipse cx={x(sx)} cy={y(92)} rx={x(2.5)} ry={y(0.8)} fill="rgba(0,0,0,0.2)" filter="url(#kit-blur4)"/>
            {/* Stool seat (round) */}
            <ellipse cx={x(sx)} cy={y(seatY)} rx={x(3)} ry={y(1)} fill="#1e1e1e"/>
            <ellipse cx={x(sx)} cy={y(seatY)} rx={x(2.6)} ry={y(0.85)} fill="#2a2a2a"/>
            {/* Seat pad */}
            <ellipse cx={x(sx)} cy={y(seatY-0.3)} rx={x(2.2)} ry={y(0.7)} fill="#3a3028"/>
            {/* Seat highlight */}
            <ellipse cx={x(sx-0.8)} cy={y(seatY-0.7)} rx={x(0.8)} ry={y(0.25)} fill="rgba(255,255,255,0.05)"/>
            {/* Center post */}
            <line x1={x(sx)} y1={y(seatY+0.8)} x2={x(sx)} y2={y(91)} stroke="#c8a86c" strokeWidth={2} strokeLinecap="round"/>
            {/* Cross footrest */}
            <ellipse cx={x(sx)} cy={y(90)} rx={x(2)} ry={y(0.5)} fill="none" stroke="#c8a86c" strokeWidth={1.2}/>
            {/* Base */}
            <ellipse cx={x(sx)} cy={y(91.5)} rx={x(2.5)} ry={y(0.6)} fill="#c8a86c" opacity={0.8}/>
          </g>
        );
      })}

      {/* ═══════════════════════════════════════════════════════
          PENDANT LIGHTS — above island
      ═══════════════════════════════════════════════════════ */}
      {[38, 50, 62].map((lx, i) => (
        <g key={i}>
          {/* Wire from ceiling */}
          <line x1={x(lx)} y1={y(0)} x2={x(lx)} y2={y(14)} stroke="#c8a86c" strokeWidth={0.8}/>
          {/* Shade */}
          <polygon points={`${x(lx-1.8)},${y(14)} ${x(lx+1.8)},${y(14)} ${x(lx+2.8)},${y(18)} ${x(lx-2.8)},${y(18)}`}
            fill="#c8a86c"/>
          {/* Light cone glow */}
          <ellipse cx={x(lx)} cy={y(18)} rx={x(3)} ry={y(1.2)} fill="rgba(255,248,200,0.12)"/>
          <ellipse cx={x(lx)} cy={y(19)} rx={x(6)} ry={y(2.5)} fill="rgba(255,248,200,0.06)"/>
        </g>
      ))}

      {/* ═══════════════════════════════════════════════════════
          WINDOW OVER SINK — left wall suggestion
      ═══════════════════════════════════════════════════════ */}
      {/* Window light on floor */}
      <polygon points={`${x(0)},${y(62)} ${x(28)},${y(62)} ${x(22)},${y(80)} ${x(0)},${y(85)}`}
        fill="rgba(220,235,255,0.05)"/>

      {/* ═══════════════════════════════════════════════════════
          DECORATIVE ITEMS
      ═══════════════════════════════════════════════════════ */}
      {/* Potted herb on counter */}
      <ellipse cx={x(57)} cy={y(43.5)} rx={x(1.5)} ry={y(0.7)} fill="#a0c878"/>
      <ellipse cx={x(57)} cy={y(42.5)} rx={x(1)} ry={y(0.6)} fill="#78a850"/>
      <rect x={x(56)} y={y(43.5)} width={x(2)} height={y(1)} fill="#d0c8b8" rx={1} opacity={0.8}/>
    </g>
  );
}
