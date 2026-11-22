extends Node2D

const Art := preload("res://scripts/eclipse_art.gd")
var current := 5
var capacity := 5
var face: Texture2D
var who := ""

func show_health(value: int, maximum: int) -> void:
    if current == value and capacity == maximum: return
    current = value
    capacity = maximum
    queue_redraw()

func show_hero(name_text: String) -> void:
    if who == name_text: return
    who = name_text
    face = Art.portrait(who == "Kha", true)
    queue_redraw()

func _draw() -> void:
    var frame := PackedVector2Array([Vector2(-20,0),Vector2(152,0),Vector2(144,14),Vector2(-20,14)])
    draw_colored_polygon(frame,Color("#271929"))
    var amount := clampf(float(current) / maxi(capacity, 1), 0, 1)
    if amount > 0.001:
        var right := -12 + 158 * amount
        var tip := minf(6.0, 146 * amount)
        draw_polygon(PackedVector2Array([Vector2(-14,3),Vector2(right,3),Vector2(right-tip,11),Vector2(-14,11)]),
            PackedColorArray([Color("#f9a19a"),Color("#fc8991"),Color("#a32d53"),Color("#832c4a")]))
    frame.append(frame[0])
    draw_polyline(frame,Color("#d9bf8b"),1.2,true)
    if face:
        var center := Vector2(-33,7)
        var points := PackedVector2Array()
        var uv := PackedVector2Array()
        var atlas := face as AtlasTexture
        for i in range(40):
            var unit := Vector2.from_angle(i * TAU / 40)
            points.append(center + unit * 20.0)
            uv.append((atlas.region.position + (unit*0.5 + Vector2(0.5,0.5))*atlas.region.size) / atlas.atlas.get_size())
        draw_circle(center,23,Color("#171c2a"),true,-1,true)
        draw_polygon(points,PackedColorArray([Color.WHITE]),uv,atlas.atlas)
        draw_arc(center,21,0,TAU,40,Color("#f2dab0"),1.6,true)
        draw_arc(center,24,0.2,PI*1.45,40,Color("#958267"),1,true)
