extends CharacterBody2D

const Combat := preload("res://scripts/combat.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const NAMES := {"wolf":"Sói Bóng Tối", "golem":"Golem Đá", "mage":"Pháp Sư Bóng", "bat":"Dơi Pha Lê", "guardian":"Thủ Hộ Tháp Trăng"}
const SIZES := {"wolf":Vector2(52, 30), "golem":Vector2(52, 62), "mage":Vector2(30, 48), "bat":Vector2(43, 30), "guardian":Vector2(114, 118)}
const HEALTH := {"wolf":3, "golem":5, "mage":3, "bat":2, "guardian":12}
const REACH := {"wolf":82.0, "golem":94.0, "mage":300.0, "bat":130.0, "guardian":156.0}

var kind := "wolf"
var home := Vector2.ZERO
var hp := 3
var facing := -1
var state := "patrol"
var clock := 0.0
var flash := 0.0
var action_count := 0
var ranged_action := false
var goal_direction := Vector2.LEFT
var phase_two := false
var phase_flash := 0.0
var dealt_strike := false
var recoil_tween: Tween
var sprite: AnimatedSprite2D

func _ready() -> void:
    home = position
    hp = HEALTH[kind]
    collision_layer = Combat.HOSTILE
    collision_mask = Combat.WORLD
    add_child(Combat.rectangle(SIZES[kind]))
    Combat.add_hurtbox(self, Vector2(SIZES[kind]) * 0.94, Combat.HOSTILE_HURT)
    sprite = Art.attach_enemy(self)

func step(delta: float, game: Node2D) -> void:
    var had_flash := flash > 0 or phase_flash > 0
    flash = maxf(0, flash - delta)
    phase_flash = maxf(0, phase_flash - delta)
    clock = maxf(0, clock - delta)
    if state == "dead":
        modulate.a = clock / 0.36
        if clock <= 0: queue_free()
        return

    var target: Vector2 = game.hero.position - position
    var flying := kind in ["bat", "mage"]
    var guardian := kind == "guardian"
    if not flying:
        velocity.y += 1140.0 * delta

    match state:
        "patrol":
            if absf(target.x) > 7:
                facing = int(signf(target.x))
            var reach: float = REACH[kind]
            ranged_action = kind == "mage" or (guardian and phase_two and (action_count % 2 == 1 or absf(target.x) > reach))
            if ranged_action and guardian:
                reach = 380.0
            var can_attack := absf(target.x) < reach and absf(target.y) < (155.0 if flying or guardian else 54.0)
            if can_attack:
                goal_direction = target.normalized()
                if absf(goal_direction.x) < 0.1:
                    goal_direction = Vector2(facing, 0)
                action_count += 1
                _set_state("tell", 0.63 if guardian else (0.56 if kind == "golem" else 0.31))
            elif guardian:
                velocity.x = 0
            elif flying:
                var hover := home.y + sin(game.visual_clock * 2.6 + home.x) * 14.0
                var gap := 155.0 if kind == "mage" else 0.0
                var desired := Vector2(game.hero.position.x - facing * gap, hover)
                velocity = ((desired - position) * 2.2).limit_length(95.0)
            else:
                var speed := 120.0 if kind == "wolf" else 51.0
                velocity.x = facing * speed
        "tell":
            velocity.x = 0
            if flying: velocity.y = 0
            if clock <= 0:
                _set_state("strike", 0.25)
                dealt_strike = false
                if ranged_action:
                    var spread := [-0.26, 0.0, 0.26] if guardian else [0.0]
                    for angle in spread:
                        game.spawn_bolt(position, goal_direction.rotated(angle) * (298.0 if guardian else 235.0), false, 1)
                elif guardian:
                    game.emit_impact(position + Vector2(facing * 86, 51), Color("#ffc485"))
                    game.sound.play_cue("contact", 0.67)
                elif kind == "bat":
                    velocity = Vector2(target.x, target.y).normalized() * 390.0
        "strike":
            if not ranged_action:
                if kind == "wolf": velocity.x = facing * 310.0
                var reach := 124.0 if guardian else (67.0 if kind == "golem" else 52.0)
                var height := 103.0 if guardian else 53.0
                var attack := Rect2(position + Vector2(0.0 if facing > 0 else -reach, -height * 0.35), Vector2(reach, height))
                if not dealt_strike: dealt_strike = game.enemy_strike(attack, position)
            if clock <= 0:
                _set_state("recover", 0.45 if phase_two else 0.69)
        "recover":
            velocity.x = move_toward(velocity.x, 0.0, 1800.0 * delta)
            if flying:
                velocity.y = clampf((home.y - position.y) * 3.0, -200.0, 200.0)
            if clock <= 0:
                _set_state("patrol", 0)
    if not guardian:
        var bounds := Vector2(floorf(home.x / 960.0) * 960.0 + 42.0, floorf(home.x / 960.0) * 960.0 + 918.0)
        if (position.x <= bounds.x and velocity.x < 0) or (position.x >= bounds.y and velocity.x > 0):
            velocity.x = 0
        var time_factor: float = game.enemy_time_factor(position)
        velocity.x *= time_factor
        move_and_slide()
        velocity.x /= time_factor
    if sprite != null:
        sprite.flip_h = facing > 0
        sprite.modulate = Color("#ffbeb9") if flash > 0 else (Color("#ffe19a") if state == "tell" else Color.WHITE)
    if had_flash or state == "tell": queue_redraw()

func take_hit(amount: int, game: Node2D, contact_at := Vector2.INF) -> void:
    if state == "dead": return
    if kind == "guardian" and game.boss_shield_time <= 0:
        game.emit_impact(position, Color("#f7d377"))
        game._say("Lá khiên hấp thụ đòn. Dùng trụ sáng để phá khiên.", 2.0)
        return
    hp = maxi(0, hp - amount)
    if kind == "guardian" and hp > 0 and hp <= 6 and not phase_two:
        phase_two = true
        phase_flash = 0.95
        _set_state("recover", 0.95)
        game.guardian_enraged()
    flash = 0.13
    queue_redraw()
    game.enemy_feedback(self, hp == 0, contact_at, Vector2(SIZES[kind]).x * 0.5)
    game.show_damage(position, amount)
    if hp == 0:
        _set_state("dead", 0.36)
        collision_layer = 0
        get_node("Hurtbox").set_deferred("collision_layer", 0)
        if kind == "guardian": game.guardian_defeated()

func _set_state(next: String, length: float) -> void:
    state = next
    clock = length
    queue_redraw()
    if sprite != null:
        var animation := {"tell":"tell", "strike":"attack", "recover":"recover", "dead":"recover"}.get(next, "idle") as String
        if sprite.sprite_frames.has_animation(animation): sprite.play(animation)

func _draw() -> void:
    if state == "dead": return
    var dimensions: Vector2 = SIZES[kind]
    if phase_flash > 0.0:
        var radius := 92.0 + 50.0 * (1.0 - phase_flash / 0.95)
        draw_arc(Vector2(0, 6), radius, 0, TAU, 48, Color(0.79, 0.56, 1.0, phase_flash * 0.8), 4, true)
    if state == "tell" and ranged_action:
        var directions := [-0.26, 0.0, 0.26] if kind == "guardian" else [0.0]
        for angle in directions:
            var ray_end := goal_direction.rotated(angle) * (218.0 if kind == "guardian" else 160.0)
            draw_dashed_line(goal_direction * maxf(10, dimensions.x * 0.49), ray_end, Color("#df9fffaf"), 2.0, 8.0)
    if state == "tell":
        var radius := dimensions.x * 0.55 + 7.0 + sin(clock * 19.0) * 3.0
        draw_arc(Vector2(0, dimensions.y * 0.5 - 4), radius, PI + 0.12, TAU - 0.12, 28, Color("#ffbd65"), 3.0, true)
    if state == "strike" and not ranged_action:
        var center := Vector2(facing * dimensions.x * 0.63, 5)
        var angle := 0.0 if facing > 0 else PI
        draw_arc(center, dimensions.x * 0.45 + 12, angle - 0.8, angle + 0.72, 28, Color("#fbb884"), 4.0, true)
    if flash > 0 or kind == "guardian":
        var width := 138.0 if kind == "guardian" else 48.0
        var top := -dimensions.y * (0.88 if kind == "guardian" else 0.62) - 9.0
        draw_rect(Rect2(-width * 0.5, top, width, 4), Color("#130f29"))
        draw_rect(Rect2(-width * 0.5, top, width * float(hp) / float(HEALTH[kind]), 4), Color("#ff786d"))
