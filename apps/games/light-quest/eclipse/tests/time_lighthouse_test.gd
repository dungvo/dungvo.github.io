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
    game._dismiss_victory()
    timeline.restore({"era":2,"owned":[true,true,false],"equipped":1})
    if not ensure(timeline.owned.size() == 8 and timeline.owned[1] and not timeline.owned[7],"V9 save migrates to eight slots"): return
    game.hero.position = sky.point(Vector2(590,432))
    game._interact()
    game._interact()
    if not ensure(timeline.metal == 1,"cache rewards only once"): return
    timeline.buy(6)
    timeline.cooldown = 0
    timeline.cast()
    game.i_frames = 0
    var hp: int = game.health
    game.damage_player(1,0)
    if not ensure(game.health == hp and timeline.barrier_time == 0,"shield consumes one block"): return
    game.damage_player(1,0)
    if not ensure(game.health == hp-1,"shield cannot block twice"): return
    game.hero.position = sky.point(Vector2(1340,432))
    timeline.owned[4] = true
    timeline.equipped = 4
    timeline.cooldown = 0
    timeline.cast()
    await _frames(36)
    if not ensure(timeline.switch_open,"reflected arrow hits the switch"): return
    timeline.owned[7] = true
    timeline.equipped = 7
    timeline.cooldown = 0
    timeline.cast()
    if not ensure(game.enemy_time_factor(game.hero.position) < 1 and game.enemy_time_factor(Vector2.ZERO) == 1,"slow applies locally"): return
    timeline.owned[5] = true
    timeline.equipped = 5
    timeline.cooldown = 0
    timeline.cast()
    if not ensure(timeline.echo > 0,"staff schedules delayed attack"): return
    timeline.update(0.6)
    if not ensure(timeline.echo == 0 and timeline.preview_item == 5,"echo fires after its delay"): return
    timeline.owned[3] = true
    timeline.equipped = 3
    timeline.cooldown = 0
    timeline.cast()
    if not ensure(game.dash_time > 0 and timeline.echo > 0,"dual blades lunge and queue a follow-up"): return
    print("ECLIPSE TIMELINE PASS")
    quit(0)
