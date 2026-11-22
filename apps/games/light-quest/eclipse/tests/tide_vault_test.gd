extends "res://tests/horizon_playthrough.gd"

func _run() -> void:
    game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.menu._begin()
    if not check(game.menu.guide.visible and not game.started, "first entry shows the field guide"): return
    for id in range(6):
        game.menu._select_guide(id)
        if not check(game.menu.guide_title.text == game.arts.NAMES[id], "each skill has its own page"): return
        var art: AtlasTexture = game.menu.guide_art.texture
        if not check(art.region.position == Vector2(id % 3 * 512, floori(id / 3.0) * 256), "illustration matches skill"): return
    game.menu._enter_from_guide()
    await _frames(15)
    var map = game.atlas
    map.survey()
    var initial: Array = map.terrain(0, 0, 0)
    game.demo_room_select.select(6)
    game._start("An")
    if not check(not initial.is_empty() and map.terrain(0, 0, 0) == initial, "visited floors survive chapter changes"): return
    var saved: Dictionary = JSON.parse_string(JSON.stringify(game._progress_data()))
    game._apply_progress(saved)
    if not check(map.terrain(0, 0, 0) == initial, "visited floors survive save round trip"): return
    var sky = game.sky
    var base: float = sky.origin
    await _frames(15)
    if not await _walk_to(base + 615): return
    await _frames(75)
    map.survey()
    if not check(game.hero.is_on_floor() and map.current_room() == 4 and map.discovered.has("6/4/0"), "first gap lands in mapped vault"): return
    if not await _walk_to(base + 400): return
    if not await _leap(base + 401, 680, false): return
    if not await _leap(base + 208, 456, true): return
    if not check(not sky.progress[3].clapper, "west stairs allow a return before solving the bell"): return
    if not await _walk_to(base + 615): return
    await _frames(75)
    if not await _walk_to(base + 1080): return
    game.arts.cast(4)
    if not check(not sky.progress[3].tide_awake, "the bell needs its clapper"): return
    if not await _walk_to(base + 765): return
    game._interact()
    if not check(sky.progress[3].clapper, "retrieve clapper on foot"): return
    await _frames(285)
    if not await _walk_to(base + 1080): return
    game.arts.cast(4)
    if not check(sky.progress[3].tide_awake and not sky.progress[3].bell, "the tide bell raises its own stair"): return
    if not await _leap(base + 1090, 681, true): return
    if not await _leap(base + 926, 577, true): return
    if not await _leap(base + 1060, 475, true): return
    if not await _leap(base + 909, 383, true): return
    if not await _leap(base + 1060, 290, true): return
    if not check(map.current_room() == 0 and sky.progress[3].checkpoint == 0, "stairs return to coast before locked gate"): return
    if not check(game._progress_data().sky[3].tide_awake, "quest completion is recorded"): return
    print("ECLIPSE TIDE PASS")
    quit(0)
