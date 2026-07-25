html_path = "index.html"
with open(html_path, "r") as f:
    content = f.read()

# Replace absolute paths with relative paths
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/assembly_diagram_1785018897677.jpg", "assembly_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/reference_genome_diagram_1785018907623.jpg", "reference_genome_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/sequencing_accuracy_diagram_1785018917563.jpg", "sequencing_accuracy_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/okseq_diagram_1785018929792.jpg", "okseq_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/genome_stability_diagram_1785018942806.jpg", "genome_stability_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/comparative_genomics_diagram_1785018953755.jpg", "comparative_genomics_diagram.jpg")
content = content.replace("/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/variant_calling_diagram_1785018967941.jpg", "variant_calling_diagram.jpg")

# Replace fig2_new.jpg with fig2_split.svg (the second image the user attached)
content = content.replace('src="fig2_new.jpg"', 'src="fig2_split.svg"')

with open(html_path, "w") as f:
    f.write(content)
