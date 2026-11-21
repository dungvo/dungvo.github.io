extends Control
## Draws the scaled minimap and the pannable atlas from the same live snapshot.
const Atlas := preload("res://scripts/atlas_data.gd")
const GOLD := Color("#ffe7ae")
const AQUA := Color("#99efef")
const LOCK := Color("#ff958c")
const INK := Color("#0c1426")
const OVERVIEW := [Vector2(6, 153), Vector2(128, 153), Vector2(251, 244),
    Vector2(365, 147), Vector2(472, 96), Vector2(559, 32), Vector2(675, 112)]
const RANK := 0.188
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
        for i in OVERVIEW.size():
            if Rect2(OVERVIEW[i], Atlas.SIZE * RANK + Vector2(5, 22)).has_point(coordinate):
                atlas.select_region(i)
                return
    else:
        coordinate *= Atlas.SIZE / size
        for room in Atlas.boxes(region).size():
            if Atlas.exists(region, room, era, atlas.repaired()) and Atlas.boxes(region)[room].has_point(coordinate):
                atlas.select_room(room)
                return

func _draw() -> void:
    if not is_instance_valid(atlas): return
    var base := Atlas.SIZE if region >= 0 else Vector2(800, 342)
    var fit := size / base
    draw_set_transform(shift, 0.0, fit * zoom)
    if not compact:
        for y in range(20, 342, 23):
            draw_line(Vector2(0, y), Vector2(base.x, y), Color("#9eb8d916"), 0.85)
        for x in range(25, int(base.x), 25):
            draw_line(Vector2(x, 0), Vector2(x, 342), Color("#9eb8d911"), 0.85)
    if region >= 0:
        _region(region, Vector2.ZERO, 1.0, not compact, true)
    else:
        for i in range(6):
            var a: Rect2 = Atlas.boxes(i)[3]
            var b: Rect2 = Atlas.boxes(i + 1)[0]
            var left: Vector2 = OVERVIEW[i] + a.get_center() * RANK
            var right: Vector2 = OVERVIEW[i + 1] + b.get_center() * RANK
            _link(left, right, Color("#cfb489"), atlas.gate(i, "exit", era), true)
        for i in OVERVIEW.size():
            _region(i, OVERVIEW[i], RANK, false, true)
            var font := ThemeDB.fallback_font
            draw_string(font, OVERVIEW[i] + Vector2(-14, 83), Atlas.NAMES[i],
                HORIZONTAL_ALIGNMENT_CENTER, 139, 14, Color(Atlas.COLORS[i]))

func _region(index: int, origin: Vector2, scale_value: float, labels: bool, markers: bool) -> void:
    var rooms := Atlas.boxes(index)
    var color := Color(Atlas.COLORS[index])
    var active: bool = index == atlas.current_region() and (index != 7 or era == atlas.current_era())
    var visited_era := era if index == 7 else 0
    var player_room: int = atlas.current_room() if active else -1
    for link in Atlas.links(index, era, atlas.repaired()):
        var left: Vector2 = rooms[link[0]].get_center() * scale_value + origin
        var right: Vector2 = rooms[link[1]].get_center() * scale_value + origin
        _link(left, right, color, atlas.gate(index, link[2], era), scale_value < 1.0)
    for i in rooms.size():
        if not Atlas.exists(index, i, era, atlas.repaired()): continue
        var rect: Rect2 = rooms[i]
        rect = Rect2(origin + rect.position * scale_value, rect.size * scale_value)
        var known: bool = atlas.discovered.has(Atlas.key(index, i, visited_era))
        _room(rect, color, i == player_room, known, scale_value < 1.0)
        if labels:
            var name: String = Atlas.names(index)[i]
            var font := ThemeDB.fallback_font
            draw_string(font, rect.position + Vector2(1, 20), name, HORIZONTAL_ALIGNMENT_CENTER,
                rect.size.x - 2, 14, GOLD if i == player_room else Color("#e4e8f4"))
    if markers and (region >= 0 or active):
        for pin in atlas.pins(index, era):
            var room := Atlas.locate(index, pin.at, era, atlas.repaired())
            if region == -1 and room != player_room: continue
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
        draw_circle(at, radius * 2.2, Color("#ffdb7c22"), true, -1.0, true)
        draw_circle(at, radius * 1.45, Color("#ffdb7c69"), true, -1.0, true)
        draw_circle(at, radius, GOLD, true, -1.0, true)

func _link(a: Vector2, b: Vector2, color: Color, reason: String, small: bool) -> void:
    var mid: Vector2
    var stroke := 1.35 if small else 2.7
    var path: PackedVector2Array
    if absf(b.x - a.x) > absf(b.y - a.y):
        mid = Vector2((a.x + b.x) * 0.5, (a.y + b.y) * 0.5)
        path = PackedVector2Array([a, Vector2(mid.x, a.y), Vector2(mid.x, b.y), b])
    else:
        mid = (a + b) * 0.5
        path = PackedVector2Array([a, Vector2(a.x, mid.y), Vector2(b.x, mid.y), b])
    draw_polyline(path, INK, stroke + 3, true)
    draw_polyline(path, color.darkened(0.22), stroke, true)
    if not reason.is_empty():
        var direction := Vector2.DOWN if absf(b.x - a.x) >= absf(b.y - a.y) else Vector2.RIGHT
        var span := 4.0 if small else 8.0
        draw_line(mid - direction * span, mid + direction * span, INK, stroke + 5, true)
        draw_line(mid - direction * span, mid + direction * span, LOCK, stroke + 1, true)

func _room(rect: Rect2, color: Color, active: bool, known: bool, small: bool) -> void:
    var notch := 3.0 if small else 7.0
    var a := rect.position
    var b := rect.end
    var shape := PackedVector2Array([a + Vector2(notch, 0), Vector2(b.x - notch, a.y),
        Vector2(b.x, a.y + notch), b - Vector2(0, notch), b - Vector2(notch, 0),
        Vector2(a.x + notch, b.y), Vector2(a.x, b.y - notch), a + Vector2(0, notch)])
    draw_colored_polygon(shape, color.darkened(0.55) if known or active else INK.lightened(0.07))
    if active or known:
        shape.append(shape[0])
        draw_polyline(shape, GOLD if active else color, 1.7 if not small else 1.15, true)
    else:
        for i in shape.size():
            draw_dashed_line(shape[i], shape[(i + 1) % shape.size()], color.darkened(0.24),
                1.0 if not small else 0.85, 5 if not small else 2.5, true, true)

func _anchor(at: Vector2, scale_value: float) -> void:
    draw_arc(at - Vector2(0, 7) * scale_value, 3.1 * scale_value, 0, TAU, 11, AQUA, 1.6, true)
    draw_line(at - Vector2(0, 4) * scale_value, at + Vector2(0, 8) * scale_value, AQUA, 1.8, true)
    draw_line(at - Vector2(4, 0) * scale_value, at + Vector2(4, 0) * scale_value, AQUA, 1.5, true)
    draw_arc(at + Vector2(0, 1) * scale_value, 7 * scale_value, 0.15, PI - 0.15, 12, AQUA, 1.6, true)

func _diamond(at: Vector2, radius: float, color: Color) -> void:
    draw_colored_polygon(PackedVector2Array([at + Vector2(0, -radius), at + Vector2(radius, 0),
        at + Vector2(0, radius), at + Vector2(-radius, 0)]), color)
    draw_circle(at, radius * 0.40, INK, true, -1.0, true)
