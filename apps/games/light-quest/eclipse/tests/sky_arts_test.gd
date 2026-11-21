extends "res://tests/smoke.gd"
func _run() -> void:
    await _fixture("An",3)
    game.set_physics_process(false)
    if not ensure(game.arts.buttons.size() == 6 and game.arts.NAMES.size() == 6,"six separate art controls"): return
    var sky = game.sky
    game.hero.position = sky.point(Vector2(280,432))
    game.facing = 1
    await _frames(3)
    game.arts.cast(0)
    if not ensure(sky.progress[0].crystal and game.dash_time > 0,"Phá Tinh removes the crystal gate and moves the real hero"): return
    game.arts.cast(1)
    if not ensure(game.hero.velocity.y == -790 and game.arts.rise_time > 0,"Thiên Thăng has upward impulse"): return
    game.hero.position = sky.point(Vector2(560,76))
    await _frames(2)
    var wall := StaticBody2D.new()
    wall.position = sky.point(Vector2(650,-20))
    wall.add_child(Combat.rectangle(Vector2(20,180)))
    game.add_child(wall)
    await _frames(3)
    game.arts.cast(2)
    if not ensure(game.arts.grapple_time == 0 and game.arts.cooldowns[2] == 0,"blocked grapple does not cross a solid wall or consume cooldown"): return
    wall.queue_free()
    await _frames(3)
    game.arts.cast(2)
    if not ensure(game.arts.grapple_time > 0,"Tơ Nguyệt selects a visible elevated anchor"): return
    game.arts.grapple_time = 0
    var ray_start: Vector2 = sky.point(Vector2(1120,-300))
    var ray_end: Vector2 = sky.point(Vector2(1120,-245))
    if not ensure(Combat.ray(game.get_world_2d().direct_space_state,ray_start,ray_end,Combat.WORLD).is_empty(),"unseen bridge has no collision"): return
    game.arts.cast(3)
    await _frames(3)
    if not ensure(not Combat.ray(game.get_world_2d().direct_space_state,ray_start,ray_end,Combat.WORLD).is_empty(),"Nguyệt Nhãn materializes physical bridge"): return
    game.arts.cast(4)
    if not ensure(not sky.progress[0].bell,"bell skill must be near the resonator"): return
    game.arts.cooldowns[4] = 0
    game.hero.position = sky.point(Vector2(895,-644))
    game.arts.cast(4)
    if not ensure(sky.progress[0].bell,"Chuông Vọng opens matching resonance doors"): return
    game.arts.rise_time = 0
    game.dash_time = 0
    game.hero.position = sky.point(Vector2(580,-930))
    game.hero.velocity = Vector2.ZERO
    game.arts.rush_time = 0
    game.set_physics_process(true)
    await _frames(2)
    game.set_physics_process(false)
    game.arts.cast(5)
    if not ensure(is_instance_valid(sky.weak_floor),"dive cannot break floor before impact"): return
    game.set_physics_process(true)
    await _frames(40)
    if not ensure(not is_instance_valid(sky.weak_floor) and game.hero.position.y > -840,"Thiên Giáng opens the sealed chamber by landing"): return
    sky.progress[0].checkpoint = 2
    sky.progress[0].relic = true
    sky.progress[0].secret = true
    game.save_enabled = true
    game._persist()
    sky.progress[0] = sky._blank()
    game._restore()
    if not ensure(sky.progress[0].checkpoint == 2 and sky.progress[0].relic and sky.progress[0].secret,"ascent checkpoint and discoveries persist"): return
    game._start("Kha")
    game._interact()
    if not ensure(game.hero.position == game.sky.point(Vector2(650,-1244)),"resume at a genuine high checkpoint"): return
    DirAccess.remove_absolute(ProjectSettings.globalize_path(game.SAVE_FILE))
    game.save_enabled = false
    game.trials.return_menu()
    if not ensure(not game.sky.active and not game.arts.layer.visible,"menu pauses ascent and hides skill toolbar"): return
    print("ECLIPSE SKY ARTS PASS: six powers, real movement, blocked grapple, spectral collision, proximity doors, impact-only floor break, high checkpoint persistence and menu safety")
    quit(0)
