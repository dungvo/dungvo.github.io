extends Node2D
## Painted effects all use world-space anchors and one shared WebGL texture.
const SHEET := preload("res://assets/eclipse/combat-ink.webp")
enum { SWEEP, CONTACT, ASH, WIND }
const LIFETIMES := [0.32, 0.22, 0.62, 0.38]
var events: Array[Dictionary] = []
var small_screen := false

func play(row: int, at: Vector2, direction: int, width: float) -> void:
    if events.size() >= (9 if small_screen else 16): events.pop_front()
    events.append({"row":row, "at":at, "direction":direction, "width":width, "age":0.0})
    queue_redraw()

func tick(delta: float) -> void:
    if events.is_empty(): return
    for i in range(events.size() - 1, -1, -1):
        events[i].age += delta
        if events[i].age >= LIFETIMES[events[i].row]: events.remove_at(i)
    queue_redraw()

func reset() -> void:
    events.clear()
    queue_redraw()

func _draw() -> void:
    var cell := SHEET.get_size() / 4
    for event in events:
        var row: int = event.row
        var time: float = event.age / LIFETIMES[row]
        var frame := minf(3.0, time * 4.0)
        var index := floori(frame)
        var at: Vector2 = event.at
        if row == ASH: at.y -= 30 * time
        var width: float = event.width
        var height: float = width * [0.64, 0.90, 1.0, 0.48][row]
        var rect := Rect2(-width * 0.5, -height * 0.5, width, height)
        draw_set_transform(at, 0.0, Vector2(event.direction, 1))
        var fade := 1.0 - smoothstep(0.70, 1.0, time)
        var blend := smoothstep(0.35, 1.0, frame - index)
        draw_texture_rect_region(SHEET, rect, Rect2(Vector2(index,row)*cell,cell), Color(Color.WHITE, fade*(1-blend)))
        if blend > 0 and index < 3:
            draw_texture_rect_region(SHEET, rect, Rect2(Vector2(index+1,row)*cell,cell), Color(Color.WHITE, fade*blend))
    draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
