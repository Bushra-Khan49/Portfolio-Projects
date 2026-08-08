import sys

filepath = 'Syllabus explained/Domain-1/Topic 4 Thermodynamics of Fidelity/index.html'
with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (
        '<figure style="margin-top: 2rem;">\n                                    <img src="diagram_base_pairing.svg" alt="DNA Base Pairing Diagram" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                                </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                                    <img src="fig1.jpg" alt="DNA Base Pairing" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                                    <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.1: DNA Base Pairing (Hydrogen Bonds)</figcaption>\n                                </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_chemical_forces.svg" alt="Chemical Forces in DNA" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig2.jpg" alt="Chemical Forces" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.2: Hydrophobic Effect (Water Cage)</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_mismatch.svg" alt="DNA Mismatch Distortion" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig3.jpg" alt="Mismatch Distortion" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.3: DNA Mismatch Distortion</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_physics.svg" alt="DNA Polymerase Physics" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig4.jpg" alt="Polymerase Physics" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.4: Polymerase Active Site Physics</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_thermodynamics.svg" alt="Thermodynamics Free Energy Landscape" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig5.jpg" alt="Thermodynamics Free Energy Landscape" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.5: Thermodynamic Free Energy Landscape</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_layered_defense.svg" alt="Biology\'s Layered Defense" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig6.jpg" alt="Biology Layered Defense" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.6: Biology\'s Layered Defense Mechanism</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem;">\n                            <img src="diagram_drug_discovery.svg" alt="Drug Discovery Molecular Docking" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig7.jpg" alt="Drug Discovery" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.7: Molecular Docking in Drug Discovery</figcaption>\n                        </figure>'
    ),
    (
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="diagram_bioinformatics_pipeline.svg" alt="Bioinformatics Pipeline" style="width: 100%; max-width: 500px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>',
        '<figure style="margin-top: 2rem; text-align: center;">\n                            <img src="fig8.jpg" alt="Bioinformatics Pipeline" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                            <figcaption style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-style: italic;">Figure 4.8: The Computational Bioinformatics Pipeline</figcaption>\n                        </figure>'
    )
]

for old, new in replacements:
    if old not in content:
        print("FAILED TO FIND:", old)
    content = content.replace(old, new)

with open(filepath, 'w') as f:
    f.write(content)

