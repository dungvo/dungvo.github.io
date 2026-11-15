extends Node2D

signal completed

const Art := preload("res://scripts/eclipse_art.gd")

const SOURCE := Vector2(110, 332)
const MIRRORS := [Vector2(329, 332), Vector2(329, 407)]
const RECEIVER := Vector2(687, 407)
const REACH := 115.0

var turned := [false, false]
var solved := false
var hovered := -1
var mirror: Texture2D
var pedestal: Texture2D

func _ready() -> void:
    z_index = 2
    mirror = Art.ruin(4)
    pedestal = Art.ruin(5)

func restore_solved() -> void:
    turned = [true, true]
    solved = true
    queue_redraw()

func set_player_position(point: Vector2) -> void:
    var nearest := _nearest(point)
    if hovered != nearest:
        hovered = nearest
        queue_redraw()

func _nearest(point: Vector2) -> int:
    var nearest := -1
    var distance := REACH
    for i in range(MIRRORS.size()):
        var candidate := point.distance_to(global_position + MIRRORS[i])
        if candidate < distance:
            distance = candidate
            nearest = i
    return nearest

func rotate_near(point: Vector2) -> bool:
    var target := _nearest(point)
    if target == -1: return false
    if solved: return true
    turned[target] = not turned[target]
    if turned.all(func(value): return value):
        solved = true
        completed.emit()
    queue_redraw()
    return true

func _draw() -> void:
    var first: Vector2 = MIRRORS[0]
    var second: Vector2 = MIRRORS[1]
    draw_texture_rect(pedestal, Rect2(SOURCE + Vector2(-22, -26), Vector2(44, 71)), false)
    draw_texture_rect(pedestal, Rect2(RECEIVER + Vector2(-25, -27), Vector2(50, 76)), false, Color.WHITE if solved else Color("#7c87af"))
    for point in MIRRORS:
        draw_texture_rect(mirror, Rect2(point + Vector2(-21, -30), Vector2(42, 68)), false)
    _beam(SOURCE, first)
    if turned[0]:
        _beam(first, second)
        _beam(second, RECEIVER if turned[1] else second + Vector2(-225, 0))
    else:
        _beam(first, first + Vector2(0, -144))
    for i in range(MIRRORS.size()):
        var center: Vector2 = MIRRORS[i]
        var tilt := 1.0 if turned[i] else -1.0
        draw_line(center + Vector2(-9, -10 * tilt), center + Vector2(9, 10 * tilt), Color("#baf4ff"), 2, true)
        if hovered == i and not solved:
            draw_string(ThemeDB.fallback_font, center + Vector2(-21, -24), "E · Xoay", HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color("#fff0ba"))

func _beam(start: Vector2, end: Vector2) -> void:
    draw_line(start, end, Color("#ff9a353b"), 14, true)
    draw_line(start, end, Color("#ffce60ba"), 6, true)
    draw_line(start, end, Color("#fff4b6"), 2, true)
