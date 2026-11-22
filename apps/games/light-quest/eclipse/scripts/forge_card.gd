extends TextureRect
## Small live preview stage rendered from actual game sprites.
const COAST := preload("res://assets/eclipse/open-moon-coast.webp")
const Art := preload("res://scripts/eclipse_art.gd")
const COLORS := [Color("#bbdcff"),Color("#ffda91"),Color("#ffab72"),Color("#ded0ff"),Color("#f6d99a"),Color("#97f5de"),Color("#ffe8b0"),Color("#ddacff")]
var frames: SpriteFrames
var weapon := 0
var double_tether := false
var phase := 1.0

func _ready() -> void:
    frames = Art.actor_frames(false)
    mouse_filter = Control.MOUSE_FILTER_IGNORE

func _process(delta: float) -> void:
    if phase < 1.0:
        phase = minf(1.0,phase+delta*1.8)
        queue_redraw()

func _draw() -> void:
    draw_texture_rect(COAST,Rect2(Vector2.ZERO,size),false,Color("#8294b2"))
    draw_rect(Rect2(Vector2.ZERO,size),Color("#9a805c"),false,1)
    var floor_y := size.y-13
    var at := Vector2(size.x*0.25,floor_y-28)
    if weapon == 3 and phase < 1.0: at.x += 48*sin(phase*PI)
    draw_line(Vector2(8,floor_y),Vector2(size.x-8,floor_y),Color("#778bb3"),2)
    var dummy := Vector2(size.x*0.76,floor_y)
    draw_line(dummy-Vector2(0,38),dummy,Color("#bd956b"),5,true)
    draw_line(dummy-Vector2(10,28),dummy+Vector2(10,-28),Color("#aa835f"),3,true)
    if frames:
        var animation := "attack_1" if phase < 1.0 else "idle"
        var count := frames.get_frame_count(animation)
        if count > 0:
            var pose := frames.get_frame_texture(animation,mini(count-1,int(phase*count)))
            var extent := pose.get_size()*(68.0/pose.get_height())
            draw_texture_rect(pose,Rect2(Vector2(at.x-extent.x/2,floor_y-extent.y+2),extent),false)
    if phase >= 1.0: return
    var tint: Color = COLORS[weapon]
    var alpha := sin(phase*PI)
    match weapon:
        1,4:
            var target := Vector2(size.x*0.65,size.y*0.42)
            _thread(at,target,phase*2.8,tint,alpha)
            if double_tether and phase > 0.34:
                var second := Vector2(size.x*0.90,size.y*0.17)
                _thread(target,second,(phase-0.34)*3.8,Color("#8fedff"),alpha)
        3:
            for sign_y in [-1,1]:
                draw_line(at+Vector2(12,-15*sign_y),at+Vector2(86,14*sign_y),Color(tint,alpha),5,true)
        5,6,7:
            var center := at+Vector2(33,0) if weapon != 6 else at
            draw_circle(center,23+phase*29,Color(tint,alpha*0.13))
            draw_arc(center,23+phase*29,0,TAU,36,Color(tint,alpha),4,true)
        2:
            for i in range(6):
                var point := Vector2(at.x+26+i*18,floor_y)
                draw_line(point,point+Vector2(7,-sin(phase*PI)*22),Color(tint,alpha),4,true)
        _:
            for width in [12.0,5.0,2.0]:
                draw_arc(at+Vector2(25,0),28+phase*22,-1.15,1.15,32,Color(tint,alpha*(0.25 if width == 12 else 0.9)),width,true)


func _thread(at: Vector2, target: Vector2, progress: float, tint: Color, alpha: float) -> void:
    var tip := at.lerp(target,minf(1,progress))
    var strands := PackedVector2Array()
    for i in range(17):
        var part := float(i)/16
        strands.append(at.lerp(tip,part)+Vector2(0,sin(part*TAU+phase*9)*5*sin(part*PI)))
    draw_polyline(strands,Color(tint,alpha*0.24),14,true)
    draw_polyline(strands,Color(tint,alpha),4,true)
    draw_line(at,tip,Color("#fff1cb",alpha),1.3,true)
    draw_arc(target,8,0,TAU,24,Color("#9eeaff",alpha),2,true)
