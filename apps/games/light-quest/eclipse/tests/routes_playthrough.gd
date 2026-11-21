extends "res://tests/campaign_playthrough.gd"
## New routes use only the actual controller and interactions; no teleports / HP edits.
func _run() -> void:
    for who in ["An", "Kha"]:
        for chapter in range(3):
            game = load("res://scenes/main.tscn").instantiate()
            game.save_enabled = false
            root.add_child(game)
            game.demo_room_select.select(chapter)
            game._start(who)
            game._interact()
            var start := chapter * 1920.0
            if chapter == 0:
                if not await _walk_to(290): return
                game._interact()
                game._interact()
            if not await _walk_to(start + 335): return
            if not await _collect_sigil(1): return
            if not await _get_secret(chapter): return
            if not await _leap(start + 786, 315, false): return
            game._interact()
            if not check(game.trials.routes.air_step_unlocked, "shrine unlocks actual double jump"): return
            if chapter == 2:
                game.facing = -1 # open the bridge while preserving a safe return ledge
                game._signature()
                if not check(game.trials.routes.opened[chapter], "Q manifests crypt bridge"): return
                await _frames(45)
                if not await _leap(start + 786, 315, false): return
            var landing_x: float = start + 1000 if chapter != 1 else game.trials.routes.ferry.position.x + 30
            if not await _leap(landing_x, 170 if chapter == 0 else (195 if chapter == 1 else 180), true, chapter == 1): return
            if chapter == 1:
                var offset: float = game.hero.position.x - game.trials.routes.ferry.position.x
                game.joystick.axis = Vector2.ZERO
                await _frames(50)
                if not check(absf((game.hero.position.x - game.trials.routes.ferry.position.x) - offset) < 6 and game.hero.is_on_floor(), "moving platform carries a stationary rider"): return
            if chapter != 2:
                game._control_pressed("jump")
                await _frames(5)
                game.facing = 1
                game._signature()
                game._control_released("jump")
                if not check(game.trials.routes.opened[chapter], "Q breaks high-route seal / " + who): return
                await _frames(60)
            if not await _leap(start + 1210, [158, 165, 150][chapter], true): return
            game._interact()
            if not check(game.trials.routes.claimed[chapter] and game.burst_cooldown == 0, "route relic reward / " + who): return
            game._signature()
            if not check(game.burst_cooldown < 5.0, "relic improves signature cooldown"): return
            # Drop back to the existing checkpoint: a new branch must not strand players.
            game._control_released("jump")
            if not await _walk_to(start + 905): return
            await _frames(60)
            if not await _walk_to(start + 1010): return
            game._interact()
            if not check(game.trials.saved[chapter], "route rejoins main checkpoint"): return
            print("NEW ROUTE PASS: %s / %s / double jump / seal / relic / return" % [who, game.trials.routes.TITLES[chapter]])
            game.queue_free()
            await process_frame
    print("ECLIPSE ROUTES PASS: all 3 new routes x An/Kha, shrine, double jump, moving / spectral platforms, Q seals, relics and safe return")
    quit(0)

func _leap(target_x: float, top: float, double: bool, moving := false) -> bool:
    game._control_released("jump")
    await _frames(3)
    game._control_pressed("jump")
    var used_air := false
    for frame in range(125):
        if moving: target_x = game.trials.routes.ferry.position.x + 30
        var distance: float = target_x - game.hero.position.x
        game.joystick.axis = Vector2(signf(distance) if absf(distance) > 5 else 0.0, 0)
        if frame == 18 and double: game._control_released("jump")
        if frame == 21 and double:
            game._control_pressed("jump")
            used_air = true
        if frame == 47: game._control_released("jump")
        if frame > 28 and game.hero.is_on_floor() and absf(distance) < 18 and absf(game.hero.position.y - (top - 24)) < 6:
            game.joystick.axis = Vector2.ZERO
            game._control_released("jump")
            if double and not check(used_air, "air jump used"): return false
            return true
        await physics_frame
    game.joystick.axis = Vector2.ZERO
    game._control_released("jump")
    return check(false, "route leap to %.1f / y %.1f; actual %s" % [target_x, top, game.hero.position])
