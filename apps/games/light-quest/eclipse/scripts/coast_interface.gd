extends Control
## Gameplay map reuses the same room bounds as the world marker.
var timeline: Node2D
var compact := false
const ROOMS := [
    Rect2(0,300,730,156),Rect2(730,358,400,98),Rect2(1130,295,820,161),
    Rect2(1950,325,650,131),Rect2(315,565,415,134),Rect2(2800,300,960,156)
]
const LABELS := ["Bờ Đá","Cầu Đồng","Đài Canh","Hải Đăng","Hầm Dẫn Nước","Tiệm Bà Lam"]
const ANCHORS := [Vector2(150,432),Vector2(1190,432),Vector2(440,676)]

func project(at: Vector2) -> Vector2:
    return Vector2(9,10)+Vector2(at.x/3760.0, (at.y-260)/470.0)*(size-Vector2(18,22))

func _draw() -> void:
    if not is_instance_valid(timeline): return
    draw_rect(Rect2(Vector2.ZERO,size),Color("#101a2dec"))
    draw_rect(Rect2(Vector2.ZERO,size),Color("#b6a37a"),false,1)
    var hero: Vector2 = timeline.game.hero.position-Vector2(timeline.sky.origin,0)
    var font := ThemeDB.fallback_font
    for i in range(ROOMS.size()):
        var source: Rect2 = ROOMS[i]
        if i == 5 and timeline.era != 0: continue
        var room := Rect2(project(source.position),project(source.end)-project(source.position))
        var occupied := source.has_point(hero)
        draw_rect(room,Color("#3f687d") if occupied else Color("#293750"))
        draw_rect(room,Color("#e4d39e") if occupied else Color("#67819e"),false,1)
        if not compact: draw_string(font,room.position+Vector2(4,16),LABELS[i],HORIZONTAL_ALIGNMENT_LEFT,-1,13,Color("#edf4ff"))
    draw_line(project(Vector2(682,435)),project(Vector2(682,565)),Color("#8feaff"),2,true)
    if timeline.era == 0: draw_line(project(Vector2(420,330)),project(Vector2(2800,330)),Color("#ad815b"),1,true)
    for at in ANCHORS: draw_circle(project(at),3 if compact else 5,Color("#82e9f2"))
    draw_circle(project(hero),3.5 if compact else 6,Color("#ffe0a2"))
