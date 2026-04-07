interface EnergyLevelDiagramProps {
  ni: number;
  nf: number;
  Z: number;
  wavelengthNm: number | null;
}

function energyEv(n: number, Z: number) {
  return -13.6 * Z ** 2 / n ** 2;
}

function wavelengthToColor(nm: number): string {
  if (nm < 380) return "hsl(280, 80%, 60%)";
  if (nm < 490) return "hsl(220, 85%, 55%)";
  if (nm < 560) return "hsl(140, 85%, 45%)";
  if (nm < 600) return "hsl(50, 90%, 50%)";
  if (nm < 650) return "hsl(25, 95%, 50%)";
  return "hsl(0, 90%, 50%)";
}

export default function EnergyLevelDiagram({ ni, nf, Z, wavelengthNm }: EnergyLevelDiagramProps) {
  const maxN = Math.max(ni, nf, 4);
  const levels = Array.from({ length: maxN }, (_, i) => i + 1);
  const energies = levels.map(n => energyEv(n, Z));
  const minE = energies[0];
  const maxE = energies[energies.length - 1];
  const range = maxE - minE || 1;

  const getY = (n: number) => {
    const e = energyEv(n, Z);
    return 90 - ((e - minE) / range) * 80;
  };

  const photonColor = wavelengthNm ? wavelengthToColor(wavelengthNm) : "hsl(200, 90%, 55%)";
  const isEmission = ni > nf;

  return (
    <div className="w-full">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Energy Levels
      </div>
      <svg viewBox="0 0 200 100" className="w-full" style={{ maxHeight: 180 }}>
        {/* Energy levels */}
        {levels.map(n => {
          const y = getY(n);
          const isActive = n === ni || n === nf;
          const isNi = n === ni;
          const isNf = n === nf;
          const e = energyEv(n, Z);
          return (
            <g key={n}>
              <line x1="40" y1={y} x2="160" y2={y}
                stroke={isNi ? "hsl(200, 90%, 55%)" : isNf ? "hsl(280, 70%, 60%)" : "hsl(228, 18%, 25%)"}
                strokeWidth={isActive ? 2 : 0.8}
                opacity={isActive ? 1 : 0.5}
              />
              <text x="12" y={y + 1} dominantBaseline="central"
                className="text-[7px] font-mono select-none"
                fill={isActive ? "hsl(210, 30%, 92%)" : "hsl(215, 15%, 50%)"}
              >n={n}</text>
              <text x="188" y={y + 1} dominantBaseline="central" textAnchor="end"
                className="text-[6px] font-mono select-none"
                fill={isActive ? "hsl(210, 30%, 92%)" : "hsl(215, 15%, 50%)"}
                opacity={0.7}
              >{e.toFixed(1)}</text>
            </g>
          );
        })}

        {/* Transition arrow */}
        {isEmission && (
          <g>
            <line x1="100" y1={getY(ni) - 2} x2="100" y2={getY(nf) + 2}
              stroke={photonColor}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              opacity="0.8"
            />
            {/* Wavy photon */}
            <path
              d={`M 110 ${(getY(ni) + getY(nf)) / 2} q 5 -4 10 0 q 5 4 10 0 q 5 -4 10 0`}
              fill="none"
              stroke={photonColor}
              strokeWidth="1.5"
              opacity="0.6"
              className="animate-pulse-glow"
            />
          </g>
        )}

        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={photonColor} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
