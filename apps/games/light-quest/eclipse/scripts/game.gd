extends Node2D
## Self-contained mechanical vertical slice. Programmatic scenery is deliberately placeholder art.
const ROOM_W := 960.0
const FLOOR_Y := 456.0
const SAVE_FILE := "user://eclipse_save_v1.json"
const ROOMS := ["Làng Trăng", "Rừng Vọng", "Hầm Bóng", "Tháp Pha Lê", "Cổng Đêm", "Đài Quan Sát", "Người Giữ Nguyệt"]
const TIPS := ["Gặp Kha (E) để nhận nhiệm vụ.", "Đánh quái và vượt bục đá.", "Tìm đường qua những bệ đá cổ.", "Đến bàn đố (E) để thắp đèn.", "Chỉ vào được khi Tháp Pha Lê đã sáng.", "Checkpoint: đứng gần đài và nhấn E.", "Phá khiên boss bằng ánh sáng. Đánh vào lúc khiên tan."]
const COLORS := [Color("#274b65"),Color("#163e44"),Color("#272f4c"),Color("#32425a"),Color("#38364e"),Color("#334b62"),Color("#38243e")]
var hero: CharacterBody2D
var body_shape: CollisionShape2D
var cam: Camera2D
var hud: Label
var help: Label
var dialogue: PanelContainer
var dialogue_label: Label
var puzzle_panel: PanelContainer
var puzzle_info: Label
var puzzle_grid: GridContainer
var touch := {"left":false,"right":false,"jump":false,"attack":false,"interact":false,"dash":false}
var buttons: Dictionary = {}
var joystick: Node2D
var puzzles: Array[int] = []
var puzzle_moves := 0
var last_room := -1
var activated := false
var met_npc := false
var moon_dash := false
var boss_dead := false
var checkpoint := Vector2(130, 385)
var health := 5
var max_health := 5
var character := "An"
var facing := 1
var velocity_x := 0.0
var i_frames := 0.0
var attack_cooldown := 0.0
var dash_cooldown := 0.0
var dash_time := 0.0
var boss_shield_time := 0.0
var boss_flash := 0.0
var boss_hp := 12
var enemy_data: Array[Dictionary] = []
var world_lines: Array[Dictionary] = []
var notice := ""
var notice_time := 0.0
var game_won := false
var started := false
var menu: PanelContainer
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
var was_grounded := false
var dust_clock := 0.0
var shake_time := 0.0
var slash_time := 0.0
var landing_time := 0.0
var vfx: Array[Dictionary] = []
var visual_clock := 0.0
var actor_sprite: Sprite2D


func _ready() -> void:
    _make_stage()
    _make_hero()
    _make_ui()
    _restore()
    _menu()

func _make_stage() -> void:
    for r in range(7):
        var ox := float(r) * ROOM_W
        _solid(Rect2(ox - 8, FLOOR_Y, ROOM_W + 16, 100), Color("#293d48"))
        if r > 0:
            _solid(Rect2(ox + 150, 375, 130, 18), Color("#496a6a"))
            _solid(Rect2(ox + 480, 310, 155, 18), Color("#496a6a"))
        if r in [1,2,4,5]:
            _solid(Rect2(ox + 730, 365, 110, 18), Color("#66808b"))
        if r in [1,2,4,5]:
            for j in range(2):
                enemy_data.append({"x":ox + 430 + j * 240,"y":FLOOR_Y - 22,"hp":3 + int(r > 3),"dir":-1.0,"alive":true,"speed":36.0 + 8*r,"phase":float(j)})
    # Hard gate after room 4: collision toggled when light is activated.
    var gate := StaticBody2D.new()
    gate.name = "LightGate"
    gate.position = Vector2(ROOM_W * 5.0, 365)
    var col := CollisionShape2D.new()
    var shape := RectangleShape2D.new()
    shape.size = Vector2(30, 180)
    col.shape = shape
    gate.add_child(col)
    add_child(gate)

func _solid(rect:Rect2, color:Color) -> void:
    world_lines.append({"rect":rect,"color":color})
    var b := StaticBody2D.new()
    b.position = rect.position + rect.size / 2
    var s := CollisionShape2D.new()
    var sh := RectangleShape2D.new()
    sh.size = rect.size
    s.shape = sh
    b.add_child(s)
    add_child(b)

func _make_hero() -> void:
    hero = CharacterBody2D.new()
    hero.position = Vector2(130, 385)
    hero.motion_mode = CharacterBody2D.MOTION_MODE_GROUNDED
    body_shape = CollisionShape2D.new()
    var sh := CapsuleShape2D.new()
    sh.radius = 12
    sh.height = 48
    body_shape.shape = sh
    hero.add_child(body_shape)
    add_child(hero)
    # Sprite2D is available only after installing the reviewed CC0 pack.
    # This stays a regular Godot sprite so it can later be replaced by AnimatedSprite2D.
    if ResourceLoader.exists("res://assets/kenney/character.png"):
        var sprite := Sprite2D.new()
        sprite.name = "PlayerSprite"
        sprite.texture = load("res://assets/kenney/character.png")
        sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
        sprite.position = Vector2(0, -4)
        sprite.region_enabled = true
        sprite.region_rect = Rect2(0, 0, 18, 18)
        sprite.scale = Vector2(2.5, 2.5)
        hero.add_child(sprite)
        actor_sprite = sprite
    cam = Camera2D.new()
    cam.zoom = Vector2(1.25, 1.25)
    cam.enabled = true
    cam.position = Vector2(0, -80)
    cam.limit_left = 0
    cam.limit_top = -250
    cam.limit_bottom = 600
    cam.limit_right = int(7*ROOM_W)
    hero.add_child(cam)

func _make_ui() -> void:
    var layer := CanvasLayer.new()
    add_child(layer)
    var bar := ColorRect.new()
    bar.color = Color("#091a2bc9")
    bar.set_anchors_preset(Control.PRESET_TOP_WIDE)
    bar.custom_minimum_size = Vector2(960,78)
    layer.add_child(bar)
    hud = Label.new()
    hud.position = Vector2(20,10)
    hud.add_theme_font_size_override("font_size",21)
    layer.add_child(hud)
    help = Label.new()
    help.position = Vector2(20,45)
    help.add_theme_font_size_override("font_size",14)
    layer.add_child(help)
    var touchbar := Control.new()
    touchbar.set_anchors_preset(Control.PRESET_FULL_RECT)
    touchbar.mouse_filter = Control.MOUSE_FILTER_IGNORE
    layer.add_child(touchbar)
    joystick = Node2D.new()
    joystick.set_script(load("res://scripts/virtual_joystick.gd"))
    layer.add_child(joystick)
    _touch_button(touchbar,"jump","NHẢY",596,420,82)
    _touch_button(touchbar,"attack","ĐÁNH",688,420,82)
    _touch_button(touchbar,"dash","LƯỚT",780,420,82)
    _touch_button(touchbar,"interact","E",870,420,72)
    dialogue = PanelContainer.new()
    dialogue.position = Vector2(145,300)
    dialogue.custom_minimum_size = Vector2(670,115)
    layer.add_child(dialogue)
    dialogue_label = Label.new()
    dialogue_label.custom_minimum_size = Vector2(650,105)
    dialogue_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    dialogue_label.add_theme_font_size_override("font_size",20)
    dialogue.add_child(dialogue_label)
    dialogue.hide()
    puzzle_panel = PanelContainer.new()
    puzzle_panel.position = Vector2(250,70)
    puzzle_panel.custom_minimum_size = Vector2(460,390)
    layer.add_child(puzzle_panel)
    var pv := VBoxContainer.new()
    puzzle_panel.add_child(pv)
    puzzle_info = Label.new()
    puzzle_info.add_theme_font_size_override("font_size",17)
    pv.add_child(puzzle_info)
    puzzle_grid = GridContainer.new()
    puzzle_grid.columns = 5
    pv.add_child(puzzle_grid)
    var close_btn := Button.new()
    close_btn.text = "Đóng bảng (ESC)"
    close_btn.pressed.connect(func(): puzzle_panel.hide())
    pv.add_child(close_btn)
    puzzle_panel.hide()
    _update_hud()

func _touch_button(parent:Control, key:String, text:String, x:int, y:int, size:int) -> void:
    var b := Button.new()
    b.text = text
    b.position = Vector2(x,y)
    b.custom_minimum_size = Vector2(size,size)
    b.modulate.a = 0.92
    b.add_theme_font_size_override("font_size",18)
    b.button_down.connect(func():
        touch[key] = true
        if key == "jump": jump_buffer_clock = JUMP_BUFFER_WINDOW
    )
    b.button_up.connect(func(): touch[key] = false)
    parent.add_child(b)
    buttons[key] = b

func _menu() -> void:
    menu = PanelContainer.new()
    menu.position = Vector2(270,106)
    menu.custom_minimum_size = Vector2(420,290)
    var layer := CanvasLayer.new()
    layer.layer = 10
    add_child(layer)
    layer.add_child(menu)
    var v := VBoxContainer.new()
    menu.add_child(v)
    var title := Label.new()
    title.text = "LIGHT QUEST: ECLIPSE\nBÍ MẬT THÁP TRĂNG"
    title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    title.add_theme_font_size_override("font_size",24)
    v.add_child(title)
    var note := Label.new()
    note.text = "Prototype gameplay · hình minh họa thay thế\nA/D di chuyển · Space nhảy · J đánh · K dash · E tương tác"
    note.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    v.add_child(note)
    for who in ["An — kiếm sĩ","Kha — pháp sư"]:
        var b := Button.new()
        b.text = "Chơi: " + who
        b.pressed.connect(func(): character = "Kha" if who.begins_with("Kha") else "An"; started = true; menu.hide(); _say("Khám phá Tháp Trăng. Mỗi kỹ năng mở một con đường khác nhau!",3))
        v.add_child(b)

func _input(event:InputEvent) -> void:
    if event.is_action_pressed("ui_cancel"):
        if puzzle_panel.visible: puzzle_panel.hide()
        elif dialogue.visible: dialogue.hide()
    if event is InputEventKey and event.pressed and not event.echo:
        if event.keycode in [KEY_SPACE, KEY_W, KEY_UP]:
            jump_buffer_clock = JUMP_BUFFER_WINDOW
        match event.keycode:
            KEY_E: _interact()
            KEY_J: _attack()
            KEY_K: _dash()
            KEY_R: _respawn()

func _physics_process(delta:float) -> void:
    if not started: return
    visual_clock += delta
    notice_time = maxf(0, notice_time-delta)
    attack_cooldown = maxf(0, attack_cooldown-delta)
    dash_cooldown = maxf(0, dash_cooldown-delta)
    i_frames = maxf(0, i_frames-delta)
    slash_time = maxf(0, slash_time-delta)
    landing_time = maxf(0, landing_time-delta)
    shake_time = maxf(0, shake_time-delta)
    boss_shield_time = maxf(0, boss_shield_time-delta)
    boss_flash = maxf(0, boss_flash-delta)
    jump_buffer_clock = maxf(0, jump_buffer_clock-delta)
    _tick_vfx(delta)
    var blocked := puzzle_panel.visible or dialogue.visible
    var grounded_before := hero.is_on_floor()
    if grounded_before:
        coyote_clock = COYOTE_WINDOW
    else:
        coyote_clock = maxf(0, coyote_clock-delta)
    var current_jump := bool(touch["jump"]) or Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP)
    if current_jump and not jump_held:
        jump_buffer_clock = JUMP_BUFFER_WINDOW
    jump_held = current_jump
    var dx := 0.0
    if not blocked:
        dx = float(int(Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT)) - int(Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT)))
        if joystick != null and absf(joystick.axis.x) > 0.02:
            dx = joystick.axis.x
        if absf(dx) > 0.18: facing = int(sign(dx))
    var target_speed := dx * (205.0 if character == "Kha" else 245.0)
    var accel := RUN_ACCEL if grounded_before else AIR_ACCEL
    hero.velocity.x = move_toward(hero.velocity.x, target_speed, (accel if absf(dx)>0.12 else RUN_FRICTION) * delta)
    if jump_buffer_clock > 0 and coyote_clock > 0 and not blocked:
        hero.velocity.y = JUMP_SPEED
        jump_buffer_clock = 0.0
        coyote_clock = 0.0
        _burst(hero.position + Vector2(0,22), Color("#d7f3d6"), 9, 95.0)
    if dash_time > 0:
        dash_time = maxf(0, dash_time-delta)
        hero.velocity.x = 565.0 * facing
        hero.velocity.y *= 0.78
    if not current_jump and hero.velocity.y < -140:
        hero.velocity.y = maxf(hero.velocity.y, -140.0)
    hero.velocity.y += (760.0 if hero.velocity.y < 0 else 1370.0) * delta
    var previous_vy := hero.velocity.y
    hero.move_and_slide()
    if not grounded_before and hero.is_on_floor() and previous_vy > 180:
        landing_time = 0.14
        shake_time = 0.08
        _burst(hero.position + Vector2(0,20), Color("#a8bec0"), 12, 120.0)
    dust_clock -= delta
    if hero.is_on_floor() and absf(hero.velocity.x) > 95 and dust_clock <= 0:
        dust_clock = 0.09
        _burst(hero.position + Vector2(-facing*11,20), Color("#9bb6b6"), 2, 38.0)
    if actor_sprite != null:
        actor_sprite.flip_h = facing < 0
        var run_bob := sin(visual_clock*19.0) * 2.0 if hero.is_on_floor() and absf(hero.velocity.x)>35 else 0.0
        actor_sprite.position = Vector2(0, -4 + run_bob)
        actor_sprite.rotation = clampf(hero.velocity.x/9000.0, -0.055,0.055)
        actor_sprite.modulate = Color("#fff2cf") if i_frames>0 else Color.WHITE
        var stretch := 1.08 if not hero.is_on_floor() and hero.velocity.y < 0 else 1.0
        actor_sprite.scale = Vector2(2.5 / stretch, 2.5 * stretch)
        if landing_time>0: actor_sprite.scale = Vector2(2.75,2.25)
    if touch["attack"]:
        touch["attack"] = false
        _attack()
    if touch["dash"]:
        touch["dash"] = false
        _dash()
    if touch["interact"]:
        touch["interact"] = false
        _interact()
    hero.position.x = clampf(hero.position.x,25,7*ROOM_W-28)
    if hero.position.y > 620: _respawn()
    var room := mini(6, int(hero.position.x/ROOM_W))
    if room != last_room:
        last_room = room
        _say(ROOMS[room] + " · " + TIPS[room], 2.6)
    if room == 6 and not boss_dead:
        _boss_tick(delta)
    _enemy_tick(delta)
    if activated and get_node_or_null("LightGate"):
        get_node("LightGate").queue_free()
    cam.offset = Vector2(sin(visual_clock*95.0)*2.3,cos(visual_clock*82.0)*1.5) if shake_time>0 else Vector2.ZERO
    _update_hud()
    queue_redraw()

func _burst(origin:Vector2, color:Color, count:int, speed:float) -> void:
    for i in range(count):
        var angle := (float(i)/maxf(1.0,float(count-1)))*PI + PI
        var direction := Vector2(cos(angle),sin(angle))
        vfx.append({"p":origin,"v":direction*speed*randf_range(0.45,1.2),"life":0.34,"duration":0.34,"color":color})
    if vfx.size()>100:
        vfx = vfx.slice(vfx.size()-100)

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

func _enemy_tick(delta:float) -> void:
    for i in range(enemy_data.size()):
        var e:Dictionary = enemy_data[i]
        if not e["alive"]: continue
        if absf(hero.position.x - float(e["x"])) < 340:
            e["dir"] = signf(hero.position.x-float(e["x"]))
            e["x"] += float(e["dir"]) * float(e["speed"]) * delta
        if absf(hero.position.x-float(e["x"]))<30 and absf(hero.position.y-float(e["y"]))<55:
            _damage(1)
        enemy_data[i]=e

func _boss_tick(delta:float) -> void:
    if boss_hp<=0: return
    var x := 6.0*ROOM_W+650.0
    if absf(hero.position.x-x)<105 and hero.position.y>280:
        _damage(1)
    if boss_shield_time<=0 and boss_flash<=0:
        boss_flash = 3.1

func _damage(amount:int) -> void:
    if i_frames>0: return
    health-=amount
    i_frames=1.1
    shake_time = 0.17
    _burst(hero.position, Color("#ff9484"), 10, 145)
    _say("Trúng đòn! Né để tránh mất máu.",1.5)
    if health<=0: _respawn()

func _respawn() -> void:
    health=max_health
    hero.position=checkpoint
    hero.velocity=Vector2.ZERO
    _say("Hồi sinh tại điểm lưu gần nhất.",2)

func _attack() -> void:
    if not started or puzzle_panel.visible or dialogue.visible or attack_cooldown>0: return
    attack_cooldown = 0.34 if character=="An" else 0.48
    slash_time = 0.22
    _burst(hero.position+Vector2(facing*42,-9), Color("#c9f7ff") if character=="Kha" else Color("#ffe0ab"), 7, 100)
    var reach := 100.0 if character=="An" else 180.0
    for i in range(enemy_data.size()):
        var e:Dictionary=enemy_data[i]
        if e["alive"] and absf(hero.position.x-float(e["x"]))<reach and absf(hero.position.y-float(e["y"]))<80 and (float(e["x"])-hero.position.x)*facing>-24:
            e["hp"]=int(e["hp"])-1
            shake_time = 0.09
            _burst(Vector2(float(e["x"]),float(e["y"])), Color("#ffb5de"), 9, 115)
            if int(e["hp"])<=0:e["alive"]=false
            enemy_data[i]=e
            break
    if last_room==6 and not boss_dead and absf(hero.position.x-(6*ROOM_W+650))<reach+75:
        if boss_shield_time>0:
            boss_hp-=1
            if boss_hp<=0:
                boss_dead=true
                moon_dash=true
                game_won=true
                _persist()
                _say("Bạn đã đánh bại Người Giữ Nguyệt! Moon Dash đã mở. Nhấn R để hồi sinh và khám phá lại.",25)
        else:
            _say("Boss có khiên! Hãy kích hoạt tinh thể bằng phím E gần bệ đá.",2)

func _dash() -> void:
    if not started or dash_cooldown>0 or puzzle_panel.visible: return
    dash_cooldown=1.4 if moon_dash else 2.8
    dash_time=0.18 if moon_dash else 0.13
    _burst(hero.position+Vector2(-facing*15,5),Color("#94e9e2"),14,155)
    _say("Moon Dash!" if moon_dash else "Lướt ngắn",0.45)

func _interact() -> void:
    if not started: return
    if dialogue.visible:
        dialogue.hide()
        return
    if puzzle_panel.visible:return
    var local_x := fposmod(hero.position.x,ROOM_W)
    if last_room==0 and local_x<390:
        met_npc=true
        dialogue_label.text="Kha: Tia sáng ở Tháp Pha Lê có thể phá lời nguyền. Hãy giải bảng ô sáng và quay lại mở Cổng Đêm. (Bấm E để đóng)"
        dialogue.show()
    elif last_room==3 and absf(local_x-465)<170:
        _open_puzzle()
    elif last_room==5 and absf(local_x-260)<150:
        checkpoint=hero.position
        health=max_health
        _persist()
        _say("Đã lưu tại Đài Quan Sát!",2)
    elif last_room==6 and absf(local_x-350)<140:
        boss_shield_time=4.5
        _say("Ánh sáng làm tan khiên! Tấn công ngay!",3)
    else:
        _say("Không có gì để tương tác ở đây. Hãy đến gần NPC, bàn đố hoặc trạm lưu.",2)

func _open_puzzle() -> void:
    if activated:
        _say("Nguồn sáng đã bật. Cổng Đêm đang mở!",2)
        return
    if puzzles.size()!=25:
        puzzles.clear()
        for j in range(25):puzzles.append(1)
        for k in [2,7,13,16,21,24]:
            _toggle_grid(k)
    puzzle_panel.show()
    _render_puzzle()

func _toggle_grid(idx:int) -> void:
    var x:=idx%5
    var y:=int(idx/5)
    for p in [idx,idx-1 if x>0 else -1,idx+1 if x<4 else -1,idx-5 if y>0 else -1,idx+5 if y<4 else -1]:
        if p>=0:puzzles[p]=1-puzzles[p]

func _render_puzzle() -> void:
    for c in puzzle_grid.get_children():c.queue_free()
    puzzle_info.text="THÁP PHA LÊ · BẢNG Ô SÁNG 5×5\nBật toàn bộ đèn để mở Cổng Đêm · %d lượt" % puzzle_moves
    for j in range(25):
        var b:=Button.new()
        b.custom_minimum_size=Vector2(78,49)
        b.text="✦" if puzzles[j] else "·"
        b.modulate=Color("#f6d788") if puzzles[j] else Color("#698a9a")
        b.pressed.connect(_puzzle_press.bind(j))
        puzzle_grid.add_child(b)

func _puzzle_press(idx:int) -> void:
    _toggle_grid(idx)
    puzzle_moves+=1
    if puzzles.all(func(value): return value == 1):
        activated=true
        puzzle_panel.hide()
        _persist()
        _say("Cổng Đêm đã mở! Tia sáng nối với lâu đài.",4)
    else:_render_puzzle()

func _say(value:String,secs:float) -> void:
    notice=value
    notice_time=secs
    _update_hud()

func _update_hud() -> void:
    if hud==null:return
    var r:=clampi(int(hero.position.x/ROOM_W) if hero else 0,0,6)
    hud.text=("AN · KIẾM" if character=="An" else "KHA · PHÉP")+"   ♥ "+str(health)+"/"+str(max_health)+"   ✧ "+ROOMS[r]+"   ◇ "+("THẮP SÁNG" if activated else "CHƯA KÍCH HOẠT")
    help.text=notice if notice_time>0 else "Joystick trái để di chuyển · Nhảy / Đánh / Lướt / E bên phải"

func _persist() -> void:
    var f:=FileAccess.open(SAVE_FILE,FileAccess.WRITE)
    if f:
        f.store_string(JSON.stringify({"version":1,"activated":activated,"met_npc":met_npc,"moon_dash":moon_dash,"boss_dead":boss_dead,"checkpoint":[checkpoint.x,checkpoint.y]}))

func _restore() -> void:
    if not FileAccess.file_exists(SAVE_FILE):return
    var f:=FileAccess.open(SAVE_FILE,FileAccess.READ)
    if not f:return
    var data=JSON.parse_string(f.get_as_text())
    if not (data is Dictionary):return
    activated=bool(data.get("activated",false))
    met_npc=bool(data.get("met_npc",false))
    moon_dash=bool(data.get("moon_dash",false))
    boss_dead=bool(data.get("boss_dead",false))
    var point=data.get("checkpoint",[130,385])
    if point is Array and point.size()==2:
        checkpoint=Vector2(float(point[0]),float(point[1]))
        hero.position=checkpoint
    if boss_dead:boss_hp=0

func _draw() -> void:
    for r in range(7):
        var ox:=r*ROOM_W
        draw_rect(Rect2(ox,-160,ROOM_W,700),COLORS[r])
        # Starfield, parallax-like atmosphere and moon
        for j in range(30):
            var sx:=ox+fposmod(float(j*137+r*47),ROOM_W)
            var sy:=float((j*71+r*19)%330)-60
            draw_circle(Vector2(sx,sy),1.5,Color("#b2c7de55"))
        draw_circle(Vector2(ox+740,70),69,Color("#f6e7ba1b"))
        draw_circle(Vector2(ox+740,70),39,Color("#f4e3bb88"))
        for c in range(10):
            var xx:=ox+c*110
            draw_rect(Rect2(xx,275-(c%3)*37,65,180),Color("#101f35b5"))
            draw_rect(Rect2(xx+8,295-(c%3)*37,16,30),Color("#caa76b44"))
        draw_string(ThemeDB.fallback_font,Vector2(ox+34,122),ROOMS[r],HORIZONTAL_ALIGNMENT_LEFT,-1,29,Color("#e3d59d"))
    for e in world_lines:
        draw_rect(e["rect"],e["color"])
    # Marker objects and puzzle world interactions
    draw_rect(Rect2(5*ROOM_W-15,275,30,181),Color("#55d5ad44") if activated else Color("#e9a363cc"))
    draw_circle(Vector2(3*ROOM_W+465,359),34,Color("#ffdd85"))
    draw_circle(Vector2(5*ROOM_W+260,368),22,Color("#8ce2c9"))
    draw_circle(Vector2(6*ROOM_W+350,372),21,Color("#e6c477"))
    draw_circle(Vector2(290,393),20,Color("#d1b5dd"))
    for e in enemy_data:
        if e["alive"]:
            draw_circle(Vector2(e["x"],e["y"]),22,Color("#9a648f"))
            draw_circle(Vector2(float(e["x"])-7,float(e["y"])-4),4,Color("#f8ca8c"))
            draw_circle(Vector2(float(e["x"])+7,float(e["y"])-4),4,Color("#f8ca8c"))
    if not boss_dead:
        var bp:=Vector2(6*ROOM_W+650,378)
        draw_circle(bp,75,Color("#a65c9d"))
        draw_circle(bp,54,Color("#27213d"))
        draw_circle(bp,17,Color("#d5a2f6") if boss_shield_time>0 else Color("#65c9f5"))
        draw_arc(bp,95,0,TAU,64,Color("#83cfe2") if boss_shield_time<=0 else Color("#f0d58a"),4)
        draw_rect(Rect2(bp.x-80,220,160*float(boss_hp)/12,9),Color("#e6a578"))
    for particle in vfx:
        var opacity := clampf(float(particle["life"])/float(particle["duration"]),0,1)
        var tint:Color = particle["color"]
        tint.a = opacity*0.84
        draw_circle(particle["p"], maxf(1.0,4.5*opacity),tint)
    if hero:
        var p:=hero.position
        if not hero.has_node("PlayerSprite"):
            draw_circle(p+Vector2(0,-15),18,Color("#a9e4d2") if character=="Kha" else Color("#82bdff"))
            draw_rect(Rect2(p.x-13,p.y-2,26,35),Color("#2c846d") if character=="Kha" else Color("#3d66ad"))
            draw_circle(p+Vector2(0,-23),9,Color("#edc5a1"))
        if i_frames>0:draw_arc(p+Vector2(0,-6),33,0,TAU,32,Color("#ffdf8b"),3)
        if slash_time>0:
            var swing := 1.0-slash_time/0.22
            var center := p+Vector2(float(facing)*30,-8)
            draw_arc(center,37,-PI/2+swing*0.7,PI/2+swing*0.7,24,Color("#ffe5a9"),7)
            draw_arc(center,47,-PI/2+swing*0.7,PI/2+swing*0.7,24,Color("#b2f0f7a9"),3)
