extends Control
## Front door to the continuous journey and the independent practice rooms.
const GroundSurface := preload("res://scripts/ground_surface.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const Map := preload("res://scripts/atlas_data.gd")
const COAST := preload("res://assets/eclipse/open-moon-coast.webp")
const GOLD := Color("#f4d99d")
const INK := Color("#0b162be8")
var game: Node2D
var home: Control
var practice: Control
var options: OptionButton
var continue_button: Button
var travel_label: Label
var hero_buttons: Array[Button] = []
var chosen_hero := "An"
var lead: TextureRect

func _ready() -> void:
    _image(self, COAST, Rect2(0, 0, 960, 540))
    var tint := Gradient.new()
    tint.offsets = PackedFloat32Array([0.0, 0.48, 1.0])
    tint.colors = PackedColorArray([Color("#050a18f5"), Color("#0b163b9c"), Color("#0c142a16")])
    var shade := GradientTexture2D.new()
    shade.gradient = tint
    shade.fill_to = Vector2(1, 0)
    shade.width = 960
    shade.height = 16
    _image(self, shade, Rect2(0, 0, 960, 540))
    home = Control.new()
    add_child(home)
    var coast_ledge := GroundSurface.new()
    coast_ledge.position = Vector2(515, 453)
    coast_ledge.width = 445
    coast_ledge.depth = 95
    coast_ledge.masonry = true
    home.add_child(coast_ledge)
    lead = _image(home, Art.cell(Art.HEROES, 0, Art.HERO_CELL), Art.anchored_pose(Vector2(720, 453), 285))
    lead.stretch_mode = TextureRect.STRETCH_SCALE
    _text(home, Rect2(48, 44, 450, 39), "L I G H T   Q U E S T", 22, Color("#efe8ca"))
    _text(home, Rect2(46, 83, 550, 83), "ECLIPSE", 68, GOLD)
    _line(home, Rect2(51, 173, 324, 1), Color("#dfbe75"))
    travel_label = _text(home, Rect2(49, 186, 414, 31), "", 17, Color("#d4e2fa"))
    continue_button = _button(home, Rect2(49, 232, 326, 52), "", _begin, true)
    for i in range(2):
        var who := "An" if i == 0 else "Kha"
        var card := _button(home, Rect2(49 + i * 168, 303, 158, 101), "", _choose.bind(who))
        var pose := _image(card, Art.cell(Art.HEROES, i * 4, Art.HERO_CELL), Rect2(4, 3, 87, 94))
        pose.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
        _text(card, Rect2(88, 24, 61, 27), who, 19, GOLD)
        _text(card, Rect2(88, 51, 68, 22), "Kiếm" if i == 0 else "Pháp", 13, Color("#cdd9ef"))
        hero_buttons.append(card)
    _button(home, Rect2(49, 425, 158, 39), "Luyện tập", _practice)
    _button(home, Rect2(217, 425, 158, 39), "Cỗ Máy", game.enter_time_coast)
    _text(home, Rect2(49, 478, 390, 25), "V17   /   ECLIPSE", 12, Color("#9cafce"))
    practice = Panel.new()
    practice.position = Vector2(240, 86)
    practice.size = Vector2(480, 369)
    practice.add_theme_stylebox_override("panel", _style(INK, Color("#917755")))
    add_child(practice)
    _text(practice, Rect2(28, 24, 414, 42), "LUYỆN TẬP", 28, GOLD)
    _text(practice, Rect2(29, 70, 413, 28), "Chọn một màn và nhân vật", 15, Color("#cdd9ef"))
    options = OptionButton.new()
    options.position = Vector2(29, 120)
    options.size = Vector2(421, 46)
    options.custom_minimum_size.y = 46
    for i in range(7): options.add_item(Map.NAMES[i], i)
    options.select(game.journey_next)
    practice.add_child(options)
    _button(practice, Rect2(29, 186, 205, 51), "An", game.enter_practice.bind("An"), true)
    _button(practice, Rect2(244, 186, 205, 51), "Kha", game.enter_practice.bind("Kha"))
    _button(practice, Rect2(29, 268, 420, 43), "Về menu", show_home)
    show_home()

func show_home() -> void:
    practice.hide()
    home.show()
    refresh()

func refresh() -> void:
    var returning: bool = game.story_room >= 0
    if returning: chosen_hero = game.story_hero
    continue_button.text = "TIẾP TỤC" if returning else "ĐI CẢNH"
    travel_label.text = Map.NAMES[game.story_room] if returning else "Làng Trăng"
    lead.texture = Art.cell(Art.HEROES, 4 if chosen_hero == "Kha" else 0, Art.HERO_CELL)
    for i in hero_buttons.size():
        hero_buttons[i].modulate = GOLD if chosen_hero == ("An" if i == 0 else "Kha") else Color.WHITE
        hero_buttons[i].disabled = returning

func _choose(who: String) -> void:
    chosen_hero = who
    refresh()

func _begin() -> void:
    game.enter_journey(chosen_hero)

func _practice() -> void:
    home.hide()
    practice.show()

func _button(parent: Control, rect: Rect2, title: String, action: Callable, primary := false) -> Button:
    var button := Button.new()
    button.position = rect.position
    button.size = rect.size
    button.text = title
    button.add_theme_font_size_override("font_size", 19 if primary else 15)
    button.add_theme_color_override("font_color", GOLD if primary else Color("#dce9ff"))
    button.add_theme_stylebox_override("normal", _style(Color("#574022") if primary else INK, GOLD if primary else Color("#8d83a2")))
    button.add_theme_stylebox_override("hover", _style(Color("#2b4163"), GOLD))
    button.add_theme_stylebox_override("pressed", _style(Color("#604628"), GOLD))
    button.add_theme_stylebox_override("disabled", _style(INK, Color("#666d7d")))
    button.pressed.connect(action, CONNECT_DEFERRED)
    parent.add_child(button)
    return button

func _style(fill: Color, trim: Color) -> StyleBoxFlat:
    var style := StyleBoxFlat.new()
    style.bg_color = fill
    style.border_color = trim
    style.set_border_width_all(1)
    style.set_corner_radius_all(8)
    style.shadow_color = Color("#03071284")
    style.shadow_size = 6
    return style

func _text(parent: Control, rect: Rect2, value: String, point_size: int, tint: Color) -> Label:
    var label := Label.new()
    label.position = rect.position
    label.size = rect.size
    label.text = value
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", point_size)
    label.add_theme_color_override("font_color", tint)
    parent.add_child(label)
    return label

func _line(parent: Control, rect: Rect2, color: Color) -> void:
    var line := ColorRect.new()
    line.position = rect.position
    line.size = rect.size
    line.color = color
    line.mouse_filter = Control.MOUSE_FILTER_IGNORE
    parent.add_child(line)

func _image(parent: Control, texture: Texture2D, rect: Rect2) -> TextureRect:
    var image := TextureRect.new()
    image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    image.texture = texture
    image.position = rect.position
    image.size = rect.size
    image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
    image.mouse_filter = Control.MOUSE_FILTER_IGNORE
    parent.add_child(image)
    return image
