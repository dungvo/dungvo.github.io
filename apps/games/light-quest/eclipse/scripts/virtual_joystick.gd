extends Node2D
## Movement owns one independent finger. The initial touch always starts neutral.
var axis := Vector2.ZERO
var finger := -1
var radius := 55.0
var accept_touch := true
var deadzone := 0.14
var base := Vector2(105, 452)
var center := base
var grab_origin := base
var reserved_button: TouchScreenButton

func _ready() -> void:
    z_index = 30
    set_process_input(true)

func _input(event: InputEvent) -> void:
    if not accept_touch: return
    if event is InputEventScreenTouch:
        if event.index == finger and (not event.pressed or event.canceled):
            release_finger()
        elif event.pressed and finger == -1 and _in_move_area(event.position):
            finger = event.index
            grab_origin = event.position
            center = event.position.clamp(Vector2(68, 394), Vector2(197, 470))
            _move(event.position)
    elif event is InputEventScreenDrag and event.index == finger:
        _move(event.position)

func _in_move_area(point: Vector2) -> bool:
    if not Rect2(0, 331, 250, 209).has_point(point): return false
    if is_instance_valid(reserved_button) and reserved_button.is_visible_in_tree():
        if point.distance_to(reserved_button.position) <= reserved_button.shape.radius: return false
    return true

func release_finger() -> void:
    finger = -1
    axis = Vector2.ZERO
    center = base
    grab_origin = base
    queue_redraw()

func _move(point: Vector2) -> void:
    var delta := (point - grab_origin).limit_length(radius)
    var amount := maxf(0, (delta.length() / radius - deadzone) / (1.0 - deadzone))
    axis = delta.normalized() * amount
    queue_redraw()

func _draw() -> void:
    var trim := Color("#c6e7eb9a") if finger >= 0 else Color("#c6e7eb50")
    draw_circle(center, 51, Color("#09152695"), true, -1.0, true)
    draw_arc(center, 50, 0, TAU, 48, trim, 1.4, true)
    draw_line(center + Vector2(-36, 0), center + Vector2(36, 0), Color("#c6e7eb31"), 1.0, true)
    var knob := center + axis * 34.0
    draw_circle(knob, 17, Color("#345269d6"), true, -1.0, true)
    draw_arc(knob, 17, 0, TAU, 32, trim, 1.45, true)
