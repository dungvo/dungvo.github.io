extends SceneTree
## Play one continuous run using the hero's actual controller and physics.

var game: Node2D

func _initialize() -> void:
    call_deferred("_run")

func check(value: bool, detail: String) -> bool:
    if not value:
        push_error("CAMPAIGN FAILED: " + detail)
        quit(1)
    return value

func _run() -> void:
    game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game._start("Kha")

    if not await _walk_to(290): return
    game._interact()
    if not check(game.met_npc and game.dialogue.visible, "speak to the keeper"): return
    game._interact()

    if not await _walk_to(2 * 960 + 570): return
    game._interact()
    if not check(game.found_chest and game.max_health == 6, "retrieve Moonstone on the route"): return

    if not await _walk_to(3 * 960 + 329): return
    game._interact()
    if not check(not game.light_circuit.turned[0] and game.light_circuit.turned[1], "upper mirror requires elevation"): return
    game._control_pressed("jump")
    for frame in range(32):
        await physics_frame
    game._control_released("jump")
    if not check(game.hero.position.y < 366, "jump onto the upper mirror platform"): return
    game._interact()
    if not check(game.activated and game.light_circuit.solved, "upper mirror directs beam to gate"): return

    if not await _walk_to(5 * 960 + 260): return
    game._interact()
    if not check(game.checkpoint.x > 5 * 960 and game.health == 6, "cross the gate and save at the observatory"): return

    if not await _walk_to(6 * 960 + 432): return
    game._interact()
    if not check(game.boss_shield_time > 0, "break the first shield"): return
    var observed_second_phase := false
    var observed_fan := false
    for frame in range(1400):
        if game.boss_dead: break
        if game.hero.position.x < 6 * 960:
            push_error("CAMPAIGN FAILED: guardian defeated the player")
            quit(1)
            return
        if game.guardian.phase_two: observed_second_phase = true
        if game.bolts.filter(func(bolt): return is_instance_valid(bolt) and not bolt.friendly).size() >= 3:
            observed_fan = true
        if game.boss_shield_time <= 0 and game.boss_pedestal_cooldown <= 0:
            game._interact()
        if frame % 23 == 0:
            game._request_attack()
        if game.health < 6 and game.shield_cooldown == 0:
            game._skill()
        await physics_frame
    if not check(observed_second_phase and observed_fan, "actual combat reaches the three-bolt phase"): return
    if not check(game.boss_dead and game.moon_dash, "use real Kha bolts to defeat the guardian"): return
    while not game.victory_panel.visible:
        await physics_frame
    game._dismiss_victory()
    if not check(not game.victory_panel.visible and game.joystick.accept_touch, "victory can return to exploration"): return
    print("ECLIPSE CAMPAIGN PASS: keeper, Moonstone, platform jump, mirror, gate, checkpoint, both boss phases and victory")
    quit(0)

func _walk_to(x: float) -> bool:
    for frame in range(2500):
        if absf(game.hero.position.x - x) < 13.0:
            game.joystick.axis = Vector2.ZERO
            for index in range(6):
                await physics_frame
            return true
        game.joystick.axis = Vector2(signf(x - game.hero.position.x), 0)
        if frame % 22 == 0:
            game._request_attack()
        if game.health < 5 and game.shield_cooldown == 0:
            game._skill()
        await physics_frame
    return check(false, "walk to %.0f; actual %.1f" % [x, game.hero.position.x])
