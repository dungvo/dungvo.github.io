extends SceneTree

func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    root.size = Vector2i(960, 540)
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.time_mode = true
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    var timeline = game.sky.timeline
    timeline.owned[1] = true
    timeline.lunar_cores = 2
    game.loadout.open(0)
    game.loadout._select_weapon(1)
    await _save("v14-armory.png")
    game.loadout.show_page(1)
    game.loadout._select_art(2)
    await _save("v14-runes.png")
    game.loadout.show_page(2)
    await _save("v14-journal.png")
    game.loadout.close()
    print("ECLIPSE ARMORY CAPTURE PASS")
    quit()

func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    var picture := root.get_texture().get_image()
    assert(picture.get_size() == Vector2i(960, 540))
    assert(picture.save_png(folder.path_join(filename)) == OK)
