extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An", 6)
    game.time_mode = true
    game._start("An")
    game._interact()
    var sky = game.sky
    var timeline = sky.timeline
    game._interact()
    if not ensure(timeline.mode == "machine","machine can be reached at spawn"): return
    timeline.travel(2)
    if not ensure(timeline.hidden_platform.collision_layer == 0,"unrepaired future has a broken bridge"): return
    timeline.companion = 1
    game.hero.position = sky.point(Vector2(770,514))
    timeline.update(0.02)
    if not ensure(timeline.hidden_platform.collision_layer != 0,"moth reveals a physical path under the bridge"): return
    timeline.travel(0)
    game.hero.position = sky.point(Vector2(420,432))
    game._interact()
    if not ensure(timeline.indoors and game.hero.position.x > sky.origin+2800,"forge door leads to a walkable room"): return
    game.hero.position = sky.point(Vector2(3320,432))
    game._interact()
    if not ensure(timeline.mode == "forge","talk to smith inside"): return
    timeline.inspect_weapon(1)
    timeline.buy(1)
    if not ensure(not timeline.owned[1],"shop charges materials"): return
    timeline.repair()
    if not ensure(not timeline.repaired,"cannot repair without core"): return
    sky.boss_defeated()
    timeline.buy(1)
    if not ensure(timeline.owned[1] and timeline.metal == 1 and timeline.equipped == 1,"defeated guardian funds purchase"): return
    timeline.repair()
    timeline.travel(2)
    await _frames(3)
    if not ensure(timeline.repaired and not is_instance_valid(timeline.hidden_platform),"future bridge remembers repair"): return
    timeline.cast()
    if not ensure(timeline.cooldown > 0 and timeline.preview_item == 1,"equipped spear selects its own attack"): return
    var saved: Dictionary = timeline.save_state()
    timeline.restore({})
    timeline.restore(saved)
    if not ensure(timeline.repaired and timeline.era == 2 and timeline.owned[1],"save round trip"): return
    game.hero.position = sky.point(Vector2(2470,432))
    game._interact()
    if not ensure(not timeline.lit,"keeper guards the lighthouse"): return
    sky.boss_defeated()
    game._interact()
    if not ensure(timeline.lit and game.victory_panel.visible,"lighthouse ending"): return
    print("ECLIPSE TIMELINE PASS")
    quit(0)
