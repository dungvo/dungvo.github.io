extends RefCounted
## Bounds use the same local coordinates as the chapter builders. The second
## rectangle is the readable diagram, where small ledges get extra space.
const NAMES := ["Làng Trăng", "Rừng Vọng", "Hầm Bóng", "Tháp Gió",
    "Vườn Treo", "Đỉnh Nguyệt", "Đường Chân Trời", "Bờ Đá & Hải Đăng"]
const COLORS := ["#bd96df", "#9bc99e", "#ceb49b", "#8bbfdd",
    "#92cec3", "#b3a6e5", "#96b6df", "#9dbee8"]
const LOW_NAMES := [
    ["Ngõ Làng", "Mái Tháp Chuông", "Trụ Ký Ức", "Sân Chuông Tàn"],
    ["Bìa Rừng", "Lối Tán Rừng", "Trụ Tiếng Vọng", "Hang Lang Vương"],
    ["Cửa Hầm", "Hành Lang Tinh Tú", "Trụ Ký Ức", "Điện Dệt Bóng"]
]
const HIGH_NAMES := [
    ["Chân Tháp", "Tầng Mây", "Phòng Di Vật", "Thiên Chung"],
    ["Gốc Vườn", "Tán Mây", "Phòng Di Vật", "Sân Lang Vương"],
    ["Chân Đỉnh", "Vách Mây", "Phòng Di Vật", "Đỉnh Nhật Thực"]
]
const LOW_WORLD := [Rect2(0, 170, 715, 300), Rect2(715, 110, 565, 203),
    Rect2(715, 313, 565, 157), Rect2(1280, 165, 640, 305)]
const LOW_DRAW := [Rect2(47, 182, 146, 76), Rect2(214, 70, 178, 71),
    Rect2(226, 182, 154, 76), Rect2(416, 173, 144, 94)]
const HIGH_WORLD := [Rect2(0, 0, 1440, 470), Rect2(0, -640, 1440, 640),
    Rect2(0, -960, 1440, 320), Rect2(0, -1900, 1440, 940)]
const HIGH_DRAW := [Rect2(78, 255, 222, 60), Rect2(218, 180, 240, 55),
    Rect2(103, 106, 211, 54), Rect2(249, 27, 203, 60)]
const COAST_NAMES := ["Vách Biển", "Hầm Vòm", "Đài Canh", "Sân Hải Đăng", "Hầm Chuông Triều"]
const COAST_WORLD := [Rect2(0, 110, 1326, 365), Rect2(1326, 90, 1164, 410),
    Rect2(2490, -75, 1050, 345), Rect2(3540, -95, 880, 365), Rect2(0, 475, 1260, 365)]
const COAST_DRAW := [Rect2(36, 163, 120, 70), Rect2(174, 191, 118, 91),
    Rect2(312, 103, 115, 82), Rect2(448, 68, 119, 69), Rect2(31, 265, 137, 66)]
const TIME_NAMES := ["Bờ Đá", "Cầu Đồng", "Đài Canh", "Hải Đăng", "Hầm Dẫn Nước",
    "Tiệm Bà Lam", "Lối Dưới Cầu"]
const TIME_WORLD := [Rect2(0, 250, 730, 316), Rect2(730, 256, 400, 210),
    Rect2(1130, 260, 820, 205), Rect2(1950, 140, 650, 330),
    Rect2(288, 566, 490, 158), Rect2(2800, 280, 960, 187),
    Rect2(730, 466, 400, 125)]
const TIME_DRAW := [Rect2(32, 155, 117, 66), Rect2(174, 152, 104, 57),
    Rect2(305, 137, 110, 67), Rect2(449, 91, 110, 81),
    Rect2(36, 266, 130, 56), Rect2(75, 40, 151, 62),
    Rect2(185, 239, 121, 57)]
const ERAS := ["Quá khứ", "Hiện tại", "Tương lai"]
const SIZE := Vector2(600, 342)

static func names(region: int) -> Array:
    if region < 3: return LOW_NAMES[region]
    if region < 6: return HIGH_NAMES[region - 3]
    return COAST_NAMES if region == 6 else TIME_NAMES

static func bounds(region: int) -> Array:
    if region < 3: return LOW_WORLD
    if region < 6: return HIGH_WORLD
    return COAST_WORLD if region == 6 else TIME_WORLD

static func boxes(region: int) -> Array:
    if region < 3: return LOW_DRAW
    if region < 6: return HIGH_DRAW
    return COAST_DRAW if region == 6 else TIME_DRAW

static func exists(region: int, room: int, era: int, repaired: bool) -> bool:
    if region != 7: return true
    if room == 5: return era == 0
    if room == 6: return era == 2 and not repaired
    return true

static func key(region: int, room: int, era: int) -> String:
    return "%d/%d/%d" % [region, room, era if region == 7 else 0]

static func locate(region: int, position: Vector2, era: int, repaired: bool) -> int:
    var areas := bounds(region)
    var nearest := -1
    var distance := INF
    for i in areas.size():
        if not exists(region, i, era, repaired): continue
        var rect: Rect2 = areas[i]
        if rect.has_point(position): return i
        var closest := position.clamp(rect.position, rect.end)
        var gap := position.distance_squared_to(closest)
        if gap < distance:
            nearest = i
            distance = gap
    return nearest

static func project(region: int, room: int, local: Vector2, inline_label := false) -> Vector2:
    var source: Rect2 = bounds(region)[room]
    var target: Rect2 = boxes(region)[room]
    var ratio := ((local - source.position) / source.size).clamp(Vector2.ZERO, Vector2.ONE)
    if region == 4: ratio.x = 1 - ratio.x
    target = target.grow(-11)
    if inline_label:
        target.position.y += 19
        target.size.y -= 19
    return target.position + ratio * target.size

# Each leg joins gameplay that already exists. A named key resolves using live progression.
static func links(region: int, era: int, repaired: bool) -> Array:
    if region < 3: return [[0, 2, ""], [0, 1, "wind"], [1, 2, "seal"], [2, 3, "sigils"]]
    if region < 6: return [[0, 1, "crystal"], [1, 2, "bell"], [2, 3, "relic"]]
    if region == 6: return [[0, 1, "coast1"], [1, 2, "coast2"], [2, 3, "warden"], [0, 4, ""]]
    var legs := [[0, 1, ""], [2, 3, ""], [0, 4, ""]]
    if era == 0: legs.append([0, 5, ""])
    if era == 2 and not repaired:
        legs.append_array([[1, 6, ""], [6, 2, "moth"]])
    else: legs.append([1, 2, ""])
    return legs

# Cartographer's overview. IDs match the playable-area bounds above in every chapter.
const WORLD_ROOMS := [
    [Rect2(17,132,49,23), Rect2(76,100,58,20), Rect2(80,146,45,23), Rect2(141,136,46,26)],
    [Rect2(209,123,43,22), Rect2(250,69,58,21), Rect2(258,110,42,21), Rect2(322,102,44,27)],
    [Rect2(174,218,50,19), Rect2(239,190,51,20), Rect2(243,238,45,22), Rect2(318,237,48,30)],
    [Rect2(410,183,53,22), Rect2(428,137,38,23), Rect2(400,91,45,23), Rect2(429,48,40,23)],
    [Rect2(492,152,54,20), Rect2(515,112,43,22), Rect2(493,74,40,19), Rect2(525,36,51,19)],
    [Rect2(600,118,49,20), Rect2(637,85,43,21), Rect2(610,53,37,18), Rect2(648,23,47,21)],
    [Rect2(546,231,54,24), Rect2(607,257,45,24), Rect2(670,224,42,23), Rect2(726,194,55,27), Rect2(535,281,56,22)]
]
const WORLD_LABELS := [Vector2(28,92), Vector2(223,55), Vector2(199,292),
    Vector2(375,29), Vector2(493,15), Vector2(624,158), Vector2(637,302)]
