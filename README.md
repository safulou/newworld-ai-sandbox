# NewWorld AI Sandbox 🌍

**An open-source, browser-based voxel sandbox where prompts become playable worlds.**

> Type a sentence. Walk into your world.

![NewWorld AI Sandbox](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Built with Three.js](https://img.shields.io/badge/built%20with-Three.js-black)

---

## What is this?

NewWorld AI Sandbox is a browser-based 3D voxel world you can build with natural language. Describe what you want — a castle, a forest, a harbor town — and AI generates it as walkable 3D space. No coding required. Bring your own API key (BYOK) or use the built-in local generator without any key at all.

Think: **AI-native Minecraft in the browser.**

## Features (v0.1)

| Feature | Status |
|---|---|
| Browser 3D voxel world | ✅ |
| WASD movement + mouse look | ✅ |
| Block place & break | ✅ |
| AI build from text prompt | ✅ |
| Local AI (no key needed) | ✅ |
| OpenAI / Gemini / Claude BYOK | ✅ |
| AI NPC conversation | ✅ |
| World save / load (localStorage) | ✅ |
| World JSON export / import | ✅ |
| Block palette (10 types) | ✅ |

## Quick Start

### Option 1 — Run locally (recommended)

**Requirements:** Node.js 18+

```bash
git clone https://github.com/safulou/newworld-ai-sandbox.git
cd newworld-ai-sandbox/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Option 2 — GitHub Pages (coming soon)

A live demo will be deployed at `https://safulou.github.io/newworld-ai-sandbox/`

## Controls

| Key | Action |
|---|---|
| `Click` | Lock cursor / Break block / Shoot blaster |
| `Right Click` | Place block |
| `WASD` | Move |
| `Space` | Jump |
| `Shift` | Cyber Sprint |
| `G` | Cyber Hoverboard |
| `O` | Arena Minigames (PvP Laser Tag, Voxel Snake, Parkour) |
| `X` / `F8` | 3D Spatial Voice Chat (WebRTC HRTF) |
| `U` | MagicaVoxel VOX 3D Asset Center |
| `Y` | Sparky Autonomous Drone Recon |
| `H` | Avatar Skin Customizer |
| `J` | Quest Log |
| `T` | Spatial Tool Palette |
| `K` | Visual Shaders Studio |
| `F4` | Cyber Photo Camera |
| `F5` | Achievements Hall |
| `F6` | 3D Model OBJ/MTL Exporter |
| `F1` | World Settings & AI Provider |
| `HUD 🌌` | Kardashev Civilizational Metric & Transcendence Core |
| `HUD 🛰️` | Dyson Swarm Mesh Collector & Solar Laser Relay Array |
| `HUD 🌋` | Planetary Core Dynamo & Super-Deep Geothermal Borehole |
| `HUD ⏳` | Chrono-Paradox Stabilizer & Closed Timelike Curves |
| `HUD 🫧` | Multiverse Bubble Topology & Inflationary Foam Probe |
| `HUD 🪐` | Ringworld Orbital Megastructure Fabricator |
| `HUD 📜` | Cosmic Constants Tuning & Sacred Genesis Decrees |
| `HUD 🎻` | String Fold Matrix & Calabi-Yau 6D Manifold Folding |
| `HUD 🛡️` | Vacuum Decay Ward & Supersymmetric Phase Screen |
| `HUD 🕳️` | Primordial Black Hole Nebula & Hawking Radiation Dynamo |
| `HUD 🗺️` | Quantum Entangled Holo-Starchart & Cosmic Filaments |
| `HUD ⚡` | Tachyonic Causality Mesh & Precognitive Antitelephone |
| `HUD ❄️` | Neutrino Superfluid Dark Matter Detector & Dilution Fridge |
| `HUD 🔥` | Quark-Gluon Plasma Nucleosynthesis Forge & Strangelets |
| `HUD 🕸️` | Spinfoam Quantum Geometry Lattice & Loop Quantum Gravity |
| `HUD 🌐` | Holographic Horizon Matrix & AdS/CFT Duality Encoding |
| `HUD 🌉` | ER=EPR Quantum Wormhole Bridge & Casimir Throat Flux |
| `HUD ⚛️` | Grand Unified Theory (GUT) Gauge Boson Collider & X/Y Bosons |
| `HUD 🌀` | Topological Chern Number Fiber Bundle & Chiral Currents |
| `HUD 〰️` | Cosmic String CMB Lensing Cartographer & Double Images |
| `HUD 🚀` | Relativistic Antimatter & Dark Energy Annihilation Propulsion Matrix |
| `HUD 🧲` | Sikivie Axion Haloscope Microwave Cavity & Dark Matter Halo |
| `HUD ⏰` | Quantum Entangled Time-Reversal Radar & Phase-Conjugate Tracking |
| `HUD 🕸️` | CFT String-Net Condensate Engine & Emergent Photons/Fermions |
| `HUD 🌀` | Supergravity Spinor Propulsion & N=8 Maximal SUGRA Inertia Vanishing |
| `HUD ⏳` | Penrose CCC Detector & Previous Aeon Hawking Points Gravitons |
| `HUD 💻` | Quantum Anomalous Hall Superfluid Microchip & Zero-Dissipation QAHE |
| `HUD 🔭` | Fermionic Dark Matter Quantum Squeezer & Dark Dwarf Fermi Surface |
| `HUD 🌈` | Rainbow Metric Graviton Mesh & Doubly Special Relativity Dispersion |
| `HUD 🔊` | Acoustic Black Hole BEC Dynamo & Sonic Hawking Radiation Generator |
| `HUD ⌛` | Many-Body Scarred Time Crystal & Subharmonic Period-Doubling DTC |
| `HUD 📐` | Higher-Order Topological Superconductor Relay & Corner Majorana Braiding |
| `HUD ⚙️` | Casimir Vacuum Torque Motor & Anisotropic Dielectric Metamaterial Drive |
| `HUD 🔮` | Non-Abelian Anyon Holographic Quantum Error-Correction Code (HaPPY) |
| `HUD 💫` | Relativistic Quantum Teleportation Superfluid Waveguide & Unruh Suppression |
| `HUD ⚡` | Planck Vacuum Cavity & Dynamical Casimir Effect SQUID Microwave Pairs |
| `HUD ❄️` | Topological Supersolid Quantum Vortex Reactor & Dual Symmetry Breaking NCRI |
| `HUD 🌌` | Primordial Gravitational Wave SGWB Interferometer & Hellings-Downs Curve |
| `HUD 🧲` | Aharonov-Bohm Geometric Phase Ring Array & Mesoscopic Persistent Current |
| `HUD ⚛️` | Supersymmetric Weyl Semimetal Chiral Anomaly Core & CME Axial Current |
| `HUD ✨` | Topological Exciton-Polariton Condensate & Superfluid Edge Soliton Reactor |
| `HUD ⏳` | Floquet Prethermal Topological Time Crystal & Subharmonic 2T DTTSB |
| `HUD 🌌` | Hawking-Unruh Holographic Microwave Detector & TMSV Squeezed Vacuum |
| `HUD 🧲` | Aharonov-Casher Neutral Spin Interferometer & Electromagnetic Duality Gate |
| `HUD 🌀` | Spinor Skyrmion Condensate Reactor & Synthetic Gauge Dirac Monopole |
| `HUD 🎯` | Non-Hermitian Exceptional Point Laser & Sublinear Fractional Topological Sensor |
| `HUD ⚛️` | Majorana Zero Mode Non-Abelian Braiding Chip & T-Junction Parity Qubit |
| `HUD 🕳️` | Kaluza-Klein Micro Black Hole Probe & Four-Stage Hawking Evaporation |
| `HUD 🌀` | Moiré Flat-Band Unconventional Superconductor & Quantum Metric Superfluidity |
| `HUD 🌌` | Gravitational Wave Memory Antenna Array & BMS Asymptotic Supertranslations |
| `HUD 🧲` | Antiferromagnetic Topological Dirac Magnon Waveguide & Magnon Thermal Hall Effect |
| `HUD 🕳️` | Holographic Traversable Wormhole Teleportation Reactor & Gao-Jafferis-Wall Protocol |
| `HUD ⚛️` | Chiral Anomaly Quantum Pump & CME Negative Longitudinal Magnetoresistance |
| `HUD 🌀` | Gravitational-Wave Spin Memory Array & BMS Celestial Superrotations |
| `HUD 📐` | Higher-Order Topological Superconductor Hinge Majorana Chip & Half-Integer Thermal Hall |
| `HUD 🏝️` | AdS/BCFT Quantum Island Reactor & Unitary Page Curve Petz Map Reconstruction |
| `HUD 🌀` | Topological Fractional Quantum Spin Liquid & Kitaev Honeycomb Anyon Reactor |
| `HUD 🕳️` | Extremal Kerr Black Hole Photon Shadow & Superradiant Ergosphere Dynamo |
| `HUD ⚙️` | Chiral Metamaterial Repulsive Casimir Motor & Quantum Vacuum Levitation Drive |
| `HUD 🌌` | Multi-Boundary Hyperbolic AdS/CFT Wormhole Network & Negative Energy Secret Sharing |
| `HUD ⚛️` | Fractional Quantum Anomalous Hall (FQAH) Reactor & Zero-Field Moiré Anyons |
| `HUD 📻` | Terahertz Josephson Quantum Mixer & Two-Mode Squeezed Microwave Probe |
| `HUD 🧲` | Dynamical Axion Insulator Resonator & Topological Magnetoelectric Polaritons |
| `HUD 🌌` | Holographic Complexity Equals Action Engine & WDW Patch Lloyd Bound |
| `HUD 🌊` | Chiral Cooper-Pair Majorana Vortex Lattice & Edge Supercurrent Reactor |
| `HUD 🛡️` | Quantum Spin Hall Helical Edge State Protection Chip & Zero Backscattering |
| `HUD 🌈` | Giant Kerr Nonlinear Soliton Frequency Comb & Quantum Squeezing Generator |
| `HUD 🌪️` | AdS4/CFT3 Holographic Weyl Semimetal Quantum Critical Fluid Engine & KSS Bound |
| `HUD ⚛️` | Tomita-Takesaki Modular Vacuum Engine & Bisognano-Wichmann Flow (QEI Bound) |
| `HUD 🌀` | Multi-Channel Kondo Effect & Non-Fermi Liquid Strange Metal Reactor (1/2 ln 2 Entropy) |
| `HUD 🔭` | Birefringent Gravitational Lens & Polarized Twin Einstein Rings Interferometer |
| `HUD 🔮` | AdS/CFT Holographic Microstate Mesh & Fuzzball HaPPY Tensor Network Reconstruction |
| `HUD 🧬` | Fibonacci Anyon Universal Topological Quantum Braiding Processor (Golden Ratio d_τ) |
| `HUD 🌌` | Gravitational Wave Celestial Holography & BMS Supertranslation Synthesizer |
| `HUD ⚡` | Floquet Topological Superconductor & Dynamical Andreev Bound State Engine |
| `HUD 🌀` | Moiré Flat-Band Fubini-Study Quantum Metric Superfluidity & Geodesic Weight |
| `HUD 🌈` | Twisted Polariton Flat-Band Photonics & Slow Light Nonequilibrium BEC Reactor |
| `HUD ❄️` | Wigner Crystal Quantum Melting & Electronic Nematic Liquid Crystal Engine |
| `HUD 🌌` | de Sitter Static Patch Holography & Gibbons-Hawking Horizon Entropy Reactor |
| `HUD 🔊` | Chiral Phonon Quantum Anomalous Acoustic Hall Reactor & Single-Direction Diode |
| `HUD ⚡` | Axion Cosmic String Shock & Gravitational Cherenkov Radiation Cone (c_grav) |
| `HUD 🌐` | 4D Quantum Hall Effect & Second Chern Number c_2 Synthetic Dimension Reactor |
| `HUD 🧬` | Non-Abelian Parafermion Zero Modes (Z_4) & Intrinsic Non-Clifford Braiding Gates |
| `HUD 🪐` | Calabi-Yau Moduli Stabilization & KKLT Metastable de Sitter Inflation Dynamo |
| `HUD 🕳️` | Hawking-Page AdS Transition & Holographic Black Hole Deconfinement Plasma |
| `HUD 🧲` | 3D Topological Insulator Axion Electrodynamics & Witten Fractional Dyon q=e/2 |
| `HUD 🌲` | Quantum Parisi Spin Glass Ultrametricity & Transverse Field Annealing Dynamo |
| `HUD 🌀` | Non-Abelian Cosmic Vortex Dynamo & BPS Saturation Bound Zero-Force Equilibrium |
| `HUD 📐` | Aharonov-Anandan Non-Adiabatic Geometric Holonomy & Fast Geometric Gate |
| `HUD 🧭` | Gravito-Electromagnetism & Lense-Thirring Gyroscopic Frame Dragging Precession |
| `HUD ⚡` | Weyl Semimetal Fermi Arc Surface States & Chiral Magnetic Effect (CME) |
| `HUD 🛡️` | D-Brane Reconnection Dynamics & Dirac-Born-Infeld (DBI) Nonlinear Vacuum |
| `HUD ⚛️` | Topological Kondo Insulator (TKI) & Strongly Correlated Dirac Cone Saturation |
| `HUD 🧲` | Magnetar QED Euler-Heisenberg Vacuum Birefringence & Starquake Relativistic Alfvén Wave |
| `HUD 🌌` | Holographic Superconductor & Charged AdS-RN Black Hole Scalar Hair Condensation |
| `HUD 🌀` | Yang-Mills BPST Instanton Vacuum Tunneling & Topological θ-Angle Axion Restoration |
| `HUD ⚡` | Schwinger Critical Field Vacuum Breakdown, Non-perturbative Dirac Sea Tunneling & Breit-Wheeler Cascades |
| `HUD 🌀` | Kerr Black Hole Superradiance Instability, Ergosphere Extraction & Hydrogenic Axion Cloud Ψ₂₁₁ |
| `HUD 🔥` | Strange Metal Planckian Limit Dissipation, Sachdev-Ye-Kitaev (SYK) Fast Scrambling Chaos & JT Gravity Dual |
| `HUD 🛡️` | Quantum Spin Hall Helical Edge State, BHZ Band Inversion & Jackiw-Rebbi Fractional Soliton e/2 |
| `HUD ⚡` | Dynamical Casimir Effect (DCE), SQUID Accelerating Relativistic Boundary & Two-Mode Squeezing (TMSV) |
| `HUD 🌊` | Quantum Hall Viscosity (Odd Viscosity), Read-Rezayi Wen-Zee Shift & Non-Dissipative Shear Hydrodynamics |
| `HUD 🌌` | Mixed Axial-Gravitational Chiral Anomaly, Luttinger Thermal Equivalence & Wiedemann-Franz Breakdown |
| `HUD ⚛️` | Magic-Angle Twisted Bilayer Graphene (MATBG), Flat-Band Quenching & Unconventional Superconducting Dome |
| `HUD 🧪` | Superfluid Helium-3 B Phase, Leggett Resonance & Class DIII Surface Majorana Cone |
| `HUD 👼` | Quantum Anomalous Hall-Superconductor Chiral Majorana Edge Modes & Half-Quantized σ = 0.5 e²/h |
| `HUD 🪐` | Black Hole Quantum Horizon Echoes, Planck-Membrane Cavity & Boltzmann Damped Resonances |
| `HUD ⚛️` | Composite Fermion Chern-Simons Liquid, Halperin-Lee-Read (HLR) Fermi Sea & Geometric Resonance |
| `HUD 🌪️` | Disorder-Induced Anderson Localization in Topological Superfluids, IPR & Critical Disorder W_c |
| `HUD 🌀` | Rotating Bose-Einstein Condensate Abrikosov Vortex Hexagonal Lattice & Tkachenko Shear Waves |
| `HUD 🧩` | Surface Code Homological Quantum Memory, Anyonic Excitations & Minimum-Weight Perfect Matching (MWPM) |
| `HUD 🌌` | Holographic Entanglement Negativity, AdS3/CFT2 Entanglement Wedge Cross-Section & Conformal Anomaly |
| `HUD 🎯` | Dirac Klein Tunneling & Veselago Negative Refraction Lens, Chiral Anti-Backscattering T=1 |
| `HUD 🌈` | Spin-Orbit Coupled BEC Stripe Supersolid Phase, Spontaneous Translation Breaking & Anisotropic Rigidity |
| `HUD 🧲` | Magnetic Weyl Semimetal Axion Polariton, Antiferromagnetic Magnon-Photon Gap & Faraday Non-Reciprocity |
| `HUD 🏝️` | Holographic Many-Body Page Island & Quantum Extremal Surface (QES), Evaporating Black Hole Unitary Page Curve |
| `HUD 🌀` | Twisted Bilayer MoTe₂ Fractional Chern Insulator (FQAHE), Moiré Flat Band & Non-Abelian Anyon Braiding |
| `HUD ⚡` | Floquet-Landau-Zener-Stückelberg-Majorana (LZSM) Qubit Interferometry & Coherent Destruction of Tunneling (CDT) |
| `HUD 🪐` | Kerr-Newman Black Hole Ergosphere, Blandford-Znajek Relativistic Plasma Jet & Penrose Energy Extraction |
| `HUD 🌌` | Holographic AdS/CFT Renormalization Group (RG) Flow & Zamolodchikov Irreversible c-Theorem |
| `HUD 🌀` | Quantum Vortex Hall Effect & Particle-Vortex Duality in Rotating Superfluids, Pinning Lattice & Anomalous Conductance |
| `HUD ⚡` | Floquet-Majorana Discrete Time Crystal (DTC), Kitaev Chain Subharmonic 2T Period Doubling & MBL Protection |
| `HUD 🪐` | Tachyonic Cosmic String Reconnection, Unstable D-Brane Condensation & Gravitational Wave Cusp Relativistic Jet |
| `HUD 🌌` | Holographic Quantum Chaos, AdS/CFT Fastest Scramblers, OTOC Correlators & Maldacena-Shenker-Stanford (MSS) Bound |
| `HUD ❄️` | Moiré Topological Excitonic Insulator & Exciton BEC Superfluid, Interlayer Dipoles & Counterflow Supercurrent |
| `HUD 🌀` | Non-Abelian Spin Superfluid & Weyl Fermion Topological Kink, Spin Josephson Precession & Chiral Anomaly |
| `HUD 📡` | Planckian Cosmic Inflation & Holographic Cosmological Antenna, CMB B-Mode Polarization & Primordial GW Tensor Power |
| `HUD 🎯` | Topological Non-Reciprocal Photonic Crystal Laser, PT-Symmetry Breaking Exceptional Point & Unidirectional Edge Modes |
| `HUD ⚛️` | Moiré Fractional Quantum Spin Hall (FQSH) & Dual Spin Liquid, Spin-Charge Separation & Helical Edge States |
| `HUD ⚡` | Topological Majorana Zero Mode Josephson Diode (JDE), Non-Reciprocal Supercurrent & 4π Fractional Tunneling |
| `HUD 🔮` | Kerr Black Hole Holographic Hyper-Entangled Gravitational Lens Antenna, Relativistic Einstein Rings & OAM Multiplexing |
| `HUD ❄️` | Higher-Order Non-Abelian Fractal Time Crystal, Sierpinski Lattice HOTI Corner Locking & Subharmonic 3T Period Multiplication |
| `HUD 🌊` | Fractional Quantum Hall Stripe Phase & Electronic Nematic Liquid Crystal, CDW & Giant Anisotropic Resistivity |
| `HUD 🕸️` | Chiral Weyl Semimetal Topological Superconducting Diode Network, CME Rectification Tensor & Logic Gates |
| `HUD 🕳️` | Micro-Black Hole Holographic Graviton Teleportation Antenna, ER=EPR Traversable Wormhole & Gao-Jafferis-Wall Protocol |
| `HUD 💎` | Spin-Orbit Coupled Fractal Weyl Time Crystal, Sierpinski Manifold 4T Subharmonic Period Quadrupling & Rigidity |
| `HUD 🌀` | Non-Hermitian Abelian-Higgs String Vortex Network, NH Skin Effect, Exceptional Point Annihilation & Cosmic Tension |
| `HUD 🧪` | Dynamical Spin-Polaron Bose Gel, Spin-Phonon Coupling, Viscoelastic Shear Modulus G*(ω) & Supersolid Rigidity |
| `HUD 🌌` | Holographic Gravitational Wave Exotic Polarization Antenna, 6 GW Polarization Modes, Holographic Cavity SNR |
| `HUD 🧊` | 4D Topological Insulator Second Chern Hyper-Crystal, 4D QHE, SO(4) Tesseract Projection & 3D Dirac Cones |
| `HUD ❄️` | Non-Abelian Fractal Higher-Order Topological Superconductor (HOTSC), Sierpinski Corner Modes & Braiding Qubits |
| `HUD 🌪️` | Dynamical Weyl Chiral Gravitational Anomaly Fluid, Mixed Relativistic Anomaly, CVE & Thermal Hall |
| `HUD ✨` | Quantum Polariton Topological Photonic Lattice, Kagome Microcavity Artificial Gauge & Flatband Laser |
| `HUD 💥` | Spinor Superfluid Holographic Soliton Collider, F=1 BEC Relativistic Collision & Black Hole Merger |
| `HUD 🪢` | Superconducting Topological Fluxon Knot Crystallizer, Faddeev-Niemi 3D Hopfions & Trefoil Untying |
| `HUD ♾️` | Topological Non-Abelian Spin-Möbius Resonator, Non-Orientable Berry Phase γ = π & Half-Integer OAM |
| `HUD 🌌` | Holographic Casimir Dark Energy Wormhole Engine, NEC Violation, Morris-Thorne Throat & Phantom Field |
| `HUD ⚛️` | Supersymmetric QCD Magnetic Monopole BEC Ring, N=2 Seiberg-Witten Dual Meissner & Color String |
| `HUD 🌀` | Non-Hermitian Exceptional-Ring Hopf Insulator, Weyl Exceptional Rings, Complex Braiding & Corner Skin Vortex |
| `HUD 🔺` | Fractal-Dimensional Quantum Spin Liquid, Sierpiński Kitaev Fractionalization & Anyon Mach-Zehnder Interferometer |
| `HUD 🌊` | Relativistic Gravitational-Wave MHD Alfvén Soliton Resonator, Gertsenshtein Parametric Coupling & FRB Surge |
| `HUD ❄️` | Superfluid Bose-Fermi Topological Exciton Supersolid Rotor, Roton Softening & Leggett NCRI Fraction |
| `HUD 🎵` | Topological Chiral Weyl Phonon Superfluid, Phonon Monopoles, Surface Phonon Arcs & Thermal Hall Conductivity |
| `HUD 🕸️` | Holographic SU(N_c) Yang-Mills Tensor Network, Hyperbolic MERA RG Flow, RT Geodesic & Wilson Confinement |
| `HUD 💠` | Non-Abelian SU(4) Spin-Orbital Liquid & BBH Topological Octupole Insulator, π-Flux & ±e/2 Corner Charges |
| `HUD ⚡` | Petawatt Laser-Plasma Wakefield GeV Collider, Strong-Field QED Radiation Recoil & Breit-Wheeler Pair Cascade |
| `HUD 🧲` | Altermagnetic Chiral Spin-Splitter & Non-Reciprocal Magnonic Diode, d/g/i-Wave Spin Splitting & Giant SSE |
| `HUD 🔬` | Rydberg Optical Tweezer Ruby Lattice Non-Abelian Topological Spin Liquid, RVB Dimers & Fredenhagen-Marcu Order |
| `HUD ☄️` | Relativistic Axion Quark-Nugget (AQN) Dark Matter Magnetosphere Resonator, 511 keV Positron Annihilation & Primakoff Flare |
| `HUD 🧬` | Topological Euler-Class Multi-Gap Metamaterial, Non-Abelian Quaternion Q_8 Nodal Braiding & Annihilation Obstruction |
| `HUD ✡️` | Kagome Metal Pair-Density-Wave & Chiral Orbital Loop-Current Superconductor, 3Q PDW & Vestigial Charge-6e Condensate |
| `HUD 🌈` | Floquet Helically-Modulated Photonic Waveguide Array, Wilczek-Zee U(N) Holonomy & π-Mode Anyon Braider |
| `HUD 🕳️` | Holographic Sachdev-Ye-Kitaev (SYK) Traversable AdS₂ Wormhole, Operator Size-Winding & Gravitational Teleportation |
| `HUD 🌟` | Relativistic Pion-Condensate Neutron Star Core, ³P₂ Superfluid Half-Quantum Vortex Avalanche & Pulsar Glitch |
| `HUD 🔷` | Rhombohedral Pentalayer Graphene Chiral Superconductor, Quarter-Metal Valley Polarization & C=5 QAH |
| `HUD 🔥` | Quantum Otto Squeeze Heat Engine, Squeezed Thermal Bath, STA Counterdiabatic Drive & Beyond-Carnot Efficiency |
| `HUD 🌀` | Asymptotically Safe Quantum Gravity Non-Gaussian UV Fixed Point, Wetterich FRG Flow & Spectral Dimension d_s → 2 |
| `HUD ⚗️` | Optical Microcavity Vibrational Polariton Condensate, VSC Rabi Splitting & Bose-Enhanced Super-Chemistry |
| `HUD ❄️` | Twisted Bilayer Cuprate High-Tc d+id Topological Josephson Junction, Charge-4e Co-Tunneling & Semifluxon Diode |
| `HUD 🌌` | Loop Quantum Cosmology Big Bounce Singularity Resolution, Area Gap Δ_area & Planck Star White-Hole Transition |
| `HUD ⚛️` | Heavy-Fermion Kondo-Breakdown Quantum Critical Point, Small-to-Large Fermi Surface Jump & ω/T Strange Metal |
| `HUD 🔊` | Superspace Phason-Pump Topological Phonon Quasicrystal, Penrose C₂ Invariant & Non-Reciprocal Acoustic Diode |
| `HUD 🧭` | Non-Hermitian 3rd-Order Exceptional Surface (ES₃) Photonic Gyroscope, Cube-Root Sagnac Splitting & Sub-SQL Sensing |
| `HUD 🔺` | Causal Dynamical Triangulations (CDT) Quantum Spacetime Emergence, De Sitter Phase C & UV Spectral Dimension d_s → 2 |
| `HUD 🧲` | Heavy-Fermion UTe₂ Spin-Triplet Topological Superconductor, 45 T Lazarus Re-Entrant Phase & Chiral Weyl Surface States |
| `HUD 💧` | Polar-Molecule Dipolar Quantum Ferroelectric Superfluid, Lee-Huang-Yang Self-Bound Droplets & Roton Stripe Supersolid |
| `ESC` | Unlock cursor |

## AI Providers

Press **F1** to open Settings and choose your AI provider:

| Provider | Model | Notes |
|---|---|---|
| **Local** | Built-in rules | No API key, works offline |
| **OpenAI** | gpt-4o-mini | Fast and affordable |
| **Google Gemini** | gemini-1.5-flash | Free tier available |
| **Anthropic Claude** | claude-haiku-4-5 | Fast and precise |

> **Privacy:** API keys are stored only in your browser's localStorage. All AI calls go directly from your browser to the AI provider — no data passes through any intermediate server.

## Project Structure

```
newworld-ai-sandbox/
├── backend/               # Express, Socket.IO WebRTC signaling, SQLite blockchain
├── frontend/
│   ├── src/
│   │   ├── engine/        # Three.js scene, spatialAudio, spatialVoice, minigames, AI
│   │   ├── components/    # Vue components (GameCanvas, HUD, SpatialVoiceModal, Minigames)
│   │   ├── stores/        # Pinia state (settings, ui)
│   │   └── types/         # TypeScript types
│   ├── index.html
│   └── vite.config.ts
├── logs/                  # Devlogs & session trajectory
├── LICENSE
└── README.md
```

## Roadmap

- [x] Multi-player (WebSocket & WebRTC 3D Spatial Voice Chat)
- [x] Arena Minigames (PvP Laser Tag, 3D Voxel Snake, Parkour)
- [x] 60+ Voxel block types and procedural biomes
- [x] MagicaVoxel .VOX 3D assets import & OBJ/MTL export
- [x] NPC with custom knowledge base (RAG & Web Speech Synthesis)
- [x] Mobile touch controls
- [x] GitHub Pages auto-deploy (GitHub Actions)

## Contributing

PRs are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

## License

MIT © [Arsen](https://github.com/safulou)
