extends Node2D
## Painted silhouettes, tapered ribbons and timed accents, rendered by Godot CanvasItem.
## No lights, shaders, full-screen passes or per-frame nodes. Geometry is bounded on mobile.
const TINTS := [Color("#ff9eb8"), Color("#8be9ff"), Color("#ffd78b"), Color("#c5a1ff"), Color("#80efd6"), Color("#ffbe78")]
const MOTIFS := preload("res://assets/eclipse/six-arts-emblems.webp")
const INK := Color("#191d42")
const MAX_EVENTS := 10
const MAX_TRAIL := 16
var events: Array[Dictionary] = []
var trails: Array[Dictionary] = []
var clock := 0.0
var sample_clock := 0.0
var was_drawing := false
var mobile := false

func _ready() -> void:
    z_index = 1
    mobile = OS.has_feature("web_android") or OS.has_feature("web_ios") or DisplayServer.is_touchscreen_available()

func clear() -> void:
    events.clear()
    trails.clear()
    clock = 0
    sample_clock = 0
    moving_art = -1
    was_drawing = false
    queue_redraw()

func begin(id: int, at: Vector2, facing: int, target: Vector2) -> void:
    var duration: float = [0.62, 0.82, 0.85, 1.1, 1.0, 0.55][id]
    _event(id, at, facing, target, duration, false)

func impact(at: Vector2, facing: int) -> void:
    _event(5, at, facing, at, 0.82, true)

func contact(at: Vector2, id: int) -> void:
    # A compact hit confirmation; it does not obscure an enemy's next telegraph.
    _event(6, at, 1, Vector2(float(id), 0), 0.28, false)

func _event(id: int, at: Vector2, facing: int, target: Vector2, duration: float, landing: bool) -> void:
    if events.size() >= MAX_EVENTS: events.pop_front()
    events.append({"id":id, "p":at, "f":facing, "target":target, "age":0.0, "duration":duration, "landing":landing})
    queue_redraw()

func tick(delta: float, hero: Vector2, rush: float, rise: float, hook: float, dive: float, target: Vector2, facing: int) -> void:
    clock += delta
    for i in range(events.size() - 1, -1, -1):
        events[i].age = float(events[i].age) + delta
        if events[i].age >= events[i].duration: events.remove_at(i)
    for i in range(trails.size() - 1, -1, -1):
        trails[i].age = float(trails[i].age) + delta
        if trails[i].age > 0.24: trails.remove_at(i)
    var art := 0 if rush > 0 else (1 if rise > 0 else (2 if hook > 0 else (5 if dive > 0 else -1)))
    sample_clock -= delta
    if art >= 0 and sample_clock <= 0:
        sample_clock = 0.025 if not mobile else 0.033
        if trails.size() >= MAX_TRAIL: trails.pop_front()
        trails.append({"p":hero, "age":0.0, "id":art, "f":facing})
    # The moving parts are one small state record, not accumulated draw calls.
    moving_hero = hero
    moving_art = art
    moving_target = target
    moving_facing = facing
    var active := not events.is_empty() or not trails.is_empty() or art >= 0
    if active or was_drawing: queue_redraw()
    was_drawing = active

var moving_hero := Vector2.ZERO
var moving_target := Vector2.ZERO
var moving_art := -1
var moving_facing := 1

func _c(color: Color, alpha: float) -> Color:
    return Color(color, clampf(alpha, 0, 1))

func _ease(t: float) -> float:
    return 1.0 - pow(1.0 - clampf(t, 0, 1), 3)

func _curve(a: Vector2, b: Vector2, c: Vector2, steps := 20) -> PackedVector2Array:
    var points := PackedVector2Array()
    for i in range(steps + 1):
        var t := float(i) / steps
        points.append(a * (1-t)*(1-t) + b * 2*t*(1-t) + c*t*t)
    return points

func _ribbon(points: PackedVector2Array, width: float, tint: Color, alpha: float, glow := true) -> void:
    if points.size() < 2 or alpha <= 0.003: return
    if glow:
        draw_polyline(points, _c(tint, alpha * 0.07), width * 2.8, true)
        draw_polyline(points, _c(tint, alpha * 0.12), width * 1.65, true)
    # Independent four-point strips remain valid on a stopped or reversing trail.
    # One large outline self-intersects when movement collides or changes direction.
    for i in range(points.size()-1):
        var direction := points[i+1]-points[i]
        if direction.length_squared() < 0.01: continue
        var normal := direction.normalized().orthogonal()
        var w0 := maxf(0.3,sin(float(i)/(points.size()-1)*PI)*width*0.5)
        var w1 := maxf(0.3,sin(float(i+1)/(points.size()-1)*PI)*width*0.5)
        var strip := PackedVector2Array([points[i]+normal*w0,points[i]-normal*w0,points[i+1]-normal*w1,points[i+1]+normal*w1])
        draw_primitive(strip,PackedColorArray([_c(tint,alpha)]),PackedVector2Array())
    draw_polyline(points, _c(tint.lightened(0.8), alpha * 0.9), 1.2, true)

func _star(p: Vector2, radius: float, tint: Color, alpha: float, angle := 0.0) -> void:
    var points := PackedVector2Array()
    for i in range(8):
        points.append(p + Vector2.from_angle(angle + float(i)*TAU/8) * (radius if i%2 == 0 else radius*0.17))
    draw_circle(p, radius*1.2, _c(tint, alpha*0.08))
    draw_colored_polygon(points, _c(tint.lightened(0.55), alpha))
    draw_circle(p, maxf(0.7,radius*0.12), _c(Color.WHITE, alpha))

func _petal(p: Vector2, angle: float, length: float, width: float, tint: Color, alpha: float) -> void:
    var d := Vector2.from_angle(angle)
    var n := d.orthogonal()
    var points := _curve(p, p + d*length*0.4 + n*width, p + d*length, 10)
    points.append_array(_curve(p+d*length, p+d*length*0.4-n*width, p, 10))
    draw_colored_polygon(points, _c(INK, alpha*0.55))
    draw_colored_polygon(points, _c(tint, alpha*0.09))
    draw_polyline(points, _c(tint, alpha*0.85), 1.6, true)
    _ribbon(_curve(p,p+d*length*0.55+n*width*0.15,p+d*length),2,tint,alpha*0.45,false)

func _ellipse(p: Vector2, radius: float, squash: float, start: float, finish: float, tint: Color, width: float) -> void:
    var points := PackedVector2Array()
    for i in range(41):
        var angle := lerpf(start, finish, float(i)/40)
        points.append(p + Vector2(cos(angle), sin(angle)*squash)*radius)
    draw_polyline(points, tint, width, true)

func _embers(p: Vector2, tint: Color, age: float, duration: float, count: int, spread: float, bias := Vector2.ZERO) -> void:
    var fade := pow(maxf(0,1-age/duration), 1.4)
    for i in range(count if not mobile else maxi(5,count*2/3)):
        var angle := float(i)*2.39996
        var speed := spread*(0.35 + float((i*7)%11)/15)
        var direction := Vector2.from_angle(angle)
        var at := p + (direction*speed + bias)*age + Vector2(0,45*age*age)
        var length := 3 + float(i%4)*2
        draw_line(at-direction*length, at, _c(tint, fade*0.7), 1.3, true)
        if i%3 == 0: _star(at, 3+float(i%4), tint, fade, age+i)

func _draw() -> void:
    _draw_trails()
    for fx in events:
        var age: float = fx.age
        var t: float = age / fx.duration
        var alpha := pow(1.0-t, 1.2)
        var p: Vector2 = fx.p
        var id: int = fx.id
        var f: float = fx.f
        var tint: Color = TINTS[mini(id,5)]
        match id:
            0:
                # Crystal splinters stay at the point where the dash took off.
                for i in range(7):
                    var shard := p + Vector2(f * (16 - i * 10 - age * 87), (i % 3 - 1) * (7 + age * 38))
                    _petal(shard, 0 if f > 0 else PI, 18 - i, 4, tint, alpha)
            1:
                for i in range(6):
                    var feather := p + Vector2((i % 2 * 2 - 1) * (15 + i * 6 + age * 22), -i * 8 + age * age * 125)
                    _petal(feather, 0.8 + i * 0.32, 15, 5, tint, alpha)
            2:
                _motif(2, fx.target - Vector2(0,24), Vector2.ONE * (40 + sin(t*PI)*13), alpha, sin(t*TAU)*0.14)
            3:
                var opening := clampf(age / 0.13, 0.08, 1.0)
                var eye := p - Vector2(0,65)
                _motif(3, eye, Vector2(148,94*opening), alpha)
                for i in range(5):
                    var beam_x := (i - 2) * 41.0
                    var reach := _ease(t) * 90
                    draw_line(eye + Vector2(beam_x * 0.18, 12), eye + Vector2(beam_x, reach), _c(tint, alpha*0.34), 1.5, true)
            4:
                _draw_bell(p, age, t, tint)
            5:
                if fx.landing: _draw_landing(p, age, t, tint)
            6:
                tint = TINTS[clampi(int(fx.target.x),0,5)]
                _star(p,28*_ease(t),tint,alpha,PI/4)
                _embers(p,tint,age,fx.duration,8,140)
    _draw_moving()

func _motif(id: int, center: Vector2, extent: Vector2, alpha: float, angle := 0.0, flip := false) -> void:
    var cell := MOTIFS.get_size() / Vector2(3, 2)
    var source := Rect2(Vector2(id % 3, floori(id / 3.0)) * cell, cell)
    draw_set_transform(center, angle, Vector2(-1 if flip else 1, 1))
    draw_texture_rect_region(MOTIFS, Rect2(-extent * 0.5, extent), source, Color(1, 1, 1, alpha))
    draw_set_transform(Vector2.ZERO)

func _draw_bell(p: Vector2, age: float, t: float, tint: Color) -> void:
    var alpha := 1.0 - t
    var swing := sin(age * 16) * 0.24 * alpha
    var pivot := p - Vector2(0, 89)
    _motif(4, pivot + Vector2(0, 30).rotated(swing), Vector2(72, 72), minf(1, alpha*2), swing)
    for beat in range(3):
        var u := (age - beat * 0.14) / 0.7
        if u <= 0 or u >= 1: continue
        var radius := lerpf(26, 208, _ease(u))
        for side in [0.0, PI]:
            _ellipse(p - Vector2(0,18), radius, 0.55, side-0.9, side+0.9, _c(tint, (1-u)*0.86), 5.0-beat)

func _draw_landing(p: Vector2, age: float, t: float, tint: Color) -> void:
    var spread := _ease(minf(t * 2.4, 1))
    var alpha := minf(1, (1-t)*2)
    _motif(5, p - Vector2(0, 16), Vector2(55 + 225*spread, 57 + 70*spread), alpha)
    for i in range(8):
        var side := -1 if i % 2 == 0 else 1
        var offset := Vector2(side*(15 + age*(95 + i*16)), -age*(145 + (i%3)*55) + age*age*330)
        _petal(p + offset, age * side * 4 + i, 12+i, 7, tint.darkened(0.24), alpha)

func _draw_trails() -> void:
    for id in [0]:
        var points := PackedVector2Array()
        var alpha := 0.0
        for trail in trails:
            if trail.id != id: continue
            points.append(trail.p+Vector2(0,7))
            alpha = maxf(alpha,1-float(trail.age)/0.24)
        if points.size() < 2 or points[0].distance_to(points[-1]) < 3: continue
        _ribbon(points,26 if id == 0 else 19,TINTS[id],alpha*0.5)
        # Offset hairline filaments add motion without copying the actor or flashing it.
        for side in [-1,1]:
            var strand := PackedVector2Array()
            for i in range(points.size()): strand.append(points[i]+Vector2(side*8,sin(i*0.7+clock*9)*4))
            draw_polyline(strand,_c(TINTS[id],alpha*0.38),1,true)

func _draw_moving() -> void:
    var p := moving_hero
    match moving_art:
        0:
            _motif(0, p + Vector2(moving_facing*10, 0), Vector2(147, 53), 0.95, 0, moving_facing < 0)
        1:
            var spread := 1.0 + sin(clock*19)*0.09
            _motif(1, p + Vector2(0, -12), Vector2(133*spread, 102/spread), 0.98)
        2:
            var origin := p+Vector2(0,-10)
            var target := moving_target-Vector2(0,24)
            var direction := target-origin
            var normal := direction.normalized().orthogonal()
            for strand in [-1,0,1]:
                var points := PackedVector2Array()
                for i in range(33):
                    var t := float(i)/32
                    var weave := sin(t*TAU*1.5-clock*18+strand*1.6)*sin(t*PI)*7
                    points.append(origin.lerp(target,t)+normal*(weave+strand*sin(t*PI)*7))
                _ribbon(points,2.6 if strand == 0 else 1.3,TINTS[2],0.95 if strand == 0 else 0.6)
            for i in range(3):
                var t := fposmod(clock*2.2+float(i)/3,1)
                _star(origin.lerp(target,t),5,TINTS[2],sin(t*PI)*0.9,PI/4)
            _motif(2, target, Vector2(39, 39), 0.95)
        5:
            var wake := PackedVector2Array([p+Vector2(-12,-76), p+Vector2(1,30), p+Vector2(12,-76), p+Vector2(0,-40)])
            draw_colored_polygon(wake, _c(TINTS[5], 0.68))
            draw_line(p-Vector2(0,56), p+Vector2(0,29), Color("#fff2c7"), 3.0, true)
