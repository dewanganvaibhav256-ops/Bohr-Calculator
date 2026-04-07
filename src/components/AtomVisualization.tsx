import { useMemo } from "react";

interface AtomVisualizationProps {
  Z: number;
  ni: number;
  nf: number;
  wavelengthNm: number | null;
}

function wavelengthToColor(nm: number): string {
  if (nm < 380) return "hsl(280, 80%, 60%)"; // UV → purple
  if (nm < 440) return `hsl(${260 + (nm - 380) * (-200 / 60)}, 80%, 60%)`;
  if (nm < 490) return `hsl(${240 - (nm - 440) * (60 / 50)}, 85%, 55%)`;
  if (nm < 510) return `hsl(${180 - (nm - 490) * (60 / 20)}, 85%, 45%)`;
  if (nm < 580) return `hsl(${120 - (nm - 510) * (60 / 70)}, 90%, 50%)`;
  if (nm < 645) return `hsl(${60 - (nm - 580) * (45 / 65)}, 95%, 50%)`;
  if (nm < 780) return `hsl(${15 - (nm - 645) * (15 / 135)}, 100%, 50%)`;
  return "hsl(0, 80%, 40%)"; // IR → deep red
}

export default function AtomVisualization({ Z, ni, nf, wavelengthNm }: AtomVisualizationProps) {
  const maxLevel = Math.max(ni, nf, 4);
  const cx = 160, cy = 160;

  const orbits = useMemo(() => {
    const levels = new Set([ni, nf]);
    for (let i = 1; i <= Math.min(maxLevel, 6); i++) levels.add(i);
    return Array.from(levels).sort((a, b) => a - b);
  }, [ni, nf, maxLevel]);

  const getRadius = (n: number) => 25 + n * 22;
  const photonColor = wavelengthNm ? wavelengthToColor(wavelengthNm) : "hsl(200, 90%, 55%)";
  const isEmission = ni > nf;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[320px]">
        <defs>
          <radialGradient id="nucleus-glow">
            <stop offset="0%" stopColor="hsl(200, 90%, 55%)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(200, 90%, 55%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="photon-glow">
            <stop offset="0%" stopColor={photonColor} stopOpacity="0.9" />
            <stop offset="60%" stopColor={photonColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Nucleus glow */}
        <circle cx={cx} cy={cy} r="30" fill="url(#nucleus-glow)" />

        {/* Nucleus */}
        <circle cx={cx} cy={cy} r="8" fill="hsl(200, 90%, 55%)" opacity="0.9" filter="url(#glow)" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
          className="text-[8px] font-bold fill-primary-foreground select-none">{Z}</text>

        {/* Orbits */}
        {orbits.map(n => {
          const r = getRadius(n);
          const isActive = n === ni || n === nf;
          const isInitial = n === ni;
          return (
            <g key={n}>
              <circle cx={cx} cy={cy} r={r}
                fill="none"
                stroke={isActive ? (isInitial ? "hsl(200, 90%, 55%)" : "hsl(280, 70%, 60%)") : "hsl(228, 18%, 22%)"}
                strokeWidth={isActive ? 1.5 : 0.5}
                strokeDasharray={isActive ? "none" : "3 3"}
                opacity={isActive ? 0.8 : 0.4}
              />
              {/* Level label */}
              <text x={cx + r + 4} y={cy - 4}
                className="text-[9px] fill-muted-foreground select-none"
                opacity={0.6}>n={n}</text>

              {/* Orbiting electron on active levels */}
              {isActive && (
                <g style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  animation: `orbit ${2 + n * 0.8}s linear infinite${isInitial ? "" : " reverse"}`
                }}>
                  <circle cx={cx + r} cy={cy} r="4"
                    fill={isInitial ? "hsl(200, 90%, 55%)" : "hsl(280, 70%, 60%)"}
                    filter="url(#glow)" />
                  <circle cx={cx + r} cy={cy} r="8"
                    fill={isInitial ? "hsl(200, 90%, 55%)" : "hsl(280, 70%, 60%)"}
                    opacity="0.15" />
                </g>
              )}
            </g>
          );
        })}

        {/* Photon emission indicator */}
        {isEmission && wavelengthNm && (
          <g>
            {/* Arrow from ni orbit to nf orbit */}
            <line
              x1={cx} y1={cy - getRadius(ni)}
              x2={cx} y2={cy - getRadius(nf)}
              stroke={photonColor}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.6"
            />
            {/* Photon burst */}
            <circle cx={cx} cy={cy - getRadius(nf) - 15} r="6"
              fill="url(#photon-glow)"
              style={{ animation: "photon-emit 2s ease-out infinite" }}
            />
            <text x={cx} y={cy - getRadius(nf) - 28}
              textAnchor="middle"
              className="text-[8px] font-mono select-none"
              fill={photonColor}
              opacity="0.8"
              style={{ animation: "photon-emit 2s ease-out infinite" }}>
              γ
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
