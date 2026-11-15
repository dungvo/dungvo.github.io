extends Node2D
## Virtual analog stick for mobile. Receives one finger on lower-left playfield.
## The drawn stick is fixed in game-space and never conflicts with right action buttons.
var axis := Vector2.ZERO
var finger := -1
var radius := 62.0
var deadzone := 0.18
var center := Vector2(112, 430)

func _ready() -> void:
    position = center
    z_index = 30
    set_process_input(true)
    queue_redraw()

func _input(event:InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and finger == -1 and event.position.x < 310 and event.position.y > 310:
            finger = event.index
            _move(event.position)
        elif not event.pressed and event.index == finger:
            finger = -1
            axis = Vector2.ZERO
            queue_redraw()
    elif event is InputEventScreenDrag and event.index == finger:
        _move(event.position)

func _move(point:Vector2) -> void:
    var delta := (point - center).limit_length(radius)
    axis = delta / radius
    if axis.length() < deadzone: axis = Vector2.ZERO
    queue_redraw()

func _draw() -> void:
    draw_circle(Vector2.ZERO, 79, Color("#071c2c88"))
    draw_arc(Vector2.ZERO, 66, 0, TAU, 56, Color("#c7e7dfac"), 3)
    draw_circle(axis * radius, 31, Color("#8fdbcbbd"))
    draw_arc(axis * radius, 31, 0, TAU, 38, Color("#ecf9e5"), 2)
