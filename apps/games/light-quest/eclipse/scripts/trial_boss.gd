extends "res://scripts/enemy.gd"
## Boss decisions lock before a tell: the displayed attack never tracks mid-strike.
var trial := 0
var title := ""
var max_hp := 18
var awake := false
var move_name := ""
var dodge_cooldown := 0.0
var combo_left := 0
var retreat_count := 0
var attacks_seen: Dictionary = {}
var arena := Vector2.ZERO
var tell_origin := Vector2.ZERO
var charge_direction := 1
var dodges := 0

func _ready() -> void:
    super._ready()
    hp = max_hp
    if trial == 1:
        scale = Vector2.ONE * 1.3
    sprite.modulate = Color.WHITE

func step(delta: float, game: Node2D) -> void:
    if state == "dead":
        clock = maxf(0, clock - delta)
        modulate.a = clock / 0.6
        if clock <= 0: queue_free()
        return
    if not awake: return
    flash = maxf(0, flash - delta)
    phase_flash = maxf(0, phase_flash - delta)
    dodge_cooldown = maxf(0, dodge_cooldown - delta)
    clock = maxf(0, clock - delta)
    velocity.y += 1140.0 * delta
    var target: Vector2 = game.hero.position - position
    match state:
        "patrol":
            facing = 1 if target.x >= 0 else -1
            # Ranged camping causes approach volleys; repeated melee invites a backstep.
            if game.attack_windup > 0 and absf(target.x) < 115 and dodge_cooldown <= 0:
                dodge_cooldown = 4.8
                dodges += 1
                charge_direction = -facing
                _set_state("evade", 0.24)
            elif absf(target.x) > (180.0 if trial == 2 else 120.0) and clock <= 0 and absf(target.x) < 560:
                _choose_attack(game, target)
            elif absf(target.x) < 180 and clock <= 0:
                _choose_attack(game, target)
            else:
                velocity.x = facing * (155.0 if trial == 1 else 102.0)
        "evade":
            velocity.x = charge_direction * 290.0
            if clock <= 0: _set_state("patrol", 0.35)
        "tell":
            velocity.x = 0
            if clock <= 0: _begin_strike(game)
        "strike":
            if move_name in ["rush", "pounce"]:
                velocity.x = charge_direction * (370.0 if trial == 1 else 285.0)
            else:
                velocity.x = 0
            if move_name in ["cleave", "rush", "pounce"]:
                var reach := 116.0 if trial == 0 else 86.0
                var area := Rect2(position + Vector2(0 if charge_direction > 0 else -reach, -28), Vector2(reach, 89))
                if not dealt_strike: dealt_strike = game.enemy_strike(area, position)
            elif move_name == "seal" and not dealt_strike:
                dealt_strike = true
                game.enemy_strike(Rect2(tell_origin + Vector2(-68, -32), Vector2(136, 85)), position)
                game.emit_impact(tell_origin, Color("#da9cff"))
            if clock <= 0:
                if combo_left > 0:
                    combo_left -= 1
                    charge_direction = 1 if game.hero.position.x > position.x else -1
                    facing = charge_direction
                    move_name = "cleave" if trial == 0 else "pounce"
                    _set_state("tell", 0.52)
                else:
                    _set_state("recover", 0.95 if not phase_two else 0.72)
        "recover":
            velocity.x = move_toward(velocity.x, 0, 1600 * delta)
            if clock <= 0: _set_state("patrol", 0.22)
        "phase":
            velocity.x = 0
            if clock <= 0: _set_state("patrol", 0.2)
    if (position.x <= arena.x and velocity.x < 0) or (position.x >= arena.y and velocity.x > 0): velocity.x = 0
    var time_factor: float = game.enemy_time_factor(position)
    velocity.x *= time_factor
    move_and_slide()
    velocity.x /= time_factor
    position.x = clampf(position.x, arena.x, arena.y)
    sprite.flip_h = facing > 0
    sprite.modulate = Color("#ffb9c4") if flash > 0 else (Color("#ffe2a4") if state == "tell" else Color.WHITE)
    if state in ["patrol", "evade"]:
        sprite.rotation = sin(game.visual_clock * 11) * 0.035
    else:
        sprite.rotation = 0
    queue_redraw()

func _choose_attack(game: Node2D, target: Vector2) -> void:
    action_count += 1
    charge_direction = facing
    tell_origin = Vector2(clampf(game.hero.position.x, arena.x, arena.y), 430)
    goal_direction = (game.hero.position - position).normalized()
    match trial:
        0: move_name = "rush" if absf(target.x) > 180 else "cleave"
        1: move_name = "volley" if action_count % 3 == 0 else "pounce"
        2:
            move_name = "seal" if action_count % 2 == 0 else "volley"
            if action_count % 3 == 0:
                # Blink only before the visible tell, never into the player.
                position.x = arena.x + 70 if game.hero.position.x > (arena.x + arena.y) * 0.5 else arena.y - 70
                game.emit_impact(position, Color("#b6a1ff"))
                goal_direction = (game.hero.position - position).normalized()
                facing = 1 if goal_direction.x > 0 else -1
    attacks_seen[move_name] = true
    ranged_action = move_name == "volley"
    combo_left = 1 if phase_two and move_name in ["cleave", "pounce"] else 0
    _set_state("tell", 0.84 if not phase_two else 0.68)
    game.sound.play_cue("phase", 1.25 if trial == 1 else 0.8)

func _begin_strike(game: Node2D) -> void:
    _set_state("strike", 0.38 if move_name in ["rush", "pounce"] else 0.22)
    dealt_strike = false
    if move_name == "volley":
        var angles := [-0.3, 0.0, 0.3] if phase_two else [-0.18, 0.18]
        for angle in angles:
            game.spawn_bolt(position, goal_direction.rotated(angle) * 255, false, 1)
    if move_name == "pounce" and is_on_floor(): velocity.y = -175
    game.sound.play_cue("contact", 0.72)

func take_hit(amount: int, game: Node2D) -> void:
    if state == "dead" or not awake: return
    if state in ["evade", "phase"]:
        game.emit_impact(position, Color("#b6e7ff"))
        return
    hp = maxi(0, hp - amount)
    flash = 0.12
    game.emit_impact(position, Color("#ffd3b2"))
    game.show_damage(position, amount)
    if hp == 0:
        _set_state("dead", 0.6)
        collision_layer = 0
        get_node("Hurtbox").set_deferred("collision_layer", 0)
        if is_instance_valid(game.sky) and game.sky.active: game.sky.boss_defeated()
        else: game.trials.boss_defeated()
    elif hp <= max_hp / 2 and not phase_two:
        phase_two = true
        phase_flash = 0.95
        _set_state("phase", 1.1)
        game.sound.play_cue("phase")
        game._say(title + " · PHA HAI — chú ý đòn nối tiếp!", 3)
    queue_redraw()

func reset_encounter() -> void:
    hp = max_hp
    position = home
    velocity = Vector2.ZERO
    phase_two = false
    awake = false
    combo_left = 0
    dodge_cooldown = 1.5
    modulate.a = 1
    _set_state("patrol", 0.6)

func _draw() -> void:
    if state == "dead": return
    if state == "tell":
        var tint := Color("#ffc685")
        if move_name == "seal":
            var at := tell_origin - position
            draw_rect(Rect2(at + Vector2(-68, -32), Vector2(136, 85)), Color(0.7, 0.35, 1, 0.17))
            draw_line(at + Vector2(-68, 24), at + Vector2(68, 24), tint, 4, true)
            draw_arc(at, 58, 0, TAU, 32, tint, 2, true)
        elif move_name in ["rush", "pounce"]:
            draw_dashed_line(Vector2(0, 28), Vector2(charge_direction * 190, 28), tint, 3, 10)
        elif move_name == "cleave":
            var angle := 0.0 if facing > 0 else PI
            draw_arc(Vector2.ZERO, 116, angle - 0.4, angle + 0.8, 32, tint, 3, true)
        elif move_name == "volley":
            for angle in ([-0.3, 0, 0.3] if phase_two else [-0.18, 0.18]):
                draw_dashed_line(goal_direction.rotated(angle) * 30, goal_direction.rotated(angle) * 250, tint, 2, 8)
    if state == "strike" and move_name == "cleave":
        var angle := 0.0 if facing > 0 else PI
        draw_arc(Vector2.ZERO, 110, angle - 0.4, angle + 0.8, 32, Color("#ffe2c9"), 8, true)
    if phase_flash > 0:
        draw_arc(Vector2.ZERO, 85 + 45 * (1 - phase_flash), 0, TAU, 48, Color("#c4a4ff"), 3, true)
