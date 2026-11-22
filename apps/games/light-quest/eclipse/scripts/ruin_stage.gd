extends Node2D

const GroundSurface := preload("res://scripts/ground_surface.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const PUZZLE_HALL := preload("res://assets/eclipse/crystal-tower.webp")
const GUARDIAN_HALL := preload("res://assets/eclipse/guardian-hall.webp")
const KEEPER := preload("res://assets/eclipse/keeper.webp")
const ROOM_W := 960.0

var background: TextureRect
var previous_back: TextureRect
var crossfade: Tween
var gate: Sprite2D
var textures: Array[AtlasTexture] = []
var plaza_chest: Sprite2D
var play_surfaces: Array[Node2D] = []

func _ready() -> void:
    z_index = -2
    for index in range(10):
        textures.append(Art.ruin(index))
    var back := CanvasLayer.new()
    back.layer = -2
    add_child(back)
    background = TextureRect.new()
    background.texture = Art.SCENERY
    background.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
    background.stretch_mode = TextureRect.STRETCH_SCALE
    background.mouse_filter = Control.MOUSE_FILTER_IGNORE
    background.position = Vector2(-64, 0)
    background.size = Vector2(1088, 572)
    back.add_child(background)
    previous_back = background.duplicate() as TextureRect
    previous_back.hide()
    back.add_child(previous_back)
    var keeper := Sprite2D.new()
    keeper.texture = KEEPER
    keeper.scale = Vector2.ONE * (62.0 / KEEPER.get_height())
    keeper.position = Vector2(290, 425)
    keeper.z_index = 3
    add_child(keeper)
    for room in range(7):
        var x := room * ROOM_W
        for pos in [Vector2(x + 18, 456), Vector2(x + 938, 456)]:
            _prop(3, pos, Vector2(69, 85))
        _prop(3, Vector2(x + 784, 456), Vector2(45, 57))
        if room in [0, 1, 4, 6]:
            var portal := _prop(7 if room in [1, 6] else 1, Vector2(x + 149, 456), Vector2(153, 223))
            portal.modulate = Color("#8d9ac6")
        var pillar_x := 904.0 if room in [0, 2, 4, 6] else 55.0
        _prop(6, Vector2(x + pillar_x, 456), Vector2(98, 265)).modulate = Color("#819cbd")
        for offset in [Vector2(7, 68), Vector2(813, 77)]:
            var leaves := _prop(8, Vector2(x + offset.x, 456 + offset.y), Vector2(208, 102))
            leaves.z_index = -1
            leaves.modulate = Color("#bfc2d9")
    _dress_forest()
    plaza_chest = _prop(9, Vector2(2 * ROOM_W + 570, 456), Vector2(54, 32))
    _prop(5, Vector2(5 * ROOM_W + 260, 456), Vector2(62, 97))
    _prop(5, Vector2(6 * ROOM_W + 432, 456), Vector2(71, 109))
    gate = _prop(1, Vector2(5 * ROOM_W, 456), Vector2(174, 305))

func _dress_forest() -> void:
    var x := ROOM_W
    _prop(5, Vector2(x + 269, 375), Vector2(44, 79))
    _prop(3, Vector2(x + 577, 375), Vector2(47, 56))
    var low_arch := _prop(7, Vector2(x + 659, 457), Vector2(114, 139))
    low_arch.modulate = Color("#748cb3")
    var garden := _prop(8, Vector2(x + 226, 451), Vector2(117, 55))
    garden.z_index = -1
    garden.modulate = Color("#c5c6f2")
    var trail := _prop(8, Vector2(x + 725, 559), Vector2(194, 107))
    trail.z_index = 2
    trail.modulate = Color("#a3b5e6")
    _prop(3, Vector2(x + 919, 456), Vector2(86, 108))

func update_camera(camera_x: float, opened: bool, immediate := false) -> void:
    background.position.x = -63.0 - sin(camera_x * 0.0016) * 48.0
    previous_back.position.x = background.position.x
    gate.visible = false # Legacy gate belongs to the original campaign, not these chapters.
    var raw_room := clampi(int(camera_x / ROOM_W), 0, 6)
    var room: int = [0, 0, 1, 1, 2, 2, 6][raw_room]
    var palette := [Color("#bdcce7"), Color.WHITE, Color("#b5a3cc"), Color.WHITE, Color("#baaecf"), Color("#adceda"), Color.WHITE]
    var target: Texture2D = PUZZLE_HALL if room == 3 else (GUARDIAN_HALL if room in [2, 6] else Art.SCENERY)
    if background.texture != target:
        if crossfade and crossfade.is_valid(): crossfade.kill()
        previous_back.texture = background.texture
        previous_back.modulate = background.modulate
        previous_back.visible = not immediate
        background.texture = target
        if not immediate:
            crossfade = create_tween()
            crossfade.tween_property(previous_back, "modulate:a", 0.0, 0.23)
            crossfade.tween_callback(previous_back.hide)
    background.modulate = palette[room] if immediate else background.modulate.lerp(palette[room], 0.055)

func platform(rect: Rect2, collider: PhysicsBody2D) -> void:
    var tile := surface(rect,self,rect.size.y > 60)
    tile.collider = collider
    play_surfaces.append(tile)

func surface(rect: Rect2, parent: Node, masonry := false) -> Node2D:
    var tile := GroundSurface.new()
    tile.position = rect.position
    tile.width = rect.size.x
    tile.depth = 129.0 if masonry else maxf(32.0, rect.size.y)
    tile.masonry = masonry
    parent.add_child(tile)
    return tile

func _prop(index: int, bottom: Vector2, dimensions: Vector2) -> Sprite2D:
    var sprite := Sprite2D.new()
    sprite.texture = textures[index]
    sprite.position = bottom - Vector2(0, dimensions.y * 0.5)
    sprite.scale = dimensions / sprite.texture.get_size()
    add_child(sprite)
    return sprite
