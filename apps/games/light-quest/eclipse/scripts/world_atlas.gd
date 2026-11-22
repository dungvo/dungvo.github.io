extends CanvasLayer
## One atlas for the story, chapter replays and the lighthouse's three eras.
const Atlas := preload("res://scripts/atlas_data.gd")
const GroundSurface := preload("res://scripts/ground_surface.gd")
const Plot := preload("res://scripts/atlas_plot.gd")
const COAST_ART := preload("res://assets/eclipse/open-moon-coast.webp")
const CAVERN_ART := preload("res://assets/eclipse/cistern-waterworks.webp")
const MOON_ART := preload("res://assets/eclipse/moon-tower.webp")
const GOLD := Color("#ecd5a2")
const RULE := Color("#938160")
var game: Node2D
var discovered := {}
var opener: Button
var minimap: Control
var overlay: Control
var plot: Control
var background: TextureRect
var heading: Label
var subheading: Label
var description: Label
var eras: HBoxContainer
var era_buttons: Array[Button] = []
var regions: Array[Button] = []
var atlas_button: Button
var transit_button: Button
var menu_tabs: HBoxContainer
var active_room := -1
var refresh_clock := 0.0

class LegendMark extends Control:
    var kind := 0
    var tint := Color.WHITE

    func _draw() -> void:
        match kind:
            0:
                draw_circle(Vector2.ZERO, 4, tint, true, -1.0, true)
            1:
                var points := PackedVector2Array([Vector2(0,-5), Vector2(5,0), Vector2(0,5), Vector2(-5,0), Vector2(0,-5)])
                draw_polyline(points, tint, 1.4, true)
            2:
                draw_arc(Vector2(0, -1), 5, 0, PI, 12, tint, 1.4, true)
                draw_line(Vector2(0, -5), Vector2(0, 4), tint, 1.4, true)
            3:
                draw_line(Vector2(-6, 0), Vector2(6, 0), tint, 2.5, true)
            4:
                draw_dashed_line(Vector2(-6, 0), Vector2(6, 0), tint, 1.5, 3.0, true, true)

func _ready() -> void:
    game = get_parent()
    layer = 18
    process_mode = Node.PROCESS_MODE_ALWAYS
    opener = _button(self, Rect2(808, 12, 130, 64), "", open)
    opener.tooltip_text = "Bản đồ · M"
    opener.hide()
    minimap = Plot.new()
    minimap.atlas = self
    minimap.compact = true
    minimap.region = 0
    minimap.position = Vector2(4, 2)
    minimap.size = Vector2(122, 53)
    opener.add_child(minimap)
    var emblem := _label(opener, Rect2(6, 48, 118, 15), "BẢN ĐỒ", 10, GOLD)
    emblem.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    overlay = Control.new()
    add_child(overlay)
    overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    overlay.mouse_filter = Control.MOUSE_FILTER_STOP
    _shade(overlay, Rect2(0, 0, 960, 540), Color("#070c18f6"))
    background = TextureRect.new()
    background.position = Vector2(10, 10)
    background.size = Vector2(940, 520)
    background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    background.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    background.mouse_filter = Control.MOUSE_FILTER_IGNORE
    background.modulate = Color("#a1a6c75c")
    overlay.add_child(background)
    _shade(overlay, Rect2(10, 10, 940, 520), Color("#0a1425a7"))
    _frame(Rect2(9, 9, 942, 522), Color("#a08a60"))
    _frame(Rect2(14, 14, 932, 512), Color("#70664e"))
    _label(overlay, Rect2(27, 22, 310, 40), "BẢN ĐỒ KHÁM PHÁ", 25, GOLD)
    heading = _label(overlay, Rect2(190, 70, 574, 30), "", 22, GOLD)
    subheading = _label(overlay, Rect2(191, 102, 714, 23), "", 13, Color("#bac8e2"))
    _shade(overlay, Rect2(28, 63, 903, 1), RULE)
    _shade(overlay, Rect2(171, 76, 1, 405), RULE.darkened(0.32))
    _label(overlay, Rect2(29, 72, 136, 24), "CÁC VÙNG", 13, GOLD)
    for index in Atlas.NAMES.size():
        var button := _button(overlay, Rect2(26, 99 + index * 39, 137, 34), Atlas.NAMES[index], select_region.bind(index))
        button.alignment = HORIZONTAL_ALIGNMENT_LEFT
        button.add_theme_font_size_override("font_size", 11 if index in [6,7] else 13)
        button.add_theme_color_override("font_color", Color(Atlas.COLORS[index]))
        regions.append(button)
    atlas_button = _button(overlay, Rect2(26, 426, 137, 36), "Toàn cảnh", select_region.bind(-1))
    _button(overlay, Rect2(26, 468, 137, 36), "Vị trí của tôi", _locate_player)
    menu_tabs = HBoxContainer.new()
    menu_tabs.position = Vector2(432, 27)
    menu_tabs.add_theme_constant_override("separation", 7)
    overlay.add_child(menu_tabs)
    _button(menu_tabs, Rect2(0, 0, 91, 30), "Trang bị", _open_menu.bind(0))
    _button(menu_tabs, Rect2(0, 0, 91, 30), "Kỹ năng", _open_menu.bind(1))
    _button(menu_tabs, Rect2(0, 0, 91, 30), "Nhật ký", _open_menu.bind(2))
    _button(overlay, Rect2(852, 27, 79, 30), "Đóng · Esc", close)
    _button(overlay, Rect2(730, 27, 35, 30), "−", _zoom.bind(-0.25))
    _button(overlay, Rect2(769, 27, 35, 30), "+", _zoom.bind(0.25))
    _button(overlay, Rect2(808, 27, 40, 30), "1:1", func(): plot.reset_view())
    plot = Plot.new()
    plot.atlas = self
    plot.position = Vector2(185, 124)
    plot.size = Vector2(742, 332)
    overlay.add_child(plot)
    eras = HBoxContainer.new()
    eras.position = Vector2(625, 77)
    eras.add_theme_constant_override("separation", 6)
    overlay.add_child(eras)
    for era in Atlas.ERAS.size():
        var button := _button(eras, Rect2(0, 0, 96, 30), Atlas.ERAS[era], select_era.bind(era))
        era_buttons.append(button)
    _shade(overlay, Rect2(186, 461, 741, 1), RULE.darkened(0.20))
    description = _label(overlay, Rect2(189, 462, 730, 29), "", 13, Color("#f2e9d5"))
    description.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
    transit_button = _button(overlay, Rect2(736, 465, 186, 29), "", _use_anchor)
    var legend := [
        [191, "Vị trí hiện tại", GOLD], [326, "Điểm nghỉ", Plot.AQUA], [443, "Móc dây", Plot.AQUA],
        [555, "Cửa / lối khóa", Plot.LOCK], [713, "Chưa khảo sát", Color("#b9c6df")]
    ]
    for i in legend.size():
        var item: Array = legend[i]
        var mark := LegendMark.new()
        mark.kind = i
        mark.tint = item[2]
        mark.position = Vector2(item[0] + 5, 506)
        mark.mouse_filter = Control.MOUSE_FILTER_IGNORE
        overlay.add_child(mark)
        _label(overlay, Rect2(item[0] + 16, 495, 120, 21), item[1], 12, item[2])
    overlay.hide()

func _button(parent: Node, rect: Rect2, title: String, action: Callable) -> Button:
    var button := Button.new()
    button.position = rect.position
    button.size = rect.size
    button.custom_minimum_size = rect.size
    button.text = title
    button.focus_mode = Control.FOCUS_NONE
    button.add_theme_font_size_override("font_size", 13)
    for state in ["normal", "hover", "pressed", "disabled"]:
        var style := StyleBoxFlat.new()
        style.bg_color = Color("#111c32ec") if state == "normal" else Color("#293755ed")
        style.border_color = Color("#b29b71") if state in ["hover", "pressed"] else Color("#6c7d98")
        style.set_border_width_all(1)
        style.set_corner_radius_all(4)
        style.content_margin_left = 7
        style.content_margin_right = 7
        button.add_theme_stylebox_override(state, style)
    button.pressed.connect(action, CONNECT_DEFERRED)
    parent.add_child(button)
    return button

func _label(parent: Node, rect: Rect2, title: String, size_pt: int, color: Color) -> Label:
    var label := Label.new()
    label.position = rect.position
    label.size = rect.size
    label.text = title
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", size_pt)
    label.add_theme_color_override("font_color", color)
    parent.add_child(label)
    return label

func _shade(parent: Control, rect: Rect2, color: Color) -> void:
    var wash := ColorRect.new()
    wash.position = rect.position
    wash.size = rect.size
    wash.color = color
    wash.mouse_filter = Control.MOUSE_FILTER_IGNORE
    parent.add_child(wash)

func _frame(rect: Rect2, color: Color) -> void:
    var window := Panel.new()
    window.position = rect.position
    window.size = rect.size
    window.mouse_filter = Control.MOUSE_FILTER_IGNORE
    var style := StyleBoxFlat.new()
    style.draw_center = false
    style.set_border_width_all(1)
    style.set_corner_radius_all(8)
    style.border_color = color
    window.add_theme_stylebox_override("panel", style)
    overlay.add_child(window)

func _input(event: InputEvent) -> void:
    if not event is InputEventKey or not event.pressed or event.echo: return
    if event.keycode == KEY_M or (overlay.visible and event.is_action_pressed("ui_cancel")):
        if overlay.visible: close()
        elif can_open(): open()
        else: return
        get_viewport().set_input_as_handled()

func _process(delta: float) -> void:
    if not is_instance_valid(game.sky): return
    opener.visible = can_open() and not overlay.visible
    refresh_clock -= delta
    if refresh_clock > 0.0 or not opener.visible: return
    refresh_clock = 0.10
    survey()
    minimap.region = current_region()
    minimap.era = current_era()
    minimap.queue_redraw()

func can_open() -> bool:
    return game.started and not game.dialogue.visible and not game.victory_panel.visible and not game.loadout.panel.visible and not game.sky.timeline.panel.visible and game.death_time <= 0

func open() -> void:
    if overlay.visible or not can_open(): return
    game._reset_touch()
    game.attack_buffer = 0
    game.jump_buffer_clock = 0
    game.joystick.accept_touch = false
    survey()
    overlay.show()
    opener.hide()
    get_tree().paused = true
    plot.era = current_era()
    select_region(current_region() if game.time_mode else -1)

func close() -> void:
    if not overlay.visible: return
    overlay.hide()
    get_tree().paused = false
    if game.started and not game.dialogue.visible: game.joystick.accept_touch = true

func _locate_player() -> void:
    plot.era = current_era()
    select_region(current_region())

func _open_menu(page: int) -> void:
    close()
    game.loadout.open(page)

func _use_anchor() -> void:
    var timeline: Node2D = game.sky.timeline
    var destination: Vector2 = timeline.atlas_destination()
    if destination == Vector2.INF: return
    close()
    timeline.use_atlas_anchor(destination)
    survey()

func _zoom(amount: float) -> void:
    plot.magnify(amount, plot.size * 0.5)

func select_region(region: int) -> void:
    if region >= 0 and not region_visible(region): return
    plot.region = region
    active_room = -1
    plot.reset_view()
    _refresh_text()

func select_era(era: int) -> void:
    plot.era = era
    active_room = -1
    _refresh_text()
    plot.queue_redraw()

func select_room(room: int) -> void:
    active_room = room
    _refresh_text()

func _refresh_text() -> void:
    var region: int = plot.region
    var atlas_era: int = plot.era
    eras.visible = region == 7
    var timeline: Node2D = game.sky.timeline
    var destination: Vector2 = timeline.atlas_destination() if region == 7 and atlas_era == current_era() else Vector2.INF
    transit_button.visible = destination != Vector2.INF
    if transit_button.visible:
        transit_button.text = "Dịch chuyển · " + ("Đài Canh" if destination == timeline.WATCH_STOP else "Bờ Đá")
    description.size.x = 540 if transit_button.visible else 730
    for i in era_buttons.size():
        era_buttons[i].modulate = GOLD if i == atlas_era else Color.WHITE
    for i in regions.size():
        regions[i].visible = i < 7 or not game.story_mode
        regions[i].disabled = not region_visible(i)
        var count := 0
        for room in Atlas.names(i).size():
            if discovered.has(Atlas.key(i, room, atlas_era)): count += 1
        regions[i].text = "%s  %d/%d" % [Atlas.NAMES[i], count, Atlas.names(i).size()] if i < 7 else Atlas.NAMES[i]
        regions[i].modulate = GOLD if i == region else (Color("#b9bbcd") if regions[i].disabled else Color.WHITE)
    atlas_button.modulate = GOLD if region == -1 else Color.WHITE
    background.texture = CAVERN_ART if region == 2 else (COAST_ART if region >= 6 else MOON_ART)
    background.modulate = [Color("#deb78b6b"), Color("#a1a6c76b"), Color("#c098d06b")][atlas_era] if region == 7 else Color("#a1a6c75c")
    heading.text = "Địa đồ Nguyệt Thực" if region < 0 else Atlas.NAMES[region]
    var here := "%s / %s" % [Atlas.NAMES[current_region()], Atlas.names(current_region())[current_room()]]
    subheading.text = "%s%s" % [here, (" · " + Atlas.ERAS[current_era()]) if game.time_mode else ""]
    if region == 7 and not game.time_mode:
        subheading.text = "Mở Cỗ Máy Thời Gian ở màn vào game để đến Bờ Đá"
    elif region == 7 and atlas_era != current_era():
        subheading.text = "Đang xem %s · đổi thời đại tại Cỗ Máy ở Bờ Đá" % Atlas.ERAS[atlas_era]
    if region < 0:
        var seen := 0
        for i in range(7):
            for room in Atlas.names(i).size():
                if discovered.has(Atlas.key(i, room, 0)): seen += 1
        description.text = "%d / 28 khu đã ghé   ·   %s" % [seen, "Chạm vùng đã ghé để xem địa hình" if game.story_mode else "Các màn luyện tập"]
        return
    var messages := PackedStringArray()
    for link in Atlas.links(region, atlas_era, repaired()):
        if active_room >= 0 and active_room not in [link[0], link[1]]: continue
        var reason := gate(region, link[2], atlas_era)
        if not reason.is_empty() and reason not in messages: messages.append(reason)
    if active_room == 3 and region >= 0 and region < 6:
        var locked := gate(region, "exit", atlas_era)
        description.text = "Cổng sang %s · %s" % [Atlas.NAMES[region + 1], "Đã mở" if locked.is_empty() else locked]
    elif active_room == 4 and region == 7:
        description.text = "Hầm Dẫn Nước · Luồn khe để xuống, gặp Tín để mở cửa lên"
    elif active_room >= 0:
        var known := discovered.has(Atlas.key(region, active_room, atlas_era))
        var label: String = Atlas.names(region)[active_room]
        description.text = label + " · " + (messages[0] if not messages.is_empty() else ("Đã ghé" if known else "Chưa ghé"))
    elif region == 7 and atlas_era == 2 and not repaired():
        description.text = "Cầu Đồng đã gãy · Đi lối dưới cầu với Bướm Đèn, hoặc gia cố cầu ở Quá khứ"
    elif not messages.is_empty():
        description.text = messages[0] + "   ·   Chạm khu để xem lối nối"
    else:
        description.text = "Chạm một khu để xem lối nối   ·   Dùng + và kéo để xem gần"

func room_visible(region: int, room: int, era: int) -> bool:
    return not game.story_mode or discovered.has(Atlas.key(region, room, era)) or (region == current_region() and room == current_room())

func region_visible(region: int) -> bool:
    if not game.story_mode: return true
    if region == 7: return false
    for room in Atlas.names(region).size():
        if room_visible(region, room, 0): return true
    return false

func current_region() -> int:
    return 7 if game.time_mode else game.current_trial

func current_era() -> int:
    return game.sky.timeline.era

func repaired() -> bool:
    return game.sky.timeline.repaired

func local_position() -> Vector2:
    var at: Vector2 = game.hero.position
    var region := current_region()
    at.x -= region * 1920.0 if region < 3 else float(game.sky.origin)
    if region == 4: at.x = game.sky.WIDTH - at.x
    return at

func current_room() -> int:
    return Atlas.locate(current_region(), local_position(), current_era(), repaired())

func survey() -> void:
    var region := current_region()
    var room := current_room()
    var exact: Rect2 = Atlas.bounds(region)[room]
    if not exact.has_point(local_position()): return
    var key := Atlas.key(region, room, current_era())
    if discovered.has(key): return
    discovered[key] = true
    game._persist()

func restore(data: Variant) -> void:
    if not data is Array: return
    for region in Atlas.NAMES.size():
        for room in Atlas.names(region).size():
            for era in (range(3) if region == 7 else range(1)):
                var key := Atlas.key(region, room, era)
                if key in data: discovered[key] = true

func gate(region: int, kind: String, era: int) -> String:
    if kind.is_empty(): return ""
    var timeline: Node2D = game.sky.timeline
    if region == 7:
        if kind == "moth" and era == 2 and timeline.companion != 1:
            return "Dùng Bướm Đèn để bắc lối dưới cầu"
        return ""
    if region < 3:
        if kind == "wind" and not game.trials.routes.air_step_unlocked: return "Học Bước Gió tại đền xanh"
        if kind == "seal" and not game.trials.routes.opened[region]: return "Dùng Q phá ấn trên đường cao"
        if kind == "exit" and not game.trials.wins[region]: return "Hạ người giữ cổng"
        if kind == "sigils":
            if region == current_region() and game.trials.arena_locked and not game.trials.wins[region]:
                return "Đấu trường đã đóng · Hạ boss để mở lại"
            if (not game.trials.wins[region] or not game.story_mode) and (game.trials.collected[region].count(true) < 2 or (region == 0 and not game.met_npc)):
                return "Thu hai mảnh ấn" if region != 0 or game.met_npc else "Gặp Thợ Lưu Giữ và thu hai mảnh ấn"
        return ""
    var state: Dictionary = game.sky.progress[region - 3]
    match kind:
        "exit":
            if not state.won: return "Hạ Thủ Hộ rồi tương tác với cổng đỉnh"
        "crystal":
            if not state.crystal: return "Dùng 1 · Phá Tinh mở lối leo"
        "bell":
            if not state.sight: return "Dùng 4 · Nguyệt Nhãn hiện bệ"
            if not state.bell: return "Dùng 5 · Chuông Vọng mở cửa tầng mây"
        "relic":
            if not state.bell or not state.relic: return "Rung chuông và dùng 6 để lấy di vật dưới sàn"
        "coast1":
            if state.checkpoint < 1: return "Tương tác trụ trước Hầm Vòm"
        "coast2":
            if state.checkpoint < 2: return "Tương tác trụ trước Đài Canh"
        "warden":
            if region == current_region() and game.sky.active and game.sky.coast_doors.size() > 2:
                var door = game.sky.coast_doors[2]
                if not is_instance_valid(door) or door.collision_layer == 0: return ""
            elif state.won or state.guardian_down: return ""
            return "Hạ Vệ Binh rồi mở cửa Sân Hải Đăng"
    return ""

func terrain(index: int, room: int, era: int) -> Array[Rect2]:
    var result: Array[Rect2] = []
    if index != current_region() or (index == 7 and era != current_era()): return result
    var surfaces: Array = []
    if game.sky.active:
        surfaces = game.sky.root.get_children()
    else:
        surfaces.append_array(game.scenery.play_surfaces)
        if is_instance_valid(game.trials.routes.root):
            surfaces.append_array(game.trials.routes.root.get_children())
    var room_bounds: Rect2 = Atlas.bounds(index)[room]
    for surface in surfaces:
        if not surface is GroundSurface or not is_instance_valid(surface.collider): continue
        if surface.collider.collision_layer == 0: continue
        var lip: Rect2 = surface.lip()
        lip.position.x -= float(game.sky.origin) if game.sky.active else index * 1920.0
        if index == 4: lip.position.x = game.sky.WIDTH - lip.end.x
        var segment := lip.intersection(room_bounds)
        if segment.has_area(): result.append(segment)
    return result

func pins(region: int, era: int) -> Array:
    var points := []
    if region < 3:
        points.append({"at": Vector2(1010, 432), "kind": "rest", "live": game.trials.saved[region]})
    elif region < 7:
        var coast := region == 6
        var state: Dictionary = game.sky.progress[region - 3]
        var stations := [Vector2(1280, 226), Vector2(2460, 106)] if coast else [Vector2(875, -144), Vector2(650, -1244)]
        for i in stations.size():
            var live: bool = state.checkpoint >= i + 1 if coast else state.checkpoint == i + 1
            points.append({"at": stations[i], "kind": "rest", "live": live})
    else:
        var timeline: Node2D = game.sky.timeline
        points.append({"at": timeline.MACHINE_STOP, "kind": "rest", "live": true})
        points.append({"at": timeline.WATCH_STOP, "kind": "rest", "live": timeline.rested[era]})
    if region == current_region() and (region != 7 or era == current_era()):
        for pin in game.sky.anchors if game.sky.active else []:
            var local: Vector2 = pin - Vector2(game.sky.origin, 0)
            if region == 4: local.x = game.sky.WIDTH - local.x
            points.append({"at": local, "kind": "hook", "live": true})
    elif region == 7:
        for at in [Vector2(1070, 281), Vector2(2125, 310)]:
            points.append({"at": at, "kind": "hook", "live": true})
        if era == 2: points.append({"at": Vector2(2290, 174), "kind": "hook", "live": true})
    return points
