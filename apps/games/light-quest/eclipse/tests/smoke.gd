extends SceneTree
const Combat := preload("res://scripts/combat.gd")
var game: Node2D

func _initialize() -> void: call_deferred("_run")
func ensure(value: bool, detail: String) -> bool:
    if not value:
        push_error("ECLIPSE SMOKE FAILED: " + detail)
        quit(1)
    return value
func _frames(n: int) -> void:
    for i in range(n): await physics_frame
func _finger(index: int, point: Vector2, down: bool) -> void:
    var event := InputEventScreenTouch.new()
    event.index = index
    event.position = point
    event.pressed = down
    root.push_input(event, true)

func _fixture(who := "An", chapter := 0) -> void:
    if is_instance_valid(game):
        game.queue_free()
        await process_frame
    game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.demo_room_select.select(chapter)
    game._start(who)
    game._interact()
    await _frames(3)

func _run() -> void:
    await _fixture()
    if not ensure(game.enemies.size() == 3, "each chapter has its own two enemies and boss"): return
    for who in ["An", "Kha"]:
        game._start(who)
        game._interact()
        await _frames(2)
        for mode in ["idle", "run", "jump", "fall", "dash", "attack", "hurt", "death"]:
            if not ensure(game.actor_anim.sprite_frames.has_animation(mode), who + " / " + mode): return
    await _fixture()
    # Freeze decisions only for collision fixtures; the full runs exercise live AI.
    game.set_physics_process(false)
    var wolf = game.enemies[0]
    game.hero.position = wolf.position + Vector2(-69, -9)
    await _frames(3)
    var original: int = wolf.hp
    game.facing = -1
    game._attack()
    game._resolve_attack()
    if not ensure(wolf.hp == original, "directional slash misses behind"): return
    game.facing = 1
    var wall := StaticBody2D.new()
    wall.position = (game.hero.position + wolf.position) * 0.5
    wall.add_child(Combat.rectangle(Vector2(12, 130)))
    game.add_child(wall)
    await _frames(3)
    game._attack()
    game._resolve_attack()
    if not ensure(wolf.hp == original, "wall blocks slash"): return
    game.spawn_bolt(game.hero.position, Vector2(8500, 0), true, 1)
    game.bolts[-1].step(1.0 / 60, game)
    await _frames(2)
    if not ensure(wolf.hp == original, "wall blocks swept projectile"): return
    wall.queue_free()
    await _frames(3)
    game.spawn_bolt(game.hero.position, Vector2(8500, 0), true, 1)
    game.bolts[-1].step(1.0 / 60, game)
    await _frames(2)
    if not ensure(wolf.hp == original - 1, "high-speed projectile cannot tunnel through hurtbox"): return
    game._attack()
    game._resolve_attack()
    if not ensure(wolf.hp < original - 1, "forward melee hits actual hurtbox"): return
    # Parry negates one strike and visibly counters; Kha heals only once per cooldown.
    game.i_frames = 0
    game._skill()
    var hp_before: int = game.health
    game.damage_player(1, game.hero.position.x + 20)
    if not ensure(game.health == hp_before and game.parry_used and game.shield_cooldown == 2.2, "timed An parry"): return
    await _fixture("Kha")
    game.health = 2
    game._skill()
    game._skill()
    if not ensure(game.health == 3 and game.shield_cooldown > 0 and game.skill_time > 0, "Kha heal / pulse cannot be spammed"): return
    # Boss reacts to windup, but recovery cannot be cancelled to dodge.
    var boss = game.trials.boss
    game.hero.position = boss.position + Vector2(-80, 0)
    boss.awake = true
    boss.state = "patrol"
    boss.dodge_cooldown = 0
    game.attack_windup = 0.14
    boss.step(1.0 / 60, game)
    if not ensure(boss.state == "evade" and boss.dodges == 1, "boss backstep reacts to repeated melee"): return
    boss.state = "recover"
    boss.clock = 0.5
    boss.step(1.0 / 60, game)
    if not ensure(boss.state == "recover", "recovery is a reliable punish window"): return
    boss.state = "tell"
    boss.move_name = "cleave"
    boss.clock = 0.5
    boss.charge_direction = -1
    game.hero.position.x = boss.position.x + 150
    boss.step(1.0 / 60, game)
    if not ensure(boss.charge_direction == -1, "telegraphed attack direction stays locked"): return
    # Death resets the active boss and clears hostile projectiles, retains checkpoint.
    game.checkpoint = Vector2(1010, 432)
    boss.hp = 1
    boss.phase_two = true
    game._respawn()
    if not ensure(boss.hp == boss.max_hp and not boss.phase_two and not boss.awake and game.hero.position == game.checkpoint and game.bolts.is_empty(), "death resets encounter and returns to checkpoint"): return
    # All three secrets are one-shot; fragment and checkpoint progress survive reload.
    for chapter in range(3):
        game.demo_room_select.select(chapter)
        game._start("Kha")
        game._interact()
        game.hero.position = Vector2(chapter * 1920 + 638, 291)
        game.trials.interact()
        var maximum: int = game.max_health
        game.trials.interact()
        if not ensure(game.trials.secrets[chapter] and game.max_health == maximum, "secret is collected once"): return
    game.trials.collected[1] = [true, false]
    game.trials.saved[1] = true
    game.save_enabled = true
    game._persist()
    game.trials.secrets = [false, false, false]
    game.max_health = 5
    game._restore()
    if not ensure(game.max_health == 8 and game.trials.secrets == [true, true, true], "save / restore secret rewards"): return
    game.demo_room_select.select(1)
    game._start("Kha")
    game._interact()
    if not ensure(game.trials.sigils == 1 and game.hero.position.x == 2930 and game.trials.relics[0].used and not game.trials.relics[1].used, "saved fragments and chapter checkpoint resume"): return
    DirAccess.remove_absolute(ProjectSettings.globalize_path(game.SAVE_FILE))
    game.save_enabled = false
    await _fixture()
    game.hero.position = Vector2(490, 432)
    await _frames(3)
    _finger(0, Vector2(105, 452), true)
    var drag := InputEventScreenDrag.new()
    drag.index = 0
    drag.position = Vector2(154, 452)
    root.push_input(drag, true)
    _finger(1, Vector2(880, 379), true)
    _finger(2, Vector2(805, 449), true)
    await _frames(6)
    if not ensure(game.joystick.axis.x > 0.6 and game.hero.velocity.x > 0 and game.hero.velocity.y < 0 and game.attack_cooldown > 0, "three simultaneous touch fingers: move / jump / attack"): return
    for finger in range(3): _finger(finger, Vector2(154, 452), false)
    await _frames(2)
    if not ensure(game.joystick.axis == Vector2.ZERO and not game.touch["jump"], "touch release clears movement"): return
    var short_jump := await _jump_height(1)
    var long_jump := await _jump_height(23)
    if not ensure(short_jump > 22 and long_jump > short_jump + 38, "tap / hold variable jump height"): return
    game._dash()
    await _frames(2)
    if not ensure(absf(game.hero.velocity.x) > 420, "dash impulse"): return
    game.trials.return_menu()
    if not ensure(not game.started and game.menu.visible and not game.joystick.accept_touch, "menu pauses combat"): return
    print("ECLIPSE SMOKE PASS: geometry, walls, swept bolts, parry, heal cooldown, reactive AI, locked tells, checkpoint reset, secrets, persistence, three-finger touch, variable jump, dash and menu")
    quit(0)

func _jump_height(hold: int) -> float:
    game.hero.position = Vector2(490, 432)
    game.hero.velocity = Vector2.ZERO
    await _frames(4)
    _finger(1, Vector2(880, 379), true)
    var highest: float = game.hero.position.y
    for frame in range(40):
        if frame == hold: _finger(1, Vector2(880, 379), false)
        await physics_frame
        highest = minf(highest, game.hero.position.y)
    return 432.0 - highest
