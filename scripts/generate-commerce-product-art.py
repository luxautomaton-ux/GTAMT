from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ART_DIR = ROOT / "public" / "assets" / "commerce-art"
SOURCE = ART_DIR / "source-commerce-board.png"
OUT_SIZE = (1200, 675)


PRODUCTS = [
    {
        "id": "celebrity-scale-rp-launch-pack",
        "title": "Celebrity-Scale RP Launch Pack",
        "label": "Flagship Server Pack",
        "price": "$499-$899",
        "tile": (0, 0),
        "accent": (255, 79, 163),
        "accent2": (67, 231, 255),
        "chips": ["Whitelist funnel", "Creator launch", "Tebex-safe ladder"],
    },
    {
        "id": "premium-city-identity-pack",
        "title": "Premium City Identity Pack",
        "label": "City Pack System",
        "price": "$119-$159",
        "tile": (1, 0),
        "accent": (255, 209, 102),
        "accent2": (255, 79, 163),
        "chips": ["City config", "Landmarks", "Sales copy"],
    },
    {
        "id": "discord-community-machine-pack",
        "title": "Discord Community Machine Pack",
        "label": "Community Funnel",
        "price": "$99-$249",
        "tile": (2, 0),
        "accent": (137, 105, 255),
        "accent2": (67, 231, 255),
        "chips": ["Channels", "Applications", "Tickets"],
    },
    {
        "id": "tebex-store-blueprint-pack",
        "title": "Tebex Store Blueprint Pack",
        "label": "Storefront System",
        "price": "$99-$299",
        "tile": (3, 0),
        "accent": (255, 177, 47),
        "accent2": (255, 101, 35),
        "chips": ["Safe categories", "Refund copy", "Coupons"],
    },
    {
        "id": "security-anti-abuse-pack",
        "title": "Security & Anti-Abuse Pack",
        "label": "Ops / Security",
        "price": "$199-$399",
        "tile": (0, 1),
        "accent": (67, 231, 255),
        "accent2": (93, 255, 177),
        "chips": ["ACE matrix", "Audit logs", "Chargeback SOP"],
    },
    {
        "id": "creator-streamer-pack",
        "title": "Creator & Streamer Growth Pack",
        "label": "Content Engine",
        "price": "$149-$399",
        "tile": (1, 1),
        "accent": (255, 79, 163),
        "accent2": (255, 177, 47),
        "chips": ["30-day plan", "Shorts scripts", "Event calendar"],
    },
    {
        "id": "police-ems-doj-pack",
        "title": "Police, EMS & DOJ Authority Pack",
        "label": "Civil Services",
        "price": "$249-$499",
        "tile": (2, 1),
        "accent": (255, 209, 102),
        "accent2": (67, 231, 255),
        "chips": ["SOPs", "Academy", "Evidence rules"],
    },
    {
        "id": "business-economy-pack",
        "title": "Business Economy & Payout Pack",
        "label": "Economy System",
        "price": "$299-$599",
        "tile": (3, 1),
        "accent": (93, 255, 177),
        "accent2": (67, 231, 255),
        "chips": ["Job grid", "Payout calculator", "Inflation checks"],
    },
    {
        "id": "top-server-access-queue-pack",
        "title": "Top-Server Access & Queue Pack",
        "label": "Monetization Blueprint",
        "price": "$149-$249",
        "tile": (0, 2),
        "accent": (255, 79, 163),
        "accent2": (255, 209, 102),
        "chips": ["Priority queue", "Supporter roles", "Order log"],
    },
    {
        "id": "gang-identity-turf-pack",
        "title": "Gang Identity & Turf Pack",
        "label": "Fictional Faction System",
        "price": "$199-$399",
        "tile": (1, 2),
        "accent": (255, 61, 95),
        "accent2": (255, 177, 47),
        "chips": ["Turf rules", "Ranks", "Payout discipline"],
    },
    {
        "id": "full-template-vault-bundle",
        "title": "Full Template Vault Bundle",
        "label": "Premium Bundle",
        "price": "$999-$1,499",
        "tile": (2, 2),
        "accent": (196, 96, 255),
        "accent2": (255, 209, 102),
        "chips": ["All docs", "Calculators", "Fulfillment"],
    },
    {
        "id": "monthly-ops-retainer",
        "title": "Monthly Ops Retainer",
        "label": "Recurring Service",
        "price": "$249-$499/mo",
        "tile": (3, 2),
        "accent": (67, 231, 255),
        "accent2": (255, 79, 163),
        "chips": ["Monthly audit", "Economy tuning", "Priority support"],
    },
]


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Black.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


FONT_LABEL = font(21, bold=True)
FONT_TITLE = font(50, bold=True)
FONT_TITLE_SMALL = font(40, bold=True)
FONT_PRICE = font(42, bold=True)
FONT_BODY = font(22, bold=False)
FONT_CHIP = font(18, bold=True)
FONT_TINY = font(17, bold=True)


def cover_resize(image, size):
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((math.ceil(image.width * scale), math.ceil(image.height * scale)), Image.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def wrap_text(draw, text, font_obj, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=font_obj)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:2]


def rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def composite_rect(image, box, fill):
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer, "RGBA").rectangle(box, fill=fill)
    image.alpha_composite(layer)


def make_art(product, source):
    col, row = product["tile"]
    cell_w = source.width / 4
    cell_h = source.height / 3
    x0 = int(col * cell_w) + 6
    y0 = int(row * cell_h) + 6
    x1 = int((col + 1) * cell_w) - 6
    y1 = int((row + 1) * cell_h) - 6
    tile = source.crop((x0, y0, x1, y1))

    scene = tile
    base = cover_resize(scene, OUT_SIZE).convert("RGBA")
    base = ImageEnhance.Brightness(base).enhance(1.62)
    base = ImageEnhance.Color(base).enhance(1.34)
    base = ImageEnhance.Contrast(base).enhance(1.12)

    blur = cover_resize(tile.filter(ImageFilter.GaussianBlur(12)), OUT_SIZE).convert("RGBA")
    canvas = Image.blend(blur, base, 0.92)
    accent = product["accent"]
    accent2 = product["accent2"]

    composite_rect(canvas, (0, 0, OUT_SIZE[0], OUT_SIZE[1]), (0, 0, 0, 4))
    composite_rect(canvas, (0, 408, OUT_SIZE[0], OUT_SIZE[1]), (2, 5, 12, 176))
    composite_rect(canvas, (0, 0, OUT_SIZE[0], 142), (2, 5, 12, 30))

    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.line((0, 406, OUT_SIZE[0], 406), fill=accent + (210,), width=4)
    draw.line((0, 672, OUT_SIZE[0], 672), fill=accent2 + (190,), width=5)

    for i in range(6):
        y = 78 + i * 18
        draw.line((840 + i * 24, y, 1120 + i * 10, y), fill=accent2 + (48,), width=3)

    rounded_rect(draw, (34, 34, 242, 74), 12, (0, 0, 0, 150), accent2 + (230,), 2)
    draw.ellipse((50, 45, 68, 63), outline=accent2 + (255,), width=3)
    draw.text((82, 44), "LEGAL & COMPLIANT", font=FONT_TINY, fill=(255, 255, 255, 245))

    rounded_rect(draw, (34, 428, 330, 468), 10, (0, 0, 0, 165), accent + (230,), 2)
    draw.text((54, 438), product["label"].upper(), font=FONT_LABEL, fill=accent + (255,))

    title_font = FONT_TITLE if len(product["title"]) <= 31 else FONT_TITLE_SMALL
    lines = wrap_text(draw, product["title"].upper(), title_font, 760)
    y = 486
    for line in lines:
        shadow_offset = 3
        draw.text((38 + shadow_offset, y + shadow_offset), line, font=title_font, fill=(0, 0, 0, 210))
        draw.text((38, y), line, font=title_font, fill=(255, 255, 255, 252))
        y += int(title_font.size * 0.96)

    price_box = (870, 472, 1164, 544)
    rounded_rect(draw, price_box, 14, (0, 0, 0, 174), accent + (235,), 2)
    price_bbox = draw.textbbox((0, 0), product["price"], font=FONT_PRICE)
    draw.text((price_box[2] - 24 - (price_bbox[2] - price_bbox[0]), 488), product["price"], font=FONT_PRICE, fill=accent + (255,))

    chip_x = 38
    chip_y = 620
    for chip in product["chips"]:
        chip_w = min(330, draw.textbbox((0, 0), chip, font=FONT_CHIP)[2] + 30)
        rounded_rect(draw, (chip_x, chip_y, chip_x + chip_w, chip_y + 32), 9, (4, 9, 18, 192), accent2 + (150,), 1)
        draw.text((chip_x + 15, chip_y + 8), chip, font=FONT_CHIP, fill=(229, 244, 255, 238))
        chip_x += chip_w + 12

    draw.text((956, 34), "GTA MONEY TEAM", font=FONT_BODY, fill=(255, 255, 255, 230))
    draw.text((956, 62), "LUX AUTOMATON", font=FONT_TINY, fill=accent2 + (255,))

    return canvas.convert("RGB")


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Missing source image: {SOURCE}")
    ART_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    for product in PRODUCTS:
        image = make_art(product, source)
        image.save(ART_DIR / f"{product['id']}.png", "PNG", optimize=True)
        print(f"wrote {product['id']}.png")


if __name__ == "__main__":
    main()
