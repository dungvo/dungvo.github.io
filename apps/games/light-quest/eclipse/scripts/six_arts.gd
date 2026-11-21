extends Node2D
## Six distinct Godot traversal/combat arts. All movement uses the hero's collision body.
const BossActor := preload("res://scripts/trial_boss.gd")
const NAMES := ["Phá Tinh", "Thiên Thăng", "Tơ Nguyệt", "Nguyệt Nhãn", "Chuông Vọng", "Thiên Giáng"]
const USES := ["lướt phá vách nứt", "lao lên tầng cao", "kéo tới móc neo vàng", "hiện cầu và phòng bí mật", "mở cửa cộng hưởng / choáng", "giáng xuống phá sàn yếu"]
const COOLDOWNS := [2.5, 3.0, 1.2, 5.0, 4.5, 2.3]
const COLORS := [Color("#ffb7bd"), Color("#a8efff"), Color("#ffe3a5"), Color("#c9b4ff"), Color("#9ff3e2"), Color("#ffd39c")]
var game: Node2D
var selected := 0
var cooldowns := [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
var effects: Array[Dictionary] = []
var cast_clock := 0.0
var cast_facing := 1
var rise_time := 0.0
var rush_time := 0.0
var dive_time := 0.0
var grapple_time := 0.0
var grapple_target := Vector2.ZERO
var hit_actors: Array[int] = []
var layer: CanvasLayer
var buttons: Array[Button] = []
var caption: Label
var ui_clock := 0.0
var drawing_active := false

class RuneIcon extends Node2D:
    var index := 0
    var tint := Color.WHITE
    func _draw() -> void:
        draw_arc(Vector2.ZERO, 15, 0, TAU, 28, Color(tint, 0.35), 1.0, true)
        match index:
            0:
                draw_polyline(PackedVector2Array([Vector2(-11, 9), Vector2(2, -12), Vector2(-1, 1), Vector2(12, -8)]), tint, 2.5, true)
            1:
                draw_line(Vector2(0, 12), Vector2(0, -12), tint, 3, true)
                draw_polyline(PackedVector2Array([Vector2(-9, -2), Vector2(0, -12), Vector2(9, -2)]), tint, 2.5, true)
                draw_arc(Vector2(0, 7), 9, 0.1, PI - 0.1, 16, tint, 1.5, true)
            2:
                draw_arc(Vector2(3, -5), 6, 0, PI * 1.7, 20, tint, 2.5, true)
                draw_polyline(PackedVector2Array([Vector2(3, 1), Vector2(2, 7), Vector2(-8, 12)]), tint, 2, true)
            3:
                draw_arc(Vector2(0, 6), 13, PI + 0.3, TAU - 0.3, 22, tint, 2, true)
                draw_arc(Vector2(0, -6), 13, 0.3, PI - 0.3, 22, tint, 2, true)
                draw_circle(Vector2.ZERO, 4, tint)
            4:
                draw_arc(Vector2.ZERO, 7, 0, TAU, 22, tint, 2.2, true)
                draw_arc(Vector2.ZERO, 12, -1.1, 1.1, 20, tint, 2, true)
                draw_arc(Vector2.ZERO, 12, PI - 1.1, PI + 1.1, 20, tint, 2, true)
            5:
                draw_line(Vector2(0, -12), Vector2(0, 8), tint, 3, true)
                draw_polyline(PackedVector2Array([Vector2(-8, 1), Vector2(0, 10), Vector2(8, 1)]), tint, 2.5, true)
                draw_line(Vector2(-13, 12), Vector2(13, 12), tint, 2, true)

func _ready() -> void:
    game = get_parent()
    z_index = 8
    layer = CanvasLayer.new()
    layer.layer = 3
    add_child(layer)
    caption = game._hud_label(layer, Vector2(255, 432), Vector2(390, 35), 14)
    caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    for i in range(6):
        var button := Button.new()
        button.position = Vector2(260 + i * 61, 474)
        button.size = Vector2(57, 54)
        button.text = str(i + 1)
        button.alignment = HORIZONTAL_ALIGNMENT_LEFT
        button.add_theme_font_size_override("font_size", 12)
        button.focus_mode = Control.FOCUS_NONE
        var style := StyleBoxFlat.new()
        style.bg_color = Color("#0b1429dd")
        style.border_color = COLORS[i].darkened(0.3)
        style.set_border_width_all(1)
        style.set_corner_radius_all(9)
        button.add_theme_stylebox_override("normal", style)
        button.add_theme_stylebox_override("hover", style)
        button.add_theme_stylebox_override("pressed", style)
        button.pressed.connect(cast.bind(i))
        layer.add_child(button)
        var icon := RuneIcon.new()
        icon.index = i
        icon.tint = COLORS[i]
        icon.position = Vector2(29, 22)
        button.add_child(icon)
        buttons.append(button)
    layer.hide()

func reset() -> void:
    for i in range(6): cooldowns[i] = 0.0
    cast_clock = 0
    rise_time = 0
    rush_time = 0
    dive_time = 0
    grapple_time = 0
    effects.clear()
    hit_actors.clear()
    layer.show()
    update_hud()
    queue_redraw()

func cast(index: int) -> void:
    if not game.started or game.dialogue.visible or game.victory_panel.visible or game.death_time > 0: return
    selected = clampi(index, 0, 5)
    if cooldowns[selected] > 0:
        game._say(NAMES[selected] + " · đang hồi %.1fs" % cooldowns[selected], 0.8)
        update_hud()
        return
    var at: Vector2 = game.hero.position
    if selected == 2:
        var anchor: Vector2 = game.sky.nearest_anchor(at) if game.sky.active else Vector2.INF
        if anchor == Vector2.INF:
            game._say("Tơ Nguyệt · đến gần móc neo vàng phía trên", 1.5)
            return
        grapple_target = anchor + Vector2(0, 24)
        grapple_time = 0.9
    if selected == 5 and game.hero.is_on_floor():
        game._say("Thiên Giáng · nhảy lên trước rồi dùng 6 / ẤN", 1.6)
        return
    cooldowns[selected] = maxf(0.8, COOLDOWNS[selected] - (game.sky.secret_count() * 0.2 if is_instance_valid(game.sky) else 0))
    cast_clock = 0.44
    cast_facing = game.facing
    hit_actors.clear()
    game.attack_windup = 0
    game.attack_buffer = 0
    game.slash_time = 0
    game.anim_label = ""
    match selected:
        0:
            rush_time = 0.29
            game.dash_time = 0.29
            game.sound.play_cue("dash", 0.8)
        1:
            rise_time = 0.48
            game.hero.velocity.y = -790
            game.air_jumps = 1
            game.sound.play_cue("cast", 1.2)
        2: game.sound.play_cue("dash", 1.3)
        3: game.sound.play_cue("light", 0.75)
        4:
            game.sound.play_cue("phase", 1.25)
            _damage(215, 1, true)
        5:
            dive_time = 1.0
            game.sound.play_cue("slash", 0.65)
    if game.sky.active and selected != 5: game.sky.use_art(selected, at)
    effects.append({"id":selected,"p":at,"f":cast_facing,"life":0.7,"duration":0.7})
    game._burst(at, COLORS[selected], 20, 175)
    game._say(NAMES[selected] + " · " + USES[selected], 1.8)
    update_hud()
    queue_redraw()
    print("ECLIPSE ART: %d %s" % [selected + 1, NAMES[selected]])

func tick(delta: float) -> void:
    for i in range(6): cooldowns[i] = maxf(0, cooldowns[i] - delta)
    cast_clock = maxf(0, cast_clock - delta)
    rise_time = maxf(0, rise_time - delta)
    rush_time = maxf(0, rush_time - delta)
    grapple_time = maxf(0, grapple_time - delta)
    dive_time = maxf(0, dive_time - delta)
    if rush_time > 0 or rise_time > 0:
        _damage(105, 2, false)
        if game.sky.active: game.sky.use_art(0 if rush_time > 0 else 1, game.hero.position)
    for i in range(effects.size() - 1, -1, -1):
        effects[i]["life"] = float(effects[i]["life"]) - delta
        if effects[i]["life"] <= 0: effects.remove_at(i)
    var visible_effect := not effects.is_empty() or grapple_time > 0 or dive_time > 0 or rise_time > 0
    if visible_effect or drawing_active: queue_redraw()
    drawing_active = visible_effect
    ui_clock -= delta
    if ui_clock <= 0:
        ui_clock = 0.1
        update_hud()

func before_move() -> void:
    if grapple_time > 0:
        var delta: Vector2 = grapple_target - game.hero.position
        if delta.length() < 17:
            grapple_time = 0
            game.hero.velocity = Vector2(0, 40)
        else: game.hero.velocity = delta.normalized() * minf(850, delta.length() * 12)
    elif dive_time > 0:
        game.hero.velocity.y = 880
        game.hero.velocity.x *= 0.55

func after_move() -> void:
    if dive_time > 0 and game.hero.is_on_floor():
        dive_time = 0
        var at: Vector2 = game.hero.position + Vector2(0, 24)
        if game.sky.active: game.sky.use_art(5, at)
        _damage(190, 3, false)
        effects.append({"id":5,"p":at,"f":game.facing,"life":0.7,"duration":0.7})
        game.emit_impact(at, COLORS[5])
        game.sound.play_cue("contact", 0.65)
        queue_redraw()

func _damage(radius: float, amount: int, stun: bool) -> void:
    var space := game.get_world_2d().direct_space_state
    for foe in game.enemies:
        if not is_instance_valid(foe) or foe.state == "dead" or foe.get_instance_id() in hit_actors: continue
        if foe.position.distance_to(game.hero.position) > radius: continue
        if not game.Combat.ray(space, game.hero.position, foe.position, game.Combat.WORLD).is_empty(): continue
        hit_actors.append(foe.get_instance_id())
        foe.take_hit(amount, game)
        if stun and foe.state not in ["dead", "phase"]:
            foe._set_state("recover", 0.42 if foe is BossActor else 1.0)

func update_hud() -> void:
    if not game.started: return
    caption.text = "%d · %s — %s" % [selected + 1, NAMES[selected], USES[selected]]
    for i in range(6):
        buttons[i].modulate = Color.WHITE if cooldowns[i] <= 0 else Color(0.6, 0.65, 0.75)
        buttons[i].text = str(i + 1) + ("\n%.1f" % cooldowns[i] if cooldowns[i] > 0 else "")

func _draw() -> void:
    if not is_instance_valid(game) or not is_instance_valid(game.hero): return
    if grapple_time > 0:
        var origin: Vector2 = game.hero.position + Vector2(0, -10)
        var points := PackedVector2Array()
        for i in range(25):
            var t := float(i) / 24
            points.append(origin.lerp(grapple_target - Vector2(0, 24), t) + Vector2(0, sin(t * PI) * 14))
        draw_polyline(points, Color("#ffe2a43b"), 9, true)
        draw_polyline(points, Color("#fff2ce"), 2, true)
    if rise_time > 0:
        for x in [-18, 0, 18]:
            draw_line(game.hero.position + Vector2(x, 8), game.hero.position + Vector2(x * 1.4, 105), Color("#a0e9ff88"), 5 if x == 0 else 2, true)
    if dive_time > 0:
        var p: Vector2 = game.hero.position
        draw_polyline(PackedVector2Array([p + Vector2(-28, -70), p + Vector2(0, 25), p + Vector2(28, -70)]), Color("#ffe1ad"), 4, true)
    for fx in effects:
        var life: float = fx.life / fx.duration
        var t := 1.0 - life
        var p: Vector2 = fx.p
        var id: int = fx.id
        var tint: Color = COLORS[id]
        tint.a = life * 0.8
        match id:
            0:
                var angle := 0.0 if int(fx.f) > 0 else PI
                for band in [Vector2(82, 15), Vector2(74, 6), Vector2(69, 2)]:
                    draw_arc(game.hero.position, band.x + t * 35, angle - 1.2, angle + 1.2, 40, Color(tint, tint.a * (0.3 if band.y == 15 else 1)), band.y, true)
            1:
                draw_arc(p + Vector2(0, 15), 32 + t * 80, PI, TAU, 40, tint, 3, true)
                draw_line(p + Vector2(-32, 24), p + Vector2(32, 24), tint, 4, true)
            2:
                draw_arc(grapple_target - Vector2(0, 24), 18 + t * 28, 0, TAU, 32, tint, 2, true)
            3, 4:
                var radius := 30 + t * (340 if id == 3 else 220)
                draw_arc(p, radius, 0, TAU, 64, Color(tint, tint.a * 0.25), 12, true)
                draw_arc(p, radius - 5, 0, TAU, 64, tint, 2, true)
                if id == 3:
                    draw_arc(p + Vector2(0, 14), 30, PI + 0.25, TAU - 0.25, 32, tint, 2, true)
                    draw_circle(p, 7, tint)
            5:
                for direction in [-1, 1]:
                    draw_polyline(PackedVector2Array([p, p + Vector2(direction * (35 + 90 * t), -12), p + Vector2(direction * (60 + 110 * t), 0)]), tint, 4, true)
