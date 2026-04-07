import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Atom } from "lucide-react";

const RY = 1.097e7; // Rydberg constant (m^-1)
const A0 = 5.29e-11; // Bohr radius (m)

function energy(n: number, Z: number) {
  return -13.6 * Z ** 2 / n ** 2;
}

function radius(n: number, Z: number) {
  return A0 * n ** 2 / Z;
}

function wavelength(ni: number, nf: number, Z: number) {
  if (ni <= nf) return null;
  const inv = RY * Z ** 2 * (1 / nf ** 2 - 1 / ni ** 2);
  return 1e9 / inv; // nm
}

function ResultRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground">
        {value} <span className="text-muted-foreground font-normal">{unit}</span>
      </span>
    </div>
  );
}

export default function BohrCalculator() {
  const [Z, setZ] = useState(1);
  const [ni, setNi] = useState(3);
  const [nf, setNf] = useState(2);

  const results = useMemo(() => {
    if (Z < 1 || ni < 1 || nf < 1) return null;
    const r = radius(ni, Z);
    const Ei = energy(ni, Z);
    const Ef = energy(nf, Z);
    const lam = wavelength(ni, nf, Z);
    return { r, Ei, Ef, lam };
  }, [Z, ni, nf]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
            <Atom className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bohr Model Calculator</h1>
          <p className="text-sm text-muted-foreground">Calculate energy levels, orbital radii, and transition wavelengths</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="z" className="text-xs">Atomic Number (Z)</Label>
                <Input id="z" type="number" min={1} value={Z} onChange={e => setZ(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ni" className="text-xs">Initial Level (nᵢ)</Label>
                <Input id="ni" type="number" min={1} value={ni} onChange={e => setNi(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nf" className="text-xs">Final Level (n_f)</Label>
                <Input id="nf" type="number" min={1} value={nf} onChange={e => setNf(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultRow label={`Radius (n=${ni})`} value={results.r.toExponential(3)} unit="m" />
              <ResultRow label={`Energy (n=${ni})`} value={results.Ei.toFixed(2)} unit="eV" />
              <ResultRow label={`Energy (n=${nf})`} value={results.Ef.toFixed(2)} unit="eV" />
              {results.lam ? (
                <ResultRow label="Wavelength" value={results.lam.toFixed(2)} unit="nm" />
              ) : (
                <div className="py-3 text-sm text-destructive">
                  Invalid transition (nᵢ must be &gt; n_f)
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
