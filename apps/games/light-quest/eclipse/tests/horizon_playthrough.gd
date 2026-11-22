extends "res://tests/sky_playthrough.gd"
func _run() -> void:
    game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.demo_room_select.select(6)
    game._start("Kha")
    game._interact()
    if not await _walk_horizon(): return
    print("V6 CONTINUOUS ROUTE PASS")
    quit(0)

func _walk_horizon() -> bool:
    await _frames(10)
    var origin: float = game.sky.origin
    if not await _walk_to(origin+535): return false
    if not await _leap(origin+695,365,true): return false
    if not await _walk_to(origin+840): return false
    if not await _leap(origin+980,290,true): return false
    if not await _walk_to(origin+1170): return false
    if not await _leap(origin+1280,250,false): return false
    game._interact()
    if not await _walk_to(origin+1480): return false
    if not await _leap(origin+1640,345,false): return false
    if not await _walk_to(origin+1780): return false
    await _frames(38)
    game._interact()
    if not check(game.sky.progress[3].relic,"real walk to lower core"): return false
    if not await _leap(origin+1910,345,true): return false
    if not await _walk_to(origin+2045): return false
    if not await _leap(origin+2200,255,true): return false
    if not await _walk_to(origin+2360): return false
    if not await _leap(origin+2460,130,true): return false
    game._interact()
    if not await _walk_to(origin+2590): return false
    game.arts.cast(3)
    game.arts.cast(4)
    if not await _walk_to(origin+2715): return false
    if not await _leap(origin+2840,185,false): return false
    if not await _walk_to(origin+2970): return false
    if not await _leap(origin+3095,205,false): return false
    if not check(game.sky.boss.awake,"arena awake after actual route"): return false
    return true
