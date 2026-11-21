extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An",6)
    game.time_mode = true
    game._start("An")
    game._interact()
    await _frames(3)
    var sky = game.sky
    var timeline = sky.timeline
    game.hero.position = sky.point(Vector2(535,432))
    game.hero.velocity = Vector2.ZERO
    for frame in range(24):
        game.joystick.axis = Vector2.RIGHT
        await physics_frame
    if not ensure(game.hero.position.x < sky.origin+580 and not game.crouched,"standing cannot enter crawl slot"): return
    for frame in range(120):
        game.touch.crouch = true
        game.joystick.axis = Vector2.RIGHT if game.hero.position.x < sky.origin+679 else Vector2.ZERO
        await physics_frame
        if game.hero.position.y > 620: break
    game.touch.crouch = false
    game.joystick.axis = Vector2.ZERO
    await _frames(35)
    if not ensure(game.hero.position.y > 650 and game.hero.is_on_floor() and timeline.underground,"walk and drop into connected cistern"): return
    for frame in range(105):
        var x: float = game.hero.position.x - sky.origin
        if absf(x-441) < 24: break
        game.joystick.axis = Vector2(signf(441-x),0)
        await physics_frame
    game.joystick.axis = Vector2.ZERO
    game._interact()
    if not ensure(timeline.rescued and game.hero.position.y == 432,"rescue Tín and return to surface"): return
    timeline.open_map()
    if not ensure(timeline.mode == "map" and timeline.panel.visible,"full map opens from the playable coast"): return
    timeline.open_journal()
    if not ensure(timeline.mode == "journal","journal uses rescued state"): return
    timeline.close()
    timeline.travel(0)
    timeline.set_interior(true)
    timeline.forge()
    if not ensure(timeline.panel.visible and timeline.mode == "forge","illustrated forge opens"): return
    timeline.close()
    print("ECLIPSE COAST PASS")
    quit(0)
