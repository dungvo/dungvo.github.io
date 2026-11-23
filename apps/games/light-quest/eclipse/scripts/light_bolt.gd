extends Node2D

const Combat := preload("res://scripts/combat.gd")

var velocity := Vector2.ZERO
var friendly := false
var damage := 1
var life := 1.65

func step(delta: float, game: Node2D) -> void:
    life -= delta
    if life <= 0:
        queue_free()
        return
    var next := global_position + velocity * delta
    var hurt_layer := Combat.HOSTILE_HURT if friendly else Combat.HERO_HURT
    var hit := Combat.ray(get_world_2d().direct_space_state, global_position, next, Combat.WORLD | hurt_layer)
    if hit.is_empty():
        global_position = next
        return
    var collider = hit.collider
    if collider is Area2D:
        if friendly:
            collider.get_parent().take_hit(damage, game)
        else:
            game.damage_player(damage, global_position.x)
    game.emit_impact(hit.position, Color("#97edff") if friendly else Color("#c692ff"))
    queue_free()

func _draw() -> void:
    var tint := Color("#77dfff") if friendly else Color("#a05cf3")
    var direction := velocity.normalized()
    draw_line(-direction * 20, Vector2.ZERO, Color(tint, 0.35), 7, true)
    draw_circle(Vector2.ZERO, 12, Color(tint, 0.18), true)
    draw_circle(Vector2.ZERO, 6, tint, true)
    draw_circle(Vector2.ZERO, 3, Color("#fff9e6"), true)
