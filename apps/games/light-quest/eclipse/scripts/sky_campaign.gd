extends Node2D
## Three vertical chapters, real platforms, a sealed side chamber, and summit encounters.
const Art := preload("res://scripts/eclipse_art.gd")
const Relic := preload("res://scripts/trial_relic.gd")
const Boss := preload("res://scripts/trial_boss.gd")
const TITLES := ["Tháp Gió", "Vườn Treo", "Đỉnh Nguyệt", "Đường Chân Trời"]
const BOSS_NAMES := ["Người Gác Thiên Chung", "Lang Vương Tán Mây", "Thủ Hộ Nhật Thực", "Vệ Binh Hải Đăng"]
const VAULT := preload("res://assets/eclipse/tide-bell-vault.webp")
const BELL_AT := Vector2(1080, 762)
const CLAPPER_AT := Vector2(765, 786)
const WIDTH := 1440.0
var game: Node2D
var active := false
var stage := 0
var origin := 7200.0
var mirrored := false
var run_id := 0
var root: Node2D
var progress: Array = []
var anchors: Array[Vector2] = []
var markers: Array[Node2D] = []
var ghost_bodies: Array[PhysicsBody2D] = []
var ghost_art: Array[Node2D] = []
var movers: Array[Dictionary] = []
var crystal: StaticBody2D
var weak_floor: PhysicsBody2D
var bell_gates: Array[StaticBody2D] = []
var boss: CharacterBody2D
var boss_dead := false
var elapsed := 0.0
var best_height := 0.0
var back_layer: CanvasLayer
var backdrop: TextureRect
var transition_back: TextureRect
var backdrop_fade: Tween
var hud_layer: CanvasLayer
var objective: Label
var altitude: Label
var boss_label: Label
var boss_bar: ProgressBar
var menu_button: Button
var weak_art: Node2D
var intro := true
var timeline: Node2D
var coast_doors: Array[StaticBody2D] = []

func _ready() -> void:
    game = get_parent()
    timeline = preload("res://scripts/time_lighthouse.gd").new()
    add_child(timeline)
    for i in TITLES.size(): progress.append(_blank())
    back_layer = CanvasLayer.new()
    back_layer.layer = -1
    add_child(back_layer)
    backdrop = TextureRect.new()
    backdrop.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    backdrop.stretch_mode = TextureRect.STRETCH_SCALE
    backdrop.mouse_filter = Control.MOUSE_FILTER_IGNORE
    back_layer.add_child(backdrop)
    transition_back = backdrop.duplicate() as TextureRect
    back_layer.add_child(transition_back)
    transition_back.hide()
    back_layer.hide()
    hud_layer = CanvasLayer.new()
    hud_layer.layer = 2
    add_child(hud_layer)
    objective = game._hud_label(hud_layer, Vector2(265, 18), Vector2(430, 60), 14)
    objective.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    objective.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    altitude = game._hud_label(hud_layer, Vector2(550, 70), Vector2(243, 23), 14)
    altitude.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
    boss_label = game._hud_label(hud_layer, Vector2(300, 86), Vector2(365, 46), 18)
    boss_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    boss_label.add_theme_color_override("font_color", Color("#ffe1ab"))
    boss_bar = ProgressBar.new()
    boss_bar.position = Vector2(300,136)
    boss_bar.show_percentage = false
    boss_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
    var bg := StyleBoxFlat.new()
    bg.bg_color = Color("#14203bef")
    bg.set_corner_radius_all(3)
    var fill := StyleBoxFlat.new()
    fill.bg_color = Color("#e9bd8c")
    fill.set_corner_radius_all(3)
    boss_bar.add_theme_stylebox_override("background",bg)
    boss_bar.add_theme_stylebox_override("fill",fill)
    hud_layer.add_child(boss_bar)
    boss_bar.size = Vector2(365,7)
    menu_button = Button.new()
    menu_button.position = Vector2(824, 86)
    menu_button.size = Vector2(112, 32)
    menu_button.text = "MÀN CHƠI"
    menu_button.focus_mode = Control.FOCUS_NONE
    menu_button.pressed.connect(game.trials.return_menu)
    hud_layer.add_child(menu_button)
    hud_layer.hide()

func _blank() -> Dictionary:
    return {"checkpoint":0,"crystal":false,"sight":false,"bell":false,"relic":false,"secret":false,"won":false,"guardian_down":false,"clapper":false,"tide_awake":false}

func point(local: Vector2) -> Vector2:
    return Vector2(origin + (WIDTH - local.x if mirrored else local.x), local.y)

func box(local: Rect2) -> Rect2:
    return Rect2(Vector2(origin + (WIDTH - local.position.x - local.size.x if mirrored else local.position.x), local.position.y), local.size)

func begin(index: int) -> void:
    stop()
    active = true
    run_id += 1
    stage = index
    origin = 7200.0 + stage * 1800.0
    mirrored = stage == 1
    if not game.time_mode and progress[stage].won and not game.story_mode:
        var secret: bool = progress[stage].secret
        progress[stage] = _blank()
        progress[stage].secret = secret
    for enemy in game.enemies:
        if is_instance_valid(enemy): enemy.queue_free()
    game.enemies.clear()
    for bolt in game.bolts:
        if is_instance_valid(bolt): bolt.queue_free()
    game.bolts.clear()
    if is_instance_valid(root): root.queue_free()
    root = Node2D.new()
    add_child(root)
    anchors.clear()
    markers.clear()
    ghost_bodies.clear()
    ghost_art.clear()
    bell_gates.clear()
    coast_doors.clear()
    movers.clear()
    elapsed = 0
    best_height = 0
    boss_dead = false
    game.guardian = null
    game.trials.routes.air_step_unlocked = true
    game.health = game.max_health
    game.death_time = 0
    game.hurt_time = 0
    game.skill_time = 0
    game.burst_time = 0
    game.burst_cooldown = 0
    game.shield_cooldown = 0
    game.dash_cooldown = 0
    game.attack_buffer = 0
    game.slash_time = 0
    game.combo_window = 0
    game.vfx.clear()
    game.dash_time = 0
    game.attack_windup = 0
    game.attack_cooldown = 0
    game.air_jumps = 1
    game.i_frames = 1.0
    game.hero.velocity = Vector2.ZERO
    game.arts.reset()
    game.cam.limit_left = int(origin)
    game.cam.limit_right = int(origin + _width())
    game.cam.limit_top = -2000
    game.cam.limit_bottom = 830 if game.time_mode else (885 if stage == 3 else 600)
    if game.time_mode: timeline.build()
    elif stage == 3: _coast()
    else: _terrain()
    if game.story_mode:
        _marker("story_back",Vector2(102,456),"E · Về miền trước",2)
        _detail(7,Vector2(102,456),Vector2(85,124))
        if progress[stage].won or progress[stage].guardian_down:
            boss_dead = true
            if is_instance_valid(boss): boss.queue_free()
            if stage == 3: _remove_body(coast_doors[2])
    var stations := [Vector2(140,432), Vector2(870,-144), Vector2(650,-1244)]
    if stage == 3: stations = [Vector2(140,432),Vector2(1280,226),Vector2(2460,106)]
    var cp: int = clampi(progress[stage].checkpoint, 0, 2)
    game.checkpoint = point(Vector2(150,432) if game.time_mode else stations[cp])
    if game.story_mode and stage == 3 and game.journey_complete:
        game.checkpoint = point(story_exit() - Vector2(0,24))
    game.hero.position = game.checkpoint
    game._snap_view()
    _background()
    game.scenery.background.hide()
    game.scenery.previous_back.hide()
    hud_layer.show()
    back_layer.show()
    game.dialogue_label.text = TITLES[stage] + " · Hành trình lên cao\n1 phá vách · 2 lao lên · 3 kéo móc · 4 tìm ẩn · 5 rung chuông · 6 phá sàn.\nCác nút 1–6 bên dưới dùng được ngay; nút ẤN dùng kỹ năng đang chọn.\nE để đóng · Lưu tại các trụ xanh trên đường leo."
    if stage == 3:
        game.dialogue_label.text = "Đường Chân Trời · Dọc bờ vực
Qua hai trạm, tìm lõi đèn dưới vòm đá, rung chuông và vượt đài canh.
E để bắt đầu · I hoặc Trang bị để đổi cách đánh."
    if game.time_mode: game.dialogue_label.text = "NGỌN ĐÈN CHƯA TẮT\nTìm Tín trong hiện tại hoặc dùng E cạnh cỗ máy để đổi thời đại.\nV / nút vũ khí dùng chiêu riêng. E để bắt đầu."
    game._show_dialogue(not game.story_mode)
    menu_button.text = "MENU" if game.story_mode else "MÀN CHƠI"
    game._say("Bờ Đá · ↓ hoặc NGỒI để luồn khe · M mở bản đồ" if game.time_mode else "Leo tháp · Bước Gió đã mở — có thể nhảy hai lần", 3)
    update_hud()
    queue_redraw()
    print("ECLIPSE SKY: %d %s" % [stage, game.character])

func story_exit() -> Vector2:
    return Vector2(4310,105) if stage == 3 else Vector2(1240,-1730 if stage == 2 else -1430)

func _width() -> float:
    if game.time_mode: return timeline.MAP_WIDTH
    return 4420.0 if stage == 3 else WIDTH

func _coast() -> void:
    # Doorways divide the coast into three named rooms and double as checkpoints.
    for door_index in range(2):
        var at := Vector2(1280,250) if door_index == 0 else Vector2(2460,130)
        _detail(7,at,Vector2(100,148))
        coast_doors.append(_wall(Rect2(at.x+30,-2000,16,at.y+2000)))
        if progress[stage].checkpoint > door_index:
            _remove_body(coast_doors[door_index])
    for rect in [Rect2(0,456,570,80),Rect2(650,365,220,24),
            Rect2(950,290,250,24),Rect2(1220,250,300,30),
            Rect2(1600,345,140,26),Rect2(1850,345,220,26),Rect2(2150,255,240,24),
            Rect2(2410,130,330,28),Rect2(3060,205,580,36),Rect2(3690,162,310,26),Rect2(4060,105,360,32)]:
        _platform(rect)
    _tide_vault()
    _platform(Rect2(2810,185,190,24),true,true)
    if game.story_mode:
        _platform(Rect2(3994,143,72,18),true,false,true)
    _platform(Rect2(1690,470,220,26))
    _platform(Rect2(2030,425,105,24))
    for at in [Vector2(740,264),Vector2(1030,187),Vector2(2250,151),Vector2(2530,22),Vector2(3190,100)]:
        _anchor(at)
    _marker("checkpoint1",Vector2(1280,250),"E · Mở cửa Hầm Vòm",0)
    _marker("checkpoint2",Vector2(2460,130),"E · Mở cửa Đài Canh",0)
    _marker("relic",Vector2(1780,470),"E · Lõi đèn dưới vòm",0)
    _marker("secret",Vector2(2050,425),"E · Kho báu chân vòm",3)
    _marker("bell",Vector2(2590,130),"5 · Rung chuông hải đăng",4)
    _marker("outer_door",Vector2(3510,205),"E · Cửa Sân Hải Đăng",0)
    coast_doors.append(_wall(Rect2(3540,-2000,16,2205)))
    _marker("goal",Vector2(4310,105),"E · Thắp sáng hải đăng",0)
    _detail(7,Vector2(4310,105),Vector2(120,175))
    _detail(5,Vector2(3850,162),Vector2(58,96))
    for at in [Vector2(1280,250),Vector2(2460,130)]:
        _detail(5,at,Vector2(46,72))
    _detail(9,Vector2(1780,470),Vector2(48,29))
    _detail(9,Vector2(2050,425),Vector2(48,29))
    _detail(7,Vector2(3510,205),Vector2(110,156))
    _enemy("bat",Vector2(1090,175))
    _enemy("mage",Vector2(1920,290))
    _enemy("bat",Vector2(2690,80))
    boss = Boss.new()
    boss.kind = "guardian"
    boss.trial = 2
    boss.title = BOSS_NAMES[stage]
    boss.max_hp = 34
    boss.position = point(Vector2(3370,205-boss.SIZES.guardian.y*0.5-2))
    boss.arena = Vector2(origin+3075,origin+3610)
    root.add_child(boss)
    game.enemies.append(boss)
    _reveal_bridge()

func in_tide_vault(at: Vector2) -> bool:
    return active and stage == 3 and not game.time_mode and at.x < origin + 1260 and at.y > 495

func _tide_vault() -> void:
    _platform(Rect2(0, 786, 1260, 90), false)
    _wall(Rect2(1242, 250, 18, 595))
    for step in [Rect2(310, 680, 172, 22), Rect2(114, 598, 155, 22), Rect2(282, 513, 142, 20)]:
        _platform(step)
    _marker("clapper", CLAPPER_AT, "E · Lưỡi chuông", 2)
    _marker("tide_bell", BELL_AT + Vector2(0, 24), "5 · Chuông Triều", 4)
    var brass := Sprite2D.new()
    var motif := AtlasTexture.new()
    motif.atlas = preload("res://assets/eclipse/six-arts-emblems.webp")
    motif.region = Rect2(320, 320, 320, 320)
    brass.texture = motif
    brass.position = point(BELL_AT - Vector2(0, 61))
    brass.scale = Vector2.ONE * 0.39
    root.add_child(brass)
    if progress[stage].tide_awake: _tide_stairs()

func _tide_stairs() -> void:
    for step in [Rect2(995, 681, 194, 24), Rect2(837, 577, 140, 22),
            Rect2(1002, 475, 150, 22), Rect2(874, 383, 130, 20)]:
        _platform(step)
    _anchor(Vector2(1100, 407))

func _terrain() -> void:
    _platform(Rect2(0,456,WIDTH,80), false)
    _platform(Rect2(90,350,205,22))
    _platform(Rect2(500,350,190,22))
    _platform(Rect2(475,100,230,22))
    _platform(Rect2(760,-120,250,22))
    _platform(Rect2(1040,-260,200,22), true, true)
    _platform(Rect2(1100,-450,220,22), true, true)
    _platform(Rect2(820,-620,250,22))
    _platform(Rect2(820,-800,190,22))
    weak_floor = _platform(Rect2(480,-840,240,22), false)
    weak_art = weak_floor.get_meta("art")
    _platform(Rect2(480,-700,240,24))
    _wall(Rect2(465,-840,15,160))
    _wall(Rect2(720,-840,15,160))
    _platform(Rect2(260,-1030,250,22))
    _platform(Rect2(550,-1220,230,22))
    _platform(Rect2(800,-1430,600,34))
    if stage == 2:
        _platform(Rect2(980,-1730,320,24))
        _anchor(Vector2(1100,-1826))
    _platform(Rect2(60,-1150,150,22), true, true)
    crystal = _wall(Rect2(406,-224,28,680))
    bell_gates.append(_wall(Rect2(742,-950,22,315)))
    bell_gates.append(_wall(Rect2(782,-1660,18,300)))
    for at in [Vector2(830,-216), Vector2(560,-936), Vector2(350,-1126), Vector2(650,-1316), Vector2(930,-1526)]: _anchor(at)
    _marker("crystal",Vector2(390,432),"1 · Phá Tinh",0)
    _marker("rise",Vector2(560,350),"2 · Thiên Thăng",1)
    _marker("hook",Vector2(560,100),"3 · Tơ Nguyệt",2)
    _marker("sight",Vector2(900,-120),"4 · Nguyệt Nhãn",3)
    _marker("bell",Vector2(895,-620),"5 · Chuông Vọng",4)
    _marker("transfer",Vector2(900,-800),"2 lên cao · 3 kéo móc",2)
    _marker("dive",Vector2(580,-840),"6 · Thiên Giáng",5)
    _marker("relic",Vector2(580,-700),"E · Di vật trong phòng kín",4)
    _marker("checkpoint1",Vector2(875,-120),"E · Trạm tầng mây",4)
    _marker("checkpoint2",Vector2(650,-1220),"E · Trạm trước đỉnh",4)
    _marker("secret",Vector2(125,-1150),"E · Kho báu phía sau tháp",3)
    var end_y := -1730.0 if stage == 2 else -1430.0
    _marker("goal",Vector2(1240,end_y),"E · Cổng tầng trời",2)
    _detail(5,Vector2(875,-120),Vector2(46,72))
    _detail(5,Vector2(650,-1220),Vector2(46,72))
    _detail(9,Vector2(580,-700),Vector2(48,29))
    _detail(9,Vector2(125,-1150),Vector2(48,29))
    _detail(7,Vector2(1240,end_y),Vector2(110,156))
    _enemy("bat",Vector2(1180,-340))
    _enemy("mage",Vector2(430,-1100))
    boss = Boss.new()
    boss.kind = "wolf" if stage == 1 else "guardian"
    boss.trial = stage
    boss.title = BOSS_NAMES[stage]
    boss.max_hp = 22 + stage * 4
    var height: float = boss.SIZES[boss.kind].y
    boss.position = point(Vector2(1200,-1430 - height * (0.65 if stage == 1 else 0.5) - 2))
    boss.arena = Vector2(origin + (40 if mirrored else 820), origin + (640 if mirrored else 1370))
    root.add_child(boss)
    game.enemies.append(boss)
    if progress[stage].crystal: _remove_body(crystal)
    if progress[stage].bell:
        for gate in bell_gates: _remove_body(gate)
    if progress[stage].relic: _remove_body(weak_floor)
    _reveal_bridge()

func _platform(rect: Rect2, one_way := true, ghost := false, shuttle := false) -> PhysicsBody2D:
    var r := box(rect)
    var body: PhysicsBody2D
    if shuttle or (stage == 1 and ghost and rect.position.y > -500):
        var carrier := AnimatableBody2D.new()
        carrier.sync_to_physics = false
        body = carrier
    else: body = StaticBody2D.new()
    body.position = r.get_center()
    body.collision_layer = game.Combat.WORLD
    var col: CollisionShape2D = game.Combat.rectangle(r.size)
    col.one_way_collision = one_way
    body.add_child(col)
    root.add_child(body)
    var art: Node2D = game.scenery.surface(r, root, r.size.y >= 60)
    art.collider = body
    body.set_meta("art",art)
    if body is AnimatableBody2D: movers.append({"body":body,"art":art,"p":body.position,"a":art.position,"shuttle":shuttle})
    if ghost:
        ghost_bodies.append(body)
        ghost_art.append(art)
    return body

func _wall(rect: Rect2) -> StaticBody2D:
    var r := box(rect)
    var body := StaticBody2D.new()
    body.position = r.get_center()
    body.collision_layer = game.Combat.WORLD
    body.add_child(game.Combat.rectangle(r.size))
    root.add_child(body)
    return body

func _detail(index: int, local: Vector2, size: Vector2) -> void:
    var art: Node2D = game.scenery._prop(index,point(local),size)
    game.scenery.remove_child(art)
    root.add_child(art)

func _anchor(local: Vector2) -> void:
    anchors.append(point(local))

func _marker(kind: String, local: Vector2, caption: String, skill: int) -> void:
    var marker := Relic.new()
    marker.kind = kind
    marker.caption = caption
    marker.position = point(local)
    marker.tint = game.arts.COLORS[skill]
    root.add_child(marker)
    markers.append(marker)

func _enemy(kind: String, local: Vector2) -> void:
    var enemy: CharacterBody2D = game.EnemyScene.instantiate()
    enemy.kind = kind
    enemy.position = point(local)
    root.add_child(enemy)
    game.enemies.append(enemy)

func _background() -> void:
    var path := "res://assets/eclipse/ascent-atlas.webp"
    if game.time_mode:
        backdrop.texture = [preload("res://assets/eclipse/moon-tower.webp"),preload("res://assets/eclipse/crystal-tower.webp"),preload("res://assets/eclipse/guardian-hall.webp")][timeline.era]
    elif stage == 3:
        backdrop.texture = preload("res://assets/eclipse/crystal-tower.webp")
    elif ResourceLoader.exists(path):
        var sheet: Texture2D = load(path)
        var atlas := AtlasTexture.new()
        atlas.atlas = sheet
        atlas.region = Rect2(sheet.get_width() * stage / 3.0, 0, sheet.get_width() / 3.0, sheet.get_height())
        backdrop.texture = atlas
    else:
        backdrop.texture = [Art.SCENERY, preload("res://assets/eclipse/crystal-tower.webp"), preload("res://assets/eclipse/guardian-hall.webp")][stage]
    var height := maxf(740, 1088.0 * backdrop.texture.get_height() / backdrop.texture.get_width())
    backdrop.size = Vector2(1088,height)
    backdrop.modulate = timeline.SHADES[timeline.era] if game.time_mode else Color.WHITE
    if backdrop_fade and backdrop_fade.is_valid(): backdrop_fade.kill()
    transition_back.hide()
    _scroll_background(true)

func _scroll_background(immediate := false) -> void:
    var camera: Vector2 = game.cam.get_screen_center_position()
    if game.time_mode:
        var coast: bool = not timeline.indoors and not timeline.underground
        var art: Texture2D = timeline.FORGE if timeline.indoors else (timeline.SHORE if coast else timeline.CISTERN)
        _backdrop_texture(art, immediate)
        if coast:
            backdrop.position = Vector2(-clampf(190+(camera.x-origin-480)*0.09,0,390),0)
        else:
            backdrop.position = Vector2(-195, -maxf(0,backdrop.size.y-550)*0.65)
        backdrop.modulate = timeline.SHADES[timeline.era] if coast else Color("#cce1f3")
        return
    if stage == 3:
        var local_x := camera.x - origin
        var art: Texture2D = timeline.SHORE
        if in_tide_vault(game.hero.position): art = VAULT
        elif local_x > 1326 and local_x < 2470: art = timeline.CISTERN
        _backdrop_texture(art, immediate)
        backdrop.position = Vector2(-clampf(75 + local_x * 0.061, 0, 390), 0)
        return
    var altitude_ratio := clampf((456.0 - camera.y) / 2300.0, 0, 1)
    backdrop.position = Vector2(-64 - sin(camera.x * 0.001) * 25, -(backdrop.size.y - 540) * (1 - altitude_ratio))

func _backdrop_texture(art: Texture2D, immediate: bool) -> void:
    if backdrop.texture == art: return
    if backdrop_fade and backdrop_fade.is_valid(): backdrop_fade.kill()
    if not immediate:
        transition_back.texture = backdrop.texture
        transition_back.size = backdrop.size
        transition_back.position = backdrop.position
        transition_back.modulate = backdrop.modulate
        transition_back.show()
        backdrop_fade = create_tween()
        backdrop_fade.tween_property(transition_back, "modulate:a", 0.0, 0.32)
        backdrop_fade.tween_callback(transition_back.hide)
    backdrop.texture = art
    backdrop.size = Vector2(1350, maxf(540, 1350.0 * art.get_height() / art.get_width()))

func tick(delta: float) -> void:
    if not active: return
    elapsed += delta
    if game.time_mode and timeline.indoors:
        game.hero.position.x = clampf(game.hero.position.x,origin+2828,origin+3732)
    else:
        game.hero.position.x = clampf(game.hero.position.x,origin + 28,origin + _width() - 28)
    best_height = maxf(best_height,456 - game.hero.position.y)
    for mover in movers:
        var offset := Vector2(0,sin(elapsed*1.8)*54) if mover.shuttle else Vector2(sin(elapsed * 1.1) * 28, 0)
        mover.body.position = mover.p + offset
        mover.art.position = mover.a + offset
    if game.story_mode and stage == 3 and fmod(elapsed,2.4) > 1.3:
        if box(Rect2(3810,142,90,23)).has_point(game.hero.position+Vector2(0,19)):
            game.damage_player(1,point(Vector2(3855,162)).x)
    if game.time_mode:
        timeline.update(delta)
        if not timeline.indoors and is_instance_valid(boss) and not boss_dead and game.hero.position.x > origin+1285: boss.awake = true
        _scroll_background()
        update_hud()
        queue_redraw()
        return
    for marker in markers:
        var hidden: bool = marker.kind == "secret" and not progress[stage].sight
        if marker.kind in ["goal", "outer_door"]: marker.sealed = not boss_dead
        marker.tick(delta,game.hero.position)
        marker.visible = not hidden
        if marker.kind == "clapper": marker.visible = not progress[stage].clapper
        if marker.kind == "relic": marker.visible = not progress[stage].relic
    if is_instance_valid(boss) and not boss_dead and progress[stage].bell and progress[stage].relic and absf(game.hero.position.y - boss.position.y) < 200 and (stage == 3 or game.hero.position.y <= -1450) and game.hero.position.x >= boss.arena.x and game.hero.position.x <= boss.arena.y:
        boss.awake = true
    if is_instance_valid(boss) and boss.awake and not boss_dead:
        game.hero.position.x = clampf(game.hero.position.x,boss.arena.x + 18,boss.arena.y - 18)
    _scroll_background()
    update_hud()
    queue_redraw()

func use_art(id: int, at: Vector2) -> void:
    if not active or game.time_mode: return
    if stage == 3:
        if id == 4 and at.distance_to(point(BELL_AT)) < 145:
            if progress[stage].clapper and not progress[stage].tide_awake:
                progress[stage].tide_awake = true
                _tide_stairs()
                game.health = game.max_health
                game.sound.play_cue("light")
                game._persist()
            return
        if id == 3:
            progress[stage].sight = true
            _reveal_bridge()
            game._persist()
        if id == 4 and at.distance_to(point(Vector2(2590,106))) < 150:
            progress[stage].bell = true
            game._persist()
            game._say("Hải đăng đã thức · đài canh mở",3)
        return
    match id:
        0:
            if is_instance_valid(crystal) and at.distance_to(point(Vector2(420,at.y))) < 155 and at.y > -240:
                progress[stage].crystal = true
                _remove_body(crystal)
                game.emit_impact(point(Vector2(420,at.y)),Color("#ffc4da"))
                game._persist()
        3:
            progress[stage].sight = true
            _reveal_bridge()
            game._persist()
        4:
            if at.distance_to(point(Vector2(895,-644))) < 180:
                progress[stage].bell = true
                for gate in bell_gates: _remove_body(gate)
                game._persist()
                game._say("Chuông đã ngân · cửa lên đỉnh mở ra",3)
        5:
            if is_instance_valid(weak_floor) and at.distance_to(point(Vector2(580,-840))) < 145 and at.y <= -810:
                _remove_body(weak_floor)
                if is_instance_valid(weak_art): weak_art.hide()
                game._say("Sàn đã vỡ · khám phá căn phòng bên dưới",3)

func _remove_body(body: PhysicsBody2D) -> void:
    if not is_instance_valid(body): return
    body.collision_layer = 0
    var art: Node2D = body.get_meta("art") if body.has_meta("art") else null
    if is_instance_valid(art): art.hide()
    body.queue_free()
    queue_redraw()

func _reveal_bridge() -> void:
    for body in ghost_bodies:
        body.collision_layer = game.Combat.WORLD if progress[stage].sight else 0
    for art in ghost_art: art.modulate = Color.WHITE if progress[stage].sight else Color(0.7,0.8,1,0.12)

func nearest_anchor(at: Vector2, excluded := Vector2.INF) -> Vector2:
    if not active: return Vector2.INF
    var best := Vector2.INF
    var distance := 10000.0
    for anchor in anchors:
        if anchor == excluded: continue
        if anchor.y > at.y - 100: continue
        if absf(anchor.x - at.x) < 110 and at.y - anchor.y < 115: continue
        var gap := at.distance_to(anchor)
        if gap > 500: continue
        var score := gap - 180 if (anchor.x - at.x) * game.facing > 30 else gap + 120
        if score < distance and _hook_clear(at, anchor):
            best = anchor
            distance = score
    return best

func _hook_clear(at: Vector2, anchor: Vector2) -> bool:
    var query := PhysicsRayQueryParameters2D.create(at,anchor,game.Combat.WORLD)
    var space := game.get_world_2d().direct_space_state
    # A one-way ledge can be approached from below, just like the hero capsule.
    # Solid walls, locked doors and the sealed chamber still block the thread.
    for i in range(12):
        var hit := space.intersect_ray(query)
        if hit.is_empty(): return true
        var body: PhysicsBody2D = hit.collider
        var pass_through := false
        for child in body.get_children():
            if child is CollisionShape2D and child.one_way_collision: pass_through = true
        if not pass_through: return false
        var excluded := query.exclude
        excluded.append(body.get_rid())
        query.exclude = excluded
    return false

func interact() -> void:
    if game.time_mode:
        timeline.interact()
        return
    for marker in markers:
        if game.hero.position.distance_to(marker.position) > 60: continue
        match marker.kind:
            "story_back":
                game.cross_story_gate(-1)
                return
            "clapper":
                if not progress[stage].clapper:
                    progress[stage].clapper = true
                    game.sound.play_cue("light")
                    game._persist()
                    game._say("Trên lưỡi chuông khắc tên Tín. Tiếng chuông từng dẫn ghe về làng.", 5)
                return
            "tide_bell":
                game._say("Ấn 5 để gọi những con thuyền lạc." if progress[stage].clapper else "Chuông mất tiếng. Tìm lưỡi đồng dưới vòm nước.", 4)
                return
            "checkpoint1", "checkpoint2":
                var checkpoint_index := 1 if marker.kind == "checkpoint1" else 2
                if stage == 3:
                    progress[stage].checkpoint = maxi(progress[stage].checkpoint, checkpoint_index)
                    var door := coast_doors[checkpoint_index-1]
                    if is_instance_valid(door) and door.collision_layer != 0:
                        _remove_body(door)
                        game.sound.play_cue("light")
                        game.emit_impact(marker.position+Vector2(30,-54),Color("#ffe3a1"))
                else:
                    progress[stage].checkpoint = checkpoint_index
                game.checkpoint = game.hero.position
                game.health = game.max_health
                game._persist()
                game._say("Đã lưu trạm tầng trời · sinh lực đầy",2)
                print("ECLIPSE SKY CHECKPOINT: %d %d" % [stage,checkpoint_index])
                return
            "relic":
                if stage != 3 and is_instance_valid(weak_floor):
                    game._say("Lên sàn phía trên, nhảy rồi dùng 6 để phá sàn",2)
                    return
                progress[stage].relic = true
                game.sound.play_cue("victory")
                game._persist()
                game._say("Đã tìm Di Vật Thiên Không · Thủ Hộ thức tỉnh trên đỉnh",4)
                return
            "secret":
                if not progress[stage].sight: return
                progress[stage].secret = true
                game.health = game.max_health
                game._persist()
                game._say("BÍ MẬT SAU THÁP · sáu kỹ năng hồi nhanh hơn",4)
                return
            "outer_door":
                if not boss_dead:
                    game._say("Vệ Binh giữ cửa sân hải đăng",2)
                    return
                var exit_door := coast_doors[2]
                if is_instance_valid(exit_door) and exit_door.collision_layer != 0:
                    _remove_body(exit_door)
                    game.sound.play_cue("light")
                game._say("Cửa đã mở · vượt hai nhịp cầu và thắp đèn",3)
                return
            "goal":
                if not boss_dead:
                    game._say("Đánh bại Thủ Hộ và tìm Di Vật trong phòng kín trước",3)
                    return
                if game.story_mode and stage < 3:
                    progress[stage].won = true
                    game.mark_chapter_complete(stage+3)
                    game.cross_story_gate(1)
                    return
                if game.story_mode and stage == 3:
                    game.journey_complete = true
                    game.checkpoint = point(story_exit() - Vector2(0,24))
                    game.sound.play_cue("victory")
                    game.emit_impact(point(story_exit() - Vector2(0,140)), Color("#ffdea0"))
                _finish()
                return
    game._say("E gần trụ lưu, di vật hoặc cổng đỉnh; 1–6 dùng kỹ năng",2)

func respawn() -> void:
    game.arts.reset()
    if is_instance_valid(boss) and not boss_dead: boss.reset_encounter()
    game.air_jumps = 1

func boss_defeated() -> void:
    boss_dead = true
    if game.time_mode:
        timeline.guardian_down()
        return
    if game.story_mode:
        progress[stage].guardian_down = true
        game._persist()
    game.i_frames = 1.2
    for bolt in game.bolts:
        if is_instance_valid(bolt) and not bolt.friendly: bolt.life = 0
    game.sound.play_cue("victory")
    game._say("Thủ Hộ đã gục ngã · tìm cổng tầng trời phía trên (E)",5)
    update_hud()

func _finish() -> void:
    progress[stage].won = true
    game.mark_chapter_complete(stage + 3)
    game.trials.victory_title.text = TITLES[stage].to_upper() + " · CHẠM TẦNG TRỜI"
    game.trials.victory_text.text = "Đã vượt hơn %d độ cao.\nSáu kỹ năng mở đường · Di Vật đã được cứu.\nBí mật: %s" % [int(best_height),"đã tìm" if progress[stage].secret else "còn một lối ẩn sau tháp"]
    game.trials.next_button.text = "Tiếp: " + TITLES[stage + 1] if stage < 3 else "Về bản đồ"
    if stage == 3:
        game.trials.victory_title.text = "HẢI ĐĂNG ĐÃ SÁNG"
        game.trials.victory_text.text = "Ngoài khơi, những ghe lạc nối đuôi về làng theo tiếng Chuông Triều." if progress[stage].tide_awake else "Ánh đèn trở lại. Dưới vách biển vẫn còn một quả chuông im tiếng."
        game.trials.next_button.text = "Về menu"
    game._show_victory()
    print("ECLIPSE SKY WIN: %d %s height=%d" % [stage,game.character,int(best_height)])

func next_stage() -> void:
    if stage == 3:
        game.trials.return_menu()
        return
    game.demo_room_select.select(4 + stage)
    game._start(game.character)

func stop() -> void:
    active = false
    back_layer.hide()
    timeline.hide_ui()
    hud_layer.hide()
    game.scenery.background.show()
    game.crouch_touch.hide()
    game.control_art.crouch.hide()
    if is_instance_valid(root): root.hide()

func secret_count() -> int:
    var result := 0
    for item in progress:
        if item.secret: result += 1
    return result

func restore(data: Variant) -> void:
    if not data is Array: return
    for i in range(mini(data.size(), TITLES.size())):
        if not data[i] is Dictionary: continue
        var clean := _blank()
        clean.checkpoint = clampi(int(data[i].get("checkpoint",0)),0,2)
        for key in ["crystal","sight","bell","relic","secret","won","guardian_down","clapper","tide_awake"]: clean[key] = data[i].get(key,false) == true
        progress[i] = clean

func update_hud() -> void:
    if not active: return
    game.chapter.text = TITLES[stage]
    game.light_status.text = ""
    game.hearts.show_health(game.health,game.max_health)
    altitude.text = "Độ cao: %d · Trạm %d/2" % [maxi(0,int(456 - game.hero.position.y)),progress[stage].checkpoint]
    var p: Vector2 = game.hero.position
    if game.time_mode:
        game.chapter.text = timeline.ERAS[timeline.era]
        altitude.text = ""
        game.light_status.text = "Hầm Dẫn Nước" if timeline.underground else ("Tiệm Bà Lam" if timeline.indoors else "Bờ Đá · Hải Đăng")
        objective.text = ["Gặp Bà Lam · tìm lõi của Thủ Vệ Đá","E · Hỏi Tín bên cửa tiệm hoặc dùng cỗ máy","Vượt cầu · hạ vệ binh · thắp hải đăng"][timeline.era]
    elif stage == 3:
        var room_name := "Cửa Biển" if p.x < origin + 1310 else ("Hầm Vòm" if p.x < origin + 2490 else ("Đài Canh" if p.x < origin + 3540 else "Sân Hải Đăng"))
        game.chapter.text = room_name
        altitude.text = "Đường đi %d%% · Trạm %d/2" % [int((p.x-origin)/_width()*100),progress[stage].checkpoint]
        objective.text = "Tìm lõi đèn dưới vòm đá (E)" if not progress[stage].relic else ("Dùng 4 hiện cầu · dùng 5 gần chuông" if not progress[stage].bell else ("Đến đài canh và đánh bại vệ binh" if not boss_dead else "Đến cổng cuối và nhấn E"))
    elif not progress[stage].crystal: objective.text = "1 Phá Tinh · phá vách hồng, tìm đường leo lên"
    elif p.y > 130: objective.text = "2 Thiên Thăng · lao lên sân tháp ở phía trên"
    elif not progress[stage].sight: objective.text = "3 kéo móc vàng · 4 hiện cầu và lối ẩn"
    elif not progress[stage].bell: objective.text = "Leo theo cầu tinh tú · dùng 5 tại chuông xanh"
    elif not progress[stage].relic: objective.text = "6 Thiên Giáng · phá sàn nứt, vào phòng kín lấy Di Vật (E)"
    elif not boss_dead: objective.text = "Dùng móc vàng leo tới đỉnh · đánh bại " + BOSS_NAMES[stage]
    else: objective.text = "Tiếp tục lên cổng tầng trời và nhấn E"
    if game.story_mode:
        altitude.text = ""
        if stage == 3:
            objective.text = "" if progress[stage].won else ("Lõi đèn" if not progress[stage].relic else ("5 · Chuông" if not progress[stage].bell else ""))
        else:
            objective.text = ("1 · Phá vách" if not progress[stage].crystal else
                ("4 · Hiện cầu" if not progress[stage].sight else ("5 · Rung chuông" if not progress[stage].bell else ("6 · Phá sàn" if not progress[stage].relic else ""))))
    if in_tide_vault(p):
        game.chapter.text = "Hầm Chuông Triều"
        objective.text = "Nhặt lưỡi chuông · E" if not progress[stage].clapper else ("Mang lưỡi đồng tới chuông · 5" if not progress[stage].tide_awake else "Ghe đã nghe chuông · leo bậc đá về bờ")
    boss_label.visible = is_instance_valid(boss) and boss.awake and not boss_dead and (not game.time_mode or not timeline.indoors)
    boss_bar.visible = boss_label.visible
    if boss_label.visible:
        boss_bar.max_value = boss.max_hp
        boss_bar.value = boss.hp
        boss_label.text = "%s · PHA %d\n%d/%d" % [boss.title,2 if boss.phase_two else 1,boss.hp,boss.max_hp]

func _draw() -> void:
    if not active: return
    if stage == 3:
        if game.story_mode:
            var phase := fmod(elapsed,2.4)
            for i in range(6):
                var at := point(Vector2(3810+i*15,162))
                var spike_height := 22.0 if phase > 1.3 else (6.0 if phase > 0.88 else 2.0)
                draw_colored_polygon(PackedVector2Array([at,at+Vector2(7,-spike_height),at+Vector2(14,0)]),Color("#ffe6aa") if phase > 1.3 else Color("#a05e4d"))
        for i in coast_doors.size():
            var door := coast_doors[i]
            if not is_instance_valid(door) or door.collision_layer == 0: continue
            var at := point([Vector2(1310,250),Vector2(2490,130),Vector2(3540,205)][i])
            draw_line(at,at-Vector2(0,109),Color("#ffda9570"),10,true)
            draw_line(at,at-Vector2(0,109),Color("#fff1c6"),2,true)
    if stage == 3 and not game.time_mode and progress[stage].won:
        var focus := point(story_exit() - Vector2(0,149))
        var slope := sin(elapsed * 0.8) * 49
        for side in [-1, 1]:
            var beam := PackedVector2Array([focus, focus + Vector2(side * 620, slope - 114), focus + Vector2(side * 620, slope + 38)])
            draw_polygon(beam, PackedColorArray([Color("#ffe4a975"), Color("#ffe4a900"), Color("#ffe4a900")]))
        draw_circle(focus, 34, Color("#ffd58436"), true, -1.0, true)
        draw_circle(focus, 16, Color("#ffdfa596"), true, -1.0, true)
        draw_circle(focus, 8, Color("#fff5ce"), true, -1.0, true)
    for anchor in anchors:
        draw_circle(anchor,20,Color("#ffe0a321"))
        draw_arc(anchor,13,0,TAU,32,Color("#ffe3b0"),2.5,true)
        draw_line(anchor + Vector2(-6,0),anchor + Vector2(6,0),Color("#fff4db"),2,true)
        draw_line(anchor + Vector2(0,-6),anchor + Vector2(0,6),Color("#fff4db"),2,true)
    if is_instance_valid(boss) and boss.awake and not boss_dead:
        for x in [boss.arena.x + 18,boss.arena.y - 18]:
            draw_line(Vector2(x,35 if stage == 3 else -1600),Vector2(x,205 if stage == 3 else -1430),Color("#e8c7a25a"),3,true)
    if is_instance_valid(crystal):
        var r := box(Rect2(406,-224,28,680))
        draw_rect(r,Color("#df8cba35"))
        for y in range(-220,450,60): draw_polyline(PackedVector2Array([Vector2(r.position.x,y),Vector2(r.end.x,y+30),Vector2(r.position.x,y+60)]),Color("#ffd0f1"),2,true)
    for gate in bell_gates:
        if not is_instance_valid(gate): continue
        draw_line(gate.position + Vector2(0,-150),gate.position + Vector2(0,150),Color("#9cf1df99"),5,true)
    if is_instance_valid(weak_floor):
        var r := box(Rect2(480,-840,240,22))
        draw_polyline(PackedVector2Array([r.position + Vector2(12,3),r.position + Vector2(70,13),r.position + Vector2(120,3),r.position + Vector2(155,17),r.position + Vector2(225,5)]),Color("#ffdca3"),3,true)
