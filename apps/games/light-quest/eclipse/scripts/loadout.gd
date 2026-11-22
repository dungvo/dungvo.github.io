extends CanvasLayer
## Shared pause screen. Story weapons affect basic attacks; era weapons carry the V technique.
const GroundSurface := preload("res://scripts/ground_surface.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const SixArts := preload("res://scripts/six_arts.gd")
const Hit := preload("res://scripts/hit_geometry.gd")
const Preview := preload("res://scripts/forge_card.gd")
const AtlasPlot := preload("res://scripts/atlas_plot.gd")
const MapData := preload("res://scripts/atlas_data.gd")
const COAST := preload("res://assets/eclipse/open-moon-coast.webp")
const MOON := preload("res://assets/eclipse/moon-tower.webp")
const ARMORY := preload("res://assets/eclipse/forge-weapons.webp")
const GOLD := Color("#ebd5a7")
const AQUA := Color("#a2e6de")
const TEXT := Color("#d6e1f4")
const WEAPONS := ["Nguyệt Thép", "Tơ Bạc", "Tinh Thạch"]
const STORY_ICONS := [0, 1, 2]
const ATTACK_RECOVERY := [1.0, 1.22, 1.48]
const EXTRA_MELEE := [0, 24, 0]
const MELEE_REACH := [int(Hit.SWORD_REACH), int(Hit.SWORD_REACH) + EXTRA_MELEE[1], int(Hit.SWORD_REACH)]
const BOLT_SPEED := [570, 740, 570]
const HIT_BONUS := [0, 0, 1]
const GUIDES := [
    "Đứng trước vách pha lê hồng rồi lướt xuyên. Đòn đánh xuyên qua nhiều mục tiêu trên đường.",
    "Đứng dưới bệ cao và lao lên. Chỉnh hướng trên không để đáp xuống bệ.",
    "Nhìn về móc vàng rồi tung dây để kéo người tới. Móc cần ở trong tầm và có lối thoáng.",
    "Dùng gần vực hoặc lối mờ để hiện cầu và kho báu ẩn.",
    "Dùng sát chuông để mở đường. Trong chiến đấu, gây choáng kẻ địch gần.",
    "Nhảy lên trên sàn nứt rồi giáng. Sàn chỉ vỡ khi chạm."
]
var weapon := 0
var favorite := -1
var game: Node2D
var panel: Control
var portrait_button: Button
var opener: Button
var content: Control
var tabs: Array[Button] = []
var page := 0
var selected_weapon := 0
var selected_art := 0

func _ready() -> void:
    game = get_parent()
    layer = 17
    process_mode = Node.PROCESS_MODE_ALWAYS
    opener = _button(self, Rect2(21, 88, 125, 36), "KHO · I", toggle)
    opener.hide()
    portrait_button = Button.new()
    portrait_button.flat = true
    portrait_button.focus_mode = Control.FOCUS_NONE
    portrait_button.tooltip_text = "Trang bị · I"
    portrait_button.position = Vector2(20, 9)
    portrait_button.size = Vector2(50, 50)
    portrait_button.pressed.connect(toggle, CONNECT_DEFERRED)
    add_child(portrait_button)
    portrait_button.hide()
    panel = _surface(self, Rect2(0, 0, 960, 540), Color("#070b17"), Color.TRANSPARENT)
    var backdrop := _picture(panel, MOON, Rect2(0, 0, 960, 540))
    backdrop.modulate = Color("#7789a76b")
    _surface(panel, Rect2(11, 11, 938, 518), Color("#0912249c"), Color("#9a8663"))
    _label(panel, Rect2(29, 19, 210, 43), "E C L I P S E", 21, GOLD)
    _button(panel, Rect2(211, 25, 135, 34), "Bản đồ · M", _map)
    for index in range(3):
        tabs.append(_button(panel, Rect2(356 + index * 142, 25, 132, 34),
            ["Trang bị", "Kỹ năng", "Nhật ký"][index], show_page.bind(index)))
    _button(panel, Rect2(808, 25, 121, 34), "Tiếp tục · Esc", close)
    _surface(panel, Rect2(28, 67, 904, 1), GOLD.darkened(0.45), Color.TRANSPARENT)
    panel.hide()

func can_open() -> bool:
    return game.started and not game.dialogue.visible and not game.victory_panel.visible and game.death_time <= 0 and not game.sky.timeline.panel.visible and not game.atlas.overlay.visible

func _process(_delta: float) -> void:
    if is_instance_valid(game.atlas):
        opener.visible = can_open() and not panel.visible
        portrait_button.visible = opener.visible

func _input(event: InputEvent) -> void:
    if not event is InputEventKey or not event.pressed or event.echo: return
    if panel.visible:
        if event.keycode in [KEY_I, KEY_ESCAPE]: close()
        elif event.keycode == KEY_M: _map()
        else: return
    elif event.keycode == KEY_I and can_open():
        open(0)
    else:
        return
    get_viewport().set_input_as_handled()

func toggle() -> void:
    if panel.visible: close()
    else: open(0)

func open(index: int) -> void:
    if not panel.visible:
        if not can_open(): return
        var timeline: Node2D = game.sky.timeline
        selected_weapon = timeline.equipped if game.time_mode else weapon
        selected_art = quick_art()
        game._reset_touch()
        game.jump_buffer_clock = 0
        game.attack_buffer = 0
        game.joystick.accept_touch = false
        panel.show()
        get_tree().paused = true
    show_page(index)

func close() -> void:
    if not panel.visible: return
    panel.hide()
    get_tree().paused = false
    if game.started and not game.dialogue.visible: game.joystick.accept_touch = true

func _map() -> void:
    close()
    game.atlas.open()

func show_page(index: int) -> void:
    page = index
    if is_instance_valid(content):
        panel.remove_child(content)
        content.queue_free()
    content = Control.new()
    content.mouse_filter = Control.MOUSE_FILTER_IGNORE
    panel.add_child(content)
    for i in tabs.size(): tabs[i].modulate = GOLD if i == page else TEXT
    match page:
        0: _gear()
        1: _skills()
        2: _journal()

func _gear() -> void:
    var timeline: Node2D = game.sky.timeline
    var temporal: bool = game.time_mode
    var equipped: int = timeline.equipped if temporal else weapon
    var list: Array = timeline.WEAPONS if temporal else WEAPONS
    var owned := not temporal or bool(timeline.owned[selected_weapon])
    _surface(content, Rect2(25, 81, 316, 349))
    _label(content, Rect2(38, 91, 287, 28),
        "KHO HẢI ĐĂNG   %d / 8" % timeline.owned.count(true) if temporal else "VŨ KHÍ HÀNH TRÌNH", 17, GOLD)
    for i in list.size():
        var x := 38 + (i % 2) * 146
        var y := 126 + (i / 2) * 72
        var unlocked := not temporal or bool(timeline.owned[i])
        var card := _button(content, Rect2(x, y, 139, 64), "", _select_weapon.bind(i), i == selected_weapon)
        var icon := _picture(card, _weapon_icon(i if temporal else STORY_ICONS[i]), Rect2(5, 4, 129, 42))
        if not unlocked: icon.modulate = Color("#9ba3b2a0")
        var label := _label(card, Rect2(3, 44, 133, 17), list[i] + ("  ·" if i == equipped else ""), 12, GOLD if unlocked else TEXT)
        label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    _hero(Rect2(352, 81, 240, 349))
    _surface(content, Rect2(602, 81, 332, 349))
    _label(content, Rect2(619, 96, 297, 40), list[selected_weapon], 24, GOLD)
    _label(content, Rect2(619, 141, 297, 22), "Đang mang · " + list[equipped], 14, TEXT)
    _surface(content, Rect2(619, 177, 297, 1), GOLD.darkened(0.5), Color.TRANSPARENT)
    if temporal:
        _wrap(content, Rect2(619, 189, 292, 64), timeline.TECHS[selected_weapon], 17, AQUA)
        var preview := Preview.new()
        preview.position = Vector2(620, 254)
        preview.size = Vector2(294, 103)
        preview.weapon = selected_weapon
        preview.double_tether = selected_weapon == timeline.SPEAR and timeline.spear_infused
        content.add_child(preview)
        _button(content, Rect2(620, 369, 131, 40), "Xem chiêu", func(): preview.phase = 0.0)
        var action := _button(content, Rect2(762, 369, 152, 40),
            "Đang mang" if equipped == selected_weapon else ("Trang bị" if owned else "Mua ở tiệm Bà Lam"), _equip, true)
        action.disabled = not owned or equipped == selected_weapon
    else:
        _compare(201, "Tầm kiếm" if game.character == "An" else "Tốc độ đạn",
            MELEE_REACH if game.character == "An" else BOLT_SPEED)
        _compare(242, "Sát thương thêm", HIT_BONUS)
        _compare(283, "Thời gian hồi (%)", [100, 122, 148], true)
        var action := _button(content, Rect2(620, 369, 294, 40),
            "Đang mang" if equipped == selected_weapon else "Trang bị", _equip, true)
        action.disabled = equipped == selected_weapon
    _surface(content, Rect2(25, 442, 909, 69))
    if temporal:
        var infusion: String = "Tơ Kép đã mở · nối hai móc liên tiếp" if timeline.spear_infused else "Truyền 4 Lõi nguyệt ở tiệm Bà Lam để mở Tơ Kép"
        for i in range(timeline.SPEAR_CORE_COST):
            var filled: bool = i < timeline.lunar_cores
            var corners := PackedVector2Array([Vector2(0, -10), Vector2(10, 0), Vector2(0, 10), Vector2(-10, 0)])
            var slot := Polygon2D.new()
            slot.position = Vector2(54 + i * 31, 475)
            slot.polygon = corners
            slot.color = AQUA if filled else Color("#132438")
            content.add_child(slot)
            var edge := Line2D.new()
            edge.points = corners
            edge.closed = true
            edge.width = 1.0
            edge.antialiased = true
            edge.default_color = AQUA if filled else Color("#889eb7")
            slot.add_child(edge)
        _label(content, Rect2(182, 451, 727, 23), "LÕI NGUYỆT   %d / 4     ·     Mảnh đồng   %d" % [timeline.lunar_cores, timeline.metal], 16, AQUA)
        _label(content, Rect2(182, 476, 727, 22), infusion, 15, TEXT)
    else:
        _label(content, Rect2(40, 451, 875, 23), "ẤN ƯU TIÊN · " + (game.arts.NAMES[favorite] if favorite >= 0 else "Theo ấn vừa dùng"), 16, AQUA)
        _label(content, Rect2(40, 476, 875, 22), "Nhấn F hoặc nút ẤN để dùng nhanh. Chọn ấn trong tab Kỹ năng.", 15, TEXT)

func _hero(rect: Rect2) -> void:
    _surface(content, rect)
    _picture(content, Art.portrait(game.character == "Kha"), rect.grow(-2))
    _surface(content, Rect2(rect.position + Vector2(1,1), Vector2(rect.size.x - 2, 64)), Color("#0a101acb"), Color.TRANSPARENT)
    var nameplate := _label(content, Rect2(rect.position + Vector2(12, 13), Vector2(216, 33)), game.character, 24, GOLD)
    nameplate.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    _surface(content, Rect2(rect.position + Vector2(14, 54), Vector2(212, 8)), Color("#2a1830"), Color("#a68b68"))
    _surface(content, Rect2(rect.position + Vector2(15, 55), Vector2(210 * float(game.health) / game.max_health, 6)), Color("#d36575"), Color.TRANSPARENT)

func _compare(y: float, name_text: String, values: Array, lower_better := false) -> void:
    var current: int = values[weapon]
    var target: int = values[selected_weapon]
    var benefit := target < current if lower_better else target > current
    _label(content, Rect2(619, y, 169, 30), name_text, 14, TEXT)
    var tint := TEXT if target == current else (AQUA if benefit else Color("#ff9e94"))
    _label(content, Rect2(796, y, 119, 30), "%d   >   %d" % [current, target], 15, tint)

func _select_weapon(index: int) -> void:
    selected_weapon = index
    show_page(0)

func _equip() -> void:
    if game.time_mode:
        var timeline: Node2D = game.sky.timeline
        if not timeline.owned[selected_weapon]: return
        timeline.equipped = selected_weapon
        timeline.reset_chain()
        game._persist()
    else:
        _choose_weapon(selected_weapon)
    show_page(0)

func _skills() -> void:
    _surface(content, Rect2(25, 81, 506, 338))
    _label(content, Rect2(42, 91, 470, 35), "SÁU ẤN KHÁM PHÁ", 18, GOLD)
    for i in range(6):
        var x := 42 + (i % 2) * 235
        var y := 132 + (i / 2) * 88
        var tile := _button(content, Rect2(x, y, 226, 78), "", _select_art.bind(i), i == selected_art)
        var icon := SixArts.RuneIcon.new()
        icon.index = i
        icon.tint = game.arts.COLORS[i]
        icon.position = Vector2(39, 32)
        icon.scale = Vector2.ONE * 1.35
        tile.add_child(icon)
        _label(tile, Rect2(73, 11, 148, 27), game.arts.NAMES[i], 17, icon.tint)
        _label(tile, Rect2(73, 42, 148, 21), "Phím %d%s" % [i + 1, " · Ưu tiên" if favorite == i else ""], 13, TEXT)
    _surface(content, Rect2(543, 81, 391, 338))
    _label(content, Rect2(561, 96, 350, 44), game.arts.NAMES[selected_art], 26, GOLD)
    _label(content, Rect2(561, 142, 350, 27), game.arts.USES[selected_art], 12, AQUA)
    _picture(content, SixArts.illustration(selected_art), Rect2(561, 174, 351, 104))
    _wrap(content, Rect2(561, 280, 355, 63), GUIDES[selected_art], 14, TEXT)
    var waiting: float = game.arts.cooldowns[selected_art]
    var ready_text := "Sẵn sàng" if waiting <= 0.0 else "Hồi %.1f s" % waiting
    var status := _label(content, Rect2(818, 146, 94, 22), ready_text, 13, AQUA)
    status.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
    var choice := _button(content, Rect2(561, 347, 218, 45), "Gán vào nút ẤN", _pin_art, true)
    choice.disabled = favorite == selected_art
    var clear := _button(content, Rect2(789, 347, 126, 45), "Bỏ ưu tiên", _clear_art)
    clear.disabled = favorite < 0
    _surface(content, Rect2(25, 432, 909, 79))
    _label(content, Rect2(40, 443, 875, 25), "F / ẤN   ·   Ưu tiên hồi nhanh hơn 20%", 16, AQUA)
    _label(content, Rect2(40, 475, 875, 22), "Phím 1–6 và sáu biểu tượng dưới màn chơi vẫn dùng trực tiếp.", 15, TEXT)

func _select_art(index: int) -> void:
    selected_art = index
    show_page(1)

func _pin_art() -> void:
    _choose_art(selected_art + 1)
    show_page(1)

func _clear_art() -> void:
    _choose_art(0)
    show_page(1)

func _journal() -> void:
    var time: bool = game.time_mode
    var timeline: Node2D = game.sky.timeline
    var region: int = game.atlas.current_region()
    var title: String = "Ngọn Đèn Chưa Tắt" if time else MapData.NAMES[region]
    _surface(content, Rect2(25, 81, 579, 430))
    var art := _picture(content, COAST if time or region == 6 else MOON, Rect2(26, 82, 577, 187))
    art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    _label(content, Rect2(46, 275, 538, 43), title, 25, GOLD)
    var tasks: Array
    if time:
        tasks = [[timeline.rescued, "Cứu Tín trong Hầm Dẫn Nước"], [timeline.core, "Lấy lõi đồng từ Thủ Vệ Đá ở Quá khứ"],
            [timeline.repaired, "Gia cố Cầu Đồng tại tiệm Bà Lam"], [timeline.lit, "Thắp Hải Đăng ở Tương lai"]]
    elif region < 3:
        tasks = [[game.trials.collected[region].count(true) == 2, "Thu hai mảnh ấn"],
            [game.trials.saved[region], "Nghỉ tại trụ trước đấu trường"],
            [game.trials.wins[region], "Hạ " + game.trials.BOSS_NAMES[region]],
            [game.trials.routes.claimed[region], "Khám phá di vật trên đường cao"]]
    else:
        var state: Dictionary = game.sky.progress[region - 3]
        tasks = [[state.checkpoint > 0, "Ghé trạm nghỉ"], [state.bell, "Rung chuông mở đường"],
            [state.relic, "Tìm di vật trên tuyến khám phá"], [state.won, "Qua cổng cuối của vùng"]]
    if region == 6 and not time:
        var coast: Dictionary = game.sky.progress[3]
        tasks = [[coast.clapper, "Dưới vách biển · nhặt lưỡi chuông đồng"],
            [coast.tide_awake, "Gọi ghe về · rung Chuông Triều bằng ấn 5"],
            [coast.relic and coast.bell, "Thu lõi đèn và đánh thức đài canh"],
            [coast.won, "Thắp sáng hải đăng"]]
    for i in tasks.size():
        _label(content, Rect2(48, 326 + i * 39, 535, 34), ("+   " if tasks[i][0] else "·   ") + tasks[i][1],
            16, AQUA if tasks[i][0] else TEXT)
    _surface(content, Rect2(616, 81, 318, 430))
    _label(content, Rect2(636, 98, 277, 28), "VỊ TRÍ HIỆN TẠI", 15, GOLD)
    var plot := AtlasPlot.new()
    plot.atlas = game.atlas
    plot.compact = true
    plot.region = region
    plot.era = game.atlas.current_era()
    plot.position = Vector2(628, 136)
    plot.size = Vector2(292, 148)
    content.add_child(plot)
    _wrap(content, Rect2(636, 303, 271, 58), MapData.names(region)[game.atlas.current_room()], 18, TEXT)
    _button(content, Rect2(637, 365, 274, 43), "Mở bản đồ vùng", func():
        _map()
        game.atlas.select_region(region)
    )
    _button(content, Rect2(637, 439, 274, 43), "Về màn chọn", game.trials.return_menu)

func _choose_weapon(index: int) -> void:
    weapon = index
    game._persist()

func _choose_art(index: int) -> void:
    favorite = index - 1
    game._persist()

func quick_art() -> int:
    return favorite if favorite >= 0 else game.arts.selected

func _weapon_icon(index: int) -> Texture2D:
    var crop := AtlasTexture.new()
    crop.atlas = ARMORY
    crop.region = Rect2(50 + (index % 4) * 398, 244 + (index / 4) * 320, 378, 164)
    crop.filter_clip = true
    return crop

func _style(fill: Color, line: Color) -> StyleBoxFlat:
    var style := StyleBoxFlat.new()
    style.bg_color = fill
    style.border_color = line
    style.set_border_width_all(1)
    style.set_corner_radius_all(5)
    return style

func _surface(parent: Node, rect: Rect2, fill := Color("#101a2ced"), line := Color("#74694e")) -> Panel:
    var surface := Panel.new()
    surface.position = rect.position
    surface.size = rect.size
    surface.mouse_filter = Control.MOUSE_FILTER_IGNORE
    surface.add_theme_stylebox_override("panel", _style(fill, line))
    parent.add_child(surface)
    return surface

func _button(parent: Node, rect: Rect2, title: String, action: Callable, emphasized := false) -> Button:
    var button := Button.new()
    button.position = rect.position
    button.size = rect.size
    button.text = title
    button.focus_mode = Control.FOCUS_NONE
    button.add_theme_font_size_override("font_size", 14)
    button.add_theme_stylebox_override("normal", _style(Color("#493926") if emphasized else Color("#111b2d"), GOLD if emphasized else Color("#67758d")))
    button.add_theme_stylebox_override("hover", _style(Color("#263651"), GOLD))
    button.add_theme_stylebox_override("pressed", _style(Color("#5d472a"), GOLD))
    button.add_theme_stylebox_override("disabled", _style(Color("#152033"), Color("#465670")))
    button.pressed.connect(action, CONNECT_DEFERRED)
    parent.add_child(button)
    return button

func _label(parent: Node, rect: Rect2, title: String, font_size: int, tint: Color) -> Label:
    var label := Label.new()
    label.position = rect.position
    label.size = rect.size
    label.text = title
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
    label.add_theme_color_override("font_color", tint)
    label.add_theme_font_size_override("font_size", font_size)
    parent.add_child(label)
    return label

func _wrap(parent: Node, rect: Rect2, title: String, font_size: int, tint: Color) -> void:
    var label := _label(parent, rect, "", font_size, tint)
    label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    label.text = title

func _picture(parent: Node, texture: Texture2D, rect: Rect2) -> TextureRect:
    var image := TextureRect.new()
    image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    image.texture = texture
    image.position = rect.position
    image.size = rect.size
    image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    image.mouse_filter = Control.MOUSE_FILTER_IGNORE
    parent.add_child(image)
    return image
