extends Node2D
## Floating joystick, independent finger tracking for iPhone multi-touch.
## Left thumb owns joystick; right fingers remain free for jump + combat.
var axis := Vector2.ZERO
var finger := -1
var radius := 64.0
var deadzone := 0.14
var base := Vector2(112, 430)
var center := Vector2(112,430)

func _ready() -> void:
    position = Vector2.ZERO
    z_index = 30
    set_process_input(true)
    queue_redraw()

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and finger == -1 and event.position.x < 330.0 and event.position.y > 270.0:
            finger = event.index
            center = event.position.clamp(Vector2(80,330),Vector2(245,465))
            _move(event.position)
        elif not event.pressed and event.index == finger:
            finger = -1
            axis = Vector2.ZERO
            center = base
            queue_redraw()
    elif event is InputEventScreenDrag and event.index == finger:
        _move(event.position)

func _move(point: Vector2) -> void:
    var delta := (point-center).limit_length(radius)
    axis = delta/radius
    if axis.length()<deadzone: axis = Vector2.ZERO
    queue_redraw()

func _draw() -> void:
    draw_circle(center, 78, Color("#071c2c88"))
    draw_arc(center, 67, 0, TAU, 56, Color("#c7e7dfac"), 3)
    draw_circle(center + axis*radius, 32, Color("#8fdbcbbd"))
    draw_arc(center + axis*radius, 32, 0, TAU, 38, Color("#ecf9e5"), 2)
