extends SceneTree
## Visual lifecycle and pathological movement, including reversals and stopped trails.
const VFX := preload("res://scripts/art_vfx.gd")
func _initialize() -> void: call_deferred("_run")
func _run() -> void:
    var vfx := VFX.new()
    root.add_child(vfx)
    for mobile in [false,true]:
        vfx.mobile = mobile
        for id in range(6):
            vfx.begin(id,Vector2(100,100),-1,Vector2(180,20))
        vfx.impact(Vector2(100,120),-1)
        for frame in range(90):
            var at := Vector2(100+sin(frame*0.6)*35,100+maxf(0,frame-40)*2)
            vfx.tick(1.0/60,at,0.3,0,0,0,Vector2(180,20),-1)
            if frame%5 == 0: vfx.contact(at,frame%6)
            assert(vfx.events.size() <= vfx.MAX_EVENTS)
            assert(vfx.trails.size() <= vfx.MAX_TRAIL)
            await process_frame
        for frame in range(90):
            vfx.tick(1.0/60,Vector2(100,100),0,0,0,0,Vector2.ZERO,1)
            await process_frame
        assert(vfx.events.is_empty() and vfx.trails.is_empty() and not vfx.was_drawing,"idle stops redrawing and releases all event data")
        vfx.tick(0.016,Vector2.ZERO,0,0,1,0,Vector2(80,-100),1)
        vfx.clear()
        assert(vfx.moving_art == -1 and vfx.events.is_empty() and vfx.trails.is_empty(),"reset clears the moving effect as well")
    print("ECLIPSE VFX PASS: six designs, bounded events / trails, reversing geometry, touch budget, idle cleanup and menu reset")
    quit(0)
