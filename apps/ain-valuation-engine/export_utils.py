from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def export_to_pdf(data, out_path):
    c = canvas.Canvas(out_path, pagesize=letter)
    width, height = letter
    y = height - 40
    c.setFont("Helvetica", 12)
    if isinstance(data, dict):
        items = data.items()
    else:
        items = enumerate(data)
    for k, v in items:
        line = f"{k}: {v}"
        c.drawString(40, y, line)
        y -= 18
        if y < 40:
            c.showPage()
            y = height - 40
    c.save()

if __name__ == "__main__":
    sample = {"VIN": "1HGCM82633A004352", "Make": "HONDA", "Model": "ACCORD", "Model Year": "2003"}
    export_to_pdf(sample, "test_export.pdf")
    print("PDF export complete.")
