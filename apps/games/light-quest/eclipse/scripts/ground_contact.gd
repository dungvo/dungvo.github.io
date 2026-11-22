extends Node2D

var compression := 0.0

func _draw() -> void:
    # A soft contact patch anchors the boots to the collision line.
    draw_set_transform(Vector2(0, 1), 0.0, Vector2(1.0 + compression * 0.28, 0.23))
    draw_circle(Vector2.ZERO, 21, Color("#060c1d39"), true, -1.0, true)
    draw_circle(Vector2.ZERO, 15, Color("#05091463"), true, -1.0, true)
    draw_circle(Vector2.ZERO, 8, Color("#03071485"), true, -1.0, true)
