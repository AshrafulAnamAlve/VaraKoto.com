import os
import math
from PIL import Image, ImageDraw, ImageOps

DARK_GREEN = (11, 79, 68, 255)       # #0B4F44
DARK_BG = (7, 31, 27, 255)          # #071F1B
CREAM = (255, 246, 229, 255)        # #FFF6E5
YELLOW = (255, 201, 60, 255)        # #FFC93C
ORANGE = (229, 87, 10, 255)         # #E5570A
SLATE = (23, 48, 43, 255)           # #17302B
TRANSPARENT = (0, 0, 0, 0)

def draw_varakoto_car(draw, offset_x, offset_y, scale, on_dark=True):
    # Base viewBox: 0 0 120 110
    def pt(x, y):
        return (offset_x + x * scale, offset_y + y * scale)

    body_color = CREAM if on_dark else DARK_GREEN
    win_color = DARK_GREEN if on_dark else CREAM
    roof_color = YELLOW if on_dark else ORANGE
    qm_color = DARK_GREEN if on_dark else CREAM

    # 1. Roof Box: x=50, y=8, w=30, h=22, rx=6
    r_box = [pt(50, 8), pt(80, 30)]
    draw.rounded_rectangle(r_box, radius=6 * scale, fill=roof_color)

    # 2. Roof Question Mark: curve M58,16 C58,11 72,11 72,16 C72,20 65,20 65,24
    # We can draw it with small points/lines
    qm_stroke_w = int(max(2, 3.2 * scale))
    # Approximate bezier curve for '?'
    curve_pts = []
    # Arc part:
    for a in range(180, -30, -10):
        rad = math.radians(a)
        cx, cy = pt(65, 14.5)
        rx, ry = 6.8 * scale, 5.0 * scale
        curve_pts.append((cx - rx * math.cos(rad), cy - ry * math.sin(rad)))
    curve_pts.append(pt(65, 19.5))
    curve_pts.append(pt(65, 23.5))
    for i in range(len(curve_pts) - 1):
        draw.line([curve_pts[i], curve_pts[i+1]], fill=qm_color, width=qm_stroke_w)
    
    # Dot of ?
    dot_r = 1.8 * scale
    dot_c = pt(65, 27.2)
    draw.ellipse([dot_c[0] - dot_r, dot_c[1] - dot_r, dot_c[0] + dot_r, dot_c[1] + dot_r], fill=qm_color)

    # 3. Car Cabin (upper body): polygon (30,56), (45,36), (54,30), (82,30), (92,36), (104,56)
    cabin_pts = [pt(30, 56), pt(45, 36), pt(54, 30), pt(82, 30), pt(92, 36), pt(104, 56)]
    draw.polygon(cabin_pts, fill=body_color)

    # 4. Car Lower Body: rect (8, 54, 104, 34), rx=14
    lower_box = [pt(8, 54), pt(112, 88)]
    draw.rounded_rectangle(lower_box, radius=14 * scale, fill=body_color)

    # 5. Windows
    win_stroke_w = int(max(1, 2.5 * scale))
    # Left window: (42,54), (52,38), (66,38), (66,54)
    win_left = [pt(42, 54), pt(52, 38), pt(66, 38), pt(66, 54)]
    draw.polygon(win_left, fill=win_color)
    # Right window: (72,54), (72,38), (82,38), (90,54)
    win_right = [pt(72, 54), pt(72, 38), pt(82, 38), pt(90, 54)]
    draw.polygon(win_right, fill=win_color)

    # 6. Lights
    # Front light (right side): x=102, y=62, w=8, h=8, rx=3
    f_light = [pt(102, 62), pt(110, 70)]
    draw.rounded_rectangle(f_light, radius=2.5 * scale, fill=ORANGE)
    # Rear light (left side): x=10, y=62, w=8, h=8, rx=3
    r_light = [pt(10, 62), pt(18, 70)]
    draw.rounded_rectangle(r_light, radius=2.5 * scale, fill=ORANGE)

    # 7. Wheels
    # Left wheel center: (32, 90), r=14
    w1_c = pt(32, 90)
    w_r = 14 * scale
    # Outer tire
    draw.ellipse([w1_c[0] - w_r, w1_c[1] - w_r, w1_c[0] + w_r, w1_c[1] + w_r], fill=SLATE, outline=body_color, width=int(max(2, 2.5 * scale)))
    # Hubcap r=6
    hub_r = 6 * scale
    draw.ellipse([w1_c[0] - hub_r, w1_c[1] - hub_r, w1_c[0] + hub_r, w1_c[1] + hub_r], fill=YELLOW)

    # Right wheel center: (90, 90), r=14
    w2_c = pt(90, 90)
    draw.ellipse([w2_c[0] - w_r, w2_c[1] - w_r, w2_c[0] + w_r, w2_c[1] + w_r], fill=SLATE, outline=body_color, width=int(max(2, 2.5 * scale)))
    draw.ellipse([w2_c[0] - hub_r, w2_c[1] - hub_r, w2_c[0] + hub_r, w2_c[1] + hub_r], fill=YELLOW)

def generate_square_icon(target_size, bg_color=DARK_GREEN, round_corners=True):
    # Render at 4x supersampling then downsample for antialiasing
    super_size = target_size * 4
    img = Image.new('RGBA', (super_size, super_size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    # Draw rounded background
    corner_r = int(super_size * 0.22) if round_corners else 0
    if round_corners:
        draw.rounded_rectangle([0, 0, super_size - 1, super_size - 1], radius=corner_r, fill=bg_color)
    else:
        draw.rectangle([0, 0, super_size - 1, super_size - 1], fill=bg_color)

    # Car occupies ~65% of the icon width
    car_w = super_size * 0.65
    scale = car_w / 120.0
    car_h = 110.0 * scale
    ox = (super_size - car_w) / 2.0
    oy = (super_size - car_h) / 2.0

    draw_varakoto_car(draw, ox, oy, scale, on_dark=True)
    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def generate_round_icon(target_size, bg_color=DARK_GREEN):
    super_size = target_size * 4
    img = Image.new('RGBA', (super_size, super_size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    # Draw circle background
    draw.ellipse([0, 0, super_size - 1, super_size - 1], fill=bg_color)

    # Car occupies ~60% of circle diameter
    car_w = super_size * 0.60
    scale = car_w / 120.0
    car_h = 110.0 * scale
    ox = (super_size - car_w) / 2.0
    oy = (super_size - car_h) / 2.0

    draw_varakoto_car(draw, ox, oy, scale, on_dark=True)
    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def generate_foreground_icon(target_size):
    # Adaptive icon foreground (108dp base, safe zone in center 66dp)
    super_size = target_size * 4
    img = Image.new('RGBA', (super_size, super_size), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    # Car occupies ~54% of 108dp (within 66dp circle)
    car_w = super_size * 0.54
    scale = car_w / 120.0
    car_h = 110.0 * scale
    ox = (super_size - car_w) / 2.0
    oy = (super_size - car_h) / 2.0

    draw_varakoto_car(draw, ox, oy, scale, on_dark=True)
    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

def generate_splash(width, height):
    # Render splash with dark background and centered logo
    img = Image.new('RGBA', (width, height), DARK_BG)
    draw = ImageDraw.Draw(img)

    # Logo size is min(width, height) * 0.35
    logo_size = min(width, height) * 0.35
    scale = logo_size / 120.0
    car_w = 120.0 * scale
    car_h = 110.0 * scale
    ox = (width - car_w) / 2.0
    oy = (height - car_h) / 2.0 - (height * 0.04)

    draw_varakoto_car(draw, ox, oy, scale, on_dark=True)
    return img

def export_all():
    res_dir = r"F:\API\VaraKoto.com\mobile-app\android\app\src\main\res"

    mipmaps = {
        'mipmap-mdpi': (48, 108),
        'mipmap-hdpi': (72, 162),
        'mipmap-xhdpi': (96, 216),
        'mipmap-xxhdpi': (144, 324),
        'mipmap-xxxhdpi': (192, 432),
    }

    for folder, (size, fg_size) in mipmaps.items():
        out_dir = os.path.join(res_dir, folder)
        os.makedirs(out_dir, exist_ok=True)
        print(f"Generating {folder} (icon: {size}x{size}, foreground: {fg_size}x{fg_size})...")

        # 1. ic_launcher.png
        icon = generate_square_icon(size, DARK_GREEN, round_corners=True)
        icon.save(os.path.join(out_dir, "ic_launcher.png"), format="PNG")

        # 2. ic_launcher_round.png
        round_icon = generate_round_icon(size, DARK_GREEN)
        round_icon.save(os.path.join(out_dir, "ic_launcher_round.png"), format="PNG")

        # 3. ic_launcher_foreground.png
        fg_icon = generate_foreground_icon(fg_size)
        fg_icon.save(os.path.join(out_dir, "ic_launcher_foreground.png"), format="PNG")

    # Generate splash screens
    splashes = {
        'drawable': (480, 800),
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (960, 1600),
        'drawable-port-xxxhdpi': (1280, 1920),
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1600, 960),
        'drawable-land-xxxhdpi': (1920, 1280),
    }

    for folder, (w, h) in splashes.items():
        out_dir = os.path.join(res_dir, folder)
        os.makedirs(out_dir, exist_ok=True)
        print(f"Generating splash in {folder} ({w}x{h})...")
        splash_img = generate_splash(w, h)
        splash_img.save(os.path.join(out_dir, "splash.png"), format="PNG")

    print("All icons and splash screens successfully generated!")

if __name__ == '__main__':
    export_all()

