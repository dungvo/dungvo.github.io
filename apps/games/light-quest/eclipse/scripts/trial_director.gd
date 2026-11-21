extends Node2D
## Three isolated, two-room chapters using the original Godot scene art.
const Routes := preload("res://scripts/moon_routes.gd")
var routes: Node2D
const Boss := preload("res://scripts/trial_boss.gd")
const Relic := preload("res://scripts/trial_relic.gd")
const TITLES := ["Làng Trăng", "Rừng Vọng", "Hầm Bóng"]
const BOSS_NAMES := ["Vệ Binh Chuông Tàn", "Lang Vương Vọng Âm", "Kẻ Dệt Bóng"]
const STORIES := [
    "Tiếng chuông cuối đã bị đánh cắp. Gặp Thợ Lưu Giữ, thu hai mảnh chuông rồi đánh thức Vệ Binh.",
    "Dấu chân dẫn vào rừng, nhưng tiếng tru vọng từ mọi phía. Thu hai ấn rừng để gọi Lang Vương.",
    "Hai ký ức nằm dưới nền đền. Mang chúng đến Kẻ Dệt Bóng để tìm ra ai đã làm thời gian dừng lại."
]
var game: Node2D
var selected := -1
var boss: CharacterBody2D
var relics: Array[Node2D] = []
var sigils := 0
var secrets := [false, false, false]
var wins := [false, false, false]
var saved := [false, false, false]
var collected: Array = [[false, false], [false, false], [false, false]]
var active := false
var run_id := 0
var arena_locked := false
var boss_label: Label
var boss_bar: ProgressBar
var objective: Label
var prompt: Label
var mini_map: Label
var cooldowns: Label
var barrier: StaticBody2D
var victory_title: Label
var victory_text: Label
var next_button: Button
var menu_button: Button
var checkpoint_heal_ready := true
var decorations: Array[Node2D] = []
var hud_clock := 0.0

func _ready() -> void:
    game = get_parent()
    var layer := CanvasLayer.new()
    add_child(layer)
    objective = game._hud_label(layer, Vector2(270, 18), Vector2(415, 40), 14)
    objective.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    objective.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    prompt = game._hud_label(layer, Vector2(275, 350), Vector2(410, 40), 17)
    prompt.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    boss_label = game._hud_label(layer, Vector2(240, 85), Vector2(480, 50), 17)
    boss_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    boss_label.add_theme_color_override("font_color", Color("#ffdab0"))
    mini_map = game._hud_label(layer, Vector2(370, 501), Vector2(330, 30), 13)
    cooldowns = game._hud_label(layer, Vector2(22, 85), Vector2(215, 50), 13)
    boss_bar = ProgressBar.new()
    boss_bar.position = Vector2(280, 137)
    boss_bar.show_percentage = false
    boss_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
    var bar_bg := StyleBoxFlat.new()
    bar_bg.bg_color = Color("#18162ae8")
    bar_bg.set_corner_radius_all(3)
    var bar_fill := StyleBoxFlat.new()
    bar_fill.bg_color = Color("#e5b084")
    bar_fill.set_corner_radius_all(3)
    boss_bar.add_theme_stylebox_override("background", bar_bg)
    boss_bar.add_theme_stylebox_override("fill", bar_fill)
    layer.add_child(boss_bar)
    boss_bar.size = Vector2(400, 7)
    menu_button = Button.new()
    menu_button.text = "MÀN CHƠI"
    menu_button.position = Vector2(824, 86)
    menu_button.size = Vector2(112, 32)
    menu_button.focus_mode = Control.FOCUS_NONE
    menu_button.pressed.connect(return_menu)
    layer.add_child(menu_button)
    boss_label.hide()
    if is_instance_valid(boss_bar): boss_bar.hide()
    menu_button.hide()
    # Replace only victory copy and actions; preserve the game's panel and controls.
    var column: VBoxContainer = game.victory_panel.get_child(0)
    victory_title = column.get_child(0)
    victory_text = column.get_child(1)
    var resume: Button = column.get_child(2)
    resume.text = "Khám phá bí mật còn lại"
    next_button = Button.new()
    next_button.text = "Màn tiếp theo"
    next_button.custom_minimum_size.y = 36
    next_button.pressed.connect(next_trial)
    column.add_child(next_button)
    var choose := Button.new()
    choose.text = "Chọn màn / đổi nhân vật"
    choose.custom_minimum_size.y = 36
    choose.pressed.connect(return_menu)
    column.add_child(choose)
    game.victory_panel.position = Vector2(235, 120)
    game.victory_panel.custom_minimum_size.x = 490
    routes = Routes.new()
    add_child(routes)

func begin(index: int) -> void:
    run_id += 1
    active = true
    selected = index
    # Replay defeated chapters from the start; preserve fragments for unfinished saves.
    if wins[index]: collected[index] = [false, false]
    sigils = collected[index].count(true)
    arena_locked = false
    checkpoint_heal_ready = true
    for foe in game.enemies:
        if is_instance_valid(foe): foe.queue_free()
    game.enemies.clear()
    for bolt in game.bolts:
        if is_instance_valid(bolt): bolt.queue_free()
    game.bolts.clear()
    for relic in relics:
        if is_instance_valid(relic): relic.queue_free()
    relics.clear()
    for prop in decorations:
        if is_instance_valid(prop): prop.queue_free()
    decorations.clear()
    if is_instance_valid(barrier): barrier.queue_free()
    var start := float(index) * 1920
    game.hero.position = Vector2(start + (1010.0 if saved[index] and not wins[index] else 110.0), 432)
    game.hero.velocity = Vector2.ZERO
    game.checkpoint = game.hero.position
    game.cam.limit_left = int(start)
    game.cam.limit_right = int(start + 1920)
    game.cam.reset_smoothing()
    game.cam.force_update_scroll()
    game.scenery.update_camera(start + 480, false, true)
    game.guardian = null
    game.boss_dead = false
    game.health = game.max_health
    game.i_frames = 1.2
    game.death_time = 0
    game.hurt_time = 0
    game.dash_time = 0
    game.attack_buffer = 0
    game.slash_time = 0
    game.combo_step = 0
    game.attack_windup = 0
    game.attack_cooldown = 0
    game.shield_cooldown = 0
    game.dash_cooldown = 0
    game.skill_time = 0
    game.combo_window = 0
    game.burst_cooldown = 0
    game.burst_time = 0
    game.air_jumps = 1 if routes.air_step_unlocked else 0
    game.vfx.clear()
    game.victory_panel.hide()
    menu_button.show()
    var roster: Array = [["wolf", "golem"], ["wolf", "bat"], ["golem", "mage"]][index]
    game._spawn_enemy(roster[0], start + 440)
    game._spawn_enemy(roster[1], start + 830)
    for i in range(2):
        var relic_x := 335.0 if i == 0 else 1120.0
        _relic("sigil", Vector2(start + relic_x, 375), "E · Mảnh ấn " + ("I" if i == 0 else "II"))
        relics[-1].used = collected[index][i]
    _relic("checkpoint", Vector2(start + 1010, 432), "E · Lưu / hồi sinh lực")
    if not secrets[index]:
        _relic("secret", Vector2(start + 638, 315), "E · Bí mật trên cao")
    # Use original statues/chests to ground interactables in the painted world.
    decorations.append(game.scenery._prop(5, Vector2(start + 1010, 456), Vector2(58, 86)))
    boss = Boss.new()
    boss.kind = ["guardian", "wolf", "mage"][index]
    boss.trial = index
    boss.title = BOSS_NAMES[index]
    boss.max_hp = [18, 20, 22][index]
    boss.position = Vector2(start + 1680, 456 - boss.SIZES[boss.kind].y * 0.5)
    boss.arena = Vector2(start + 1320, start + 1850)
    add_child(boss)
    game.enemies.append(boss)
    # An arena divider is opened by the two sigils and the village quest.
    barrier = StaticBody2D.new()
    barrier.collision_layer = 1
    barrier.position = Vector2(start + 1280, 78)
    barrier.add_child(game.Combat.rectangle(Vector2(16, 756)))
    add_child(barrier)
    routes.build(index)
    game._say(TITLES[index] + " · Hai khu vực / một bí mật / một boss", 3)
    game.dialogue_label.text = STORIES[index] + "\n\nE / nút E để đóng. Checkpoint nằm trước đấu trường."
    game._show_dialogue(true)
    update_hud()
    queue_redraw()
    print("ECLIPSE CHAPTER: %d %s" % [selected, game.character])

func _relic(kind: String, point: Vector2, caption: String) -> void:
    var relic := Relic.new()
    relic.kind = kind
    relic.position = point
    relic.caption = caption
    relic.tint = Color("#ffda8a") if kind == "secret" else Color("#98e2ed")
    add_child(relic)
    relics.append(relic)

func tick(delta: float) -> void:
    if not active: return
    var start := selected * 1920.0
    game.hero.position.x = clampf(game.hero.position.x, start + 26, start + 1890)
    routes.tick(delta)
    for relic in relics:
        relic.tick(delta, game.hero.position)
    if is_instance_valid(boss) and not boss.awake and boss.state != "dead" and game.hero.position.x > start + 1340 and sigils >= 2 and (selected != 0 or game.met_npc):
        boss.awake = true
        arena_locked = true
        game._say(BOSS_NAMES[selected] + " · Vệt vàng báo đòn: né rồi phản công!", 4)
    # Existing body is closed behind the player only after entry.
    if arena_locked and is_instance_valid(boss) and boss.state != "dead":
        game.hero.position.x = maxf(game.hero.position.x, start + 1315)
    if sigils >= 2 and (selected != 0 or game.met_npc) and is_instance_valid(barrier):
        barrier.queue_free()
        game._say("Đấu trường đã mở · Lưu ở trụ trước khi vào", 3)
        queue_redraw()
    hud_clock -= delta
    if hud_clock <= 0:
        hud_clock = 0.1
        update_hud()

func interact() -> bool:
    if not active: return false
    if routes.interact(): return true
    if selected == 0 and not game.met_npc and game.hero.position.distance_to(Vector2(290, 432)) < 90:
        game.met_npc = true
        game.dialogue_label.text = "Thợ Lưu Giữ: Hai mảnh chuông nằm trên các bệ đá. Mang chúng đến Vệ Binh. Khi lưỡi kiếm lóe vàng, lướt qua đòn hoặc dùng L để phản đòn.\n\nE để đóng."
        game._show_dialogue(true)
        game._persist()
        return true
    for relic in relics:
        if relic.used and relic.kind != "checkpoint": continue
        var reach := 72.0 if relic.kind == "checkpoint" else 48.0
        if game.hero.position.distance_to(relic.position) > reach: continue
        match relic.kind:
            "sigil":
                relic.used = true
                sigils += 1
                collected[selected][0 if fposmod(relic.position.x, 1920) < 960 else 1] = true
                game.sound.play_cue("light")
                game.emit_impact(relic.position, relic.tint)
                game._say("Mảnh ấn %d/2 · Tìm trụ lưu trước đấu trường" % sigils, 3)
            "secret":
                relic.used = true
                secrets[selected] = true
                game.max_health = mini(8, 5 + secrets.count(true))
                game.health = game.max_health
                game.sound.play_cue("victory")
                game._say("BÍ MẬT · Ký ức %d/3 — thêm một tim" % secrets.count(true), 4)
            "checkpoint":
                saved[selected] = true
                game.checkpoint = Vector2(selected * 1920 + 1010, 432)
                if checkpoint_heal_ready:
                    game.health = game.max_health
                    checkpoint_heal_ready = false
                relic.used = true
                game._say("Đã lưu. Hồi sinh sẽ đặt lại boss; hai mảnh ấn được giữ trong lượt.", 3)
        game._persist()
        update_hud()
        queue_redraw()
        return true
    return false

func respawn() -> void:
    arena_locked = false
    checkpoint_heal_ready = true
    if is_instance_valid(boss) and boss.state != "dead": boss.reset_encounter()
    game.skill_time = 0
    game.burst_time = 0
    game.burst_cooldown = 0
    game.air_jumps = 1 if routes.air_step_unlocked else 0
    game.shield_cooldown = 0
    game.dash_cooldown = 0
    game._persist()
    update_hud()

func boss_defeated() -> void:
    wins[selected] = true
    arena_locked = false
    game.moon_dash = true
    game.i_frames = maxf(game.i_frames, 1.2)
    # Expire hostile bolts without mutating the array during a projectile hit callback.
    for bolt in game.bolts:
        if is_instance_valid(bolt) and not bolt.friendly: bolt.life = 0
    game._persist()
    game.sound.play_cue("victory")
    victory_title.text = TITLES[selected].to_upper() + " · ĐÃ GIẢI PHÓNG"
    victory_text.text = BOSS_NAMES[selected] + " đã gục ngã.\nNguyệt Lướt đã thức tỉnh · Bí mật: %d/3\n%s" % [secrets.count(true), "Chuông lại ngân. Tiếng vọng dẫn vào rừng." if selected == 0 else ("Lang Vương để lộ cửa hầm ký ức." if selected == 1 else "Thời gian chuyển động. Ba miền đã được giải phóng.")]
    next_button.text = "Tiếp: " + TITLES[(selected + 1) % 3]
    var ending := create_tween()
    ending.tween_interval(0.75)
    var cleared := selected
    var cleared_run := run_id
    ending.tween_callback(func():
        if active and selected == cleared and cleared_run == run_id: game._show_victory()
    )
    update_hud()

func next_trial() -> void:
    game.demo_room_select.select((selected + 1) % 3)
    game._start(game.character)

func return_menu() -> void:
    active = false
    routes.clear_hint()
    game.started = false
    game._show_dialogue(false)
    game.victory_panel.hide()
    game.menu.show()
    game.joystick.accept_touch = false
    game._reset_touch()
    boss_label.hide()
    if is_instance_valid(boss_bar): boss_bar.hide()
    prompt.text = ""
    objective.text = ""
    cooldowns.text = ""
    mini_map.text = ""
    menu_button.hide()

func update_hud() -> void:
    if not active: return
    game.chapter.text = TITLES[selected]
    game.hearts.show_health(game.health, game.max_health)
    game.light_status.text = "Đã giải phóng" if wins[selected] else "Khám phá / đấu trường"
    objective.text = ("Gặp Thợ Lưu Giữ · E" if selected == 0 and not game.met_npc else ("Thu mảnh ấn %d/2 · E gần pha lê" % sigils if sigils < 2 else "Đánh bại " + BOSS_NAMES[selected]))
    if is_instance_valid(boss) and boss.state == "dead": objective.text = "Màn hoàn thành · Có thể tiếp tục tìm bí mật"
    boss_label.visible = is_instance_valid(boss) and boss.awake and boss.state != "dead"
    if boss_label.visible:
        boss_label.text = "%s · PHA %d\n%d / %d" % [BOSS_NAMES[selected], 2 if boss.phase_two else 1, boss.hp, boss.max_hp]
        boss_bar.max_value = boss.max_hp
        boss_bar.value = boss.hp
    boss_bar.visible = boss_label.visible
    cooldowns.text = "L · %s  %s\nK · Lướt  %s" % ["Phản đòn" if game.character == "An" else "Hồi quang / xung lực", "SẴN SÀNG" if game.shield_cooldown <= 0 else "%.1fs" % game.shield_cooldown, "SẴN SÀNG" if game.dash_cooldown <= 0 else "%.1fs" % game.dash_cooldown]
    cooldowns.text += "\nQ · %s  %s\n%s · Di vật %d/3" % ["Nguyệt Trảm" if game.character == "An" else "Tinh Bộ", "SẴN SÀNG" if game.burst_cooldown <= 0 else "%.1fs" % game.burst_cooldown, "Bước Gió" if routes.air_step_unlocked else "Tìm đền Bước Gió", routes.claimed.count(true)]
    prompt.text = ""
    for relic in relics:
        if (not relic.used or relic.kind == "checkpoint") and relic.position.distance_to(game.hero.position) < 100:
            prompt.text = relic.caption
    var local_x: float = game.hero.position.x - selected * 1920
    mini_map.text = "LỐI ĐI  %d%%   ·   ẤN %d/2   ·   BÍ MẬT %s" % [clampi(int(local_x / 19.2), 0, 100), sigils, "ĐÃ TÌM" if secrets[selected] else "?"]

func _draw() -> void:
    if not active: return
    if is_instance_valid(barrier):
        var x := selected * 1920 + 1280
        draw_line(Vector2(x, -250), Vector2(x, 456), Color("#a4dbf580"), 4, true)
        for y in range(160, 450, 38):
            draw_circle(Vector2(x, y), 4, Color("#e6e4b0"))
