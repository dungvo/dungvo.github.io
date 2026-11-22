extends "res://tests/horizon_playthrough.gd"
## One run from the real journey entry to the lighthouse, using collision, attacks and gates.
func _run() -> void:
    game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    if not check(game.menu.visible and not game.started, "menu is the first screen"): return
    game.enter_journey("Kha")
    if not check(game.current_trial == 0 and game.started and not game.dialogue.visible, "new journey begins in real Làng Trăng gameplay"): return
    if not check(not game.atlas.region_visible(1), "atlas conceals regions not yet entered"): return
    for chapter in range(3):
        if not await _complete_ground(chapter, "Kha"): return
        if not check(game.atlas.region_visible(chapter + 1), "walking through a gate reveals its real next region"): return
    for stage in range(3):
        if not await _complete_sky(stage, "Kha"): return
    if not check(game.sky.stage == 3 and game.story_room == 6, "summit gate leads into the coast"): return
    if not await _walk_horizon(): return
    if not await _defeat_sky_boss(3, "Kha"): return
    var sky = game.sky
    if not await _walk_to(sky.point(Vector2(3510,181)).x): return
    game._interact()
    if not check(sky.coast_doors[2].collision_layer == 0, "physical gate opens into the last courtyard"): return
    if not await _walk_to(sky.point(Vector2(3590,181)).x): return
    if not await _leap(sky.point(Vector2(3740,162)).x,162,false): return
    if not await _leap(sky.point(Vector2(3950,162)).x,162,true): return
    if not await _leap(sky.point(Vector2(4115,105)).x,105,true): return
    if not await _walk_to(sky.point(Vector2(4310,81)).x): return
    game._interact()
    if not check(game.journey_complete and game.victory_panel.visible and sky.progress[3].won, "interaction illuminates the lighthouse and closes the route"): return
    var snapshot: Dictionary = game._progress_data().duplicate(true)
    game.trials.return_menu()
    game.demo_room_select.select(1)
    game.enter_practice("An")
    game.trials.wins[1] = false
    game.trials.return_menu()
    if not check(game.trials.wins[1] and game.story_room == 6, "practice does not overwrite campaign progress"): return
    game._apply_progress(snapshot)
    game.enter_journey("An")
    if not check(game.character == "Kha" and game.journey_complete and game.hero.position.distance_to(sky.point(Vector2(4310,81))) < 2, "continue restores hero and lit lighthouse"): return
    print("ECLIPSE CONTINUOUS STORY PASS")
    quit()
