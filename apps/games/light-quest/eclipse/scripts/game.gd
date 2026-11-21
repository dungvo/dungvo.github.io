extends Node2D
## Coordinates campaign rooms, combat actors and HUD.
const Sound := preload("res://scripts/eclipse_sound.gd")
const ATTACK_WINDUP := [0.078, 0.105, 0.145]
const ATTACK_CYCLE := [0.26, 0.30, 0.42]
const HealthHearts := preload("res://scripts/health_hearts.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const RuinStage := preload("res://scripts/ruin_stage.gd")
const Combat := preload("res://scripts/combat.gd")
const EnemyScene := preload("res://scenes/enemy.tscn")
const LightBolt := preload("res://scripts/light_bolt.gd")
const MirrorCircuit := preload("res://scripts/mirror_circuit.gd")
const MOBILE_WEB_FPS := 30
const MOBILE_PARTICLE_BUDGET := 44
const ROOM_W := 960.0
const FLOOR_Y := 456.0
const SAVE_FILE := "user://eclipse_chapters_v2.json"
const SixArts := preload("res://scripts/six_arts.gd")
const SkyCampaign := preload("res://scripts/sky_campaign.gd")
var arts: Node2D
var sky: Node2D
const TrialDirector := preload("res://scripts/trial_director.gd")
var trials: Node2D
var skill_time := 0.0
var parry_used := false
var air_jumps := 0
var burst_cooldown := 0.0
var burst_time := 0.0
var burst_facing := 1
var burst_origin := Vector2.ZERO
var burst_trace := Vector2.ZERO
var burst_hits: Array[int] = []
const Hit := preload("res://scripts/hit_geometry.gd")
const ROOMS := ["Làng Trăng", "Rừng Vọng", "Hầm Bóng", "Tháp Pha Lê", "Cổng Đêm", "Đài Quan Sát", "Người Giữ Nguyệt"]
const TIPS := ["Gặp Thợ Lưu Giữ (E) để nhận nhiệm vụ.", "Đánh quái và vượt bục đá.", "Tìm đường qua những bệ đá cổ.", "Xoay hai gương để dẫn tia sáng đến pha lê.", "Chỉ vào được khi Tháp Pha Lê đã sáng.", "Checkpoint: đứng gần đài và nhấn E.", "Phá khiên boss bằng ánh sáng. Đánh vào lúc khiên tan."]
var hero: CharacterBody2D
var body_shape: CollisionShape2D
var cam: Camera2D
var hud: Label
var hearts: Node2D
var help: Label
var chapter: Label
var light_status: Label
var dialogue: PanelContainer
var dialogue_label: Label
var touch := {"jump":false, "attack":false, "interact":false, "dash":false, "skill":false, "burst":false, "art":false}
var control_art: Dictionary = {}
var joystick: Node2D
var last_room := -1
var activated := false
var met_npc := false
var found_chest := false
var moon_dash := false
var boss_dead := false
var checkpoint := Vector2(130, 432)
var health := 5
var max_health := 5
var character := "An"
var facing := 1
var i_frames := 0.0
var attack_cooldown := 0.0
var dash_cooldown := 0.0
var dash_time := 0.0
var boss_shield_time := 0.0
var boss_pedestal_cooldown := 0.0
var sound: Node
var victory_panel: PanelContainer
var enemies: Array[CharacterBody2D] = []
var bolts: Array[Node2D] = []
var guardian: CharacterBody2D
var light_circuit: Node2D
var combo_step := 0
var combo_window := 0.0
var attack_buffer := 0.0
var attack_windup := 0.0
var attack_facing := 1
var hurt_time := 0.0
var death_time := 0.0
var shield_cooldown := 0.0
var scenery: Node2D
var notice := ""
var notice_time := 0.0
var started := false
var menu: PanelContainer
var demo_room_select: OptionButton
var current_trial := 0
# Feel First v0.2: buffered jumps, acceleration and feedback.
const RUN_ACCEL := 2050.0
const RUN_FRICTION := 2300.0
const AIR_ACCEL := 1450.0
const JUMP_SPEED := -435.0
const COYOTE_WINDOW := 0.13
const JUMP_BUFFER_WINDOW := 0.15
var coyote_clock := 0.0
var jump_buffer_clock := 0.0
var jump_held := false
var dust_clock := 0.0
var shake_time := 0.0
var slash_time := 0.0
var blade_flash := 0.0
var save_enabled := true
var vfx: Array[Dictionary] = []
var visual_clock := 0.0
var actor_anim: AnimatedSprite2D
var anim_label := ""
var motion_state := "idle"
var mobile_web := false
var effects_visible := false
var guardian_shield_visible := false



var loadout: CanvasLayer
var journey_next := 0
var story_mode := false
var story_room := -1
var story_hero := "An"
var story_button: Button

func _ready() -> void:
    mobile_web = OS.has_feature("web") and DisplayServer.is_touchscreen_available()
    if mobile_web:
        Engine.max_fps = MOBILE_WEB_FPS
    sound = Sound.new()
    add_child(sound)
    _make_stage()
    _make_hero()
    light_circuit = MirrorCircuit.new()
    light_circuit.position = Vector2(3 * ROOM_W, 0)
    add_child(light_circuit)
    light_circuit.completed.connect(_light_completed)
    light_circuit.hide() # Original mirror puzzle is retained in source for the legacy campaign.
    _make_ui()
    trials = TrialDirector.new()
    add_child(trials)
    arts = SixArts.new()
    add_child(arts)
    sky = SkyCampaign.new()
    add_child(sky)
    loadout = preload("res://scripts/loadout.gd").new()
    add_child(loadout)
    _restore()
    if activated: light_circuit.restore_solved()
    scenery.plaza_chest.hide()
    # Chapter bosses are spawned when a chapter is selected.
    _update_hud()
    _menu()

func _make_stage() -> void:
    scenery = RuinStage.new()
    add_child(scenery)
    var ledges := [
        [Vector2(130, 168), Vector2(686, 172)],
        [Vector2(143, 159), Vector2(473, 138), Vector2(783, 130)],
        [Vector2(255, 144), Vector2(499, 194), Vector2(790, 127)],
        [Vector2(229, 155), Vector2(630, 179)],
        [Vector2(174, 194), Vector2(586, 133), Vector2(783, 118)],
        [Vector2(436, 179), Vector2(701, 182)],
        [Vector2(194, 135), Vector2(797, 156)]
    ]
    for r in range(7):
        var ox := float(r) * ROOM_W
        _solid(Rect2(ox, FLOOR_Y, ROOM_W, 100))
        var platforms: Array = ledges[r] if r % 2 == 0 else [Vector2(143, 159)]
        for ledge in platforms:
            _solid(Rect2(ox + ledge.x, 375, ledge.y, 25), true)
        if r == 1:
            _solid(Rect2(ox + 295, 410, 51, 46), true)
            _solid(Rect2(ox + 658, 410, 60, 46), true)
        if r == 3:
            _solid(Rect2(ox + 59, 375, 106, 25), true)
        if r in [0, 2, 4]:
            _solid(Rect2(ox + 586, 315, 115, 24), true)
    # Hard gate after room 4: collision toggled when light is activated.
    var gate := StaticBody2D.new()
    gate.name = "LightGate"
    gate.collision_layer = Combat.WORLD
    gate.collision_mask = 0
    gate.position = Vector2(ROOM_W * 5.0, 301)
    var col := CollisionShape2D.new()
    var shape := RectangleShape2D.new()
    shape.size = Vector2(30, 310)
    col.shape = shape
    gate.add_child(col)
    add_child(gate)
    gate.collision_layer = 0 # Chapter boundaries are handled by the trial director.

func _spawn_enemy(kind: String, x: float) -> CharacterBody2D:
    var enemy := EnemyScene.instantiate() as CharacterBody2D
    enemy.kind = kind
    var height: float = enemy.SIZES[kind].y
    enemy.position = Vector2(x, 345.0 if kind in ["bat", "mage"] else FLOOR_Y - height * 0.5)
    add_child(enemy)
    enemies.append(enemy)
    return enemy

func _solid(rect: Rect2, one_way := false) -> void:
    scenery.platform(rect)
    var b := StaticBody2D.new()
    b.collision_layer = Combat.WORLD
    b.collision_mask = 0
    b.position = rect.position + rect.size / 2
    var s := CollisionShape2D.new()
    var sh := RectangleShape2D.new()
    sh.size = rect.size
    s.shape = sh
    s.one_way_collision = one_way
    b.add_child(s)
    add_child(b)

func _make_hero() -> void:
    hero = CharacterBody2D.new()
    hero.position = Vector2(130, 432)
    hero.motion_mode = CharacterBody2D.MOTION_MODE_GROUNDED
    body_shape = CollisionShape2D.new()
    var sh := CapsuleShape2D.new()
    sh.radius = 12
    sh.height = 48
    body_shape.shape = sh
    hero.add_child(body_shape)
    hero.collision_layer = Combat.HERO
    hero.collision_mask = Combat.WORLD
    Combat.add_hurtbox(hero, Hit.PLAYER_BODY, Combat.HERO_HURT)
    add_child(hero)
    actor_anim = AnimatedSprite2D.new()
    actor_anim.offset = Vector2(0, -80)
    actor_anim.position.y = 24.0
    actor_anim.scale = Vector2.ONE * 0.43
    actor_anim.z_index = 4
    actor_anim.sprite_frames = Art.actor_frames(false)
    hero.add_child(actor_anim)
    actor_anim.play("idle")
    cam = Camera2D.new()
    cam.zoom = Vector2(1.0, 1.0)
    cam.position_smoothing_enabled = true
    cam.position_smoothing_speed = 9.0
    cam.enabled = true
    cam.position = Vector2(0, -142)
    cam.limit_left = 0
    cam.limit_top = -250
    cam.limit_bottom = 600
    cam.limit_right = int(7*ROOM_W)
    hero.add_child(cam)

func _make_ui() -> void:
    var layer := CanvasLayer.new()
    add_child(layer)
    hud = _hud_label(layer, Vector2(22, 18), Vector2(312, 39), 20)
    hud.add_theme_color_override("font_color", Color("#ffe0a1"))
    hearts = HealthHearts.new()
    hearts.position = Vector2(79, 28)
    layer.add_child(hearts)
    chapter = _hud_label(layer, Vector2(698, 18), Vector2(240, 32), 19)
    chapter.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
    light_status = _hud_label(layer, Vector2(698, 49), Vector2(240, 28), 14)
    light_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
    help = _hud_label(layer, Vector2(22, 53), Vector2(480, 30), 15)
    help.add_theme_color_override("font_color", Color("#daebff"))
    var touchbar := Control.new()
    touchbar.set_anchors_preset(Control.PRESET_FULL_RECT)
    touchbar.mouse_filter = Control.MOUSE_FILTER_IGNORE
    layer.add_child(touchbar)
    joystick = Node2D.new()
    joystick.set_script(load("res://scripts/virtual_joystick.gd"))
    layer.add_child(joystick)
    _touch_button(touchbar, "jump", "NHẢY", Vector2(880, 379), 34)
    _touch_button(touchbar, "attack", "ĐÁNH", Vector2(805, 449), 43)
    _touch_button(touchbar, "dash", "LƯỚT", Vector2(705, 463), 33)
    _touch_button(touchbar, "skill", "LỰC", Vector2(898, 471), 33)
    _touch_button(touchbar, "art", "ẤN", Vector2(705, 354), 30)
    _touch_button(touchbar, "burst", "Q", Vector2(790, 354), 30)
    _touch_button(touchbar, "interact", "E", Vector2(898, 299), 26)
    dialogue = PanelContainer.new()
    dialogue.position = Vector2(145,220)
    dialogue.custom_minimum_size = Vector2(670,115)
    layer.add_child(dialogue)
    dialogue_label = Label.new()
    dialogue_label.custom_minimum_size = Vector2(650,105)
    dialogue_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    dialogue_label.add_theme_font_size_override("font_size",20)
    dialogue.add_child(dialogue_label)
    dialogue.hide()
    victory_panel = PanelContainer.new()
    victory_panel.position = Vector2(278, 128)
    victory_panel.custom_minimum_size = Vector2(404, 202)
    var column := VBoxContainer.new()
    column.add_theme_constant_override("separation", 12)
    var title := Label.new()
    title.text = "ĐÃ THẮP SÁNG THÁP TRĂNG"
    title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    title.add_theme_font_size_override("font_size", 23)
    var reward := Label.new()
    reward.text = "Đã mở Nguyệt Lướt.
Tháp Trăng đã an toàn."
    reward.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    var resume := Button.new()
    resume.text = "Tiếp tục khám phá"
    resume.custom_minimum_size.y = 38.0
    resume.pressed.connect(_dismiss_victory)
    column.add_child(title)
    column.add_child(reward)
    column.add_child(resume)
    victory_panel.add_child(column)
    layer.add_child(victory_panel)
    victory_panel.hide()
    _update_hud()

func _hud_label(layer: CanvasLayer, at: Vector2, extent: Vector2, font_size: int) -> Label:
    var label := Label.new()
    label.position = at
    label.size = extent
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    label.add_theme_font_size_override("font_size", font_size)
    label.add_theme_color_override("font_outline_color", Color("#071633"))
    label.add_theme_constant_override("outline_size", 8)
    layer.add_child(label)
    return label

func _touch_button(parent: Control, key: String, glyph: String, center: Vector2, radius: float) -> void:
    var hit := TouchScreenButton.new()
    var circle := CircleShape2D.new()
    circle.radius = radius + 5
    hit.shape = circle
    hit.position = center
    hit.pressed.connect(_control_pressed.bind(key))
    hit.released.connect(_control_released.bind(key))
    parent.add_child(hit)

    var face := Button.new()
    face.text = glyph
    face.position = center - Vector2.ONE * radius
    face.size = Vector2.ONE * radius * 2
    face.focus_mode = Control.FOCUS_NONE
    face.mouse_filter = Control.MOUSE_FILTER_IGNORE
    face.add_theme_font_size_override("font_size", 17 if key == "interact" else 15)
    var style := StyleBoxFlat.new()
    style.bg_color = Color("#0a1b34a9") if key != "attack" else Color("#492e168c")
    style.border_color = Color("#adcde9b0") if key != "attack" else Color("#ffcf77")
    style.set_border_width_all(2)
    style.set_corner_radius_all(100)
    face.add_theme_stylebox_override("normal", style)
    parent.add_child(face)
    control_art[key] = face

func _control_pressed(key: String) -> void:
    if not started or death_time > 0: return
    if victory_panel.visible:
        if key == "interact": _dismiss_victory()
        return
    if dialogue.visible:
        if key == "interact": _show_dialogue(false)
        return
    touch[key] = true
    control_art[key].modulate = Color("#b6ebff")
    if key == "jump": jump_buffer_clock = JUMP_BUFFER_WINDOW

func _control_released(key: String) -> void:
    if key == "jump": touch[key] = false
    control_art[key].modulate = Color.WHITE

func _reset_touch() -> void:
    if is_instance_valid(joystick): joystick.release_finger()
    for key in touch:
        touch[key] = false
        control_art[key].modulate = Color.WHITE
    jump_held = false

func _notification(what: int) -> void:
    if what == NOTIFICATION_APPLICATION_FOCUS_OUT and is_instance_valid(joystick):
        _reset_touch()
        jump_buffer_clock = 0
        attack_buffer = 0
func _menu() -> void:
    menu = PanelContainer.new()
    menu.position = Vector2(270,75)
    menu.custom_minimum_size = Vector2(420,375)
    var layer := CanvasLayer.new()
    layer.layer = 10
    add_child(layer)
    layer.add_child(menu)
    var v := VBoxContainer.new()
    menu.add_child(v)
    var title := Label.new()
    title.text = "LIGHT QUEST: ECLIPSE\nHÀNH TRÌNH NHẬT THỰC · V8"
    title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    title.add_theme_font_size_override("font_size",24)
    v.add_child(title)
    var note := Label.new()
    note.text = "A/D di chuyển · Space nhảy · J đánh\n1–6 sáu ấn · F dùng ấn · Q tuyệt kỹ · E tương tác"
    note.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    v.add_child(note)
    var selector_label := Label.new()
    selector_label.text = "CHỌN MÀN HOẶC TIẾP TỤC HÀNH TRÌNH"
    selector_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    v.add_child(selector_label)
    demo_room_select = OptionButton.new()
    demo_room_select.add_item("01 · Làng Trăng — Vệ Binh Chuông Tàn", 0)
    demo_room_select.add_item("02 · Rừng Vọng — Lang Vương Vọng Âm", 1)
    demo_room_select.add_item("03 · Hầm Bóng — Kẻ Dệt Bóng", 2)
    demo_room_select.add_item("04 · Tháp Gió — sáu ấn / leo tầng trời", 3)
    demo_room_select.add_item("05 · Vườn Treo — khám phá trên mây", 4)
    demo_room_select.add_item("06 · Đỉnh Nguyệt — Thủ Hộ Nhật Thực", 5)
    demo_room_select.add_item("07 · Đường Chân Trời — cầu gió và đài canh", 6)
    demo_room_select.select(journey_next)
    demo_room_select.custom_minimum_size.y = 38.0
    v.add_child(demo_room_select)
    for who in ["An — kiếm sĩ","Kha — pháp sư"]:
        var b := Button.new()
        b.text = "Chơi: " + who
        b.pressed.connect(func():
            story_mode = false
            _start("Kha" if who.begins_with("Kha") else "An")
        )
        b.custom_minimum_size.y = 38
        v.add_child(b)
    story_button = Button.new()
    story_button.text = "VÀO TRUYỆN · " + ("Tiếp tục" if story_room >= 0 else "Bắt đầu")
    story_button.custom_minimum_size.y = 36
    story_button.pressed.connect(func():
        story_mode = true
        demo_room_select.select(maxi(0, story_room))
        _start(story_hero)
    )
    v.add_child(story_button)
    v.add_theme_constant_override("separation", 12)
    menu.add_theme_stylebox_override("panel", _panel_style())
    dialogue.add_theme_stylebox_override("panel", _panel_style())
    victory_panel.add_theme_stylebox_override("panel", _panel_style())

func _panel_style() -> StyleBoxFlat:
    var style := StyleBoxFlat.new()
    style.bg_color = Color("#0b1427f0")
    style.border_color = Color("#b8a273")
    style.set_border_width_all(1)
    style.set_corner_radius_all(12)
    style.content_margin_left = 20
    style.content_margin_right = 20
    style.content_margin_top = 16
    style.content_margin_bottom = 16
    return style

func _start(who: String) -> void:
    character = who
    current_trial = demo_room_select.get_selected_id() if is_instance_valid(demo_room_select) else 0
    last_room = -1
    actor_anim.sprite_frames = Art.actor_frames(character == "Kha")
    actor_anim.play("idle")
    anim_label = "idle"
    started = true
    menu.hide()
    _reset_touch()
    joystick.accept_touch = true
    if current_trial >= 3:
        trials.return_menu()
        started = true
        menu.hide()
        joystick.accept_touch = true
        sky.begin(current_trial - 3)
    else:
        sky.stop()
        trials.begin(current_trial)
        arts.reset()
    if story_mode:
        story_room = current_trial
        story_hero = character
        story_button.text = "VÀO TRUYỆN · Tiếp tục"
        _persist()
    _update_hud()
    if OS.has_feature("web") and "--eclipse-render-probe" in OS.get_cmdline_user_args():
        _measure_browser_render_rate()

func _measure_browser_render_rate() -> void:
    var started_at := Time.get_ticks_msec()
    var drawn_at_start := Engine.get_frames_drawn()
    get_tree().create_timer(2.2).timeout.connect(func():
        var elapsed := (Time.get_ticks_msec() - started_at) / 1000.0
        var fps := (Engine.get_frames_drawn() - drawn_at_start) / elapsed
        var viewport_size := get_viewport().get_texture().get_size()
        print("ECLIPSE RENDER PROBE: %.1f FPS, cap %d, viewport %dx%d" % [
            fps, Engine.max_fps, int(viewport_size.x), int(viewport_size.y)
        ])
    )

func _input(event:InputEvent) -> void:
    if not is_instance_valid(dialogue): return
    if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_I and loadout.opener.visible:
        loadout.toggle()
        return
    if loadout.panel.visible:
        if event.is_action_pressed("ui_cancel"): loadout.toggle()
        return
    if event.is_action_pressed("ui_cancel"):
        if dialogue.visible: _show_dialogue(false)
        elif victory_panel.visible: _dismiss_victory()
        elif started: trials.return_menu()
    if not started: return
    if victory_panel.visible:
        if event is InputEventKey and event.pressed and event.keycode == KEY_E: _dismiss_victory()
        return
    if event is InputEventKey and event.pressed and not event.echo:
        if not dialogue.visible and event.keycode in [KEY_SPACE, KEY_W, KEY_UP]:
            jump_buffer_clock = JUMP_BUFFER_WINDOW
        match event.keycode:
            KEY_E: _interact()
            KEY_J: _request_attack()
            KEY_K: _dash()
            KEY_R: _respawn()
            KEY_L: _skill()
            KEY_Q: _signature()
            KEY_F: arts.cast(loadout.quick_art())
            KEY_1: arts.cast(0)
            KEY_2: arts.cast(1)
            KEY_3: arts.cast(2)
            KEY_4: arts.cast(3)
            KEY_5: arts.cast(4)
            KEY_6: arts.cast(5)

func _physics_process(delta:float) -> void:
    if not started or dialogue.visible or victory_panel.visible or loadout.panel.visible: return
    visual_clock += delta
    burst_cooldown = maxf(0, burst_cooldown - delta)
    burst_time = maxf(0, burst_time - delta)
    if burst_time > 0 and character == "An": _signature_hits()
    if death_time > 0:
        death_time = maxf(0, death_time - delta)
        _tick_vfx(delta)
        _refresh_effects()
        if death_time <= 0: _respawn()
        return
    arts.tick(delta)
    if notice_time > 0:
        notice_time = maxf(0, notice_time - delta)
        if notice_time <= 0: help.text = ""
    attack_cooldown = maxf(0, attack_cooldown-delta)
    dash_cooldown = maxf(0, dash_cooldown-delta)
    i_frames = maxf(0, i_frames-delta)
    slash_time = maxf(0, slash_time-delta)
    blade_flash = maxf(0, blade_flash-delta)
    shake_time = maxf(0, shake_time-delta)
    boss_shield_time = maxf(0, boss_shield_time-delta)
    boss_pedestal_cooldown = maxf(0, boss_pedestal_cooldown-delta)
    jump_buffer_clock = maxf(0, jump_buffer_clock-delta)
    _tick_vfx(delta)
    combo_window = maxf(0, combo_window - delta)
    hurt_time = maxf(0, hurt_time - delta)
    shield_cooldown = maxf(0, shield_cooldown - delta)
    skill_time = maxf(0, skill_time - delta)
    attack_buffer = maxf(0, attack_buffer - delta)
    if attack_buffer > 0 and attack_cooldown <= 0:
        _attack()
    if attack_windup > 0:
        attack_windup -= delta
        if attack_windup <= 0: _resolve_attack()
    var grounded_before := hero.is_on_floor()
    if grounded_before:
        coyote_clock = COYOTE_WINDOW
        air_jumps = 1 if trials.routes.air_step_unlocked else 0
    else:
        coyote_clock = maxf(0, coyote_clock-delta)
    var current_jump := bool(touch["jump"]) or Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP)
    if current_jump and not jump_held:
        jump_buffer_clock = JUMP_BUFFER_WINDOW
    jump_held = current_jump
    var dx := 0.0
    dx = float(int(Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT)) - int(Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT)))
    if joystick != null and absf(joystick.axis.x) > 0.02:
        dx = joystick.axis.x
    if absf(dx) > 0.18 and dash_time <= 0: facing = int(sign(dx))
    # A strong first impulse prevents the sluggish feel when changing direction.
    var target_speed := dx * (215.0 if character == "Kha" else 255.0)
    var accel := RUN_ACCEL if grounded_before else AIR_ACCEL
    var turn_boost := 1.55 if absf(dx)>0.2 and hero.velocity.x * dx < 0.0 else 1.0
    hero.velocity.x = move_toward(hero.velocity.x, target_speed, (accel * turn_boost if absf(dx)>0.12 else RUN_FRICTION) * delta)
    if jump_buffer_clock > 0 and coyote_clock > 0:
        hero.velocity.y = JUMP_SPEED
        jump_buffer_clock = 0.0
        coyote_clock = 0.0
        _burst(hero.position + Vector2(0,22), Color("#d7f3d6"), 9, 95.0)
    elif jump_buffer_clock > 0 and not grounded_before and air_jumps > 0:
        air_jumps -= 1
        hero.velocity.y = JUMP_SPEED
        jump_buffer_clock = 0
        sound.play_cue("dash", 1.3)
        _burst(hero.position + Vector2(0, 22), Color("#a8efda"), 14, 165)
    if dash_time > 0:
        dash_time = maxf(0, dash_time-delta)
        hero.velocity.x = 565.0 * facing
        hero.velocity.y *= 0.78
    if not current_jump and hero.velocity.y < -185 and arts.rise_time <= 0 and arts.grapple_time <= 0:
        hero.velocity.y = maxf(hero.velocity.y, -185.0)
    hero.velocity.y += (760.0 if hero.velocity.y < 0 else 1370.0) * delta
    var previous_vy := hero.velocity.y
    arts.before_move()
    hero.move_and_slide()
    arts.after_move()
    if not grounded_before and hero.is_on_floor() and previous_vy > 180:
        shake_time = 0.08
        _burst(hero.position + Vector2(0,20), Color("#a8bec0"), 12, 120.0)
    dust_clock -= delta
    if hero.is_on_floor() and absf(hero.velocity.x) > 95 and dust_clock <= 0:
        dust_clock = 0.09
        _burst(hero.position + Vector2(-facing*11,20), Color("#9bb6b6"), 2, 38.0)
    motion_state = _select_motion_state()
    _update_character_animation()
    if touch["attack"]:
        touch["attack"] = false
        _request_attack()
    if touch["dash"]:
        touch["dash"] = false
        _dash()
    if touch["skill"]:
        touch["skill"] = false
        _skill()
    if touch["art"]:
        touch["art"] = false
        arts.cast(loadout.quick_art())
    if touch["burst"]:
        touch["burst"] = false
        _signature()
    if touch["interact"]:
        touch["interact"] = false
        _interact()
    if sky.active:
        sky.tick(delta)
    else:
        trials.tick(delta)
        hero.position.x = clampf(hero.position.x,25,7*ROOM_W-28)
        hero.position.y = maxf(hero.position.y, -225)
    if hero.position.y > 620: _respawn()
    var room := mini(6, int(hero.position.x/ROOM_W))
    if room != last_room:
        last_room = room
        _update_hud()
    for idx in range(enemies.size() - 1, -1, -1):
        var enemy := enemies[idx]
        if not is_instance_valid(enemy):
            enemies.remove_at(idx)
        elif absf(enemy.position.x - hero.position.x) < ROOM_W or enemy.state == "dead":
            enemy.step(delta, self)
    for idx in range(bolts.size() - 1, -1, -1):
        var bolt := bolts[idx]
        if not is_instance_valid(bolt):
            bolts.remove_at(idx)
        else:
            bolt.step(delta, self)
    light_circuit.set_player_position(hero.position)
    if not sky.active: scenery.update_camera(cam.get_screen_center_position().x, activated)
    if activated:
        var gate := get_node_or_null("LightGate")
        if gate != null: gate.queue_free()
    cam.offset = Vector2(sin(visual_clock*95.0)*2.3,cos(visual_clock*82.0)*1.5) if shake_time>0 else Vector2.ZERO
    _refresh_effects()

func _refresh_effects() -> void:
    var shield := is_instance_valid(guardian) and not boss_dead and boss_shield_time <= 0 and last_room >= 5
    var dynamic := not vfx.is_empty() or i_frames > 0 or skill_time > 0 or burst_time > 0 or (blade_flash > 0 and character == "An")
    if dynamic or effects_visible or shield != guardian_shield_visible:
        effects_visible = dynamic
        guardian_shield_visible = shield
        queue_redraw()

func _update_character_animation() -> void:
    var candidate := motion_state
    if motion_state == "attack" and character == "An":
        candidate = "attack_%d" % combo_step
        var pose := 0 if attack_windup > 0.0 else (1 if slash_time > 0.075 else 2)
        actor_anim.animation = candidate
        actor_anim.pause()
        actor_anim.set_frame_and_progress(pose, 0.0)
        anim_label = candidate
    if anim_label != candidate:
        anim_label = candidate
        actor_anim.play(candidate)
    actor_anim.flip_h = (arts.cast_facing if arts.cast_clock > 0 else (burst_facing if burst_time > 0 else (attack_facing if motion_state == "attack" else facing))) < 0
    actor_anim.modulate = Color("#ffb5ab") if hurt_time > 0 else Color.WHITE
    var bob := sin(visual_clock * 18) * 1.4 if motion_state == "run" else 0.0
    actor_anim.position.y = 24 + bob
    actor_anim.rotation = -0.09 * facing if motion_state == "dash" else 0.0

func _select_motion_state() -> String:
    if hurt_time > 0.0: return "hurt"
    if arts.cast_clock > 0: return "dash" if arts.selected in [0, 2] else ("jump" if arts.selected in [1, 5] else ("attack" if character == "Kha" else "dash"))
    if burst_time > 0: return "attack" if character == "Kha" else "dash"
    if skill_time > 0: return "attack" if character == "Kha" else "dash"
    if dash_time > 0.0: return "dash"
    if slash_time > 0.0: return "attack"
    if not hero.is_on_floor():
        return "jump" if hero.velocity.y < 0.0 else "fall"
    if absf(hero.velocity.x) > 25.0: return "run"
    return "idle"

func _burst(origin:Vector2, color:Color, count:int, speed:float) -> void:
    var emitted := mini(count, 10) if mobile_web else count
    for i in range(emitted):
        var angle := (float(i)/maxf(1.0,float(emitted-1)))*PI + PI
        var direction := Vector2(cos(angle),sin(angle))
        vfx.append({"p":origin,"v":direction*speed*randf_range(0.45,1.2),"life":0.34,"duration":0.34,"color":color})
    var budget := MOBILE_PARTICLE_BUDGET if mobile_web else 100
    if vfx.size() > budget:
        vfx = vfx.slice(vfx.size() - budget)
    _refresh_effects()

func _tick_vfx(delta:float) -> void:
    for i in range(vfx.size()-1,-1,-1):
        var particle:Dictionary = vfx[i]
        particle["life"] = float(particle["life"])-delta
        particle["p"] = Vector2(particle["p"]) + Vector2(particle["v"])*delta
        particle["v"] = Vector2(particle["v"])*0.91
        if float(particle["life"])<=0:
            vfx.remove_at(i)
        else:
            vfx[i] = particle

func spawn_bolt(origin: Vector2, motion: Vector2, allied: bool, amount: int) -> void:
    var bolt := LightBolt.new()
    bolt.position = origin
    bolt.velocity = motion
    bolt.friendly = allied
    bolt.damage = amount
    bolt.z_index = 6
    add_child(bolt)
    bolts.append(bolt)

func emit_impact(at: Vector2, color: Color) -> void:
    shake_time = 0.10
    _burst(at, color, 11, 135.0)

func show_damage(origin: Vector2, amount: int) -> void:
    var value := Label.new()
    value.text = str(amount)
    value.position = origin + Vector2(-6, -42)
    value.z_index = 7
    value.add_theme_font_size_override("font_size", 18)
    value.add_theme_color_override("font_color", Color("#ffe399"))
    value.add_theme_constant_override("outline_size", 6)
    add_child(value)
    var drift := value.create_tween().set_parallel()
    drift.tween_property(value, "position:y", value.position.y - 24, 0.42)
    drift.tween_property(value, "modulate:a", 0.0, 0.42).set_delay(0.14)
    drift.chain().tween_callback(value.queue_free)

func enemy_strike(area: Rect2, origin: Vector2) -> bool:
    var space := get_world_2d().direct_space_state
    if not Combat.overlapping(space, area, Combat.HERO_HURT).is_empty() and Combat.ray(space, origin, hero.position, Combat.WORLD).is_empty():
        damage_player(1, origin.x)
        return true
    return false

func damage_player(amount: int, from_x: float) -> void:
    if character == "An" and skill_time > 0 and not parry_used:
        parry_used = true
        sound.play_cue("contact", 1.5)
        shield_cooldown = 2.2
        _burst(hero.position, Color("#ebfaff"), 24, 230)
        _say("PHẢN ĐÒN · Nguyệt Kiếm!", 1.2)
        _skill_damage(155, 3)
        return
    if i_frames > 0 or dash_time > 0 or dialogue.visible: return
    health -= amount
    sound.play_cue("hurt")
    i_frames = 0.92
    hurt_time = 0.21
    hero.velocity.x = 220.0 * (1.0 if hero.position.x >= from_x else -1.0)
    shake_time = 0.17
    _burst(hero.position, Color("#ff9484"), 10, 145)
    if health <= 0:
        health = 0
        death_time = 0.55
        _reset_touch()
        actor_anim.play("death")
    _update_hud()

func _respawn() -> void:
    health = max_health
    death_time = 0
    hurt_time = 0
    hero.position = checkpoint
    hero.velocity = Vector2.ZERO
    i_frames = 1.0
    dash_time = 0.0
    coyote_clock = 0.0
    attack_windup = 0.0
    burst_time = 0
    burst_hits.clear()
    attack_buffer = 0.0
    jump_buffer_clock = 0.0
    for bolt in bolts:
        if is_instance_valid(bolt): bolt.queue_free()
    bolts.clear()
    cam.reset_smoothing()
    if sky.active: sky.respawn()
    elif is_instance_valid(trials):
        trials.respawn()
        arts.reset()
    _say("Hồi sinh tại điểm lưu gần nhất.", 2)

func _request_attack() -> void:
    if not started or dialogue.visible or death_time > 0: return
    attack_buffer = 0.17

func _attack() -> void:
    attack_buffer = 0.0
    attack_facing = facing
    combo_step = (combo_step % 3) + 1 if combo_window > 0 and character == "An" else 1
    combo_window = 0.61
    attack_cooldown = ATTACK_CYCLE[combo_step - 1] if character == "An" else 0.46
    attack_windup = ATTACK_WINDUP[combo_step - 1] if character == "An" else 0.115
    attack_cooldown *= [1.0, 1.22, 1.48][loadout.weapon]
    slash_time = attack_cooldown - 0.03

func _resolve_attack() -> void:
    sound.play_cue("cast" if character == "Kha" else "slash", 1 + (combo_step - 1) * 0.08)
    if character == "Kha":
        spawn_bolt(hero.position, Vector2((740 if loadout.weapon == 1 else 570) * attack_facing, 0), true, 2 if loadout.weapon == 2 else 1)
        return
    blade_flash = 0.16
    var reach := Hit.attack_hitbox(hero.position, attack_facing, false)
    if loadout.weapon == 1:
        reach = reach.grow_individual(24 if attack_facing < 0 else 0, 0, 24 if attack_facing > 0 else 0, 0)
    if combo_step == 2:
        reach = reach.grow_individual(0, 15, 0, 0)
    elif combo_step == 3:
        var extension := 14.0
        reach = reach.grow_individual(extension if attack_facing < 0 else 0, 1, extension if attack_facing > 0 else 0, 5)
    var space := get_world_2d().direct_space_state
    for hit in Combat.overlapping(space, reach, Combat.HOSTILE_HURT):
        var foe: CharacterBody2D = hit.collider.get_parent()
        if Combat.ray(space, hero.position, foe.position, Combat.WORLD).is_empty():
            foe.take_hit((2 if combo_step == 3 else 1) + int(loadout.weapon == 2), self)
            emit_impact(foe.position, Color("#fff1bf"))
            sound.play_cue("contact")

func _skill() -> void:
    if not started or dialogue.visible or shield_cooldown > 0 or death_time > 0: return
    shield_cooldown = 6.0
    skill_time = 0.46
    attack_facing = facing
    anim_label = ""
    parry_used = false
    sound.play_cue("light")
    if character == "Kha":
        health = mini(max_health, health + 1)
        attack_facing = facing
        _skill_damage(145, 2)
        spawn_bolt(hero.position + Vector2(facing * 18, -8), Vector2(470 * facing, 0), true, 2)
        _burst(hero.position, Color("#b1ffdf"), 21, 155)
        _say("Kha · Hồi quang — hồi 1 tim / xung lực", 1.2)
    else:
        _burst(hero.position, Color("#92e9ff"), 16, 140)
        _say("An · Nguyệt Kính — L đúng lúc để phản đòn", 1.2)
    _update_hud()

func _skill_damage(radius: float, amount: int) -> void:
    var space := get_world_2d().direct_space_state
    for foe in enemies:
        if not is_instance_valid(foe) or foe.state == "dead": continue
        if foe.position.distance_to(hero.position) < radius and Combat.ray(space, hero.position, foe.position, Combat.WORLD).is_empty():
            foe.take_hit(amount, self)

func _signature() -> void:
    if not started or dialogue.visible or victory_panel.visible or death_time > 0 or burst_cooldown > 0: return
    burst_cooldown = maxf(3.0, 5.0 - trials.routes.claimed.count(true) * 0.6)
    burst_time = 0.38
    burst_facing = facing
    burst_origin = hero.position
    burst_trace = hero.position
    burst_hits.clear()
    attack_windup = 0
    attack_buffer = 0
    slash_time = 0
    anim_label = ""
    trials.routes.resonate(hero.position)
    if character == "An":
        sound.play_cue("slash", 0.75)
        _signature_hits()
        _burst(hero.position, Color("#bdefff"), 24, 240)
        _say("An · NGUYỆT TRẢM — chém quét ba sát thương", 1.4)
    else:
        # Sweep the full capsule along the path. Blink never crosses a solid wall.
        var motion := Vector2(facing * 155, 0)
        var collision := hero.move_and_collide(motion)
        burst_trace = hero.position
        if collision: emit_impact(collision.get_position(), Color("#c0c9ff"))
        i_frames = maxf(i_frames, 0.22)
        sound.play_cue("dash", 1.1)
        for angle in [-0.16, 0.0, 0.16]:
            spawn_bolt(hero.position, Vector2(500 * facing, 0).rotated(angle), true, 1)
        _burst(burst_origin, Color("#d4bbff"), 16, 190)
        _burst(hero.position, Color("#c3f3f0"), 16, 190)
        _say("Kha · TINH BỘ — dịch chuyển / ba tia sáng", 1.4)
    _update_hud()
    _refresh_effects()
    print("ECLIPSE SIGNATURE: " + character)

func _signature_hits() -> void:
    var area := Rect2(hero.position + Vector2(-22 if burst_facing > 0 else -150, -72), Vector2(172, 140))
    var space := get_world_2d().direct_space_state
    for hit in Combat.overlapping(space, area, Combat.HOSTILE_HURT):
        var foe: CharacterBody2D = hit.collider.get_parent()
        if not is_instance_valid(foe) or foe.state == "dead" or foe.get_instance_id() in burst_hits: continue
        if not Combat.ray(space, hero.position, foe.position, Combat.WORLD).is_empty(): continue
        burst_hits.append(foe.get_instance_id())
        foe.take_hit(3, self)
        sound.play_cue("contact", 0.85)

func guardian_defeated() -> void:
    boss_dead = true
    moon_dash = true
    _persist()
    sound.play_cue("victory")
    _say("Thủ Hộ Tháp Trăng đã gục ngã. Bạn đã mở kỹ năng Nguyệt Lướt!", 12)
    var ending := create_tween()
    ending.tween_interval(0.68)
    ending.tween_callback(_show_victory)

func _show_victory() -> void:
    victory_panel.show()
    arts.layer.hide()
    joystick.accept_touch = false
    _reset_touch()

func _dismiss_victory() -> void:
    victory_panel.hide()
    arts.layer.show()
    joystick.accept_touch = true
    _reset_touch()

func guardian_enraged() -> void:
    boss_shield_time = 0.0
    boss_pedestal_cooldown = 1.45
    emit_impact(guardian.position, Color("#d796ff"))
    sound.play_cue("phase")
    _say("Pha hai · Khi trụ sáng nạp lại, phá khiên. Né ba luồng đạn!", 4.2)


func _dash() -> void:
    if not started or dash_cooldown > 0 or dialogue.visible or death_time > 0: return
    dash_cooldown=1.4 if moon_dash else 2.8
    dash_time=0.18 if moon_dash else 0.13
    if attack_windup > 0:
        attack_windup = 0
        slash_time = 0
    sound.play_cue("dash")
    _burst(hero.position+Vector2(-facing*15,5),Color("#94e9e2"),14,155)
    _say("Moon Dash!" if moon_dash else "Lướt ngắn",0.45)

func _show_dialogue(open: bool) -> void:
    dialogue.visible = open
    joystick.accept_touch = not open
    _reset_touch()
    jump_buffer_clock = 0
    attack_buffer = 0

func _interact() -> void:
    if not started or death_time > 0: return
    if dialogue.visible:
        _show_dialogue(false)
        return
    if story_mode and not sky.active and trials.active:
        var local_x := hero.position.x-current_trial*1920
        if current_trial > 0 and absf(local_x-95) < 58 and hero.position.y > 374:
            cross_story_gate(-1)
            return
        if absf(local_x-1810) < 58 and hero.position.y > 374:
            if trials.wins[current_trial]: cross_story_gate(1)
            else: _say("Cổng còn khóa · đánh bại người canh giữ",3)
            return
    if sky.active:
        sky.interact()
        return
    if is_instance_valid(trials) and trials.active:
        if not trials.interact(): _say("E gần pha lê / trụ lưu · nhảy để tìm bí mật trên cao", 2)
        return
    var room := int(hero.position.x / ROOM_W)
    var local_x := fposmod(hero.position.x, ROOM_W)
    if room == 0 and hero.position.distance_to(Vector2(290, 432)) < 92:
        met_npc = true
        _persist()
        dialogue_label.text = "Thợ Lưu Giữ: Xoay hai gương ở Tháp Pha Lê để dẫn tia sáng đến Cổng Đêm. Trụ sáng trong phòng Thủ Hộ sẽ hạ khiên trong giây lát. Nhấn E để đóng."
        _show_dialogue(true)
    elif room == 2 and not found_chest and hero.position.distance_to(Vector2(2 * ROOM_W + 570, 428)) < 70:
        found_chest = true
        scenery.plaza_chest.hide()
        max_health += 1
        health = max_health
        emit_impact(hero.position, Color("#ffd478"))
        _persist()
        _say("Đã tìm thấy Nguyệt Thạch. Sinh lực tối đa tăng 1.", 3.0)
    elif room == 3 and light_circuit.rotate_near(hero.position):
        sound.play_cue("light")
        if not activated: _say("Xoay gương để tia sáng chạm pha lê.", 2.2)
    elif room == 5 and hero.position.distance_to(Vector2(room * ROOM_W + 260, 418)) < 93:
        checkpoint = hero.position
        health = max_health
        _persist()
        _say("Đã lưu tại Đài Quan Sát!", 2)
    elif room == 6 and absf(local_x - 432) < 83 and absf(hero.position.y - 418.0) < 82 and not boss_dead:
        if boss_shield_time <= 0 and boss_pedestal_cooldown <= 0:
            boss_shield_time = 6.5 if guardian.hp > 6 else 5.4
            boss_pedestal_cooldown = boss_shield_time + 1.4
            sound.play_cue("light")
            _say("Khiên Thủ Hộ đã tan. Tấn công ngay!", 3)
        elif boss_shield_time <= 0:
            _say("Trụ sáng đang nạp lại.", 1.25)
    else:
        _say("Đến gần người giữ đèn, gương hoặc trụ sáng rồi tương tác.", 2)

func _light_completed() -> void:
    activated = true
    sound.play_cue("victory")
    _persist()
    _say("Tia sáng đã đánh thức Cổng Đêm.", 4)


func _say(value:String,secs:float) -> void:
    notice=value
    notice_time=secs
    _update_hud()

func _update_hud() -> void:
    if hud==null:return
    var r:=clampi(int(hero.position.x/ROOM_W) if hero else 0,0,6)
    hud.text = character
    hearts.show_health(health, max_health)
    chapter.text = ROOMS[r]
    light_status.text = "Ba hồi · Tiếng chuông đã mất"
    help.text = notice if notice_time > 0 else ""
    if is_instance_valid(trials): trials.update_hud()
    if is_instance_valid(sky) and sky.active: sky.update_hud()

func cross_story_gate(direction: int) -> void:
    var destination := current_trial + direction
    if destination < 0 or destination > 6: return
    demo_room_select.select(destination)
    _start(character)
    if sky.active:
        var at: Vector2 = sky.story_exit() if direction < 0 else Vector2(140,432)
        hero.position = sky.point(at + Vector2(0,-24 if direction < 0 else 0))
    else:
        hero.position = Vector2(destination*1920 + (1800 if direction < 0 else 110),432)
    checkpoint = hero.position
    cam.reset_smoothing()
    cam.force_update_scroll()
    _show_dialogue(false)
    sound.play_cue("light")
    _say("Cổng đã mở · E để đi tiếp hoặc quay về",3)

func mark_chapter_complete(chapter_index: int) -> void:
    journey_next = maxi(journey_next, mini(chapter_index + 1, 6))
    _persist()

func _persist() -> void:
    if not save_enabled or not is_instance_valid(trials): return
    var f := FileAccess.open(SAVE_FILE, FileAccess.WRITE)
    if f:
        f.store_string(JSON.stringify({"version":2, "journey_next":journey_next, "story_room":story_room, "story_hero":story_hero, "weapon":loadout.weapon, "favorite":loadout.favorite, "met_npc":met_npc, "moon_dash":moon_dash, "secrets":trials.secrets, "wins":trials.wins, "saved":trials.saved, "collected":trials.collected, "air_step":trials.routes.air_step_unlocked, "route_claimed":trials.routes.claimed, "route_opened":trials.routes.opened, "sky":sky.progress if is_instance_valid(sky) else []}))

func _restore() -> void:
    if not save_enabled or not FileAccess.file_exists(SAVE_FILE): return
    var f := FileAccess.open(SAVE_FILE, FileAccess.READ)
    if not f: return
    var data = JSON.parse_string(f.get_as_text())
    if not data is Dictionary or data.get("version") != 2: return
    story_room = clampi(int(data.get("story_room", -1)), -1, 6)
    story_hero = "Kha" if data.get("story_hero") == "Kha" else "An"
    journey_next = clampi(int(data.get("journey_next", 0)), 0, 6)
    loadout.weapon = clampi(int(data.get("weapon", 0)), 0, 2)
    loadout.favorite = clampi(int(data.get("favorite", -1)), -1, 5)
    met_npc = data.get("met_npc", false) == true
    moon_dash = data.get("moon_dash", false) == true
    for key in ["secrets", "wins", "saved"]:
        var values = data.get(key, [])
        if values is Array and values.size() == 3:
            var validated := [false, false, false]
            for i in range(3): validated[i] = values[i] == true
            trials.set(key, validated)
    var fragments = data.get("collected", [])
    if fragments is Array and fragments.size() == 3:
        for i in range(3):
            if fragments[i] is Array and fragments[i].size() == 2:
                trials.collected[i] = [fragments[i][0] == true, fragments[i][1] == true]
    trials.routes.air_step_unlocked = data.get("air_step", false) == true
    for key in ["route_claimed", "route_opened"]:
        var values = data.get(key, [])
        if values is Array and values.size() == 3:
            var clean := [false, false, false]
            for i in range(3): clean[i] = values[i] == true
            trials.routes.set("claimed" if key == "route_claimed" else "opened", clean)
    if is_instance_valid(sky): sky.restore(data.get("sky", []))
    max_health = 5 + trials.secrets.count(true)
    health = max_health

func _draw() -> void:
    if not is_instance_valid(hero): return
    if guardian_shield_visible and is_instance_valid(guardian):
        draw_arc(guardian.position, 81, 0, TAU, 64, Color("#83cfe27e"), 3, true)
    for particle in vfx:
        var opacity := clampf(float(particle["life"])/float(particle["duration"]),0,1)
        var tint:Color = particle["color"]
        tint.a = opacity*0.84
        draw_circle(particle["p"], maxf(1.0,4.5*opacity),tint)
    if hero:
        var p:=hero.position
        if burst_time > 0:
            var tint := Color("#9fe4ff") if character == "An" else Color("#d5b4ff")
            var opacity := burst_time / 0.38
            tint.a = opacity * 0.75
            if character == "An":
                var angle := 0.0 if burst_facing > 0 else PI
                var sweep := angle + (1.0 - opacity) * 1.6 * burst_facing - 0.8
                draw_arc(p, 140, sweep - 1.2, sweep + 1.2, 48, Color(tint, opacity * 0.17), 18, true)
                draw_arc(p, 133, sweep - 1.2, sweep + 1.2, 48, tint, 5, true)
                draw_arc(p, 126, sweep - 1.2, sweep + 1.2, 48, Color("#ecffff"), 2, true)
            else:
                draw_line(burst_origin, burst_trace, Color(tint, opacity * 0.3), 20, true)
                draw_line(burst_origin, burst_trace, tint, 3, true)
                draw_arc(p, 36 + (1 - opacity) * 35, 0, TAU, 32, tint, 2, true)
        if skill_time > 0:
            var radius := 38.0 + (1.0 - skill_time / 0.46) * (95 if character == "Kha" else 20)
            draw_arc(p, radius, 0, TAU, 48, Color("#a6edffa0"), 4, true)
            draw_arc(p, radius - 7, 0, TAU, 48, Color("#edfff4"), 1, true)
        if i_frames>0:draw_arc(p+Vector2(0,-6),33,0,TAU,32,Color("#ffdf8b"),3)
        if blade_flash > 0 and character == "An" and slash_time > 0:
            _draw_blade(p)

func _draw_blade(at: Vector2) -> void:
    var life := blade_flash / 0.16
    var facing_sign := float(attack_facing)
    var reach := 71.0 + (20 if loadout.weapon == 1 else 0) + (10 if combo_step == 3 else 0)
    var tint: Color = [Color("#d1a8ff"),Color("#8ff5ed"),Color("#ffc070")][loadout.weapon]
    var pitch := (-0.37 if combo_step == 2 else 0.24) + (1-life)*0.65
    var outer := PackedVector2Array()
    var inner := PackedVector2Array()
    for index in range(25):
        var progress := float(index)/24
        var angle := lerpf(-1.22,1.17,progress) + pitch
        var direction := Vector2(cos(angle)*facing_sign,sin(angle)*0.77)
        var width := pow(sin(progress*PI),1.35)*(24 if combo_step == 3 else 16)
        outer.append(at+Vector2(facing_sign*12,-8)+direction*reach)
        inner.append(at+Vector2(facing_sign*12,-8)+direction*(reach-width))
    var fill := outer.duplicate()
    inner.reverse()
    fill.append_array(inner.slice(1,inner.size()-1))
    draw_polyline(outer,Color(tint,life*0.22),10,true)
    draw_colored_polygon(fill,Color(tint,life*0.8))
    draw_polyline(outer,Color("#fff7e6",life),2.4,true)
    for index in range(3):
        var spark := outer[7+index*5]+Vector2(facing_sign*(1-life)*27,0)
        draw_line(spark,spark+Vector2(facing_sign*9,-5),Color(tint,life),2,true)
