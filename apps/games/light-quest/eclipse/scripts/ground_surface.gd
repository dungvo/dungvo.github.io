extends Node2D
## The origin is the exact top of the corresponding collider. All stone is below it.
const Art := preload("res://scripts/eclipse_art.gd")
var width := 0.0
var depth := 0.0
var masonry := false
var collider: PhysicsBody2D
var stone: Texture2D

func _ready() -> void:
    stone = Art.ruin(2 if masonry else 0)

func _draw() -> void:
    var sections := maxi(1, ceili(width / (219.0 if masonry else 189.0)))
    var section := width / sections
    for i in range(sections):
        var x := section * i
        var inset := minf(10, section * 0.15)
        var stone_floor := PackedVector2Array([Vector2(x, 0), Vector2(x + section, 0),
            Vector2(x + section - inset, depth * 0.77), Vector2(x + section * 0.68, depth),
            Vector2(x + section * 0.32, depth * 0.9), Vector2(x + inset, depth * 0.71)])
        if not masonry:
            draw_polygon(stone_floor, PackedColorArray([Color("#3b4a55"), Color("#334453"),
                Color("#101c33"), Color("#10182b"), Color("#10182b"), Color("#19263d")]))
        # A shadowed cap fills gaps in the picture. The moss leaves may extend above it.
        draw_rect(Rect2(x, 0, section, minf(depth, 6)), Color("#3d4b3c"))
        var overhang := minf(depth * 0.14, 9.0)
        draw_texture_rect(stone, Rect2(x, -overhang, section, depth + overhang), false, Color("#b0b9c9"))
    draw_line(Vector2(0, 0.5), Vector2(width, 0.5), Color("#a7b99d53"), 1.0)
    for i in range(0, int(width), 11):
        var phase := (i * 13) % 7
        draw_line(Vector2(i, 1), Vector2(minf(width, i + 4 + phase), 1), Color("#b6bd9770"), 1.0)

func lip() -> Rect2:
    return Rect2(global_position, Vector2(width, 1))
