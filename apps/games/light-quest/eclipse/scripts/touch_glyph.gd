extends Control
## The visual face sits over an independent TouchScreenButton.
const INK := Color("#0b1729d9")
const GOLD := Color("#f1d294")
const ICE := Color("#c6e7eb")
var action := ""
var radius := 28.0
var held := false
var recovery := 0.0

func _ready() -> void:
    mouse_filter = Control.MOUSE_FILTER_IGNORE

func sync(pressed: bool, remaining: float) -> void:
    if held == pressed and absf(recovery - remaining) < 0.007: return
    held = pressed
    recovery = remaining
    queue_redraw()

func _draw() -> void:
    var at := Vector2.ONE * radius
    var trim := GOLD if action in ["attack", "burst", "interact"] else ICE
    var rim := radius - 4.0
    draw_circle(at + Vector2(0, 2), rim + 3.0, Color("#050a1566"), true, -1.0, true)
    draw_circle(at, rim, trim.darkened(0.69) if held else INK, true, -1.0, true)
    draw_arc(at, rim, 0, TAU, 46, Color(trim, 0.75 if held else 0.33), 1.15, true)
    if recovery > 0.0:
        draw_arc(at, rim - 3.0, -PI * 0.5, -PI * 0.5 + (1.0 - recovery) * TAU, 36, trim, 2.0, true)
    draw_set_transform(at, 0.0, Vector2.ONE * (1.13 if held else 1.0))
    var tint := Color(trim, 0.55) if recovery > 0.0 else trim
    match action:
        "jump", "crouch":
            var direction := -1.0 if action == "jump" else 1.0
            _path([Vector2(-9, -3 * direction), Vector2(0, 7 * direction), Vector2(9, -3 * direction)], tint)
            _path([Vector2(-6, -10 * direction), Vector2(0, -3 * direction), Vector2(6, -10 * direction)], tint)
        "attack":
            _path([Vector2(-9, 11), Vector2(10, -9), Vector2(12, -15), Vector2(6, -13), Vector2(-12, 6)], tint)
            _path([Vector2(-12, 1), Vector2(-2, 10)], tint)
        "dash":
            _path([Vector2(1, -8), Vector2(11, 0), Vector2(1, 8)], tint)
            _path([Vector2(-12, 0), Vector2(10, 0)], tint)
            _path([Vector2(-12, 6), Vector2(-6, 6)], tint)
        "burst":
            _path([Vector2(-10, 0), Vector2(0, -11), Vector2(10, 0), Vector2(0, 11), Vector2(-10, 0)], tint)
            draw_circle(Vector2.ZERO, 3, tint, true, -1.0, true)
        "skill":
            _path([Vector2(-9, -8), Vector2(9, -8), Vector2(8, 3), Vector2(0, 11), Vector2(-8, 3), Vector2(-9, -8)], tint)
            _path([Vector2(0, -4), Vector2(0, 4)], tint)
        "art":
            draw_arc(Vector2.ZERO, 10, 0.3, TAU - 0.3, 28, tint, 1.8, true)
            _path([Vector2(-5, 5), Vector2(0, -7), Vector2(5, 5)], tint)
        "interact":
            _path([Vector2(5, -7), Vector2(-5, -7), Vector2(-5, 8), Vector2(5, 8)], tint)
            _path([Vector2(-5, 0), Vector2(2, 0)], tint)

func _path(points: Array[Vector2], tint: Color) -> void:
    draw_polyline(PackedVector2Array(points), tint, 2.0, true)
