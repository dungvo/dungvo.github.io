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
    game.story_mode = true
    game.demo_room_select.select(2)
    game._start("An")
    game._interact()
    game.hero.position = Vector2(2*1920+1810,432)
    game._interact()
    if not ensure(game.current_trial == 2,"story gate requires a victory"): return
    game.trials.wins[2] = true
    game._interact()
    if not ensure(game.current_trial == 3 and game.sky.active,"story gate connects ground and sky"): return
    game.hero.position = game.sky.point(Vector2(102,432))
    game._interact()
    if not ensure(game.current_trial == 2 and not game.sky.active and game.trials.wins[2],"backtrack without losing victory"): return
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    if not ensure(game.sky.boss_dead and game.sky.movers.size() == 1,"story preserves boss and creates lift"): return
    var lift: AnimatableBody2D = game.sky.movers[0].body
    var original_y := lift.position.y
    game.sky.tick(0.3)
    if not ensure(not is_equal_approx(original_y,lift.position.y),"lift moves vertically"): return
    game.i_frames = 0
    game.hero.position = game.sky.point(Vector2(3855,138))
    game.sky.elapsed = 1.5
    var hp: int = game.health
    game.sky.tick(0.01)
    if not ensure(game.health == hp-1,"extended spikes deal damage"): return
    print("ECLIPSE JOURNEY PASS: continuation, equipment, core, bridge, checkpoint and ending")
    quit(0)
