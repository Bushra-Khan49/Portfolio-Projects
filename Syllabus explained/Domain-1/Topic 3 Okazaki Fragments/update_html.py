import re
import shutil

html_path = "index.html"
with open(html_path, "r") as f:
    content = f.read()

# Replace Figure 1 img src
content = re.sub(
    r'<img src="[^"]*" alt="The Replisome"[^>]*>',
    r'<img src="fig1_new.svg" alt="The Replisome" style="display: block; margin: 0 auto; width: 100%; max-width: 600px; height: auto; border-radius: 4px; filter: contrast(1.1) brightness(1.05);">',
    content
)

# Replace Figure 2 img src
content = re.sub(
    r'<img src="[^"]*" alt="DNA Polymerase III and Sliding Clamp"[^>]*>',
    r'<img src="fig2_new.jpg" alt="DNA Replication Fork Overview" style="display: block; margin: 0 auto; width: 100%; max-width: 600px; height: auto; border-radius: 4px; filter: contrast(1.1) brightness(1.05);">',
    content
)

# Alternatively, wait, the second image user provided was Frank Boumphrey's (fig2_split.svg).
# Let's use fig2_split.svg instead of fig2_new.jpg for Figure 2, or maybe the Campbell one for Fig 2?
# The user explicitly gave 3 images but said "use this for fig 1. fig 2.". 
# Let's use Campbell one for Fig 2.

new_content = """
                    <!-- NEW SECTIONS ADDED -->
                    <div class="glass-panel" style="margin-top: 3rem; background: rgba(255, 255, 255, 0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 class="gradient-text" style="font-size: 1.8rem; margin-bottom: 1.5rem;">Bioinformatics Applications of Replication</h3>
                        
                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">1. Continuous Genome Assembly</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                One of the first things bioinformaticians do is assemble genomes. Genome assembly assumes chromosomes are continuous DNA molecules. Assembler algorithms work like a jigsaw puzzle. Imagine if RNA primers were still present. Instead of continuous DNA, you would have an RNA-DNA hybrid mix. The sequence would no longer represent one chemically consistent molecule, and assembly algorithms would encounter discontinuities that do not exist in normal genomes.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/assembly_diagram_1785018897677.jpg" alt="Continuous Genome Assembly" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">2. Reference Genomes</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                Every reference genome (Human, Mouse, E. coli) is stored as one continuous DNA sequence. There are no RNA primers and no Okazaki fragment boundaries because DNA Polymerase I removed every primer and DNA ligase sealed every nick. Only after these processes does the chromosome become the stable molecule that sequencing captures.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/reference_genome_diagram_1785018907623.jpg" alt="Reference Genomes" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">3. Sequencing Accuracy</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                Suppose ligase never sealed the DNA. The chromosome would contain thousands of tiny breaks. During DNA extraction or library preparation, these weak points would break easily. This would produce fragmented reads, uneven coverage, and poor sequencing quality. Modern sequencing depends on intact chromosomes.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/sequencing_accuracy_diagram_1785018917563.jpg" alt="Sequencing Accuracy" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">4. Replication Timing Studies (OK-Seq)</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                Not every sequencing experiment studies finished DNA. Techniques like OK-seq (Okazaki Fragment Sequencing) deliberately sequence these fragments. From these fragments, computational biologists reconstruct replication fork direction, replication origins, and termination zones.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/okseq_diagram_1785018929792.jpg" alt="OK-Seq" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">5. Genome Stability & DNA Repair</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                Cancer genomes contain many structural abnormalities. Some arise because Okazaki fragment processing fails (e.g. if ligase is defective). DNA breaks accumulate leading to large deletions, duplications, or translocations. Bioinformaticians detect these using structural variant callers. Understanding the biology explains where these computational signals originate.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/genome_stability_diagram_1785018942806.jpg" alt="Genome Stability and DNA Repair" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">6. Comparative Genomics</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                One reason genomes remain stable over millions of years is because Okazaki fragment processing is extremely reliable. This stability allows us to computationally align and compare homologous genes between humans, chimpanzees, mice, and fish. If chromosomes accumulated thousands of replication mistakes every generation, multiple sequence alignment would become nearly impossible.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/comparative_genomics_diagram_1785018953755.jpg" alt="Comparative Genomics" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>

                        <div class="content-block" style="margin-bottom: 2rem;">
                            <h4 style="color: #64ffda; font-size: 1.3rem; margin-bottom: 1rem;">7. Variant Calling & Replication Stress</h4>
                            <p style="font-size: 1.1rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 1rem;">
                                Is a mutation real? Understanding replication biology helps build statistical models for variant callers. The probability that DNA replication introduced an error is extremely low because of proofreading, mismatch repair, primer replacement, and ligase repair. Therefore, observed variants in a VCF file are much more likely to represent genuine biological changes than routine replication errors.
                            </p>
                            <figure style="text-align: center; margin: 1.5rem 0;">
                                <img src="/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/variant_calling_diagram_1785018967941.jpg" alt="Variant Calling and Replication Stress" style="max-width: 100%; border-radius: 8px;">
                            </figure>
                        </div>
                    </div>
"""

# Insert before </section> which is near the end of main content
content = content.replace("</section>\n\n            <!-- Navigation Buttons -->", new_content + "\n</section>\n\n            <!-- Navigation Buttons -->")

with open(html_path, "w") as f:
    f.write(content)
