extends SceneTree
## Real production physics and renderer, staged cast positions only. No synthetic sprite motion.
func _initialize() -> void: call_deferred("_capture")
func _capture() -> void:
    root.size = Vector2i(960,540)
    var points := [Vector2(280,432),Vector2(560,326),Vector2(560,76),Vector2(830,-144),Vector2(895,-644),Vector2(580,-930)]
    for id in range(6):
        var game = load("res://scenes/main.tscn").instantiate()
        game.save_enabled = false
        root.add_child(game)
        game.demo_room_select.select(3)
        game._start("An" if id%2 == 0 else "Kha")
        game._interact()
        for i in range(65): await physics_frame # Let the normal spawn-protection ring expire.
        game.hero.position = game.sky.point(points[id])
        game.hero.velocity = Vector2.ZERO
        game.facing = 1
        game.cam.reset_smoothing()
        game.cam.force_update_scroll()
        for i in range(2): await physics_frame
        game.arts.cast(id)
        var frames := [3,8,16,28,44] if id != 5 else [2,5,10,17,28]
        var step := 0
        for frame in range(1,frames[-1]+1):
            await physics_frame
            if frame == frames[step]:
                await _save("v5-art-%d-frame-%02d.png"%[id+1,frame])
                step += 1
                if step == frames.size(): break
        game.queue_free()
        await process_frame
    print("ECLIPSE VFX CAPTURE PASS: six actual casts, live physics, five animation stages each")
    quit(0)
func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var pixels := root.get_texture().get_image()
    assert(pixels != null and not pixels.is_empty())
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    assert(pixels.save_png(folder.path_join(filename)) == OK)
