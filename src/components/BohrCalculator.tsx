import { useState, useMemo, Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Atom3D from "@/components/Atom3D";
import EnergyLevelDiagram from "@/components/EnergyLevelDiagram";
import BohrTheory from "@/components/BohrTheory";

const A0 = 5.29e-11;
const RY = 1.097e7;

function energy(n: number, Z: number) { return -13.6 * Z ** 2 / n ** 2; }
function radius(n: number, Z: number) { return A0 * n ** 2 / Z; }
function wavelength(ni: number, nf: number, Z: number) {
  if (ni <= nf) return null;
  return 1e9 / (RY * Z ** 2 * (1 / nf ** 2 - 1 / ni ** 2));
}

function wavelengthToColor(nm: number): string {
  if (nm < 380) return "hsl(280, 80%, 60%)";
  if (nm < 490) return "hsl(220, 85%, 55%)";
  if (nm < 560) return "hsl(140, 85%, 45%)";
  if (nm < 600) return "hsl(50, 90%, 50%)";
  if (nm < 650) return "hsl(25, 95%, 50%)";
  return "hsl(0, 90%, 50%)";
}

function spectrumLabel(nm: number): string {
  if (nm < 380) return "Ultraviolet";
  if (nm < 450) return "Violet";
  if (nm < 490) return "Blue";
  if (nm < 560) return "Green";
  if (nm < 590) return "Yellow";
  if (nm < 650) return "Orange";
  if (nm < 780) return "Red";
  return "Infrared";
}

function ResultCard({ label, value, unit, color }: { label: string; value: string; unit: string; color?: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 border border-border p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="font-mono text-lg font-semibold" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground">{unit}</div>
    </div>
  );
}

export default function BohrCalculator() {
  const [Z, setZ] = useState(1);
  const [ni, setNi] = useState(3);
  const [nf, setNf] = useState(2);

  const results = useMemo(() => {
    if (Z < 1 || ni < 1 || nf < 1) return null;
    return {
      r: radius(ni, Z),
      Ei: energy(ni, Z),
      Ef: energy(nf, Z),
      lam: wavelength(ni, nf, Z),
    };
  }, [Z, ni, nf]);

  const photonColor = results?.lam ? wavelengthToColor(results.lam) : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(200, 90%, 55%) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Bohr Model <span className="text-primary text-glow-primary">Calculator</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Explore hydrogen-like atoms — drag the sliders to visualize electron transitions
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {/* Left: Visualization */}
          <div className="rounded-2xl bg-card/60 backdrop-blur border border-border p-6 glow-primary space-y-4">
            <Suspense fallback={<div className="w-full aspect-square max-h-[400px] rounded-2xl bg-secondary/30 flex items-center justify-center text-muted-foreground text-sm">Loading 3D model...</div>}>
              <Atom3D Z={Z} ni={ni} nf={nf} wavelengthNm={results?.lam ?? null} />
            </Suspense>
            <EnergyLevelDiagram ni={ni} nf={nf} Z={Z} wavelengthNm={results?.lam ?? null} />
          </div>

          {/* Right: Controls + Results */}
          <div className="space-y-6">
            {/* Sliders */}
            <div className="rounded-2xl bg-card/60 backdrop-blur border border-border p-6 space-y-6">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Parameters</div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-secondary-foreground">Atomic Number (Z)</Label>
                    <span className="font-mono text-sm text-primary font-semibold">{Z}</span>
                  </div>
                  <Slider min={1} max={10} step={1} value={[Z]} onValueChange={v => setZ(v[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-secondary-foreground">Initial Level (nᵢ)</Label>
                    <span className="font-mono text-sm text-primary font-semibold">{ni}</span>
                  </div>
                  <Slider min={1} max={7} step={1} value={[ni]} onValueChange={v => setNi(v[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-secondary-foreground">Final Level (nf)</Label>
                    <span className="font-mono text-sm text-accent font-semibold">{nf}</span>
                  </div>
                  <Slider min={1} max={7} step={1} value={[nf]} onValueChange={v => setNf(v[0])} />
                </div>
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="rounded-2xl bg-card/60 backdrop-blur border border-border p-6 space-y-4 animate-fade-in">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Results</div>

                <div className="grid grid-cols-2 gap-3">
                  <ResultCard label={`Radius (n=${ni})`} value={results.r.toExponential(3)} unit="meters" />
                  <ResultCard label={`Energy (n=${ni})`} value={results.Ei.toFixed(2)} unit="eV" />
                  <ResultCard label={`Energy (n=${nf})`} value={results.Ef.toFixed(2)} unit="eV" />
                  <ResultCard label="ΔE" value={Math.abs(results.Ei - results.Ef).toFixed(2)} unit="eV" />
                </div>

                {results.lam ? (
                  <div className="rounded-xl border border-border p-4 text-center space-y-2"
                    style={{ borderColor: photonColor ? `${photonColor.replace(")", " / 0.3)")}` : undefined }}>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emitted Photon</div>
                    <div className="font-mono text-2xl font-bold" style={{ color: photonColor }}>
                      {results.lam.toFixed(2)} <span className="text-sm font-normal">nm</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: photonColor }} />
                      {spectrumLabel(results.lam)}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border p-4 text-center text-sm text-muted-foreground">
                    {ni === nf ? "Same level — no transition" : "Absorption (nᵢ < nf) — swap levels for emission"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Theory Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-2xl bg-card/60 backdrop-blur border border-border p-6">
            <BohrTheory />
          </div>
        </div>
      </div>
    </div>
  );
}
