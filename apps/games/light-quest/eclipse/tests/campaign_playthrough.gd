extends SceneTree
## Six complete runs: real controller, collision queries and damage, without teleporting,
## inflating health, editing enemy HP, disabling AI or calling take_hit.
var game: Node2D
var failed := false

func _initialize() -> void:
    call_deferred("_run")

func check(value: bool, detail: String) -> bool:
    if not value:
        failed = true
        push_error("CHAPTER PLAYTHROUGH FAILED: " + detail)
        quit(1)
    return value

func _run() -> void:
    for who in ["An", "Kha"]:
        for chapter in range(3):
            game = load("res://scenes/main.tscn").instantiate()
            game.save_enabled = false
            root.add_child(game)
            game.demo_room_select.select(chapter)
            game._start(who)
            game._interact() # dismiss introduction
            if not await _complete_ground(chapter, who): return
            game.queue_free()
            await process_frame
    print("ECLIPSE SIX RUNS PASS: 3 chapters x An/Kha, actual movement and attacks, sigils, checkpoint, moving boss, phase two and victory")
    quit(0)

func _complete_ground(chapter: int, who: String) -> bool:
    var start := chapter * 1920.0
    if chapter == 0:
        if not await _walk_to(start + 290): return false
        game._interact()
        if not check(game.met_npc and game.dialogue.visible, "keeper quest"): return false
        game._interact()
    if not await _walk_to(start + 335): return false
    if not await _collect_sigil(1): return false
    if not await _get_secret(chapter): return false
    if not await _walk_to(start + 1010): return false
    game._interact()
    if not check(game.trials.saved[chapter] and absf(game.checkpoint.x - (start + 1010)) < 1, "checkpoint " + who): return false
    if not await _walk_to(start + 1120): return false
    if not await _collect_sigil(2): return false
    if not await _walk_to(start + 1390): return false
    var boss = game.trials.boss
    if not check(boss.awake, "boss arena starts"): return false
    var observed_phase := false
    var initial_x: float = boss.position.x
    var movement := 0.0
    for frame in range(2400):
        if not is_instance_valid(boss) or boss.state == "dead": break
        if not check(game.death_time <= 0 and game.hero.position.x > start + 1290, "%s chapter %d: died at frame %d boss hp %d" % [who, chapter, frame, boss.hp]): return false
        observed_phase = observed_phase or boss.phase_two
        movement = maxf(movement, absf(boss.position.x - initial_x))
        var gap: float = boss.position.x - game.hero.position.x
        var direction: float = signf(gap)
        var axis := 0.0
        if who == "An":
            axis = direction if absf(gap) > 72 else 0.0
        else:
            if absf(gap) > 255: axis = direction
            elif absf(gap) < 155: axis = -direction
        game.joystick.axis = Vector2(axis, 0)
        game.facing = int(direction) if direction != 0 else 1
        if frame % 16 == 0: game._request_attack()
        if who == "Kha" and game.health < game.max_health and game.shield_cooldown <= 0: game._skill()
        if who == "An" and boss.state == "tell" and boss.clock < 0.25 and absf(gap) < 170: game._skill()
        if boss.state == "tell" and boss.clock < 0.13:
            if who == "Kha" or game.shield_cooldown > 0.6:
                game._control_pressed("jump")
        elif boss.state != "tell": game._control_released("jump")
        await physics_frame
    game.joystick.axis = Vector2.ZERO
    game._control_released("jump")
    if not check(observed_phase and movement > 35, "boss moves and changes phase"): return false
    if not check(game.trials.wins[chapter], "boss defeated by actual %s attacks / chapter %d; hp %s" % [who, chapter, str(boss.hp) if is_instance_valid(boss) else "freed"]): return false
    if game.story_mode:
        if not await _walk_to(start + 1810): return false
        game._interact()
        if not check(game.current_trial == chapter + 1, "story gate advances after a real victory"): return false
    else:
        await _frames(60)
        if not check(game.victory_panel.visible, "victory panel"): return false
        game._dismiss_victory()
        if not check(game.joystick.accept_touch and not game.victory_panel.visible, "return to exploration"): return false
    print("CHAPTER PASS: %s / %s / phase two / boss movement %.1f / health %d" % [who, game.trials.TITLES[chapter], movement, game.health])
    return true

func _walk_to(x: float) -> bool:
    for frame in range(1200):
        if absf(game.hero.position.x - x) < 7:
            game.joystick.axis = Vector2.ZERO
            for i in range(5): await physics_frame
            return true
        game.joystick.axis = Vector2(signf(x - game.hero.position.x), 0)
        if frame % 17 == 0: game._request_attack()
        if game.character == "Kha" and game.health < game.max_health and game.shield_cooldown <= 0: game._skill()
        if game.character == "An" and game.health < 4: game._skill()
        if not check(game.death_time <= 0, "died on exploration route"): return false
        await physics_frame
    return check(false, "walk to %.0f actual %.1f" % [x, game.hero.position.x])

func _collect_sigil(expected: int) -> bool:
    game._control_pressed("jump")
    for frame in range(45):
        if frame == 24: game._control_released("jump")
        game._interact()
        if game.trials.sigils >= expected:
            game._control_released("jump")
            for i in range(45): await physics_frame
            return true
        await physics_frame
    game._control_released("jump")
    return check(false, "jump and interact with elevated sigil %d at %s" % [expected, game.hero.position])

func _get_secret(chapter: int) -> bool:
    var base_x := chapter * 1920.0
    if not await _walk_to(base_x + (720 if chapter == 0 else 638)): return false
    game._control_pressed("jump")
    await _frames(27)
    game._control_released("jump")
    await _frames(22)
    if not check(game.hero.position.y < 360, "land on first secret-route platform"): return false
    game._control_pressed("jump")
    for frame in range(55):
        var distance: float = base_x + 638 - game.hero.position.x
        game.joystick.axis = Vector2(signf(distance) if absf(distance) > 6 else 0.0, 0)
        if frame == 26: game._control_released("jump")
        game._interact()
        if game.trials.secrets[chapter]:
            game._control_released("jump")
            game.joystick.axis = Vector2.ZERO
            await _frames(36)
            return true
        await physics_frame
    return check(false, "secret route is reachable at " + str(game.hero.position))

func _frames(n: int) -> void:
    for i in range(n): await physics_frame
