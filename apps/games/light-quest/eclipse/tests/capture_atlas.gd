extends SceneTree

func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    root.size = Vector2i(960, 540)
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.story_mode = true
    game._start("An")
    game._interact()
    game.atlas.survey()
    await _save("v13-minimap.png")
    game.atlas.open()
    await _save("v13-atlas-world.png")
    game.atlas.select_region(0)
    await _save("v13-atlas-village.png")
    game.atlas.close()
    game.story_mode = false
    game.time_mode = true
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    var timeline = game.sky.timeline
    timeline.travel(2)
    game.hero.position = game.sky.point(Vector2(441, 676))
    game.cam.reset_smoothing()
    game.atlas.open()
    await _save("v13-atlas-future.png")
    game.atlas.close()
    print("ECLIPSE ATLAS CAPTURE PASS")
    quit()

func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    var picture := root.get_texture().get_image()
    assert(picture.get_size() == Vector2i(960, 540))
    assert(picture.save_png(folder.path_join(filename)) == OK)
