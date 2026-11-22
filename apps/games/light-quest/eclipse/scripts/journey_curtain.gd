extends Control
## A brief painted chapter transition that never interrupts input.
const GOLD := Color("#ffe6ab")
var name_text := ""
var tween: Tween

func show_region(value: String) -> void:
    if tween and tween.is_valid(): tween.kill()
    name_text = value
    mouse_filter = Control.MOUSE_FILTER_IGNORE
    modulate.a = 0.0
    show()
    queue_redraw()
    tween = create_tween()
    tween.tween_property(self, "modulate:a", 1.0, 0.19)
    tween.tween_interval(0.85)
    tween.tween_property(self, "modulate:a", 0.0, 0.33)
    tween.tween_callback(hide)

func _draw() -> void:
    var at := Vector2(480, 215)
    var glyph := PackedVector2Array([at + Vector2(0, -77), at + Vector2(7, -70),
        at + Vector2(0, -63), at + Vector2(-7, -70)])
    draw_rect(Rect2(242, 147, 476, 105), Color("#050d22b0"))
    draw_polyline(PackedVector2Array([Vector2(278, 223), Vector2(682, 223)]), GOLD, 1.0, true)
    draw_colored_polygon(glyph, GOLD)
    draw_string(ThemeDB.fallback_font, Vector2(243, 203), name_text, HORIZONTAL_ALIGNMENT_CENTER, 474, 34, GOLD)
