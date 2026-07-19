from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "mueenuddeen-baqavi-cv.pdf"
PHOTO = ROOT / "public" / "mueenusta.jpeg"
FONT = Path("C:/Windows/Fonts/Nirmala.ttf")
if not FONT.exists():
    FONT = Path("C:/Windows/Fonts/Nirmala.ttc")


def register_fonts():
    try:
        pdfmetrics.registerFont(TTFont("Nirmala", str(FONT)))
        return "Nirmala"
    except Exception:
        return "Helvetica"


def section(title, rows, styles):
    data = [[Paragraph(title, styles["section"])]]
    for row in rows:
        data.append([Paragraph(row, styles["body"])])
    table = Table(data, colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8f3ec")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#dce8dc")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dce8dc")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    font_name = register_fonts()
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            "title_ml",
            fontName=font_name,
            fontSize=22,
            leading=30,
            textColor=colors.HexColor("#116a45"),
            alignment=TA_CENTER,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            "subtitle_ml",
            fontName=font_name,
            fontSize=10.5,
            leading=17,
            textColor=colors.HexColor("#5e6f64"),
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            "section",
            fontName=font_name,
            fontSize=12,
            leading=18,
            textColor=colors.HexColor("#10231a"),
            alignment=TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            "body",
            fontName=font_name,
            fontSize=9.6,
            leading=16,
            textColor=colors.HexColor("#10231a"),
            alignment=TA_LEFT,
        )
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Mueenuddeen Baqavi P - Biography CV",
        author="Mueenuddeen Baqavi P",
    )

    story = []
    if PHOTO.exists():
        photo = Image(str(PHOTO), width=34 * mm, height=42 * mm)
        photo.hAlign = "CENTER"
        story.append(photo)
        story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("മുഈനുദ്ദീൻ ബാഖവി പി", styles["title_ml"]))
    story.append(
        Paragraph(
            "ഇസ്ലാമിക പണ്ഡിതൻ | അധ്യാപകൻ | ഗ്രന്ഥകാരൻ<br/>Phone: 9496343397 | Email: mueenbaqavi@gmail.com",
            styles["subtitle_ml"],
        )
    )

    sections = [
        (
            "വ്യക്തിഗത വിവരങ്ങൾ",
            [
                "ജനനം: മേയ് 1977",
                "പിതാവ്: കുഞ്ഞുമുട്ടി ഹാജി",
                "മാതാവ്: താച്ചുട്ടി",
                "സഹധർമ്മിണി: ഉമ്മു സൽമ തൗഫീഖിയ്യ",
                "വിലാസം: പുൽപ്പറമ്പൻ ഹൗസ്, പി.ഒ. വിളയിൽ, കുഴിമണ്ണ, മലപ്പുറം - 673641",
            ],
        ),
        (
            "വിജ്ഞാന മേഖല",
            [
                "ഇസ്ലാമിക വിജ്ഞാനീയങ്ങൾ",
                "കർമശാസ്ത്ര പഠനങ്ങൾ",
                "ദർസ് അധ്യാപനവും പ്രായോഗിക മതവിഷയങ്ങളിലെ മാർഗ്ഗനിർദ്ദേശവും",
            ],
        ),
        (
            "മതപഠനം",
            [
                "ശൈഖുനാ മർഹും മഞ്ചേരി U പുല്ലൂർ അബ്ദുറഹീം ബാഖവി",
                "പി.എ. ബിരാൻ കുട്ടി ബാഖവി",
            ],
        ),
        (
            "ഉപരിപഠനം",
            [
                "വെല്ലൂർ ബാഖിയാതുസ്സ്വാലിഹാത്തിൽ നിന്ന് 2000ൽ മുത്വവ്വൽ ഒന്നാം റാങ്കോടെ ബാഖവി MFB ബിരുദം",
                "മഞ്ചേരി ദാറുസ്സുന്ന ഇസ്ലാമിക കേന്ദ്രത്തിൽ നിന്ന് ഇസ്ലാമിക ദഅവയിൽ ബിരുദാനന്തര ബിരുദം (MD)",
            ],
        ),
        (
            "ഗ്രന്ഥങ്ങൾ",
            [
                "രോഗ പരിചരണം മയ്യിത്ത് പരിപാലനം",
                "അനന്തരാവകാശം, ഒരു എളുപ്പ വായന",
                "യാത്രയിലെ മര്യാദകൾ",
                "ഹജ്ജ് - ഉംറ - അദ്കാർ ഹാൻഡ് ബുക്ക്",
                "ആനുകാലിക വിഷയങ്ങളിലെ കർമശാസ്ത്ര ലേഖനങ്ങൾ",
            ],
        ),
        (
            "സേവനങ്ങൾ",
            [
                "ശംസുൽ ഉലമ ഇസ്ലാമിക് അക്കാദമി, വെങ്ങപ്പള്ളി",
                "വാഫി ക്യാമ്പസ് പ്രൊഫസർ, കാളികാവ്",
                "ജനറൽ സെക്രട്ടറി, ബസ്മല എജുക്കേഷൻ ആൻഡ് ചാരിറ്റബിൾ ട്രസ്റ്റ്, നെല്ലിക്കാട് വിളയിൽ",
                "2018ൽ മികച്ച വാഫി അധ്യാപകനുള്ള അവാർഡ്",
            ],
        ),
        (
            "വഹിക്കുന്ന പദവികൾ",
            [
                "Founder, Annoor Online Shareea Academy",
                "Director, Annoor Online Madrasa",
                "English Malayalam academic initiatives",
            ],
        ),
    ]

    for title, rows in sections:
        story.append(section(title, rows, styles))
        story.append(Spacer(1, 4 * mm))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
