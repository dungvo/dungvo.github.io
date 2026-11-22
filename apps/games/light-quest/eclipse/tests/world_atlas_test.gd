extends "res://tests/smoke.gd"
const Atlas := preload("res://scripts/atlas_data.gd")

func _run() -> void:
    await _fixture()
    game.story_mode = true
    var map = game.atlas
    var tiles := 0
    for region in range(7):
        tiles += Atlas.names(region).size()
        for room in Atlas.bounds(region).size():
            var bounds: Rect2 = Atlas.bounds(region)[room]
            if not ensure(Atlas.locate(region, bounds.get_center(), 1, false) == room, "mapped area owns its collision coordinates"): return
    if not ensure(tiles == 29 and map.current_room() == 0, "29 playable-area bounds across seven chapters"): return
    map.open()
    if not ensure(paused and map.plot.region == -1, "opening story atlas freezes game"): return
    var position_before: Vector2 = game.hero.position
    game.joystick.axis = Vector2.RIGHT
    await _frames(10)
    if not ensure(game.hero.position == position_before, "hero stays still while inspecting map"): return
    game.joystick.axis = Vector2.ZERO
    if not ensure(Atlas.WORLD_ROOMS.size() == 7 and map.regions[1].disabled, "overview shows seven territories without opening an unexplored region"): return
    var first: Rect2 = Atlas.WORLD_ROOMS[0][0]
    map.plot._select_at(first.get_center() * map.plot.size / Vector2(800,342))
    if not ensure(map.plot.region == 0, "tapping a charted chamber enters its regional floor map"): return
    map.select_room(3)
    if not ensure("người giữ cổng" in map.description.text, "chapter exit shows its real unlock condition"): return
    map._zoom(0.5)
    if not ensure(map.plot.zoom == 1.5, "atlas zoom changes projection"): return
    map.close()
    if not ensure(not paused, "closing atlas resumes game"): return

    # Exercise both endpoints of each story gate with validated progression flags.
    for region in range(6):
        game.demo_room_select.select(region)
        game._start("An")
        if region < 3:
            game.hero.position = Vector2(region * 1920 + 1810, 432)
            game._interact()
            if not ensure(game.current_trial == region and map.gate(region, "exit", 1) != "", "unfinished trial gate holds"): return
            game.trials.wins[region] = true
        else:
            game.hero.position = game.sky.point(game.sky.story_exit() - Vector2(0, 24))
            game.sky.boss_dead = true
        game._interact()
        if not ensure(game.current_trial == region + 1 and map.gate(region, "exit", 1) == "", "east gate connects to next mapped region"): return
        if game.sky.active:
            game.hero.position = game.sky.point(Vector2(102, 432))
        else:
            game.hero.position = Vector2((region + 1) * 1920 + 95, 432)
        game._interact()
        if not ensure(game.current_trial == region, "west gate returns to previous mapped region"): return
        if region == 4:
            if not ensure(map.local_position().is_equal_approx(game.sky.story_exit() - Vector2(0, 24)), "mirrored Vườn Treo has correct atlas coordinates"): return

    game.story_mode = false
    game.time_mode = true
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    var timeline = game.sky.timeline
    timeline.travel(2)
    game.hero.position = game.sky.point(Vector2(440, 676))
    map.open()
    if not ensure(map.current_room() == 4 and map.discovered.has("7/4/2"), "cistern shows current position below surface"): return
    if not ensure(Atlas.exists(7, 6, 2, false) and map.gate(7, "moth", 2) != "", "future shows wrecked bridge route and familiar requirement"): return
    map.select_era(0)
    if not ensure(timeline.era == 2 and Atlas.exists(7, 5, 0, false), "previewing the past shows forge and does not travel"): return
    map.close()
    timeline.repaired = true
    if not ensure(not Atlas.exists(7, 6, 2, true), "repaired future removes the under-bridge detour"): return

    game.hero.position = game.sky.point(timeline.WATCH_STOP)
    game.hero.velocity = Vector2.ZERO
    await _frames(3)
    game._interact()
    if not ensure(timeline.rested[2] and timeline.atlas_destination() == timeline.MACHINE_STOP, "rest unlocks the actual anchor pair"): return
    map.open()
    if not ensure(map.transit_button.visible, "anchor shortcut is shown near an activated stop"): return
    map._use_anchor()
    await _frames(3)
    if not ensure(not paused and game.hero.position.distance_to(game.sky.point(timeline.MACHINE_STOP)) < 3, "anchor returns to the machine in the same era"): return
    map.open()
    map._use_anchor()
    await _frames(3)
    if not ensure(game.hero.position.distance_to(game.sky.point(timeline.WATCH_STOP)) < 3, "unlocked anchor travels both ways"): return
    game.hero.position = game.sky.point(Vector2(1700, 432))
    if not ensure(timeline.atlas_destination() == Vector2.INF, "anchors cannot bypass combat from anywhere on the map"): return

    var keys: Array = map.discovered.keys()
    map.discovered.clear()
    map.restore(keys + ["7/900/0", 11])
    if not ensure(map.discovered.size() == keys.size() and map.discovered.has("7/4/2"), "map restores only known area IDs"): return
    var snapshot: Dictionary = timeline.save_state()
    timeline.rested = [false, false, false]
    timeline.restore(snapshot)
    if not ensure(timeline.rested[2], "checkpoint activation survives save round trip"): return
    print("ECLIPSE ATLAS PASS")
    quit()
