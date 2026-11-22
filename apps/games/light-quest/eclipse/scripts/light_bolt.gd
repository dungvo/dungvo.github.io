extends Node2D

const Combat := preload("res://scripts/combat.gd")

var velocity := Vector2.ZERO
var friendly := false
var damage := 1
var life := 1.65
var reflection := false
var reflected := false

func step(delta: float, game: Node2D) -> void:
    life -= delta
    if life <= 0:
        queue_free()
        return
    var next := global_position + velocity * delta
    var hurt_layer := Combat.HOSTILE_HURT if friendly else Combat.HERO_HURT
    var hit := Combat.ray(get_world_2d().direct_space_state, global_position, next, Combat.WORLD | hurt_layer)
    var endpoint: Vector2 = next if hit.is_empty() else hit.position
    if reflection and game.time_mode and game.sky.timeline.arrow_trigger(global_position,endpoint,reflected):
        if reflected:
            queue_free()
        else:
            reflected = true
            velocity.x = -velocity.x
            queue_redraw()
        return
    if hit.is_empty():
        global_position = next
        return
    var collider = hit.collider
    if reflection and not reflected and not (collider is Area2D):
        reflected = true
        global_position = hit.position+hit.normal*3
        velocity = velocity.bounce(hit.normal)
        queue_redraw()
        return
    if collider is Area2D:
        if friendly:
            collider.get_parent().take_hit(damage, game, hit.position)
        else:
            game.damage_player(damage, global_position.x)
    if not friendly or not (collider is Area2D): game.emit_impact(hit.position, Color("#97edff") if friendly else Color("#c692ff"))
    queue_free()

func _draw() -> void:
    var tint := Color("#77dfff") if friendly else Color("#a05cf3")
    var direction := velocity.normalized()
    draw_line(-direction * 20, Vector2.ZERO, Color(tint, 0.35), 7, true)
    draw_circle(Vector2.ZERO, 12, Color(tint, 0.18), true)
    draw_circle(Vector2.ZERO, 6, tint, true)
    draw_circle(Vector2.ZERO, 3, Color("#fff9e6"), true)
