extends Node2D
## Draw a continuous health bar.

var current := 5
var capacity := 5

func show_health(value: int, maximum: int) -> void:
    if current == value and capacity == maximum: return
    current = value
    capacity = maximum
    queue_redraw()

func _draw() -> void:
    var frame := Rect2(0,2,144,12)
    draw_rect(frame,Color("#241d32"))
    draw_rect(Rect2(2,4,140*clampf(float(current)/maxi(1,capacity),0,1),8),Color("#db5364"))
    draw_rect(frame,Color("#e2bc88"),false,1)
