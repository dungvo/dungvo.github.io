extends CanvasLayer

const WEAPONS := ["Nguyệt Thép · cân bằng", "Tơ Bạc · tầm xa", "Tinh Thạch · trọng kích"]
const DETAILS := ["Nhịp đánh và tầm đánh tiêu chuẩn.", "Kiếm vươn xa hơn / đạn bay nhanh hơn. Ra đòn chậm hơn.", "Đòn thường thêm 1 sát thương. Hồi đòn chậm hơn."]
var weapon := 0
var favorite := -1
var game: Node2D
var panel: PanelContainer
var opener: Button
var weapon_choice: OptionButton
var art_choice: OptionButton
var description: Label

func _ready() -> void:
    game = get_parent()
    layer = 12
    opener = Button.new()
    opener.text = "TRANG BỊ · I"
    opener.position = Vector2(21, 88)
    opener.size = Vector2(125, 36)
    opener.focus_mode = Control.FOCUS_NONE
    opener.pressed.connect(toggle)
    add_child(opener)
    panel = PanelContainer.new()
    panel.position = Vector2(207, 104)
    panel.custom_minimum_size = Vector2(546, 290)
    panel.add_theme_stylebox_override("panel", game._panel_style())
    add_child(panel)
    var column := VBoxContainer.new()
    column.add_theme_constant_override("separation", 9)
    panel.add_child(column)
    var title := Label.new()
    title.text = "TRANG BỊ HÀNH TRÌNH"
    title.add_theme_font_size_override("font_size", 24)
    column.add_child(title)
    weapon_choice = OptionButton.new()
    for name_text in WEAPONS: weapon_choice.add_item(name_text)
    weapon_choice.item_selected.connect(_choose_weapon)
    column.add_child(weapon_choice)
    description = Label.new()
    column.add_child(description)
    var hint := Label.new()
    hint.text = "Ấn ưu tiên · hồi nhanh hơn 20% · F / ẤN dùng nhanh"
    column.add_child(hint)
    art_choice = OptionButton.new()
    art_choice.add_item("Theo ấn vừa dùng")
    for i in range(6): art_choice.add_item(game.arts.NAMES[i] + " · " + game.arts.USES[i])
    art_choice.item_selected.connect(_choose_art)
    column.add_child(art_choice)
    var close := Button.new()
    close.text = "TIẾP TỤC"
    close.custom_minimum_size.y = 38
    close.pressed.connect(toggle)
    column.add_child(close)
    panel.hide()
    opener.hide()

func _process(_delta: float) -> void:
    opener.visible = game.started and not game.dialogue.visible and not game.victory_panel.visible

func toggle() -> void:
    if not game.started: return
    panel.visible = not panel.visible
    game._reset_touch()
    game.joystick.accept_touch = not panel.visible
    weapon_choice.select(weapon)
    art_choice.select(favorite + 1)
    description.text = DETAILS[weapon]

func _choose_weapon(index: int) -> void:
    weapon = index
    description.text = DETAILS[weapon]
    game._persist()

func _choose_art(index: int) -> void:
    favorite = index - 1
    game._persist()

func quick_art() -> int:
    return favorite if favorite >= 0 else game.arts.selected
