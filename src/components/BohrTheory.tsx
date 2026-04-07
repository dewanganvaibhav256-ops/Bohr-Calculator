import { useState } from "react";

const sections = [
  {
    title: "Bohr's Postulates",
    icon: "⚛️",
    content: [
      {
        heading: "1. Quantized Orbits",
        text: "Electrons revolve around the nucleus in certain discrete circular orbits called stationary states. While in these orbits, electrons do not radiate energy.",
      },
      {
        heading: "2. Angular Momentum Quantization",
        text: "The angular momentum of an electron in a stationary orbit is an integer multiple of ℏ (h/2π).",
        formula: "L = mvr = nℏ,  n = 1, 2, 3, ...",
      },
      {
        heading: "3. Energy Transitions",
        text: "An electron can jump from one orbit to another by absorbing or emitting a photon whose energy equals the energy difference between the two orbits.",
        formula: "ΔE = Eᵢ − E_f = hν",
      },
    ],
  },
  {
    title: "Key Formulas",
    icon: "📐",
    content: [
      {
        heading: "Orbital Radius",
        text: "The radius of the nth orbit for a hydrogen-like atom with atomic number Z:",
        formula: "rₙ = a₀ · n² / Z",
        detail: "where a₀ = 5.29 × 10⁻¹¹ m (Bohr radius)",
      },
      {
        heading: "Energy of nth Level",
        text: "The energy of an electron in the nth orbit:",
        formula: "Eₙ = −13.6 · Z² / n²  eV",
        detail: "Negative sign indicates bound state",
      },
      {
        heading: "Photon Wavelength",
        text: "When an electron transitions from nᵢ to n_f (nᵢ > n_f), it emits a photon:",
        formula: "1/λ = R_∞ · Z² · (1/n_f² − 1/nᵢ²)",
        detail: "R∞ = 1.097 × 10⁷ m⁻¹ (Rydberg constant)",
      },
    ],
  },
  {
    title: "Spectral Series",
    icon: "🌈",
    content: [
      {
        heading: "Lyman Series (n_f = 1)",
        text: "Transitions to n=1 produce ultraviolet radiation. These are the highest energy transitions in hydrogen.",
        formula: "λ range: 91.2 nm − 121.6 nm",
      },
      {
        heading: "Balmer Series (n_f = 2)",
        text: "Transitions to n=2 produce visible light. This series includes the famous Hα (red), Hβ (blue-green), and Hγ (violet) lines.",
        formula: "λ range: 364.6 nm − 656.3 nm",
      },
      {
        heading: "Paschen Series (n_f = 3)",
        text: "Transitions to n=3 produce infrared radiation, not visible to the human eye.",
        formula: "λ range: 820.4 nm − 1875 nm",
      },
      {
        heading: "Brackett & Pfund",
        text: "Higher series (n_f = 4, 5) produce far-infrared radiation with progressively lower energies.",
      },
    ],
  },
  {
    title: "Limitations",
    icon: "⚠️",
    content: [
      {
        heading: "Single-electron atoms only",
        text: "The Bohr model works well for hydrogen and hydrogen-like ions (He⁺, Li²⁺) but fails for multi-electron systems due to electron-electron interactions.",
      },
      {
        heading: "No fine structure",
        text: "Cannot explain the fine splitting of spectral lines caused by spin-orbit coupling and relativistic corrections.",
      },
      {
        heading: "Violates uncertainty principle",
        text: "The model assumes electrons have definite orbits with known position and momentum, violating Heisenberg's uncertainty principle.",
      },
    ],
  },
];

export default function BohrTheory() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <span className="text-primary text-glow-primary">📖</span>
        Bohr Model Theory
      </h2>
      <div className="space-y-2">
        {sections.map((section, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden bg-card/40 backdrop-blur">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span>{section.icon}</span>
                {section.title}
              </span>
              <span className="text-muted-foreground text-xs transition-transform" style={{
                transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
              }}>▼</span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 space-y-4 animate-fade-in">
                {section.content.map((item, j) => (
                  <div key={j} className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-primary">{item.heading}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                    {item.formula && (
                      <div className="font-mono text-xs bg-secondary/50 rounded-lg px-3 py-2 text-accent border border-border/50">
                        {item.formula}
                      </div>
                    )}
                    {"detail" in item && item.detail && (
                      <p className="text-[10px] text-muted-foreground italic">{item.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
