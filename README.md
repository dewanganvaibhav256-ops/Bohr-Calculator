# Bohr Atomic Calculator
# Bohr Calculator ⚛️

A simple and interactive web application to calculate various parameters of the Bohr Model of an atom. This tool helps in finding the radius, velocity, and energy of an electron in different orbits for Hydrogen and Hydrogen-like species.

## 🚀 Live Demo
https://quantum-joy.lovable.app

## 🛠️ Features
- **Radius Calculation:** Find the radius of the $n^{th}$ orbit.
- **Velocity Calculation:** Determine the speed of an electron in a specific orbit.
- **Energy Calculation:** Calculate the total energy of an electron in electron-volts ($eV$).
- **Interactive UI:** Clean and responsive design for easy calculations.

## 📐 Formulas Used
The calculator is powered by the following Bohr's Model equations:

- **Radius ($r_n$):** $$r_n = 0.529 \times \frac{n^2}{Z} \, \text{}$$
- **Velocity ($v_n$):** $$v_n = 2.18 \times 10^6 \times \frac{Z}{n} \, \text{m/s}$$
- **Energy ($E_n$):** $$E_n = -13.6 \times \frac{Z^2}{n^2} \, \text{eV}$$

*Where n is the Principal Quantum Number and Z is the Atomic Number.*

## 💻 Technologies Used
- **HTML5:** Semantic structure.
- **CSS3:** Modern styling and layout.
- **JavaScript (ES6):** Calculation logic and DOM manipulation.

## 📂 Project Structure
```text
Bohr-Calculator/
├── index.html    # Main UI
├── style.css     # Styling
├── script.js    # Logic & Formulas
└── README.md     # Documentation
