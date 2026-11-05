"""Generate logo.png (400x400): four rounded tiles in a 2x2 grid and a bar, on a dark ground. Standard library only,
no third-party marks. Run: python3 make_logo.py"""
import struct
import zlib

S = 400
BG = (22, 32, 48)
px = [[BG] * S for _ in range(S)]


def rrect(x0, y0, x1, y1, r, c):
    for y in range(y0, y1):
        for x in range(x0, x1):
            dx = max(x0 + r - x, 0, x - (x1 - r - 1))
            dy = max(y0 + r - y, 0, y - (y1 - r - 1))
            if dx * dx + dy * dy <= r * r:
                px[y][x] = c


cols = [(78, 168, 222), (120, 200, 160), (240, 180, 80), (225, 110, 120)]
m, g, t = 70, 24, 108
for i, c in enumerate(cols):
    x = m + (i % 2) * (t + g)
    y = m + (i // 2) * (t + g)
    rrect(x, y, x + t, y + t, 18, c)
rrect(m, 330, S - m, 346, 8, (235, 238, 245))


def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data))


raw = b"".join(b"\x00" + bytes(v for p in row for v in p) for row in px)
png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", S, S, 8, 2, 0, 0, 0))
       + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
open("logo.png", "wb").write(png)
