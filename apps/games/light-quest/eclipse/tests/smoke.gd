extends SceneTree
## Mechanical tests run under Godot, not browser.
func _initialize() -> void:
    call_deferred("_run")

func _run() -> void:
    var scene:PackedScene = load("res://scenes/main.tscn")
    assert(scene != null)
    var g = scene.instantiate()
    root.add_child(g)
    await process_frame
    assert(g.hero != null)
    assert(g.enemy_data.size() == 8)
    assert(g.ROOMS.size() == 7)
    assert(g.activated == false)
    g._open_puzzle()
    assert(g.puzzles.size() == 25)
    assert(g.puzzles.any(func(value): return value == 0))
    for index in [2, 7, 13, 16, 21, 24]:
        g._toggle_grid(index)
    assert(g.puzzles.all(func(value): return value == 1))
    g.puzzle_panel.hide()
    g.activated = true
    g.started = true
    assert(g.get_node_or_null("LightGate") != null)
    g._physics_process(0.016)
    await process_frame
    assert(g.get_node_or_null("LightGate") == null)
    g.boss_shield_time = 4.0
    g.last_room = 6
    g.hero.position = Vector2(6 * 960 + 570, 410)
    g.boss_hp = 1
    g.attack_cooldown = 0
    g.started = true
    g._attack()
    assert(g.boss_dead == true)
    assert(g.moon_dash == true)
    print("ECLIPSE SMOKE TEST PASS: 7 rooms, 8 enemies, puzzle, gate, boss unlock")
    quit(0)
