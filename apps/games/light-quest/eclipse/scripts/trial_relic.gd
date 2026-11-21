extends Node2D
## Lightweight painted-world markers, with VFX only while the room is active.
var kind := "sigil"
var caption := ""
var used := false
var time := 0.0
var tint := Color("#97e7ff")
var label: Label

func _ready() -> void:
    z_index = 2
    label = Label.new()
    label.text = caption
    label.add_theme_font_size_override("font_size", 13)
    label.add_theme_color_override("font_color", Color("#fff0c5"))
    label.add_theme_color_override("font_outline_color", Color("#08142b"))
    label.add_theme_constant_override("outline_size", 5)
    label.position = Vector2(-65, -66)
    label.size.x = 130
    label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    add_child(label)

func tick(delta: float, player: Vector2) -> void:
    time += delta
    label.visible = player.distance_to(global_position) < 150 and not used
    visible = not used or kind == "checkpoint"
    if visible: queue_redraw()

func _draw() -> void:
    var glow := 0.15 + sin(time * 2.2) * 0.06
    draw_circle(Vector2(0, -18), 28, Color(tint, glow))
    if kind == "checkpoint":
        draw_arc(Vector2(0, -22), 23, 0, TAU, 32, tint, 2, true)
        draw_line(Vector2(0, -46), Vector2(0, -4), tint, 3, true)
        draw_arc(Vector2(0, -22), 14, 0, TAU, 24, Color("#fff3d5"), 1, true)
    else:
        var cy := -22 + sin(time * 2.8) * 4
        var vertices := PackedVector2Array([Vector2(0, cy - 14), Vector2(10, cy), Vector2(0, cy + 14), Vector2(-10, cy)])
        draw_colored_polygon(vertices, Color(tint, 0.65))
        vertices.append(vertices[0])
        draw_polyline(vertices, Color("#fff4d4"), 1.5, true)
