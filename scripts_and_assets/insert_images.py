import sys

filepath = '/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 4 Thermodynamics of Fidelity/index.html'
with open(filepath, 'r') as f:
    content = f.read()

replacements = [
    (
        '<p>Nature simply follows the lowest-energy arrangement.</p>\n                            </div>',
        '<p>Nature simply follows the lowest-energy arrangement.</p>\n                                <figure style="margin-top: 2rem;">\n                                    <img src="diagram_base_pairing.svg" alt="DNA Base Pairing Diagram" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                                </figure>\n                            </div>'
    ),
    (
        '<p>This arrangement minimizes the system’s free energy. It is energetically favorable.</p>\n                        </div>\n                    </div>',
        '<p>This arrangement minimizes the system’s free energy. It is energetically favorable.</p>\n                        </div>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_chemical_forces.svg" alt="Chemical Forces in DNA" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<p>Creating this ordered shell costs energy. Therefore, the total free energy of the DNA-water system increases. The mismatch becomes thermodynamically unfavorable.</p>\n                    </div>',
        '<p>Creating this ordered shell costs energy. Therefore, the total free energy of the DNA-water system increases. The mismatch becomes thermodynamically unfavorable.</p>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_mismatch.svg" alt="DNA Mismatch Distortion" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<p>DNA polymerase functions similarly. Its active site is a nanoscale measuring instrument. Only nucleotides with correct bond angles, spacing, and orientation fit properly. This is Physics. Not intelligence.</p>\n                    </div>',
        '<p>DNA polymerase functions similarly. Its active site is a nanoscale measuring instrument. Only nucleotides with correct bond angles, spacing, and orientation fit properly. This is Physics. Not intelligence.</p>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_physics.svg" alt="DNA Polymerase Physics" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<p>Nature doesn’t need perfect discrimination. A small energy advantage, repeated billions of times, produces highly accurate replication.</p>\n                            </div>\n                        </div>\n                    </div>',
        '<p>Nature doesn’t need perfect discrimination. A small energy advantage, repeated billions of times, produces highly accurate replication.</p>\n                            </div>\n                        </div>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_thermodynamics.svg" alt="Thermodynamics Free Energy Landscape" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<strong>1 error per 10 billion bases</strong>\n                        </div>\n                    </div>',
        '<strong>1 error per 10 billion bases</strong>\n                        </div>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_layered_defense.svg" alt="Biology\'s Layered Defense" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<p>In molecular dynamics simulations, we observe whether the protein-drug complex remains stable over time. If interactions weaken, ΔG increases and the drug dissociates. If interactions remain favorable, the complex remains bound. This is governed entirely by physics and chemistry.</p>\n                            </div>\n                        </div>\n                    </div>',
        '<p>In molecular dynamics simulations, we observe whether the protein-drug complex remains stable over time. If interactions weaken, ΔG increases and the drug dissociates. If interactions remain favorable, the complex remains bound. This is governed entirely by physics and chemistry.</p>\n                            </div>\n                        </div>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_drug_discovery.svg" alt="Drug Discovery Molecular Docking" style="width: 100%; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>\n                    </div>'
    ),
    (
        '<strong style="color: var(--accent);">Biological Discovery</strong>\n                            </div>\n                        </div>',
        '<strong style="color: var(--accent);">Biological Discovery</strong>\n                            </div>\n                        </div>\n                        <figure style="margin-top: 2rem;">\n                            <img src="diagram_bioinformatics_pipeline.svg" alt="Bioinformatics Pipeline" style="width: 100%; max-width: 500px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">\n                        </figure>'
    )
]

for old, new in replacements:
    if old not in content:
        print("FAILED TO FIND:", old)
    content = content.replace(old, new)

with open(filepath, 'w') as f:
    f.write(content)

