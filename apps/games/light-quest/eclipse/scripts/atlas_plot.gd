extends Control
## Draws the scaled minimap and the pannable atlas from the same live snapshot.
const Atlas := preload("res://scripts/atlas_data.gd")
const GOLD := Color("#ffe7ae")
const AQUA := Color("#99efef")
const LOCK := Color("#ff958c")
const INK := Color("#0c1426")
const LANDSCAPE := preload("res://assets/eclipse/moon-cartography.webp")
const FRONTIER := Color("#9da5b7")
const SILHOUETTES := [
        [Vector2(0,.28),Vector2(.19,.28),Vector2(.19,0),Vector2(.85,0),Vector2(.85,.12),Vector2(1,.12),Vector2(1,1),Vector2(.12,1),Vector2(.12,.83),Vector2(0,.83)],
        [Vector2(0,.12),Vector2(.30,.12),Vector2(.30,0),Vector2(.66,0),Vector2(.66,.18),Vector2(1,.18),Vector2(1,.80),Vector2(.81,.80),Vector2(.81,1),Vector2(0,1)],
        [Vector2(0,.15),Vector2(.13,0),Vector2(.83,0),Vector2(1,.20),Vector2(1,1),Vector2(.61,1),Vector2(.61,.88),Vector2(0,.88)],
        [Vector2(0,.26),Vector2(.12,.26),Vector2(.12,.10),Vector2(.29,.10),Vector2(.29,0),Vector2(.73,0),Vector2(.73,.12),Vector2(.91,.12),Vector2(.91,.26),Vector2(1,.26),Vector2(1,1),Vector2(0,1)],
        [Vector2(0,0),Vector2(.74,0),Vector2(.74,.16),Vector2(1,.16),Vector2(1,.82),Vector2(.79,.82),Vector2(.79,1),Vector2(.19,1),Vector2(.19,.84),Vector2(0,.84)]
    ]

var atlas: CanvasLayer
var compact := false
var region := -1
var era := 1
var zoom := 1.0
var shift := Vector2.ZERO
var drag := false
var down_at := Vector2.ZERO

func _ready() -> void:
    clip_contents = true
    mouse_filter = Control.MOUSE_FILTER_IGNORE if compact else Control.MOUSE_FILTER_STOP

func reset_view() -> void:
    zoom = 1.0
    shift = Vector2.ZERO
    drag = false
    queue_redraw()

func magnify(step: float, pivot: Vector2) -> void:
    var next := clampf(zoom + step, 1.0, 2.5)
    shift = pivot - (pivot - shift) * next / zoom
    zoom = next
    _limit_pan()
    queue_redraw()

func _limit_pan() -> void:
    shift = shift.clamp(size * (1.0 - zoom), Vector2.ZERO)

func _gui_input(event: InputEvent) -> void:
    if event is InputEventMouseButton:
        if event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
            magnify(0.25, event.position)
        elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
            magnify(-0.25, event.position)
        elif event.button_index == MOUSE_BUTTON_LEFT:
            if event.pressed:
                drag = true
                down_at = event.position
            else:
                if drag and event.position.distance_to(down_at) < 9.0:
                    _select_at(event.position)
                drag = false
        accept_event()
    elif event is InputEventMouseMotion:
        if drag:
            shift += event.relative
            _limit_pan()
            queue_redraw()
            accept_event()
    elif event is InputEventMagnifyGesture:
        magnify(zoom * (event.factor - 1.0), event.position)
        accept_event()

func _select_at(at: Vector2) -> void:
    var coordinate := (at - shift) / zoom
    if region == -1:
        coordinate *= Vector2(800, 342) / size
        for i in range(7):
            if not atlas.region_visible(i): continue
            for area: Rect2 in Atlas.WORLD_ROOMS[i]:
                if area.grow(5).has_point(coordinate):
                    atlas.select_region(i)
                    return
    else:
        coordinate *= Atlas.SIZE / size
        for room in Atlas.boxes(region).size():
            if atlas.room_visible(region, room, era) and Atlas.exists(region, room, era, atlas.repaired()) and Atlas.boxes(region)[room].has_point(coordinate):
                atlas.select_room(room)
                return

func _draw() -> void:
    if not is_instance_valid(atlas): return
    var base := Atlas.SIZE if region >= 0 else Vector2(800, 342)
    var fit := size / base
    draw_set_transform(shift, 0.0, fit * zoom)
    if not compact:
        var source := Rect2(Vector2.ZERO, LANDSCAPE.get_size())
        var plate := Rect2(Vector2.ZERO, base)
        if region >= 0:
            # A regional detail on the same engraved sheet.
            var window := Vector2(source.size.x * 0.60, source.size.y * 0.78)
            var center: Vector2 = Atlas.WORLD_ROOMS[mini(region, 6)][1].get_center() / Vector2(800, 342)
            source.position = (source.size * center - window * 0.5).clamp(Vector2.ZERO, source.size - window)
            source.size = window
        draw_texture_rect_region(LANDSCAPE, plate, source, Color("#bac2d3"))
        draw_rect(plate, Color("#10132935"))
        draw_rect(plate.grow(-1), Color("#af987a7c"), false, 1.2)
    if region >= 0:
        _region(region, Vector2.ZERO, 1.0, not compact, true)
    else:
        _world()

func _world() -> void:
    var current: int = atlas.current_region()
    for chapter in range(7):
        var color := Color(Atlas.COLORS[chapter])
        for link in Atlas.links(chapter, era, false):
            _world_link(chapter, link[0], chapter, link[1], color, link[2])
        if chapter < 6:
            _world_link(chapter, 3, chapter + 1, 0, Color("#efd19c"), "exit")
    for chapter in range(7):
        var color := Color(Atlas.COLORS[chapter])
        var rooms: Array = Atlas.WORLD_ROOMS[chapter]
        for i in rooms.size():
            var rect: Rect2 = rooms[i]
            var known: bool = atlas.discovered.has(Atlas.key(chapter, i, 0))
            var here: bool = chapter == current and i == atlas.current_room()
            _room(rect, color, here, known, true, _profile(chapter, i))
        var label_at: Vector2 = Atlas.WORLD_LABELS[chapter]
        var name_text: String = Atlas.NAMES[chapter]
        var font := ThemeDB.fallback_font
        draw_string_outline(font, label_at, name_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, 4, INK)
        draw_string(font, label_at, name_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, GOLD if chapter == current else color.lightened(0.35))
        for pin in atlas.pins(chapter, era):
            var room := Atlas.locate(chapter, pin.at, era, false)
            if not atlas.room_visible(chapter, room, era): continue
            var at := _world_position(chapter, room, pin.at)
            if pin.kind == "hook": _anchor(at, 0.45)
            else: _diamond(at, 4.4, AQUA if pin.live else Color("#a6bbbf"))
    if current < 7:
        _player_mark(_world_position(current, atlas.current_room(), atlas.local_position()), 4.8)

func _world_position(chapter: int, room: int, at: Vector2) -> Vector2:
    var chart: Rect2 = Atlas.boxes(chapter)[room]
    var ratio := (Atlas.project(chapter, room, at) - chart.position) / chart.size
    var tile: Rect2 = Atlas.WORLD_ROOMS[chapter][room]
    return tile.position + ratio * tile.size

func _world_link(chapter: int, room: int, next_chapter: int, next_room: int, tint: Color, gate: String) -> void:
    var a: Rect2 = Atlas.WORLD_ROOMS[chapter][room]
    var b: Rect2 = Atlas.WORLD_ROOMS[next_chapter][next_room]
    var charted: bool = atlas.room_visible(chapter, room, era) and atlas.room_visible(next_chapter, next_room, era)
    var left := a.get_center()
    var right := b.get_center()
    # The village-to-crypt and summit-to-shore descents use independent shafts.
    if chapter != next_chapter:
        var shaft: float = [196, 378, 385, 480, 586, 712][chapter]
        var line := PackedVector2Array([left, Vector2(shaft, left.y), Vector2(shaft, right.y), right])
        draw_polyline(line, INK, 3.0, true)
        draw_polyline(line, tint if charted else Color("#a69ca2"), 1.5, true)
        if charted and not atlas.gate(chapter, gate, era).is_empty():
            var mid := Vector2(shaft, (left.y + right.y) * 0.5)
            draw_line(mid - Vector2(4,0), mid + Vector2(4,0), LOCK, 2.4, true)
    else:
        _link(left, right, tint if charted else FRONTIER.darkened(0.24), atlas.gate(chapter, gate, era) if charted else "", true)

func _profile(index: int, room: int) -> int:
    return (index * 3 + room) % 5

func _region(index: int, origin: Vector2, scale_value: float, labels: bool, markers: bool) -> void:
    var rooms := Atlas.boxes(index)
    var color := Color(Atlas.COLORS[index])
    var active: bool = index == atlas.current_region() and (index != 7 or era == atlas.current_era())
    var visited_era := era if index == 7 else 0
    var player_room: int = atlas.current_room() if active else -1
    for link in Atlas.links(index, era, atlas.repaired()):
        var left: Vector2 = rooms[link[0]].get_center() * scale_value + origin
        var right: Vector2 = rooms[link[1]].get_center() * scale_value + origin
        var left_seen: bool = atlas.room_visible(index, link[0], era)
        var right_seen: bool = atlas.room_visible(index, link[1], era)
        if left_seen and right_seen:
            _link(left, right, color, atlas.gate(index, link[2], era), scale_value < 1.0)
        elif not compact or left_seen or right_seen:
            _link(left, right, FRONTIER.darkened(0.35), "", scale_value < 1.0)
        if left_seen != right_seen:
            var seen: Vector2 = left if left_seen else right
            var edge: Vector2 = right if left_seen else left
            var room: Rect2 = rooms[link[0] if left_seen else link[1]]
            var outward := seen.direction_to(edge)
            var span := room.size * scale_value * 0.5
            var border := minf(span.x / maxf(0.001, absf(outward.x)), span.y / maxf(0.001, absf(outward.y)))
            var start := seen + outward * border
            var finish := start + outward * (4.0 if scale_value < 1.0 else 16.0)
            var tint := color if atlas.gate(index, link[2], era).is_empty() else LOCK
            draw_dashed_line(start, finish, tint, 2.0 if not compact else 6.0, 3.0 if not compact else 12.0, true, true)
    for i in rooms.size():
        if not Atlas.exists(index, i, era, atlas.repaired()): continue
        var rect: Rect2 = rooms[i]
        rect = Rect2(origin + rect.position * scale_value, rect.size * scale_value)
        var known: bool = atlas.discovered.has(Atlas.key(index, i, visited_era))
        _room(rect, color, i == player_room, known, scale_value < 1.0, _profile(index, i))
        if labels and atlas.room_visible(index, i, era):
            for lip in atlas.terrain(index, i, era):
                var left := origin + Atlas.project(index, i, lip.position, true) * scale_value
                var right := origin + Atlas.project(index, i, lip.position + Vector2(lip.size.x, 0), true) * scale_value
                if left.distance_to(right) < 2.5: continue
                draw_line(left, right, Color(color.lightened(0.34), 0.64), 1.6, true)
                draw_line(left + Vector2(0, 3), right + Vector2(0, 3), Color(color, 0.22), 2.5, true)
            var name: String = Atlas.names(index)[i]
            var font := ThemeDB.fallback_font
            draw_string(font, rect.position + Vector2(1, 20), name, HORIZONTAL_ALIGNMENT_CENTER,
                rect.size.x - 2, 14, GOLD if i == player_room else Color("#e4e8f4"))
    if markers and (region >= 0 or active):
        for pin in atlas.pins(index, era):
            var room := Atlas.locate(index, pin.at, era, atlas.repaired())
            if not atlas.room_visible(index, room, era) or (region == -1 and room != player_room): continue
            var at := origin + Atlas.project(index, room, pin.at, labels) * scale_value
            if compact:
                draw_circle(at, 7.0, AQUA if pin.kind == "hook" or pin.live else Color("#a1afbb"), true, -1.0, true)
            elif pin.kind == "hook":
                _anchor(at, 0.85 if scale_value == 1 else 0.55)
            else:
                _diamond(at, 6.0 if scale_value == 1 else 3.0, AQUA if pin.live else Color("#a1afbb"))
    if active and player_room >= 0:
        var at := origin + Atlas.project(index, player_room, atlas.local_position(), labels) * scale_value
        var radius := 10.0 if compact else (5.0 if scale_value == 1.0 else 4.0)
        _player_mark(at, radius)

func _player_mark(at: Vector2, radius: float) -> void:
        draw_circle(at, radius * 2.2, Color("#ffdb7c22"), true, -1.0, true)
        draw_circle(at, radius * 1.45, Color("#ffdb7c69"), true, -1.0, true)
        draw_circle(at, radius, GOLD, true, -1.0, true)
        draw_circle(at, radius * 0.47, Color("#fffbea"), true, -1, true)

func _link(a: Vector2, b: Vector2, color: Color, reason: String, small: bool) -> void:
    var mid: Vector2
    var stroke := 7.0 if compact else (1.35 if small else 2.7)
    var path: PackedVector2Array
    if absf(b.x - a.x) > absf(b.y - a.y):
        mid = Vector2((a.x + b.x) * 0.5, (a.y + b.y) * 0.5)
        path = PackedVector2Array([a, Vector2(mid.x, a.y), Vector2(mid.x, b.y), b])
    else:
        mid = (a + b) * 0.5
        path = PackedVector2Array([a, Vector2(a.x, mid.y), Vector2(b.x, mid.y), b])
    draw_polyline(path, INK, stroke + (1.3 if small else 3.0), true)
    draw_polyline(path, color if compact else color.darkened(0.22), stroke, true)
    if not reason.is_empty():
        var direction := Vector2.DOWN if absf(b.x - a.x) >= absf(b.y - a.y) else Vector2.RIGHT
        var span := 16.0 if compact else (4.0 if small else 8.0)
        draw_line(mid - direction * span, mid + direction * span, INK, stroke + 5, true)
        draw_line(mid - direction * span, mid + direction * span, LOCK, stroke + 1, true)

func _room(rect: Rect2, color: Color, active: bool, known: bool, small: bool, profile: int) -> void:
    # Stepped roofs, undercrofts and shafts give the chambers a side elevation.
    var shape := PackedVector2Array()
    for unit: Vector2 in SILHOUETTES[profile]:
        shape.append(rect.position + rect.size * unit)
    var fill := INK.lerp(color, 0.44 if active else (0.33 if known else 0.15))
    if compact or small:
        draw_colored_polygon(shape, fill)
    else:
        var tones := PackedColorArray()
        for at in shape:
            tones.append(fill.lightened(0.075).lerp(fill.darkened(0.35), (at.y - rect.position.y) / rect.size.y))
        draw_polygon(shape, tones)
    if active or known:
        shape.append(shape[0])
        var stroke := 7.0 if compact else (1.15 if small else 1.7)
        draw_polyline(shape, GOLD if active else color, stroke, true)
    else:
        for i in shape.size():
            draw_dashed_line(shape[i], shape[(i + 1) % shape.size()], Color(color.lerp(FRONTIER, 0.6), 0.77),
                5.5 if compact else (1.1 if small else 1.2),
                17.0 if compact else (2.5 if small else 5.0), true, true)

func _anchor(at: Vector2, scale_value: float) -> void:
    draw_arc(at - Vector2(0, 7) * scale_value, 3.1 * scale_value, 0, TAU, 11, AQUA, 1.6, true)
    draw_line(at - Vector2(0, 4) * scale_value, at + Vector2(0, 8) * scale_value, AQUA, 1.8, true)
    draw_line(at - Vector2(4, 0) * scale_value, at + Vector2(4, 0) * scale_value, AQUA, 1.5, true)
    draw_arc(at + Vector2(0, 1) * scale_value, 7 * scale_value, 0.15, PI - 0.15, 12, AQUA, 1.6, true)

func _diamond(at: Vector2, radius: float, color: Color) -> void:
    draw_colored_polygon(PackedVector2Array([at + Vector2(0, -radius), at + Vector2(radius, 0),
        at + Vector2(0, radius), at + Vector2(-radius, 0)]), color)
    draw_circle(at, radius * 0.40, INK, true, -1.0, true)
