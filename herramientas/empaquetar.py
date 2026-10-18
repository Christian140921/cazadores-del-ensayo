"""Junta index.html, css/ y js/ en un solo archivo HTML (para abrirlo sin servidor o compartirlo como un archivo).

Uso: python3 herramientas/empaquetar.py [salida.html]   (por defecto: cazadores-del-ensayo.html)
"""
import pathlib, re, sys

raiz = pathlib.Path(__file__).resolve().parent.parent
html = (raiz / "index.html").read_text(encoding="utf-8")

def css(m):
    return "<style>\n" + (raiz / m.group(1)).read_text(encoding="utf-8") + "</style>"

def js(m):
    return "<script>\n" + (raiz / m.group(1)).read_text(encoding="utf-8") + "</script>"

html = re.sub(r'<link rel="stylesheet" href="(css/[^"?]+)(?:\?v=[^"]*)?">', css, html)
html = re.sub(r'<script src="(js/[^"?]+)(?:\?v=[^"]*)?"></script>', js, html)
salida = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "cazadores-del-ensayo.html")
salida.write_text(html, encoding="utf-8")
print(f"Listo: {salida} ({len(html) // 1024} KB)")
