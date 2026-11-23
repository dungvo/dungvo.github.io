extends Node2D
## Draw health icons independently of the platform font or emoji support.

const POINTS := [
    Vector2(0, 7), Vector2(2, 3), Vector2(6, 1), Vector2(10, 2), Vector2(13, 5),
    Vector2(16, 2), Vector2(20, 1), Vector2(24, 3), Vector2(26, 7),
    Vector2(25, 12), Vector2(21, 17), Vector2(13, 24), Vector2(5, 17), Vector2(1, 12)
]

var heart := PackedVector2Array(POINTS)
var outline := PackedVector2Array(POINTS)
var current := 5
var capacity := 5

func _ready() -> void:
    outline.append(POINTS[0])

func show_health(value: int, maximum: int) -> void:
    if current == value and capacity == maximum: return
    current = value
    capacity = maximum
    queue_redraw()

func _draw() -> void:
    for slot in range(capacity):
        draw_set_transform(Vector2(slot * 23, 0), 0, Vector2.ONE * 0.72)
        var filled := slot < current
        draw_colored_polygon(heart, Color("#f25466") if filled else Color("#19192c"))
        draw_polyline(outline, Color("#ffd2a1") if filled else Color("#a49cbd"), 1.35, true)
        if filled:
            draw_line(Vector2(4, 8), Vector2(7, 5), Color("#ffb59f"), 1.4, true)
