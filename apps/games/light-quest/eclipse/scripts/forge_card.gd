extends TextureRect
## Draw an animated, non-interactive preview of the selected technique.
var weapon := 0
var phase := 0.0

func _process(delta: float) -> void:
    phase = fmod(phase+delta,1.25)
    queue_redraw()

func _draw() -> void:
    var at := Vector2(size.x*0.28,size.y*0.62)
    var tint: Color = [Color("#bbdcff"),Color("#ffda91"),Color("#ffab72"),Color("#ded0ff"),Color("#f6d99a"),Color("#97f5de"),Color("#ffe8b0"),Color("#ddacff")][weapon]
    var alpha := maxf(0.0,1.0-phase)
    draw_line(Vector2(10,size.y-13),Vector2(size.x-10,size.y-13),Color("#43506c"),2)
    draw_circle(at,6,Color("#e3d0a9"))
    draw_line(at+Vector2(0,4),at+Vector2(-4,25),Color("#9eaed2"),7,true)
    match weapon:
        1,4:
            var finish := Vector2(size.x*0.86,size.y*0.34)
            draw_circle(finish,7,Color("#79daff"))
            draw_line(at,at.lerp(finish,minf(1,phase*4)),Color(tint,alpha),4,true)
        3:
            draw_line(at+Vector2(12,-18),at+Vector2(83,19),Color(tint,alpha),4,true)
            draw_line(at+Vector2(12,19),at+Vector2(83,-18),Color(tint,alpha),4,true)
        5,6,7:
            draw_arc(at+Vector2(38,0),12+phase*42,0,TAU,32,Color(tint,alpha),4,true)
        _:
            draw_arc(at+Vector2(22,4),22+phase*26,-1.28,1.15,32,Color(tint,alpha),5,true)
