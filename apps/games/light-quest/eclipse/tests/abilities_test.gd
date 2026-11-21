extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An")
    game.set_physics_process(false)
    var golem = game.enemies[1]
    game.hero.position = golem.position + Vector2(-110, 0)
    game.facing = 1
    await _frames(3)
    var initial: int = golem.hp
    game._signature()
    if not ensure(golem.hp == initial - 3, "Nguyet Tram uses the hostile hurtbox"): return
    game._signature_hits()
    if not ensure(golem.hp == initial - 3, "signature damages each actor once per swing"): return
    var cooldown: float = game.burst_cooldown
    game._signature()
    if not ensure(game.burst_cooldown == cooldown, "Q cannot be spammed during cooldown"): return

    await _fixture("An")
    game.set_physics_process(false)
    golem = game.enemies[1]
    game.hero.position = golem.position + Vector2(-110, 0)
    game.facing = 1
    var wall := StaticBody2D.new()
    wall.position = game.hero.position + Vector2(55, 0)
    wall.add_child(Combat.rectangle(Vector2(12, 150)))
    game.add_child(wall)
    await _frames(3)
    initial = golem.hp
    game._signature()
    if not ensure(golem.hp == initial, "solid wall occludes wide signature"): return

    await _fixture("Kha")
    game.set_physics_process(false)
    game.hero.position = Vector2(310, 432)
    game.facing = 1
    wall = StaticBody2D.new()
    wall.position = Vector2(390, 400)
    wall.add_child(Combat.rectangle(Vector2(14, 150)))
    game.add_child(wall)
    await _frames(3)
    game._signature()
    if not ensure(game.hero.position.x < 374 and game.hero.position.x > 340, "Tinh Bo capsule sweep stops before a wall"): return
    if not ensure(game.bolts.size() == 3 and game.i_frames > 0, "Tinh Bo launches a fan and provides short dodge frames"): return
    var stop: Vector2 = game.hero.position
    game._signature()
    if not ensure(game.hero.position == stop and game.bolts.size() == 3, "blink is cooldown limited"): return
    # The new upper route cannot bypass the chapter's quest barrier.
    game.hero.position = Vector2(1240, 20)
    game.burst_cooldown = 0
    await _frames(3)
    game._signature()
    if not ensure(game.hero.position.x < 1263 and not game.trials.boss.awake, "blink cannot bypass the gate above the old wall height"): return

    await _fixture("An", 2)
    game.set_physics_process(false)
    var routes = game.trials.routes
    if not ensure(routes.bridge_bodies.size() == 2 and routes.bridge_bodies[0].collision_layer == 0, "spectral bridge starts without collision"): return
    game.hero.position = Vector2(2 * 1920 + 786, 291)
    await _frames(2)
    game._signature()
    if not ensure(routes.opened[2] and routes.bridge_bodies[0].collision_layer == Combat.WORLD, "Q manifests physical spectral platforms"): return
    routes.air_step_unlocked = true
    routes.claimed = [true, false, true]
    game.save_enabled = true
    game._persist()
    routes.air_step_unlocked = false
    routes.claimed = [false, false, false]
    routes.opened = [false, false, false]
    game._restore()
    if not ensure(routes.air_step_unlocked and routes.claimed == [true, false, true] and routes.opened[2], "new traversal progression persists in compatible v2 save"): return
    DirAccess.remove_absolute(ProjectSettings.globalize_path(game.SAVE_FILE))
    game.save_enabled = false
    game.trials.return_menu()
    game.burst_cooldown = 0
    game._signature()
    if not ensure(game.burst_cooldown == 0, "signature cannot run on chapter menu"): return
    print("ECLIPSE ABILITIES PASS: directional once-per-swing damage, wall obstruction, safe blink, cooldowns, gate protection, spectral collision and save compatibility")
    quit(0)
