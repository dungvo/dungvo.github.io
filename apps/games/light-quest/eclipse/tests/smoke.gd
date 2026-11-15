extends SceneTree
## Standalone deterministic core mechanic smoke test.
## Does not wait for frames; exits with nonzero code on failure.
func _initialize() -> void:
    call_deferred("_run")

func ensure(value:bool, label:String) -> bool:
    if not value:
        push_error("ECLIPSE TEST FAILED: " + label)
        quit(1)
        return false
    return true

func _run() -> void:
    var scene:PackedScene = load("res://scenes/main.tscn")
    if not ensure(scene != null, "main scene loads"): return
    var g = scene.instantiate()
    root.add_child(g)
    if not ensure(g.hero != null, "hero instantiated"): return
    if not ensure(g.enemy_data.size() == 8, "enemy population"): return
    if not ensure(g.ROOMS.size() == 7, "room count"): return
    # Test deterministic light puzzle independently of presentation.
    g.puzzles.clear()
    for j in range(25):
        g.puzzles.append(1)
    var pattern = [2,7,13,16,21,24]
    for i in pattern:
        g._toggle_grid(i)
    if not ensure(g.puzzles.any(func(value):return value == 0), "scrambled board"): return
    for i in pattern:
        g._toggle_grid(i)
    if not ensure(g.puzzles.all(func(value):return value == 1), "grid reversibility"): return
    if not ensure(g.get_node_or_null("LightGate") != null, "initial gate exists"):return
    g.started = true
    g.activated = true
    g._physics_process(0.016)
    if not ensure(g.get_node_or_null("LightGate").is_queued_for_deletion(), "gate removal scheduled"):return
    # Stop player game before combat assertions; isolated boss hit.
    g.started = true
    g.last_room = 6
    g.boss_shield_time = 4
    g.hero.position = Vector2(6 * 960 + 570, 410)
    g.boss_hp = 1
    g.attack_cooldown = 0
    g._attack()
    if not ensure(g.boss_dead and g.moon_dash, "boss unlock"):return
    print("ECLIPSE SMOKE PASS: rooms, enemies, reversible puzzle, gate, boss unlock")
    quit(0)
