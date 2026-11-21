extends Node2D
## The lighthouse map retains its landmarks across all three eras.
const ERAS := ["Quá khứ","Hiện tại","Tương lai"]
const SHADES := [Color("#ffd9ab"),Color("#a9ceff"),Color("#d5a4ff")]
const WEAPONS := ["Nguyệt Kiếm","Thương Tơ","Búa Tinh Thạch"]
const TECHS := ["Trăng Vỡ · quét sáng phía trước","Xuyên Vực · kéo tới móc vàng hoặc đâm xa","Địa Chấn · chấn động và phá tường nứt"]
const MAP_WIDTH := 2600.0
var sky: Node2D
var game: Node2D
var era := 1
var core := false
var repaired := false
var lit := false
var companion := 0
var owned := [true,false,false]
var equipped := 0
var defeated := [false,false,false]
var metal := 0
var cooldown := 0.0
var flare := 0.0
var flare_origin := Vector2.ZERO
var flare_direction := 1
var mode := ""
var indoors := false
var ui: CanvasLayer
var panel: PanelContainer
var heading: Label
var copy: Label
var options: VBoxContainer
var tech_button: Button
var hidden_platform: PhysicsBody2D
var breakable: PhysicsBody2D

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
    panel = PanelContainer.new()
    panel.position = Vector2(203,82)
    panel.custom_minimum_size = Vector2(554,340)
    panel.add_theme_stylebox_override("panel",game._panel_style())
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
    sky.boss = null
    cooldown = 0
    flare = 0
    hidden_platform = null
    breakable = null
    for rect in [Rect2(0,456,730,40),Rect2(1130,456,820,40),Rect2(2040,456,560,40)]:
        sky._platform(rect,false)
    if era != 2 or repaired:
        sky._platform(Rect2(730,456,400,32),false)
        for x in [745,920,1115]: sky._detail(7,Vector2(x,456),Vector2(100,132))
    else:
        sky._platform(Rect2(745,538,133,24))
        sky._platform(Rect2(958,513,172,24))
        hidden_platform = sky._platform(Rect2(868,528,100,24))
        hidden_platform.collision_layer = 0
        hidden_platform.get_meta("art").hide()
    sky._platform(Rect2(1940,420,108,20),true,false,true)
    sky._anchor(Vector2(1070,281))
    sky._anchor(Vector2(2125,310))
    sky._marker("time_machine",Vector2(150,456),"E · Cỗ máy thời gian",2)
    sky._marker("time_forge",Vector2(420,456),"E · Vào tiệm Bà Lam" if era == 0 else "E · Hỏi Tín",2)
    sky._marker("time_rest",Vector2(1190,456),"E · Nghỉ / lưu điểm",4)
    if era == 2: sky._marker("time_goal",Vector2(2470,456),"E · Thắp hải đăng",2)
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
    mode = ""
    queue_redraw()

func close() -> void:
    panel.hide()
    mode = ""
    if game.started and not game.dialogue.visible: game.joystick.accept_touch = true

func _choice(title: String, action: Callable) -> void:
    var button := Button.new()
    button.text = title
    button.custom_minimum_size.y = 31
    button.pressed.connect(action)
    options.add_child(button)

func _open(which: String) -> void:
    mode = which
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
    _choice("Đóng",close)

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
    _open("forge")
    heading.text = "TIỆM RÈN BÀ LAM"
    copy.text = "Bà Lam: Thử chiêu trước khi mua. Hiện có %d mảnh đồng.\nĐánh bại Thủ Vệ Đá để lấy thêm vật liệu." % metal
    for index in range(WEAPONS.size()):
        var item := index
        _choice(WEAPONS[index]+" · "+("Trang bị" if owned[index] else "Thử / Mua"),func(): inspect_weapon(item))
    _choice("Gia cố cầu · cần lõi đồng" if not repaired else "Cầu đã gia cố",repair)
    _choice("Đồng hành: "+("Cáo Dẫn Đường" if companion == 0 else "Bướm Đèn"),func():
        companion = 1-companion
        game._persist()
        forge()
    )
    _choice("Rời tiệm",close)

func inspect_weapon(item: int) -> void:
    _open("item")
    heading.text = WEAPONS[item]
    copy.text = TECHS[item]+"\n"+("Đã có trong kho." if owned[item] else "Giá: 1 mảnh đồng.")
    _choice("Thử chiêu",func():
        flare_origin = game.hero.position
        flare_direction = game.facing
        flare = 0.55
        preview_item = item
        close()
        game.sound.play_cue("slash")
        game._say("Đòn thử · "+TECHS[item],3)
        queue_redraw()
    )
    _choice("Trang bị" if owned[item] else "Mua và trang bị",func(): buy(item))
    _choice("Về quầy",forge)

func buy(item: int) -> void:
    if not owned[item]:
        if metal <= 0:
            copy.text = "Cần 1 mảnh đồng để mua " + WEAPONS[item] + "."
            return
        metal -= 1
        owned[item] = true
    equipped = item
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
    game.cam.reset_smoothing()
    game.cam.force_update_scroll()
    sky.backdrop.modulate = Color("#c89777") if entering else SHADES[era]
    game._say("E · Nói chuyện với Bà Lam ở quầy" if entering else "Đã ra khỏi tiệm rèn",3)

func interact() -> void:
    var x: float = game.hero.position.x - sky.origin
    if indoors:
        if x < 2990: set_interior(false)
        elif absf(x-3320) < 100: forge()
        else: game._say("E cạnh Bà Lam hoặc cửa ra bên trái",2)
        return
    if absf(x-150) < 75 and game.hero.position.y > 375:
        machine()
    elif absf(x-420) < 64 and game.hero.position.y > 375:
        if era == 0: set_interior(true)
        elif era == 1: game._say("Tín: Dấu Bà Lam nằm dưới nhịp cầu. Cỗ máy đưa anh về thời bà còn ở đây.",5)
        else: game._say("Lò nguội lạnh. Trở về quá khứ để gặp Bà Lam.",3)
    elif absf(x-1190) < 54:
        game.checkpoint = sky.point(Vector2(1190,432))
        game.health = game.max_health
        game._say("Đã nghỉ tại trạm hải đăng",3)
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

func guardian_down() -> void:
    defeated[era] = true
    if era == 0:
        core = true
        metal += 2
        game._say("Nhặt lõi đồng và 2 mảnh đồng · trở lại Bà Lam",5)
    else:
        game._say("Vệ Binh đã gục · đi tiếp để thắp hải đăng",5)
    game._persist()

var preview_item := 0

func cast() -> void:
    if not active() or panel.visible or game.dialogue.visible or game.victory_panel.visible or game.death_time > 0 or cooldown > 0: return
    cooldown = 2.7
    flare = 0.35
    flare_origin = game.hero.position
    flare_direction = game.facing
    preview_item = equipped
    var reach: float = [115.0,210.0,100.0][equipped]
    if equipped == 1 and sky.nearest_anchor(game.hero.position) != Vector2.INF:
        game.arts.cast(2)
    for foe in game.enemies:
        if not is_instance_valid(foe) or foe.state == "dead": continue
        var offset: Vector2 = foe.position-game.hero.position
        if offset.length() > reach or (equipped != 2 and offset.x*game.facing < 0): continue
        var world := get_world_2d().direct_space_state
        if game.Combat.ray(world,game.hero.position,foe.position,game.Combat.WORLD).is_empty(): foe.take_hit(3 if equipped == 2 else 2,game)
    if equipped == 2 and is_instance_valid(breakable) and game.hero.position.distance_to(breakable.position) < 120:
        sky._remove_body(breakable)
    game.sound.play_cue("slash",0.8 if equipped == 2 else 1.25)
    queue_redraw()

func update(delta: float) -> void:
    cooldown = maxf(0,cooldown-delta)
    flare = maxf(0,flare-delta)
    tech_button.visible = not (panel.visible or game.dialogue.visible or game.victory_panel.visible)
    tech_button.text = "V · %s" % (WEAPONS[equipped] if cooldown == 0 else "%.1fs" % cooldown)
    for marker in sky.markers: marker.tick(delta,game.hero.position)
    var x: float = game.hero.position.x - sky.origin
    if era == 2 and not repaired and companion == 1 and is_instance_valid(hidden_platform) and x > 675 and x < 1130:
        hidden_platform.collision_layer = game.Combat.WORLD
        hidden_platform.get_meta("art").show()
    if era == 2 and x > 1970 and x < 2025 and fmod(sky.elapsed,2.6) > 1.6 and game.hero.position.y > 389 and game.hero.position.y < 430:
        game.damage_player(1,sky.origin+1995)
    queue_redraw()

func _draw() -> void:
    if not is_instance_valid(game) or not active(): return
    if indoors:
        draw_rect(Rect2(sky.point(Vector2(2800,80)),Vector2(960,376)),Color("#38242b42"))
        for x in [2890,3140,3500,3730]:
            draw_rect(Rect2(sky.point(Vector2(x,112)),Vector2(14,344)),Color("#8d6243"))
        var fire: Vector2 = sky.point(Vector2(3430,397))
        draw_circle(fire,75,Color("#f9974029"))
        draw_circle(fire,24,Color("#fb9c5138"))
        draw_circle(fire,9,Color("#ffce8b"))
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
    var familiar := hero+Vector2(-33,-35 if companion == 1 else 13+sin(clock*7)*3)
    draw_circle(familiar,19,Color(SHADES[era],0.14))
    draw_circle(familiar,6,Color("#ffdc87") if companion == 1 else Color("#e5efff"))
    if companion == 1:
        var flutter := 3+absf(sin(clock*15))*8
        draw_circle(familiar+Vector2(-flutter,-3),4,Color("#ffe8ad"))
        draw_circle(familiar+Vector2(flutter,-3),4,Color("#ffe8ad"))
    elif absf(hero.x-sky.origin-1040) < 360:
        for i in range(5): draw_circle(sky.point(Vector2(1010+i*13,502)),3,Color("#e0eaff"))
    if era == 2:
        for i in range(4):
            var at: Vector2 = sky.point(Vector2(1970+i*13,422))
            draw_colored_polygon(PackedVector2Array([at,at+Vector2(6,-(24 if fmod(clock,2.6)>1.6 else 5)),at+Vector2(12,0)]),Color("#ffbb77"))
    if is_instance_valid(breakable):
        draw_line(breakable.position-Vector2(0,41),breakable.position+Vector2(0,41),Color("#ffa568"),7,true)
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

func save_state() -> Dictionary:
    return {"era":era,"core":core,"repaired":repaired,"lit":lit,"metal":metal,"companion":companion,"owned":owned,"equipped":equipped,"defeated":defeated}

func restore(data: Dictionary) -> void:
    era = clampi(int(data.get("era",1)),0,2)
    core = data.get("core",false) == true
    repaired = data.get("repaired",false) == true
    lit = data.get("lit",false) == true
    metal = clampi(int(data.get("metal",0)),0,2)
    companion = clampi(int(data.get("companion",0)),0,1)
    for key in ["owned","defeated"]:
        var list = data.get(key,[])
        if list is Array and list.size() == 3:
            set(key,[list[0] == true,list[1] == true,list[2] == true])
    owned[0] = true
    equipped = clampi(int(data.get("equipped",0)),0,2)
    if not owned[equipped]: equipped = 0
