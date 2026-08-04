export const Logo = ({ className = "w-32" }: { className?: string }) => (
  <svg viewBox="0 0 200 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="green-stripes" width="3" height="3" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#106135" strokeWidth="1" />
      </pattern>
    </defs>
    
    {/* Gold Roof Outline */}
    <polyline points="50,55 100,25 150,55" stroke="#cca550" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
    <line x1="50" y1="55" x2="50" y2="65" stroke="#cca550" strokeWidth="2.5" />
    <line x1="150" y1="55" x2="150" y2="65" stroke="#cca550" strokeWidth="2.5" />

    {/* Striped Left Mountain (/) */}
    <polygon points="35,85 75,45 90,60 50,100" fill="url(#green-stripes)" />
    
    {/* Solid Right Mountain (Chevron ^) */}
    {/* Left leg goes from center peak (115,35) down-left to (80,70) */}
    {/* Right leg goes from center peak (115,35) down-right to (160,80) */}
    <polygon points="120,40 85,75 100,90 120,70 145,95 160,80" fill="#106135" />
    
    {/* Text: MARHABA HOME */}
    <text x="100" y="112" textAnchor="middle" fill="#106135" fontFamily="sans-serif" fontSize="13" fontWeight="900" letterSpacing="0.5">
      MARHABA HOME
    </text>
    
    {/* Gold Underline */}
    <polyline points="50,118 50,122 150,122 150,118" stroke="#cca550" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);
