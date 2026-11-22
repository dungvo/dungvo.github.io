extends SceneTree

func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    root.size = Vector2i(960, 540)
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    await _save("v15-main-menu.png")
    game.enter_journey("An")
    await create_timer(0.38).timeout
    await _save("v15-village-arrival.png")
    game.atlas.open()
    await _save("v15-discovery-map.png")
    game.atlas.close()
    game.story_room = 6
    game.journey_complete = true
    game.sky.progress[3].won = true
    game.enter_journey("An")
    await create_timer(1.4).timeout
    await _save("v15-lit-lighthouse.png")
    print("ECLIPSE JOURNEY CAPTURE PASS")
    quit()

func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    var picture := root.get_texture().get_image()
    assert(picture.get_size() == Vector2i(960, 540))
    assert(picture.save_png(folder.path_join(filename)) == OK)
