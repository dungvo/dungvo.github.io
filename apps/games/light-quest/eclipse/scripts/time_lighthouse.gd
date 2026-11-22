extends Node2D
## The lighthouse map retains its landmarks across all three eras.
const ERAS := ["Quá khứ","Hiện tại","Tương lai"]
const SHADES := [Color("#ffd9ab"),Color("#a9ceff"),Color("#d5a4ff")]
const WEAPONS := ["Nguyệt Kiếm","Thương Tơ","Búa Tinh Thạch","Song Đao","Cung Vọng","Trượng Dư Âm","Khiên Nhật Thực","Liềm Tàn Giờ"]
const TECHS := ["Trăng Vỡ · quét sáng phía trước","Xuyên Vực · kéo tới móc vàng hoặc đâm xa","Địa Chấn · chấn động và phá tường nứt",
    "Giao Ảnh · lướt và chém hai nhát giao nhau","Tên Hồi Âm · nảy một lần, kích ấn phản xạ",
    "Vọng Ảnh · bóng lặp đòn tại chỗ sau một nhịp","Nhật Hộ · chặn một đòn trong hai giây",
    "Tàn Khắc · làm chậm kẻ địch và bẫy trong vùng tím"]
const MAP_WIDTH := 2600.0
const MACHINE_STOP := Vector2(150,432)
const WATCH_STOP := Vector2(1190,432)
const SPEAR := 1
const SPEAR_CORE_COST := 4
const CORE_CISTERN := 1
const CORE_GUARDIAN := 2
const CORE_PRESENT := 4
const CORE_FUTURE := 8
const CORE_AWARDS := CORE_CISTERN | CORE_GUARDIAN | CORE_PRESENT | CORE_FUTURE
const TECH_REACH := [115,210,100,80,0,120,0,150]
var sky: Node2D
var game: Node2D
var era := 1
var core := false
var repaired := false
var lit := false
const FAMILIARS := preload("res://assets/eclipse/moon-familiars.webp")
const FAMILIAR_NAMES := ["Cáo Dẫn Đường", "Bướm Đèn", "Quạ Bóng", "Hươu Sương"]
const GIFTS := ["Dẫn đến kho đồng gần nhất", "Soi lối dưới cầu gãy", "Mổ quái trong tầm nhìn", "Hồi máu khi xung quanh yên"]
var companion := 0
var familiar_clock := 0.0
var familiar_target := Vector2.INF
var familiar_glow := 0.0
var owned := [true,false,false,false,false,false,false,false]
const CACHES := [Vector2(575,432),Vector2(1910,432),Vector2(520,432),Vector2(1200,432),Vector2(590,432),Vector2(2395,432)]
const CACHE_ERAS := [0,0,1,1,2,2]
var claimed := [false,false,false,false,false,false]
var echo := 0.0
var echo_origin := Vector2.ZERO
var echo_facing := 1
var echo_weapon := 3
var barrier_time := 0.0
var slow_time := 0.0
var slow_origin := Vector2.ZERO
var trap_clock := 0.0
var switch_open := false
var catalog_page := 0
var equipped := 0
var defeated := [false,false,false]
var metal := 0
var lunar_cores := 0
var lunar_awards := 0
var spear_infused := false
var chain_left := 0.0
var first_anchor := Vector2.INF
var cooldown := 0.0
var flare := 0.0
var flare_origin := Vector2.ZERO
var flare_direction := 1
var mode := ""
var indoors := false
var ui: CanvasLayer
var panel: PanelContainer
var dimmer: ColorRect
var forge_scene: TextureRect
var base_panel: StyleBoxFlat
var forge_panel: StyleBoxFlat
var heading: Label
var copy: Label
var options: VBoxContainer
var tech_button: Button
var hidden_platform: PhysicsBody2D
var breakable: PhysicsBody2D
var underground := false
var shaft_cover: PhysicsBody2D
var dropping := false
var rescued := false
var rested := [false, false, false]
var portrait := preload("res://assets/eclipse/forge-portrait.webp")
var weapon_atlas := preload("res://assets/eclipse/forge-weapons.webp")
const SkillPreview := preload("res://scripts/forge_card.gd")
const SHORE := preload("res://assets/eclipse/open-moon-coast.webp")
const CISTERN := preload("res://assets/eclipse/cistern-waterworks.webp")
const FORGE := preload("res://assets/eclipse/forge-interior.webp")


func _ready() -> void:
    z_index = 6
    sky = get_parent()
    game = sky.get_parent()
    ui = CanvasLayer.new()
    ui.layer = 14
    add_child(ui)
    tech_button = Button.new()
    tech_button.position = Vector2(640,92)
    tech_button.size = Vector2(154,36)
    tech_button.focus_mode = Control.FOCUS_NONE
    tech_button.pressed.connect(cast)
    ui.add_child(tech_button)
    forge_scene = TextureRect.new()
    forge_scene.texture = FORGE
    forge_scene.size = Vector2(960,540)
    forge_scene.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    forge_scene.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    forge_scene.mouse_filter = Control.MOUSE_FILTER_IGNORE
    forge_scene.hide()
    ui.add_child(forge_scene)
    dimmer = ColorRect.new()
    dimmer.color = Color("#060b17a0")
    dimmer.size = Vector2(960,540)
    dimmer.mouse_filter = Control.MOUSE_FILTER_STOP
    dimmer.hide()
    ui.add_child(dimmer)
    panel = PanelContainer.new()
    panel.position = Vector2(203,82)
    panel.custom_minimum_size = Vector2(554,340)
    base_panel = game._panel_style()
    forge_panel = base_panel.duplicate()
    forge_panel.bg_color = Color("#0e1523d9")
    forge_panel.border_color = Color("#e1b77e")
    panel.add_theme_stylebox_override("panel",base_panel)
    ui.add_child(panel)
    var content := VBoxContainer.new()
    content.add_theme_constant_override("separation",8)
    panel.add_child(content)
    heading = Label.new()
    heading.add_theme_font_size_override("font_size",22)
    content.add_child(heading)
    copy = Label.new()
    copy.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    content.add_child(copy)
    options = VBoxContainer.new()
    content.add_child(options)
    ui.hide()
    panel.hide()

func build() -> void:
    close()
    ui.show()
    indoors = false
    underground = false
    dropping = false
    sky.boss = null
    cooldown = 0
    reset_chain()
    flare = 0
    echo = 0
    barrier_time = 0
    slow_time = 0
    trap_clock = 0
    familiar_clock = 0
    familiar_target = Vector2.INF
    familiar_glow = 0
    hidden_platform = null
    breakable = null
    for rect in [Rect2(0,456,650,40),Rect2(716,456,14,40),Rect2(1130,456,820,40),Rect2(2040,456,560,40)]:
        sky._platform(rect,false)
    shaft_cover = sky._platform(Rect2(650,456,66,16))
    shaft_cover.get_meta("art").modulate = Color("#6786a4a0")
    # Low crawl slot leads to a physically connected shaft with a broad landing.
    sky._wall(Rect2(580,321,70,104))
    sky._detail(0,Vector2(615,425),Vector2(76,106))
    sky._detail(0,Vector2(602,373),Vector2(101,60))
    sky._platform(Rect2(300,700,470,60),false)
    sky._wall(Rect2(286,523,14,237))
    sky._wall(Rect2(770,556,18,204))
    sky._platform(Rect2(309,628,160,20),true,false,true)
    sky._marker("shaft",Vector2(672,456),"↓ · Luồn qua và xuống hầm",2)
    sky._marker("cistern",Vector2(441,700),"E · Cứu Tín / mở lối lên",2)
    sky._detail(7,Vector2(361,700),Vector2(88,125))
    _npc(Vector2(442,673))
    if era != 2 or repaired:
        sky._platform(Rect2(730,456,400,32),false)
        for x in [749,1112]: sky._detail(0,Vector2(x,540),Vector2(45,84))
    else:
        sky._platform(Rect2(745,538,133,24))
        sky._platform(Rect2(958,513,172,24))
        hidden_platform = sky._platform(Rect2(868,528,100,24))
        hidden_platform.collision_layer = 0
        hidden_platform.get_meta("art").hide()
    sky._platform(Rect2(1940,420,108,20),true,false,true)
    sky._anchor(Vector2(1070,281))
    sky._anchor(Vector2(2125,310))
    if era == 2:
        sky._anchor(Vector2(2290,174))
        sky._platform(Rect2(2250,253,166,18))
        sky._marker("spear_anchors",Vector2(2115,456),"Hai neo · Thương Tơ / Tơ Kép",2)
    sky._marker("time_machine",Vector2(150,456),"E · Cỗ máy thời gian",2)
    sky._marker("time_forge",Vector2(420,456),"E · Vào tiệm Bà Lam" if era == 0 else "E · Hỏi Tín",2)
    sky._marker("time_rest",Vector2(1190,456),"E · Nghỉ / lưu điểm",4)
    if era == 2: sky._marker("time_goal",Vector2(2470,456),"E · Thắp hải đăng",2)
    for index in CACHES.size():
        if CACHE_ERAS[index] != era or claimed[index]: continue
        var at: Vector2 = CACHES[index]+Vector2(0,24)
        sky._marker("metal_"+str(index),at,"E · Mảnh đồng",0)
        sky._detail(9,at,Vector2(42,34))
    if era == 2:
        sky._marker("reflector",Vector2(1430,456),"Gương đồng · đứng bên trái, bắn ngang",2)
    if era == 1: _npc(Vector2(467,426))
    sky._detail(7,Vector2(150,456),Vector2(115,150))
    sky._detail(7,Vector2(420,456),Vector2(110,141))
    sky._detail(5,Vector2(1190,456),Vector2(47,68))
    sky._detail(7,Vector2(2470,456),Vector2(130,185))
    if era == 0:
        sky._platform(Rect2(2800,456,960,48),false)
        sky._detail(7,Vector2(2900,456),Vector2(90,126))
        _npc(Vector2(3320,426))
        sky._marker("time_exit",Vector2(2900,456),"E · Ra khỏi tiệm",2)
        sky._marker("time_smith",Vector2(3320,456),"E · Bà Lam",2)
        sky._detail(9,Vector2(3410,456),Vector2(48,46))
        sky._detail(5,Vector2(510,456),Vector2(56,92))
        sky._enemy("golem",Vector2(1360,432))
    elif era == 1:
        sky._enemy("bat",Vector2(1420,340))
        sky._enemy("bat",Vector2(1740,325))
    if era == 2:
        sky._enemy("mage",Vector2(1700,425))
        breakable = sky._wall(Rect2(2200,371,18,85))
    if era != 1 and not defeated[era]:
        var guardian = sky.Boss.new()
        guardian.trial = 0 if era == 0 else 2
        guardian.title = "Thủ Vệ Đá" if era == 0 else "Vệ Binh Mắt Đèn"
        guardian.max_hp = 12 if era == 0 else 20
        # Both variants use the guardian atlas and collision profile.
        guardian.kind = "guardian"
        guardian.position = sky.point(Vector2(1550,456-guardian.SIZES.guardian.y*0.5-2))
        guardian.arena = Vector2(sky.origin+1270,sky.origin+1880)
        sky.root.add_child(guardian)
        game.enemies.append(guardian)
        sky.boss = guardian

func update_drop(low: bool) -> void:
    if not is_instance_valid(shaft_cover): return
    var local_x: float = game.hero.position.x-sky.origin
    if not dropping and low and local_x > 659 and local_x < 705 and game.hero.position.y > 413 and game.hero.position.y < 453:
        game.hero.add_collision_exception_with(shaft_cover)
        game.hero.velocity.x = 0
        game.hero.velocity.y = 85
        dropping = true
    elif dropping and (game.hero.position.y > 564 or local_x < 645 or local_x > 722):
        game.hero.remove_collision_exception_with(shaft_cover)
        dropping = false

func _npc(at: Vector2) -> void:
    var sprite := Sprite2D.new()
    sprite.texture = preload("res://assets/eclipse/keeper.webp")
    sprite.position = sky.point(at)
    sprite.scale = Vector2.ONE*(61.0/sprite.texture.get_height())
    sprite.z_index = 4
    sky.root.add_child(sprite)

func active() -> bool:
    return game.time_mode and sky.active

func hide_ui() -> void:
    ui.hide()
    panel.hide()
    forge_scene.hide()
    dimmer.hide()
    mode = ""
    queue_redraw()

func close() -> void:
    panel.hide()
    forge_scene.hide()
    dimmer.hide()
    mode = ""
    if game.started and not game.dialogue.visible: game.joystick.accept_touch = true

func _choice(title: String, action: Callable) -> void:
    var button := Button.new()
    button.text = title
    button.custom_minimum_size.y = 31
    button.pressed.connect(action,CONNECT_DEFERRED)
    options.add_child(button)

func _open(which: String) -> void:
    mode = which
    var wide := which in ["forge","item"]
    var shop := which == "forge"
    forge_scene.visible = shop
    dimmer.color = Color("#10101535") if shop else Color("#060b17a0")
    panel.add_theme_stylebox_override("panel",forge_panel if shop else base_panel)
    panel.position = Vector2(27,23) if shop else (Vector2(46,52) if wide else Vector2(203,82))
    panel.custom_minimum_size = Vector2(906,494) if shop else (Vector2(868,420) if wide else Vector2(554,340))
    heading.modulate = Color.WHITE
    copy.show()
    panel.call_deferred("reset_size")
    dimmer.show()
    panel.show()
    game._reset_touch()
    game.joystick.accept_touch = false
    for child in options.get_children():
        options.remove_child(child)
        child.queue_free()

func machine() -> void:
    _open("machine")
    heading.text = "CỖ MÁY THỜI GIAN · " + ERAS[era]
    copy.text = "Cùng một cây cầu, ba thời đại.\nViệc đã làm ở quá khứ sẽ hiện ở hai thời đại sau."
    for index in range(3):
        var destination := index
        _choice(ERAS[index]+(" · đang ở đây" if index == era else ""),func(): travel(destination))
    _choice("Đồng hành", choose_familiar)
    _choice("Đóng",close)

func _familiar_crop(index: int) -> AtlasTexture:
    var extent := FAMILIARS.get_size() * 0.5
    return _crop(FAMILIARS, Rect2(Vector2(index % 2, index / 2) * extent, extent))

func choose_familiar() -> void:
    _open("familiar")
    heading.text = "ĐỒNG HÀNH"
    copy.text = FAMILIAR_NAMES[companion] + "  ·  " + GIFTS[companion]
    var row := HBoxContainer.new()
    options.add_child(row)
    for i in range(4):
        var card := _button(row, FAMILIAR_NAMES[i], equip_familiar.bind(i))
        card.custom_minimum_size = Vector2(119, 125)
        card.icon = _familiar_crop(i)
        card.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
        card.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
        card.expand_icon = true
        card.add_theme_font_size_override("font_size", 13)
        if i == companion: _emphasize(card)
    _choice("Tiếp tục", close)

func equip_familiar(index: int) -> void:
    if index < 0 or index >= FAMILIAR_NAMES.size(): return
    if index != companion:
        companion = index
        familiar_clock = 0
        familiar_target = Vector2.INF
        familiar_glow = 0
        game._persist()
    choose_familiar()

func travel(destination: int) -> void:
    close()
    if era == destination: return
    era = destination
    game._persist()
    sky.begin(3)
    game._show_dialogue(false)
    game.sound.play_cue("phase")
    game.emit_impact(game.hero.position,SHADES[era])

func forge() -> void:
    catalog_page = 0
    show_catalog()

func _crop(texture: Texture2D, rect: Rect2) -> AtlasTexture:
    var region := AtlasTexture.new()
    region.atlas = texture
    region.region = rect
    return region

func _weapon_icon(item: int) -> AtlasTexture:
    return _crop(weapon_atlas,Rect2(50+(item%4)*398,244+(item/4)*320,378,164))

func _button(parent: Control, title: String, callback: Callable) -> Button:
    var button := Button.new()
    button.text = title
    button.custom_minimum_size.y = 34
    button.pressed.connect(callback,CONNECT_DEFERRED)
    parent.add_child(button)
    return button

func _emphasize(button: Button) -> void:
    var style := StyleBoxFlat.new()
    style.bg_color = Color("#523b28")
    style.border_color = Color("#efbe75")
    style.set_corner_radius_all(5)
    style.set_border_width_all(1)
    style.content_margin_left = 12
    style.content_margin_right = 12
    button.add_theme_stylebox_override("normal",style)

func award_lunar_core(source: int) -> bool:
    if (lunar_awards & source) != 0: return false
    lunar_awards |= source
    lunar_cores += 1
    return true

func infuse_spear() -> bool:
    if not active() or not indoors or mode != "forge": return false
    if not owned[SPEAR] or spear_infused or lunar_cores < SPEAR_CORE_COST: return false
    lunar_cores -= SPEAR_CORE_COST
    spear_infused = true
    game.sound.play_cue("phase")
    game._persist()
    return true

func reset_chain() -> void:
    chain_left = 0.0
    first_anchor = Vector2.INF

func show_catalog() -> void:
    inspect_weapon(catalog_page*6)

func inspect_weapon(item: int) -> void:
    _open("forge")
    heading.text = "TIỆM RÈN BÀ LAM"
    heading.modulate = Color("#ffdda4")
    copy.text = "Mảnh đồng  %d    |    Lõi nguyệt  %d" % [metal,lunar_cores]
    var row := HBoxContainer.new()
    row.add_theme_constant_override("separation",12)
    options.add_child(row)
    var face := TextureRect.new()
    face.texture = _crop(portrait,Rect2(25,150,366,580))
    face.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    face.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    face.custom_minimum_size = Vector2(176,244)
    row.add_child(face)
    var catalog := GridContainer.new()
    catalog.columns = 3
    catalog.add_theme_constant_override("h_separation",6)
    catalog.add_theme_constant_override("v_separation",7)
    row.add_child(catalog)
    for index in range(catalog_page*6,mini(catalog_page*6+6,WEAPONS.size())):
        var choice := index
        var card := _button(catalog,"",func(): inspect_weapon(choice))
        card.custom_minimum_size = Vector2(95,104)
        var style := StyleBoxFlat.new()
        style.bg_color = Color("#24283b") if item == index else Color("#111a2c")
        style.border_color = Color("#ffc96e") if item == index else Color("#5e5260")
        style.set_border_width_all(2 if item == index else 1)
        style.set_corner_radius_all(5)
        card.add_theme_stylebox_override("normal",style)
        var image := TextureRect.new()
        image.texture = _weapon_icon(index)
        image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
        image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
        image.position = Vector2(3,6)
        image.size = Vector2(89,57)
        image.mouse_filter = Control.MOUSE_FILTER_IGNORE
        card.add_child(image)
        var label := Label.new()
        label.position = Vector2(1,62)
        label.size = Vector2(93,39)
        label.text = WEAPONS[index] + ("\nĐã có" if owned[index] else "\n1 đồng")
        label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
        label.add_theme_font_size_override("font_size",11)
        label.mouse_filter = Control.MOUSE_FILTER_IGNORE
        card.add_child(label)
        card.modulate = Color("#ffdda5") if item == index else Color.WHITE
    var details := VBoxContainer.new()
    details.custom_minimum_size.x = 350
    row.add_child(details)
    var name_label := Label.new()
    name_label.text = WEAPONS[item]
    name_label.add_theme_font_size_override("font_size",22)
    name_label.modulate = Color("#ffe3ae")
    details.add_child(name_label)
    var stats := Label.new()
    stats.text = TECHS[item]
    stats.custom_minimum_size.x = 350
    stats.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    details.add_child(stats)
    var item_info := Label.new()
    item_info.text = "Đang mang" if equipped == item else ("Đã sở hữu" if owned[item] else "Giá · 1 mảnh đồng")
    item_info.modulate = Color("#d8c396")
    details.add_child(item_info)
    var reach := Label.new()
    var candidate: int = TECH_REACH[item]
    var current: int = TECH_REACH[equipped]
    if candidate > 0 and current > 0:
        var difference := candidate-current
        reach.text = "Tầm chiêu  %d  sang  %d" % [current,candidate]
        if difference == 0: reach.text = "Tầm chiêu  %d" % candidate
        else: reach.text += "  (%+d)" % difference
        reach.modulate = Color("#b4eac2") if difference > 0 else (Color("#ffb2a6") if difference < 0 else Color("#d7dff1"))
    else:
        reach.text = "Đòn riêng · Hồi 2,7 giây"
    details.add_child(reach)
    var preview := SkillPreview.new()
    preview.weapon = item
    preview.double_tether = item == SPEAR and spear_infused
    preview.phase = 0.0
    preview.custom_minimum_size = Vector2(350,113)
    preview.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    details.add_child(preview)
    var commands := HBoxContainer.new()
    commands.add_theme_constant_override("separation",6)
    details.add_child(commands)
    _button(commands,"Thử chiêu",func():
        preview.phase = 0
        game.sound.play_cue("slash")
    )
    var transaction := _button(commands,"Trang bị" if owned[item] else "Mua · 1 đồng",func():
        buy(item)
        inspect_weapon(item)
    )
    transaction.disabled = equipped == item or (not owned[item] and metal < 1)
    _emphasize(transaction)
    if item == SPEAR:
        var infusion := Label.new()
        infusion.add_theme_font_size_override("font_size",14)
        infusion.text = "Tơ Kép · đã mở" if spear_infused else "Tơ Kép · %d / %d Lõi nguyệt" % [lunar_cores,SPEAR_CORE_COST]
        infusion.modulate = Color("#a7eeef")
        details.add_child(infusion)
        var forge_actions := HBoxContainer.new()
        details.add_child(forge_actions)
        _button(forge_actions,"Xem Tơ Kép",func():
            preview.double_tether = true
            preview.phase = 0
        )
        var upgrade := _button(commands,"Truyền lõi · 4",func():
            if infuse_spear(): inspect_weapon(item)
        )
        _emphasize(upgrade)
        upgrade.disabled = not owned[SPEAR] or spear_infused or lunar_cores < SPEAR_CORE_COST
    var actions := HBoxContainer.new()
    options.add_child(actions)
    _button(actions,"Kho "+str(catalog_page+1)+"/2 ›",func():
        catalog_page = 1-catalog_page
        show_catalog()
    )
    _button(actions,"Gia cố cầu",repair)
    _button(actions,"Đồng hành",choose_familiar)
    _button(actions,"Rời quầy",close)

func open_map() -> void:
    close()
    game.atlas.open()

func buy(item: int) -> void:
    if not owned[item]:
        if metal <= 0:
            copy.text = "Cần 1 mảnh đồng để mua " + WEAPONS[item] + "."
            return
        metal -= 1
        owned[item] = true
    equipped = item
    reset_chain()
    game._persist()
    close()
    game._say("Đã mang "+WEAPONS[item]+" · V dùng chiêu riêng",3)

func repair() -> void:
    if not core:
        copy.text = "Bà Lam: Thủ Vệ Đá đang giữ lõi đồng. Mang lõi về đây."
        return
    repaired = true
    game._persist()
    close()
    game.emit_impact(sky.point(Vector2(728,433)),Color("#ffd178"))
    game._say("Cầu đã được gia cố · trở về cỗ máy để xem tương lai",5)

func set_interior(entering: bool) -> void:
    indoors = entering
    game.hero.position = sky.point(Vector2(2950 if entering else 420,432))
    game.hero.velocity = Vector2.ZERO
    if entering: game.checkpoint = game.hero.position
    else: game.checkpoint = sky.point(Vector2(150,432))
    game.cam.limit_left = int(sky.origin + (2800 if entering else 0))
    game.cam.limit_right = int(sky.origin + (3760 if entering else MAP_WIDTH))
    game._snap_view()
    sky.backdrop.modulate = Color("#c89777") if entering else SHADES[era]
    game._say("E · Nói chuyện với Bà Lam ở quầy" if entering else "Đã ra khỏi tiệm rèn",3)

func interact() -> void:
    var x: float = game.hero.position.x - sky.origin
    if game.hero.position.y > 595 and x < 770:
        if absf(x-441) > 88:
            game._say("Tín đang chờ cạnh đèn ở giữa hầm",2)
            return
        rescued = true
        var received := award_lunar_core(CORE_CISTERN)
        game._persist()
        game.hero.position = sky.point(Vector2(366,432))
        game.hero.velocity = Vector2.ZERO
        game._snap_view()
        game._say("Tín đã an toàn · nhận 1 Lõi nguyệt" if received else "Cửa hầm mở về Bờ Đá",4)
        return
    if rescued and x > 310 and x < 382 and game.hero.position.y > 375:
        game.hero.position = sky.point(Vector2(400,676))
        game.hero.velocity = Vector2.ZERO
        game._snap_view()
        return
    if indoors:
        if x < 2990: set_interior(false)
        elif absf(x-3320) < 100: forge()
        else: game._say("E cạnh Bà Lam hoặc cửa ra bên trái",2)
        return
    for index in CACHES.size():
        if CACHE_ERAS[index] == era and not claimed[index] and game.hero.position.distance_to(sky.point(CACHES[index])) < 45:
            claimed[index] = true
            metal += 1
            for marker in sky.markers:
                if marker.kind == "metal_"+str(index): marker.used = true
            game._persist()
            game.sound.play_cue("light")
            game._say("Nhặt 1 mảnh đồng · có %d" % metal,3)
            return
    if absf(x-150) < 75 and game.hero.position.y > 375:
        machine()
    elif absf(x-420) < 64 and game.hero.position.y > 375:
        if era == 0: set_interior(true)
        elif era == 1: game._say("Tín: Dấu Bà Lam nằm dưới nhịp cầu. Cỗ máy đưa anh về thời bà còn ở đây.",5)
        else: game._say("Lò nguội lạnh. Trở về quá khứ để gặp Bà Lam.",3)
    elif absf(x-1190) < 54:
        game.checkpoint = sky.point(WATCH_STOP)
        game.health = game.max_health
        var received := false
        if era == 1: received = award_lunar_core(CORE_PRESENT)
        elif era == 2: received = award_lunar_core(CORE_FUTURE)
        if not rested[era] or received:
            rested[era] = true
            game._persist()
        game._say("Điểm nghỉ đã mở · nhận 1 Lõi nguyệt" if received else "Đã nghỉ tại trạm hải đăng",3)
    elif absf(x-2470) < 85 and era == 2:
        if not defeated[2]:
            game._say("Hạ Vệ Binh Mắt Đèn trước khi thắp đèn",3)
            return
        lit = true
        game._persist()
        game.trials.victory_title.text = "NGỌN ĐÈN CHƯA TẮT"
        game.trials.victory_text.text = "Hải Đăng đã sáng." + (" Cây cầu Bà Lam gia cố vẫn còn đứng." if repaired else "Anh đã đến bằng đường dưới cầu.")
        game.trials.next_button.text = "Về bản đồ"
        game._show_victory()
    else:
        game._say("E gần cỗ máy, tiệm rèn, trạm nghỉ hoặc hải đăng · V dùng vũ khí",3)

func atlas_destination() -> Vector2:
    if not active() or indoors or not rested[era] or not game.hero.is_on_floor(): return Vector2.INF
    var local: Vector2 = game.hero.position - Vector2(sky.origin, 0)
    if local.distance_to(MACHINE_STOP) < 49.0: return WATCH_STOP
    if local.distance_to(WATCH_STOP) < 49.0: return MACHINE_STOP
    return Vector2.INF

func use_atlas_anchor(destination: Vector2) -> void:
    if destination == Vector2.INF or destination != atlas_destination(): return
    game._set_crouch(false, true)
    game.arts.reset()
    reset_chain()
    game.hero.position = sky.point(destination)
    game.hero.velocity = Vector2.ZERO
    game._snap_view()
    game.sound.play_cue("phase")
    game.emit_impact(game.hero.position, SHADES[era])
    game._say("Đã tới Đài Canh" if destination == WATCH_STOP else "Đã về Bờ Đá", 2)

func guardian_down() -> void:
    if defeated[era]: return
    defeated[era] = true
    if era == 0:
        core = true
        metal += 2
        award_lunar_core(CORE_GUARDIAN)
        game._say("Nhận lõi đồng, 2 mảnh đồng và 1 Lõi nguyệt",5)
    else:
        game._say("Vệ Binh đã gục · đi tiếp để thắp hải đăng",5)
    game._persist()

var preview_item := 0

func cast() -> void:
    if not active() or panel.visible or game.dialogue.visible or game.victory_panel.visible or game.death_time > 0: return
    if equipped == SPEAR and spear_infused and chain_left > 0:
        if game.hero.position.distance_to(first_anchor+Vector2(0,24)) > 75:
            game._say("Tơ Kép · đợi tới gần neo đầu rồi bấm V",1.4)
            return
        if game.arts.cast(2,first_anchor):
            reset_chain()
            cooldown = 2.7
            game.sound.play_cue("phase")
            game._say("Tơ Kép · đã nối neo thứ hai",2)
        return
    if cooldown > 0: return
    cooldown = 2.7
    flare = 0.35
    flare_origin = game.hero.position
    flare_direction = game.facing
    preview_item = equipped
    match equipped:
        0: strike(flare_origin,115,flare_direction,2)
        1:
            if sky.nearest_anchor(game.hero.position) != Vector2.INF:
                if game.arts.cast(2) and spear_infused:
                    first_anchor = game.arts.grapple_target-Vector2(0,24)
                    chain_left = 1.8
                    game._say("Tơ Kép · bấm V lần nữa khi tới gần neo",2)
            strike(flare_origin,float(TECH_REACH[SPEAR]),flare_direction,2)
        2: strike(flare_origin,100,0,3)
        3:
            game.dash_time = 0.16
            strike(flare_origin,80,flare_direction,1)
            echo = 0.12
            echo_origin = flare_origin
            echo_facing = flare_direction
            echo_weapon = equipped
        4:
            var arrow: Node2D = game.spawn_bolt(flare_origin,Vector2(675*flare_direction,0),true,3)
            arrow.reflection = true
        5:
            strike(flare_origin,120,flare_direction,2)
            echo = 0.55
            echo_origin = flare_origin
            echo_facing = flare_direction
            echo_weapon = equipped
        6:
            barrier_time = 2.0
            game._say("Nhật Hộ · chặn đòn kế tiếp",2)
        7:
            slow_time = 3.0
            slow_origin = flare_origin
            strike(flare_origin,150,0,1)
    if equipped == 2 and is_instance_valid(breakable) and game.hero.position.distance_to(breakable.position) < 120:
        sky._remove_body(breakable)
    game.sound.play_cue("slash",0.8 if equipped == 2 else 1.25)
    queue_redraw()

func strike(at: Vector2, reach: float, direction: int, power: int) -> void:
    for foe in game.enemies:
        if not is_instance_valid(foe) or foe.state == "dead": continue
        var offset: Vector2 = foe.position-at
        if offset.length() > reach or offset.x*direction < 0: continue
        if game.Combat.ray(get_world_2d().direct_space_state,at,foe.position,game.Combat.WORLD).is_empty():
            foe.take_hit(power,game)

func slow_factor(at: Vector2) -> float:
    return 0.45 if active() and slow_time > 0 and at.distance_to(slow_origin) < 170 else 1.0

func block_hit() -> bool:
    if not active() or barrier_time <= 0: return false
    barrier_time = 0
    game.emit_impact(game.hero.position,Color("#ffdc91"))
    game.sound.play_cue("contact")
    return true

func arrow_trigger(from: Vector2, to: Vector2, reflected: bool) -> bool:
    if not active() or era != 2: return false
    var target: Vector2 = sky.point(Vector2(1260 if reflected else 1430,432))
    if Geometry2D.get_closest_point_to_segment(target,from,to).distance_to(target) > 14: return false
    if reflected and not switch_open:
        switch_open = true
        metal += 1
        game._persist()
        game._say("Ấn phản xạ mở · nhận thêm 1 mảnh đồng",4)
    return true

func update(delta: float) -> void:
    chain_left = maxf(0,chain_left-delta)
    var echo_was_active := echo > 0
    echo = maxf(0,echo-delta)
    if echo_was_active and echo == 0:
        var at: Vector2 = game.hero.position if echo_weapon == 3 else echo_origin
        strike(at,120,echo_facing,2)
        flare_origin = at
        flare_direction = echo_facing
        preview_item = echo_weapon
        flare = 0.28
    barrier_time = maxf(0,barrier_time-delta)
    slow_time = maxf(0,slow_time-delta)
    _update_familiar(delta)
    trap_clock += delta*slow_factor(sky.point(Vector2(1995,410)))
    cooldown = maxf(0,cooldown-delta)
    flare = maxf(0,flare-delta)
    tech_button.visible = not (panel.visible or game.dialogue.visible or game.victory_panel.visible)
    underground = game.hero.position.y > 566 and game.hero.position.x < sky.origin+770
    tech_button.text = "V · Tơ Kép ›" if chain_left > 0 else "V · %s" % (WEAPONS[equipped] if cooldown == 0 else "%.1fs" % cooldown)
    tech_button.modulate = Color("#9ff2ff") if chain_left > 0 else Color.WHITE
    for marker in sky.markers: marker.tick(delta,game.hero.position)
    var x: float = game.hero.position.x - sky.origin
    if era == 2 and not repaired and companion == 1 and is_instance_valid(hidden_platform) and x > 675 and x < 1130:
        hidden_platform.collision_layer = game.Combat.WORLD
        hidden_platform.get_meta("art").show()
    if era == 2 and x > 1970 and x < 2025 and fmod(trap_clock,2.6) > 1.6 and game.hero.position.y > 389 and game.hero.position.y < 430:
        game.damage_player(1,sky.origin+1995)
    queue_redraw()

func _update_familiar(delta: float) -> void:
    familiar_glow = maxf(0, familiar_glow - delta)
    familiar_clock += delta
    var hero: Vector2 = game.hero.position
    if companion == 0:
        if familiar_clock < 0.22: return
        familiar_clock = 0
        familiar_target = Vector2.INF
        if indoors: return
        for i in CACHES.size():
            if CACHE_ERAS[i] != era or claimed[i]: continue
            var cache: Vector2 = sky.point(CACHES[i])
            if not familiar_target.is_finite() or hero.distance_squared_to(cache) < hero.distance_squared_to(familiar_target):
                familiar_target = cache
        return
    if companion == 1 or indoors or familiar_clock < (3.8 if companion == 2 else 1.0): return
    var nearest: Node2D = null
    var distance := 175.0 if companion == 2 else 265.0
    for enemy in game.enemies:
        if not is_instance_valid(enemy) or enemy.state == "dead": continue
        var gap := hero.distance_to(enemy.position)
        if gap >= distance: continue
        if not game.Combat.ray(get_world_2d().direct_space_state, hero, enemy.position, game.Combat.WORLD).is_empty(): continue
        distance = gap
        nearest = enemy
    if companion == 2 and nearest:
        familiar_clock = 0
        familiar_glow = 0.32
        familiar_target = nearest.position
        nearest.take_hit(1, game)
    elif companion == 3:
        if nearest or game.i_frames > 0 or game.hurt_time > 0:
            familiar_clock = 0
        elif familiar_clock >= 10.0 and game.health < game.max_health:
            familiar_clock = 0
            game.health += 1
            game._burst(hero, Color("#adfbdc"), 12, 102)
            game._update_hud()

func _draw() -> void:
    if not is_instance_valid(game) or not active(): return
    if not indoors:
        var depth := 700.0 if underground else 511.0
        var start: Vector2 = sky.point(Vector2(0,depth))
        draw_rect(Rect2(start,Vector2(MAP_WIDTH,126)),Color("#0d325130"))
        for line in range(4):
            var wave := PackedVector2Array()
            for x in range(0,2601,33):
                wave.append(start+Vector2(x,line*12+sin(x*0.027+sky.elapsed*1.7+line)*1.4))
            draw_polyline(wave,Color(0.40,0.75,0.96,0.27-line*0.04),1,true)
    var clock: float = sky.elapsed
    var center: Vector2 = sky.point(Vector2(150,354))
    for i in range(3):
        var radius := 24.0+i*12
        draw_arc(center,radius,clock+i,clock+i+TAU*0.82,36,Color(SHADES[era],0.72),2,true)
    draw_circle(center,5,SHADES[era])
    if repaired and era != 0:
        var brace: Vector2 = sky.point(Vector2(730,459))
        draw_line(brace,brace+Vector2(390,0),Color("#e5a355"),5,true)
        for i in range(5): draw_circle(brace+Vector2(i*95+8,0),4,Color("#fff1b3"))
    var forge_light: Vector2 = sky.point(Vector2(420,408))
    draw_circle(forge_light,35,Color(1.0,0.65,0.3,0.14 if era == 0 else 0.035))
    var hero: Vector2 = game.hero.position
    var flying := companion in [1,2]
    var familiar := hero + Vector2(-game.facing * (42 if flying else 52), (-33 if flying else 6) + sin(clock * 5) * 3)
    var reach := 50.0 if companion == 1 else 63.0
    var width := reach * (0.80 + absf(sin(clock * 10)) * 0.20) if companion == 1 else reach
    var cell := FAMILIARS.get_size() * 0.5
    draw_set_transform(familiar, 0, Vector2(game.facing, 1))
    draw_texture_rect_region(FAMILIARS, Rect2(-width/2, -reach/2, width, reach), Rect2(Vector2(companion%2,companion/2)*cell,cell))
    draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
    if companion == 0 and familiar_target.is_finite():
        var axis := familiar.direction_to(familiar_target)
        for i in range(5):
            var at := familiar + axis * (26 + i * 12) + Vector2(0,sin(clock*3+i)*2)
            draw_circle(at, 1.7, Color("#d3dffa", 0.80 - i * 0.10), true, -1, true)
    elif companion == 1:
        var lantern := familiar + Vector2(1,11)
        for ring in range(5):
            draw_circle(lantern, 32.0 - ring*5, Color("#ffd786", 0.025 + ring * 0.012), true, -1, true)
    if companion == 2 and familiar_glow > 0 and familiar_target.is_finite():
        draw_line(familiar, familiar_target, Color("#bf93ff", familiar_glow * 2.2), 1.7, true)
    if era == 2:
        for i in range(4):
            var at: Vector2 = sky.point(Vector2(1970+i*13,422))
            draw_colored_polygon(PackedVector2Array([at,at+Vector2(6,-(24 if fmod(trap_clock,2.6)>1.6 else 5)),at+Vector2(12,0)]),Color("#ffbb77"))
    if is_instance_valid(breakable):
        draw_line(breakable.position-Vector2(0,41),breakable.position+Vector2(0,41),Color("#ffa568"),7,true)
    if barrier_time > 0:
        draw_circle(hero,43,Color("#edb45835"))
        draw_arc(hero,43,0,TAU,48,Color("#ffe9af"),3,true)
    if slow_time > 0:
        draw_circle(slow_origin,170,Color("#b485ff20"))
        for i in range(12):
            var angle := float(i)*TAU/12
            var axis := Vector2.from_angle(angle)
            draw_line(slow_origin+axis*153,slow_origin+axis*169,Color("#d8aeff"),3,true)
    if era == 2:
        draw_circle(sky.point(Vector2(1260,432)),8,Color("#9affc7") if switch_open else Color("#b491ff"))
        draw_arc(sky.point(Vector2(1430,432)),15,0,TAU,24,Color("#ffe19a"),2,true)
    if flare > 0:
        var f := float(flare_direction)
        var alpha := clampf(flare*4,0,1)
        match preview_item:
            0:
                var angle := 0.0 if f > 0 else PI
                for radius in [68.0,78.0,83.0]:
                    draw_arc(flare_origin,radius,angle-1.1,angle+1.1,36,Color("#d9edff",alpha),5 if radius == 78 else 2,true)
            1:
                draw_line(flare_origin,flare_origin+Vector2(f*190,-13),Color("#ffe193",alpha),6,true)
                draw_line(flare_origin,flare_origin+Vector2(f*210,-15),Color("#fffbe6",alpha),2,true)
            2:
                for side in [-1,1]:
                    draw_arc(flare_origin+Vector2(side*70,22),31,PI,TAU,26,Color("#ffb56b",alpha),5,true)

            3:
                for sign_y in [-1,1]:
                    draw_line(flare_origin+Vector2(-15,sign_y*38),flare_origin+Vector2(f*96,-sign_y*32),Color("#dcbbff",alpha),5,true)
            4:
                draw_line(flare_origin,flare_origin+Vector2(f*100,0),Color("#ffeab2",alpha),4,true)
            5:
                for radius in [26.0,49.0,68.0]:
                    draw_arc(flare_origin,radius,0,TAU,32,Color("#8af9e3",alpha),3,true)
            6:
                draw_arc(flare_origin,48,0,TAU,48,Color("#ffe9af",alpha),5,true)
            7:
                draw_arc(flare_origin,92,0,TAU,48,Color("#d5a9ff",alpha),5,true)

func save_state() -> Dictionary:
    return {"era":era,"core":core,"repaired":repaired,"lit":lit,"metal":metal,"companion":companion,"owned":owned.duplicate(),"equipped":equipped,"defeated":defeated.duplicate(),"claimed":claimed.duplicate(),"switch_open":switch_open,"rescued":rescued,"rested":rested.duplicate(),"lunar_cores":lunar_cores,"lunar_awards":lunar_awards,"spear_infused":spear_infused}

func restore(data: Dictionary) -> void:
    era = clampi(int(data.get("era",1)),0,2)
    core = data.get("core",false) == true
    repaired = data.get("repaired",false) == true
    lit = data.get("lit",false) == true
    metal = clampi(int(data.get("metal",0)),0,9)
    companion = clampi(int(data.get("companion",0)),0,3)
    for key in ["owned","defeated","claimed","rested"]:
        var list = data.get(key,[])
        var flags: Array = get(key)
        for index in flags.size():
            flags[index] = list is Array and index < list.size() and list[index] == true
    rescued = data.get("rescued",false) == true
    switch_open = data.get("switch_open",false) == true
    owned[0] = true
    equipped = clampi(int(data.get("equipped",0)),0,WEAPONS.size()-1)
    if not owned[equipped]: equipped = 0
    lunar_awards = int(data.get("lunar_awards",0)) & CORE_AWARDS
    lunar_cores = clampi(int(data.get("lunar_cores",0)),0,SPEAR_CORE_COST)
    spear_infused = owned[SPEAR] and data.get("spear_infused",false) == true
    if rescued: award_lunar_core(CORE_CISTERN)
    if defeated[0]: award_lunar_core(CORE_GUARDIAN)
    rested[1] = rested[1] or (lunar_awards & CORE_PRESENT) != 0
    rested[2] = rested[2] or (lunar_awards & CORE_FUTURE) != 0
    reset_chain()
