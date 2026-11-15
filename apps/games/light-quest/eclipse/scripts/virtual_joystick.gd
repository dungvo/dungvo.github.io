extends Node2D
## Floating joystick, independent finger tracking for iPhone multi-touch.
## Left thumb owns joystick; right fingers remain free for jump + combat.
var axis := Vector2.ZERO
var finger := -1
var radius := 55.0
var accept_touch := true
var deadzone := 0.14
var base := Vector2(105, 452)
var center := base

func _ready() -> void:
    position = Vector2.ZERO
    z_index = 30
    set_process_input(true)
    queue_redraw()

func _input(event: InputEvent) -> void:
    if not accept_touch: return
    if event is InputEventScreenTouch:
        if event.pressed and finger == -1 and event.position.x < 250.0 and event.position.y > 331.0:
            finger = event.index
            center = event.position.clamp(Vector2(68,394),Vector2(197,470))
            _move(event.position)
        elif not event.pressed and event.index == finger:
            release_finger()
    elif event is InputEventScreenDrag and event.index == finger:
        _move(event.position)

func release_finger() -> void:
    finger = -1
    axis = Vector2.ZERO
    center = base
    queue_redraw()

func _move(point: Vector2) -> void:
    var delta := (point-center).limit_length(radius)
    var amount := maxf(0, (delta.length() / radius - deadzone) / (1.0 - deadzone))
    axis = delta.normalized() * amount
    queue_redraw()

func _draw() -> void:
    draw_circle(center, 63, Color("#071c2c88"))
    draw_arc(center, 59, 0, TAU, 56, Color("#c7e7dfac"), 3)
    draw_circle(center + axis*radius, 25, Color("#8fdbcbbd"))
    draw_arc(center + axis*radius, 25, 0, TAU, 38, Color("#ecf9e5"), 2)
