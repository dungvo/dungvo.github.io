extends Node2D
## Painted silhouettes, tapered ribbons and timed accents, rendered by Godot CanvasItem.
## No lights, shaders, full-screen passes or per-frame nodes. Geometry is bounded on mobile.
const TINTS := [Color("#ff9eb8"), Color("#8be9ff"), Color("#ffd78b"), Color("#c5a1ff"), Color("#80efd6"), Color("#ffbe78")]
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
            0: _draw_crescent(p, f, age, t, tint)
            1: _draw_ascent(p, age, t, tint)
            2:
                var at: Vector2 = fx.target - Vector2(0,24)
                _star(at, 18+sin(t*PI)*10, tint, alpha, age*2)
                _ellipse(at, 17+_ease(t)*22, 0.65, -PI, PI, _c(tint,alpha*0.65), 1.5)
                _embers(at,tint,age,fx.duration,9,65)
            3: _draw_eye(p, age, t, tint)
            4: _draw_bell(p, age, t, tint)
            5:
                if fx.landing: _draw_landing(p,age,t,tint)
                else:
                    _ellipse(p,32+_ease(t)*12,0.35,-PI,PI,_c(tint,alpha*0.75),2)
                    _star(p+Vector2(0,22),22,tint,alpha,PI/4)
            6:
                tint = TINTS[clampi(int(fx.target.x),0,5)]
                _star(p,28*_ease(t),tint,alpha,PI/4)
                _embers(p,tint,age,fx.duration,8,140)
    _draw_moving()

func _draw_crescent(p: Vector2, f: float, age: float, t: float, tint: Color) -> void:
    var alpha := pow(1-t,1.3)
    var sweep := _ease(minf(t*2.4,1))
    var center := p + Vector2(f*(15+sweep*80),-5)
    var points := PackedVector2Array()
    for i in range(33):
        var u := float(i)/32
        var angle := lerpf(-1.65,1.65,u)
        points.append(center+Vector2(f*cos(angle)*(58+sweep*16),sin(angle)*66))
    # Dark edge is readable even against the bright cloud backgrounds.
    _ribbon(points,28,tint.darkened(0.75),alpha*0.9,false)
    _ribbon(points,17,tint,alpha)
    var back := _curve(p+Vector2(-f*70,8),p+Vector2(f*5,-42),center+Vector2(f*58,-6))
    _ribbon(back,12,tint.lightened(0.3),alpha*0.8)
    _star(center+Vector2(f*65,0),19,tint,alpha,PI/4)
    _embers(center,tint,age,0.62,14,160,Vector2(f*80,0))

func _draw_ascent(p: Vector2, age: float, t: float, tint: Color) -> void:
    var alpha := pow(1-t,1.1)
    var radius := 25+_ease(t)*48
    _ellipse(p+Vector2(0,22),radius,0.23,-PI,PI,_c(INK,alpha*0.65),8)
    _ellipse(p+Vector2(0,22),radius,0.23,-PI,PI,_c(tint,alpha),2)
    for side in [-1,1]:
        for i in range(3):
            var start := p+Vector2(side*(8+i*8),16)
            var end := p+Vector2(side*(30+i*14),-60-_ease(t)*80+i*18)
            _ribbon(_curve(start,p+Vector2(side*(80+i*8),-24),end),10-i*2,tint,alpha*0.8)
    _embers(p,tint,age,0.82,14,85,Vector2(0,-120))

func _draw_eye(p: Vector2, age: float, t: float, tint: Color) -> void:
    var alpha := pow(1-t,0.8)*minf(age/0.055,1)
    var center := p+Vector2(0,-55)
    var opening := minf(age/0.16,1)
    for side in [-1,1]:
        var lid := _curve(center+Vector2(-48,0),center+Vector2(0,side*40*opening),center+Vector2(48,0),24)
        _ribbon(lid,7,INK,alpha,false)
        _ribbon(lid,3,tint,alpha)
    draw_circle(center,17,_c(INK,alpha*0.85))
    draw_arc(center,14,0,TAU,32,_c(tint,alpha),2,true)
    draw_circle(center,10,_c(tint,alpha*0.25))
    _star(center,18,tint,alpha,age*0.7)
    for i in range(8):
        var angle := float(i)*TAU/8+age*0.12
        _petal(center+Vector2.from_angle(angle)*22,angle,42+_ease(t)*15,12,tint,alpha*0.6)
    # Broken expanding scan front; never a screen-filling opaque disk.
    var radius := 50+_ease(t)*260
    for i in range(12):
        var angle := float(i)*TAU/12
        _ellipse(p,radius,0.7,angle,angle+0.22,_c(tint,alpha*0.55),1.5)
        _star(p+Vector2(cos(angle),sin(angle)*0.7)*radius,4,tint,alpha*0.6,angle)
    _embers(center,tint,age,1.1,12,70)

func _draw_bell(p: Vector2, age: float, t: float, tint: Color) -> void:
    var alpha := pow(1-t,1.2)
    var center := p+Vector2(0,-40)
    # An actual suspended bell silhouette, followed by three staggered tone fronts.
    var swing := sin(age*18)*7*alpha
    var bell := PackedVector2Array([Vector2(-21,16),Vector2(-14,4),Vector2(-12,-14),Vector2(-6,-23),Vector2(6,-23),Vector2(12,-14),Vector2(14,4),Vector2(21,16),Vector2(-21,16)])
    for i in range(bell.size()): bell[i] = center+(bell[i].rotated(deg_to_rad(swing)))
    draw_colored_polygon(bell,_c(INK,alpha*0.75))
    draw_colored_polygon(bell,_c(tint,alpha*0.16))
    draw_polyline(bell,_c(tint,alpha),2.5,true)
    _ellipse(center+Vector2(0,15),21,0.18,0,TAU,_c(tint.lightened(0.7),alpha),1.8)
    _petal(center+Vector2(0,6),-PI/2,23,8,tint,alpha)
    _star(center+Vector2(0,22),8,tint,alpha)
    for ring in range(3):
        var local := age-float(ring)*0.12
        if local < 0: continue
        var u := clampf(local/0.72,0,1)
        var r := 30+_ease(u)*195
        var fade := (1-u)*alpha
        for side in [0.0,PI]:
            _ellipse(p,r,0.68,side-1.3,side+1.3,_c(INK,fade*0.4),6)
            _ellipse(p,r,0.68,side-1.3,side+1.3,_c(tint,fade*0.9),2.0)
        for i in range(6):
            var angle := float(i)*TAU/6+float(ring)*0.18
            _star(p+Vector2(cos(angle),sin(angle)*0.68)*r,5,tint,fade,angle)
    _embers(center,tint,age,1,12,100,Vector2(0,-20))

func _draw_landing(p: Vector2, age: float, t: float, tint: Color) -> void:
    var alpha := pow(1-t,1.5)
    var spread := _ease(minf(t*1.7,1))
    _ellipse(p,25+spread*155,0.17,-PI,PI,_c(INK,alpha*0.6),12)
    _ellipse(p,25+spread*155,0.17,-PI,PI,_c(tint,alpha*0.85),2.3)
    for side in [-1,1]:
        for i in range(3):
            var length := (80+i*32)*spread
            var a := p+Vector2(side*10,-3)
            var b := p+Vector2(side*length*0.55,-68+i*12)
            var c := p+Vector2(side*length, -13+i*6)
            _ribbon(_curve(a,b,c),12-i*3,tint,alpha*(1.0-i*0.15))
        var crack := PackedVector2Array([p+Vector2(side*12,0),p+Vector2(side*42,-9),p+Vector2(side*59,-2),p+Vector2(side*83,-12),p+Vector2(side*130,0)*spread])
        draw_polyline(crack,_c(INK,alpha*0.8),7,true)
        draw_polyline(crack,_c(tint,alpha),2,true)
    _star(p+Vector2(0,-4),38,tint,alpha,PI/4)
    _embers(p,tint,age,0.82,22,210,Vector2(0,-100))

func _draw_trails() -> void:
    for id in [0,1,2,5]:
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
            for side in [-1,1]:
                _ribbon(_curve(p+Vector2(-moving_facing*100,side*19),p+Vector2(-moving_facing*38,side*30),p+Vector2(moving_facing*30,side*10)),8,TINTS[0],0.7)
        1:
            for side in [-1,1]:
                _ribbon(_curve(p+Vector2(side*27,75),p+Vector2(side*38,5),p+Vector2(0,-36)),10,TINTS[1],0.85)
            _star(p+Vector2(0,-34),12,TINTS[1],0.8,PI/4)
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
            _star(target,12,TINTS[2],0.9,clock)
        5:
            # A spear, rather than the old static V: swept shoulders and a white-hot point.
            for side in [-1,1]:
                _ribbon(_curve(p+Vector2(side*37,-100),p+Vector2(side*20,-14),p+Vector2(0,31)),13,TINTS[5],0.9)
            _ribbon(PackedVector2Array([p+Vector2(0,-80),p+Vector2(0,-14),p+Vector2(0,34)]),9,TINTS[5].lightened(0.6),0.9)
            _star(p+Vector2(0,30),15,TINTS[5],0.95,PI/4)
