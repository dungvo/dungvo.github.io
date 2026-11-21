extends "res://tests/routes_playthrough.gd"
## Continuous ascent with real input / collision; no teleports, HP changes or direct damage.
func _run() -> void:
    for who in ["An", "Kha"]:
        for stage in range(3):
            game = load("res://scenes/main.tscn").instantiate()
            game.save_enabled = false
            root.add_child(game)
            game.demo_room_select.select(3 + stage)
            game._start(who)
            game._interact()
            var sky = game.sky
            if not await _walk_to(sky.point(Vector2(280,432)).x): return
            game.facing = -1 if sky.mirrored else 1
            game.arts.cast(0)
            await _frames(25)
            if not check(sky.progress[stage].crystal,"dash opens actual crystal wall"): return
            if not await _leap(sky.point(Vector2(560,350)).x,350,false): return
            if not await _rise_to(Vector2(560,100)): return
            if not await _hook_to(Vector2(830,-120),true): return
            game._interact()
            if not check(sky.progress[stage].checkpoint == 1,"save cloud checkpoint"): return
            game.arts.cast(3)
            if not check(sky.progress[stage].sight,"reveal spectral bridge"): return
            if not await _leap(sky.point(Vector2(1130,-260)).x,-260,true): return
            if not await _rise_to(Vector2(1200,-450)): return
            if not await _leap(sky.point(Vector2(900,-620)).x,-620,true): return
            game.arts.cast(4)
            if not check(sky.progress[stage].bell,"resonant bell opens gates"): return
            if not await _rise_to(Vector2(900,-800)): return
            if not await _hook_to(Vector2(560,-840),false): return
            game._control_pressed("jump")
            await _frames(10)
            game.arts.cast(5)
            game._control_released("jump")
            await _frames(60)
            if not check(not is_instance_valid(sky.weak_floor),"dive breaks the chamber ceiling on impact"): return
            if not await _walk_to(sky.point(Vector2(580,-700)).x): return
            game._interact()
            if not check(sky.progress[stage].relic,"discover sealed chamber relic"): return
            if not await _hook_to(Vector2(350,-1030),false): return
            # An optional hidden wing genuinely requires discovery and returns safely.
            if not await _leap(sky.point(Vector2(125,-1150)).x,-1150,true): return
            game._interact()
            if not check(sky.progress[stage].secret,"discover secret treasure above the side shaft"): return
            if not await _walk_to(sky.point(Vector2(350,-1030)).x): return
            await _frames(30)
            if not await _hook_to(Vector2(650,-1220),true): return
            game._interact()
            if not check(sky.progress[stage].checkpoint == 2,"save summit checkpoint"): return
            if not await _hook_to(Vector2(930,-1430),true): return
            var boss = sky.boss
            if not check(boss.awake,"summit boss wakes after relic and bell"): return
            var saw_phase := false
            var jumped_tell := false
            for frame in range(2800):
                if sky.boss_dead: break
                if not check(game.death_time <= 0,"survive sky boss / " + who + " / " + str(stage)): return
                saw_phase = saw_phase or boss.phase_two
                var gap: float = boss.position.x - game.hero.position.x
                var direction: float = signf(gap)
                var axis := 0.0
                if who == "An": axis = direction if absf(gap) > 70 else 0.0
                else:
                    if absf(gap) > 250: axis = direction
                    elif absf(gap) < 150: axis = -direction
                game.joystick.axis = Vector2(axis,0)
                game.facing = int(direction) if direction != 0 else 1
                if frame % 16 == 0: game._request_attack()
                if who == "Kha" and game.health < game.max_health: game._skill()
                if who == "An" and boss.state == "tell" and boss.clock < 0.24 and absf(gap) < 180: game._skill()
                if boss.state == "tell" and boss.clock < 0.1 and not jumped_tell:
                    game._control_pressed("jump")
                    jumped_tell = true
                elif boss.state != "tell":
                    game._control_released("jump")
                    jumped_tell = false
                # Echo Bell is also useful in combat; preserve a full phase transition.
                if frame > 200 and frame % 250 == 0: game.arts.cast(4)
                await physics_frame
            game.joystick.axis = Vector2.ZERO
            game._control_released("jump")
            if not check(sky.boss_dead and saw_phase,"defeat moving two-phase sky boss hp=%d phase=%s hero=%s boss=%s" % [boss.hp,str(saw_phase),str(game.hero.position),str(boss.position)]): return
            if stage == 2:
                if not await _walk_to(sky.point(Vector2(1070,-1430)).x): return
                if not await _hook_to(Vector2(1100,-1730),true): return
            if not await _walk_to(sky.point(Vector2(1240,-1730 if stage == 2 else -1430)).x): return
            game._interact()
            if not check(sky.progress[stage].won and game.victory_panel.visible and sky.best_height > 1800,"reach sky exit above ground"): return
            print("SKY PLAYTHROUGH PASS: %s / %s / height %.0f / six arts / secret / two checkpoints / boss" % [who,sky.TITLES[stage],sky.best_height])
            game.queue_free()
            await process_frame
    print("ECLIPSE SKY PASS: three vertical chapters x An/Kha, six meaningful arts, physical traversal, hidden chambers, secret wings, two checkpoints, summit bosses and exits")
    quit(0)

func _rise_to(local: Vector2) -> bool:
    var target: Vector2 = game.sky.point(local)
    for i in range(190):
        if game.arts.cooldowns[1] <= 0: break
        await physics_frame
    game.arts.cast(1)
    return await _land_at(target,160)

func _hook_to(local: Vector2, right: bool) -> bool:
    var target: Vector2 = game.sky.point(local)
    game.facing = (1 if right else -1) * (-1 if game.sky.mirrored else 1)
    for i in range(100):
        if game.arts.cooldowns[2] <= 0: break
        await physics_frame
    game.arts.cast(2)
    for i in range(160):
        if game.hero.is_on_floor() and absf(game.hero.position.y - (local.y - 24)) < 7 and absf(game.hero.position.x - target.x) < 100:
            game.joystick.axis = Vector2.ZERO
            await _frames(6)
            return true
        await physics_frame
    return check(false,"hook to " + str(local) + " actual " + str(game.hero.position) + " grapple " + str(game.arts.grapple_target))

func _land_at(target: Vector2, frames: int) -> bool:
    for i in range(frames):
        var dx: float = target.x - game.hero.position.x
        game.joystick.axis = Vector2(signf(dx) if absf(dx) > 6 else 0.0,0)
        if i > 24 and game.hero.is_on_floor() and absf(game.hero.position.y - (target.y - 24)) < 6 and absf(dx) < 20:
            game.joystick.axis = Vector2.ZERO
            await _frames(6)
            return true
        await physics_frame
    return check(false,"rise / land at " + str(target) + " actual " + str(game.hero.position))
