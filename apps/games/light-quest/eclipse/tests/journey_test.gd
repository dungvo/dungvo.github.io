extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An", 5)
    game.mark_chapter_complete(5)
    game.trials.next_trial()
    if not ensure(game.sky.stage == 3 and game.journey_next == 6,"stage six advances to seven"): return
    game._interact()
    game.loadout.toggle()
    if not ensure(game.loadout.panel.visible and not game.joystick.accept_touch,"equipment suspends input"): return
    game.loadout._choose_weapon(2)
    game.loadout._choose_art(2)
    game.loadout.toggle()
    game.arts.cast(1)
    if not ensure(game.loadout.quick_art() == 1 and is_equal_approx(game.arts.cooldowns[1], 2.4),"favorite binds quick cast and cooldown"): return
    var sky = game.sky
    game.hero.position = sky.point(Vector2(1780,446))
    game._interact()
    if not ensure(sky.progress[3].relic,"lower detour contains the lighthouse core"): return
    game.hero.position = sky.point(Vector2(2590,106))
    game.arts.cast(3)
    game.arts.cast(4)
    if not ensure(sky.progress[3].sight and sky.ghost_bodies[0].collision_layer != 0 and sky.progress[3].bell,"reveal bridge and ring lighthouse bell"): return
    game.hero.position = sky.point(Vector2(2460,106))
    game._interact()
    if not ensure(sky.progress[3].checkpoint == 2,"late checkpoint works"): return
    game.hero.position = sky.point(Vector2(3510,181))
    game._interact()
    if not ensure(not game.victory_panel.visible,"exit requires the boss"): return
    sky.boss_defeated()
    game._interact()
    if not ensure(not game.victory_panel.visible and sky.coast_doors[2].collision_layer == 0,"boss door opens into separate lighthouse courtyard"): return
    game.hero.position = sky.point(Vector2(4310,81))
    game._interact()
    if not ensure(game.victory_panel.visible and sky.progress[3].won,"seventh chapter completes journey"): return
    game.trials.next_trial()
    if not ensure(game.menu.visible and not game.started,"journey ends at the map"): return
    print("ECLIPSE JOURNEY PASS: continuation, equipment, core, bridge, checkpoint and ending")
    quit(0)
