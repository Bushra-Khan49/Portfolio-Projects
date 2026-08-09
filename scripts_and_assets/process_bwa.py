import fitz
from PIL import Image

doc = fitz.open("Syllabus explained/Domain-1/Topic 2 Fidelity Safeguards/bwa.pdf")
# Extract page 2 and 3 (index 1 and 2, or maybe 2 and 3 depending on title)
# Let's extract pages 1 to 5 and check titles, but hardcoding is easier.
# The user image says "Genome Shotgun Sequencing and Assembly" and "Aligning short-reads to a reference genome"
# We will just extract pages 1, 2, 3, 4 and stitch 2 and 3.
p2 = doc.load_page(1).get_pixmap(dpi=150)
p3 = doc.load_page(2).get_pixmap(dpi=150)
img2 = Image.frombytes("RGB", [p2.width, p2.height], p2.samples)
img3 = Image.frombytes("RGB", [p3.width, p3.height], p3.samples)

# stitch vertically
dst = Image.new('RGB', (max(img2.width, img3.width), img2.height + img3.height))
dst.paste(img2, (0, 0))
dst.paste(img3, (0, img2.height))
dst.save("Syllabus explained/Domain-1/Topic 2 Fidelity Safeguards/bwa_slide.png")
