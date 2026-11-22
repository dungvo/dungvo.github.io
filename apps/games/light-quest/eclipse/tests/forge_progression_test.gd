extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An",6)
    game.time_mode = true
    game._start("An")
    game._interact()
    var sky = game.sky
    var timeline = sky.timeline
    await _frames(3)

    game.hero.position = sky.point(Vector2(441,676))
    game._interact()
    if not ensure(timeline.lunar_cores == 1 and timeline.rescued,"rescuing Tín gives one upgrade core"): return
    game.hero.position = sky.point(Vector2(441,676))
    game._interact()
    if not ensure(timeline.lunar_cores == 1,"the cistern reward cannot be farmed"): return
    game.hero.position = sky.point(Vector2(1150,432))
    game._interact()
    game._interact()
    if not ensure(timeline.lunar_cores == 2,"present rest point awards once"): return
    timeline.travel(0)
    await _frames(2)
    sky.boss_defeated()
    sky.boss_defeated()
    if not ensure(timeline.lunar_cores == 3 and timeline.metal == 2,"guardian awards both currencies once"): return

    timeline.set_interior(true)
    game.hero.position = sky.point(Vector2(3320,432))
    game._interact()
    if not ensure(not timeline.infuse_spear() and timeline.lunar_cores == 3,"cannot infuse before purchase"): return
    timeline.buy(1)
    timeline.inspect_weapon(1)
    if not ensure(not timeline.infuse_spear() and timeline.lunar_cores == 3,"short balance does not charge"): return
    timeline.travel(2)
    await _frames(2)
    game.hero.position = sky.point(Vector2(1150,432))
    game._interact()
    game._interact()
    if not ensure(timeline.lunar_cores == 4,"future point completes the set"): return

    timeline.travel(0)
    await _frames(2)
    timeline.set_interior(true)
    game.hero.position = sky.point(Vector2(3320,432))
    game._interact()
    timeline.inspect_weapon(1)
    if not ensure(timeline.infuse_spear() and timeline.lunar_cores == 0 and timeline.metal == 1,"forge consumes only the four cores"): return
    if not ensure(not timeline.infuse_spear(),"duplicate infusion is refused"): return
    var saved: Dictionary = timeline.save_state()
    timeline.restore({})
    timeline.restore(saved)
    if not ensure(timeline.spear_infused and timeline.lunar_cores == 0,"save round-trip preserves upgrade and spent rewards"): return

    timeline.travel(2)
    await _frames(3)
    game.hero.position = sky.point(Vector2(2050,432))
    game.hero.velocity = Vector2.ZERO
    game.facing = 1
    timeline.cast()
    var first: Vector2 = game.arts.grapple_target
    if not ensure(timeline.chain_left > 0 and first == sky.point(Vector2(2125,334)),"upgraded cast hooks first valid anchor"): return
    timeline.cast()
    if not ensure(game.arts.grapple_target == first and timeline.chain_left > 0,"early press preserves follow-up"): return
    for frame in range(49):
        await physics_frame
        if game.hero.position.distance_to(first) < 50: break
    if not ensure(game.hero.position.distance_to(first) < 75,"player reached first anchor through physics"): return
    timeline.cast()
    var second: Vector2 = game.arts.grapple_target
    if not ensure(second == sky.point(Vector2(2290,198)) and timeline.chain_left == 0,"second cast selects a different anchor and closes window"): return
    for frame in range(54):
        await physics_frame
        if game.hero.position.distance_to(second) < 42: break
    if not ensure(game.hero.position.distance_to(second) < 52,"second anchor actually pulls player onto high route"): return
    print("ECLIPSE FORGE PASS")
    quit(0)
