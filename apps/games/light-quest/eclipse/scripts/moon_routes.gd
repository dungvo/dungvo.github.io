extends Node2D
## Optional routes are built from original art and real Godot collision bodies.
const Relic := preload("res://scripts/trial_relic.gd")
const TITLES := ["Mái Tháp Chuông", "Lối Tán Rừng", "Hành Lang Tinh Tú"]
var director: Node2D
var game: Node2D
var root: Node2D
var air_step_unlocked := false
var claimed := [false, false, false]
var opened := [false, false, false]
var chapter := 0
var base_x := 0.0
var shrine: Node2D
var cache: Node2D
var seal: Node2D
var seal_body: StaticBody2D
var bridge_bodies: Array[StaticBody2D] = []
var bridge_art: Array[Node2D] = []
var ferry: AnimatableBody2D
var ferry_art: Node2D
var shrine_art: Node2D
var cache_art: Node2D
var elapsed := 0.0
var pulse := 0.0
var hint: Label

func _ready() -> void:
    director = get_parent()
    game = director.game
    var layer := CanvasLayer.new()
    add_child(layer)
    hint = game._hud_label(layer, Vector2(270, 165), Vector2(420, 42), 14)
    hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    hint.add_theme_color_override("font_color", Color("#c1eddf"))

func build(index: int) -> void:
    if is_instance_valid(root):
        for body in root.get_children():
            if body is PhysicsBody2D: body.collision_layer = 0
        root.queue_free()
    root = Node2D.new()
    add_child(root)
    chapter = index
    base_x = index * 1920.0
    elapsed = 0
    pulse = 0
    bridge_bodies.clear()
    bridge_art.clear()
    ferry = null
    ferry_art = null
    # The shrine is reachable with ordinary jumps via the existing lower ledges.
    _platform(Vector2(740, 315), Vector2(125, 22))
    shrine = _marker("shrine", Vector2(786, 315), "E · Đền Bước Gió", Color("#a8efda"))
    shrine.used = air_step_unlocked
    shrine_art = _detail(5, Vector2(786, 315), Vector2(40, 64))
    shrine_art.modulate = Color("#9fc8ba") if air_step_unlocked else Color.WHITE
    seal = null
    seal_body = null
    match index:
        0:
            _platform(Vector2(945, 170), Vector2(155, 22))
            _platform(Vector2(1150, 158), Vector2(105, 22))
        1:
            # A travelling moss platform is a Godot AnimatableBody2D, with real rider motion.
            ferry = AnimatableBody2D.new()
            ferry.sync_to_physics = false
            ferry.position = Vector2(base_x + 982, 205)
            ferry.collision_layer = game.Combat.WORLD
            ferry.add_child(game.Combat.rectangle(Vector2(125, 20)))
            ferry.get_child(0).one_way_collision = true
            root.add_child(ferry)
            ferry_art = _art_platform(Rect2(base_x + 920, 195, 125, 20))
            _platform(Vector2(1135, 165), Vector2(120, 22))
        2:
            bridge_bodies.append(_platform(Vector2(940, 180), Vector2(140, 22), true))
            bridge_bodies.append(_platform(Vector2(1130, 150), Vector2(125, 22), true))
    var height: float = [158.0, 165.0, 150.0][index]
    cache = _marker("cache", Vector2(1210, height), "E · Di vật đường mới", Color("#ffd695"))
    cache.used = claimed[index]
    cache_art = _detail(9, Vector2(1210, height), Vector2(44, 27))
    cache_art.modulate = Color("#687486") if claimed[index] else Color.WHITE
    var seal_pos := Vector2(1084, 160) if index != 2 else Vector2(842, 290)
    if not opened[index]:
        seal = _marker("seal", seal_pos, "Q · Phá ấn cộng hưởng", Color("#cda4ff"))
        if index != 2:
            seal_body = StaticBody2D.new()
            seal_body.position = Vector2(base_x + 1104, 148)
            seal_body.collision_layer = game.Combat.WORLD
            seal_body.add_child(game.Combat.rectangle(Vector2(12, 150)))
            root.add_child(seal_body)
    _sync_bridge()
    hint.text = ""
    queue_redraw()

func _marker(kind: String, point: Vector2, caption: String, color: Color) -> Node2D:
    var item := Relic.new()
    item.kind = kind
    item.caption = caption
    item.position = Vector2(base_x + point.x, point.y)
    item.tint = color
    root.add_child(item)
    return item

func _detail(index: int, point: Vector2, dimensions: Vector2) -> Node2D:
    var art: Node2D = game.scenery._prop(index, Vector2(base_x + point.x, point.y), dimensions)
    game.scenery.remove_child(art)
    root.add_child(art)
    art.z_index = -1
    return art

func _platform(point: Vector2, extent: Vector2, ghost := false) -> StaticBody2D:
    var rect := Rect2(Vector2(base_x + point.x, point.y), extent)
    var body := StaticBody2D.new()
    body.collision_layer = game.Combat.WORLD
    body.position = rect.get_center()
    var col: CollisionShape2D = game.Combat.rectangle(extent)
    col.one_way_collision = true
    body.add_child(col)
    root.add_child(body)
    var art := _art_platform(rect)
    if ghost: bridge_art.append(art)
    return body

func _art_platform(rect: Rect2) -> Node2D:
    var depth := maxf(43, rect.size.y + 7)
    var art: Node2D = game.scenery._prop(0, Vector2(rect.get_center().x, rect.position.y + depth - 2), Vector2(rect.size.x, depth))
    game.scenery.remove_child(art)
    root.add_child(art)
    art.z_index = -1
    return art

func tick(delta: float) -> void:
    if not director.active: return
    elapsed += delta
    pulse = maxf(0, pulse - delta)
    for marker in [shrine, cache, seal]:
        if is_instance_valid(marker): marker.tick(delta, game.hero.position)
    if is_instance_valid(ferry):
        ferry.position.x = base_x + 982 + sin(elapsed * 1.25) * 70
        ferry_art.position.x = ferry.position.x
    var x: float = game.hero.position.x - base_x
    hint.text = ""
    if x > 700 and x < 1280:
        if not air_step_unlocked:
            hint.text = "Nhánh trên cao · Gặp đền xanh để học Bước Gió (E)"
        elif game.hero.position.y < 295:
            hint.text = TITLES[chapter] + (" · Đã tìm di vật" if claimed[chapter] else " · Nhảy lần hai giữa không trung; Q phá ấn")
        elif chapter == 2 and not opened[chapter]:
            hint.text = "Q cạnh ấn tím để làm hiện cầu tinh tú"
    if pulse > 0: queue_redraw()

func interact() -> bool:
    if is_instance_valid(shrine) and not air_step_unlocked and game.hero.position.distance_to(shrine.position) < 50:
        air_step_unlocked = true
        shrine.used = true
        shrine_art.modulate = Color("#9fc8ba")
        game.air_jumps = 1
        game.sound.play_cue("victory")
        game.emit_impact(shrine.position, Color("#a8efda"))
        game._say("ĐÃ HỌC BƯỚC GIÓ · Thả rồi nhấn NHẢY lần nữa giữa không trung", 5)
        game._persist()
        print("ECLIPSE ROUTE: air-step unlocked")
        return true
    if is_instance_valid(cache) and not claimed[chapter] and game.hero.position.distance_to(cache.position) < 50:
        if not opened[chapter]:
            game._say("Di vật còn phong ấn · Dùng Q gần ấn tím", 2)
            return true
        claimed[chapter] = true
        cache.used = true
        cache_art.modulate = Color("#687486")
        game.health = game.max_health
        game.burst_cooldown = 0
        game.sound.play_cue("victory")
        game.emit_impact(cache.position, Color("#ffd695"))
        game._say("DI VẬT · " + TITLES[chapter] + " — tuyệt kỹ hồi nhanh hơn, đã lưu", 4)
        game._persist()
        print("ECLIPSE ROUTE: chapter %d relic claimed" % chapter)
        return true
    return false

func resonate(origin: Vector2) -> bool:
    if opened[chapter] or not is_instance_valid(seal): return false
    var target := seal.position + Vector2(0, -12)
    # Interaction may reach the seal's front surface, but never through another wall.
    if origin.distance_to(target) > 155: return false
    if not game.Combat.ray(game.get_world_2d().direct_space_state, origin, target, game.Combat.WORLD).is_empty(): return false
    opened[chapter] = true
    seal.used = true
    if is_instance_valid(seal_body):
        seal_body.collision_layer = 0
        seal_body.queue_free()
    _sync_bridge()
    pulse = 0.5
    game.emit_impact(target, Color("#d4b1ff"))
    game.sound.play_cue("light")
    game._say("Ấn đã vỡ · " + ("Cầu tinh tú hiện ra" if chapter == 2 else "Đường tới di vật đã mở"), 3)
    game._persist()
    print("ECLIPSE ROUTE: chapter %d seal opened" % chapter)
    return true

func _sync_bridge() -> void:
    for body in bridge_bodies:
        body.collision_layer = game.Combat.WORLD if opened[chapter] else 0
    for art in bridge_art:
        art.modulate = Color.WHITE if opened[chapter] else Color(0.65, 0.7, 1, 0.19)

func clear_hint() -> void:
    hint.text = ""

func _draw() -> void:
    if pulse <= 0 or not is_instance_valid(seal): return
    draw_arc(seal.position + Vector2(0, -16), 40 + (0.5 - pulse) * 180, 0, TAU, 48, Color("#dfbbffa0"), 3, true)
