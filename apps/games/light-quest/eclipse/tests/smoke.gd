extends SceneTree

const Combat := preload("res://scripts/combat.gd")

func _initialize() -> void:
    call_deferred("_run")

func ensure(value: bool, label: String) -> bool:
    if not value:
        push_error("ECLIPSE TEST FAILED: " + label)
        quit(1)
    return value

func _run() -> void:
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.activated = false
    if not ensure(game.enemies.size() == 9, "eight foes and one guardian"): return
    for character in ["Kha", "An"]:
        game._start(character)
        for mode in ["idle", "run", "jump", "fall", "dash", "attack", "hurt", "death"]:
            if not ensure(game.actor_anim.sprite_frames.has_animation(mode), character + " / " + mode): return

    var wolf = game.enemies[0]
    game.hero.position = wolf.position + Vector2(-69, -9)
    await _frames(3)
    var original_hp: int = wolf.hp
    game.facing = -1
    game._request_attack()
    await _frames(10)
    if not ensure(wolf.hp == original_hp, "left-facing slash misses an enemy to the right"): return
    game.attack_cooldown = 0
    game.facing = 1
    var wall := StaticBody2D.new()
    wall.position = (game.hero.position + wolf.position) * 0.5
    wall.add_child(Combat.rectangle(Vector2(12, 130)))
    game.add_child(wall)
    await _frames(3)
    game._request_attack()
    await _frames(10)
    if not ensure(wolf.hp == original_hp, "wall blocks directional slash"): return
    game.spawn_bolt(game.hero.position, Vector2(8500, 0), true, 1)
    await _frames(3)
    if not ensure(wolf.hp == original_hp, "swept light bolt stops at wall"): return
    wall.queue_free()
    await _frames(3)
    game.spawn_bolt(game.hero.position, Vector2(8500, 0), true, 1)
    await _frames(4)
    if not ensure(wolf.hp == original_hp - 1, "swept light bolt strikes at high speed"): return
    game.attack_cooldown = 0
    game.combo_window = 0
    game._request_attack()
    await _frames(9)
    if not ensure(wolf.hp < original_hp - 1, "right-facing slash reaches the wolf through its Area2D"): return
    game.hero.position = Vector2(3 * 960 + 329, 351)
    await _frames(2)
    game._interact()
    if not ensure(not game.activated and game.light_circuit.turned[0], "one mirror redirects beam"): return
    game.hero.position = Vector2(3 * 960 + 329, 430)
    game._interact()
    await _frames(2)
    if not ensure(game.activated and not game.has_node("LightGate"), "second mirror opens gate"): return

    game.hero.position = Vector2(2 * 960 + 570, 432)
    game._interact()
    game._interact()
    if not ensure(game.found_chest and game.max_health == 6, "chest increases maximum health once"): return

    var boss = game.guardian
    game.hero.position = Vector2(6 * 960 + 430, 432)
    await _frames(2)
    var boss_hp: int = boss.hp
    boss.take_hit(1, game)
    if not ensure(boss.hp == boss_hp, "guardian shield rejects attack"): return
    game._interact()
    if not ensure(game.boss_shield_time > 0, "arena pedestal drops guardian shield"): return
    boss.take_hit(boss_hp - 5, game)
    if not ensure(boss.hp == 5, "phase transition crosses half health"): return
    boss.take_hit(5, game)
    if not ensure(game.boss_dead and game.moon_dash, "guardian victory unlocks dash"): return

    game.hero.position = Vector2(490, 432)
    game.i_frames = 0
    await _frames(3)
    _finger(0, Vector2(105, 452), true)
    var drag := InputEventScreenDrag.new()
    drag.index = 0
    drag.position = Vector2(154, 452)
    root.push_input(drag, true)
    _finger(1, Vector2(880, 379), true)
    _finger(2, Vector2(805, 449), true)
    await _frames(6)
    if not ensure(game.joystick.axis.x > 0.6 and game.hero.velocity.x > 0 and game.hero.velocity.y < 0 and game.attack_cooldown > 0,
            "three simultaneous fingers handle move, jump and attack"): return
    _finger(2, Vector2(805, 449), false)
    _finger(1, Vector2(880, 379), false)
    _finger(0, Vector2(154, 452), false)
    await _frames(2)
    if not ensure(game.joystick.axis == Vector2.ZERO and not game.touch["jump"], "release clears joystick and jump"): return
    var short_height := await _jump_height(game, 1)
    var long_height := await _jump_height(game, 23)
    print("Jump tap and hold rise: %.1f and %.1f px" % [short_height, long_height])
    if not ensure(short_height > 22 and long_height > short_height + 38, "held jump rises higher than tap jump"): return
    game._dash()
    await _frames(2)
    if not ensure(game.hero.velocity.x > 420, "dash applies high-speed horizontal motion"): return
    print("ECLIPSE SMOKE PASS: actors, directional melee, wall obstruction, swept bolts, mirrors, guardian, three-finger input")
    quit(0)

func _jump_height(game: Node2D, hold: int) -> float:
    game.hero.position = Vector2(490, 432)
    game.hero.velocity = Vector2.ZERO
    await _frames(4)
    _finger(1, Vector2(880, 379), true)
    var highest: float = game.hero.position.y
    for frame in range(40):
        if frame == hold: _finger(1, Vector2(880, 379), false)
        await physics_frame
        highest = minf(highest, game.hero.position.y)
    return 432.0 - highest

func _frames(amount: int) -> void:
    for frame in range(amount):
        await physics_frame

func _finger(index: int, point: Vector2, down: bool) -> void:
    var event := InputEventScreenTouch.new()
    event.index = index
    event.position = point
    event.pressed = down
    root.push_input(event, true)
